const { db } = require('../config/firebase');

// Store for OTP rate limiting (in-memory, could be moved to Redis in production)
const otpRequestTimestamps = new Map();

/**
 * Request OTP generation from ESP32
 * ESP32 will generate TOTP using RTC and send to Firebase
 */
const requestOTPFromESP32 = async () => {
  if (!db) {
    throw new Error('Firebase database not initialized');
  }
  
  try {
    console.log('Clearing previous OTP data...');
    // Clear any previous OTP data
    await db.ref('live_otp').set(null);
    await db.ref('otp_request/generate').set(null);
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Requesting new OTP from ESP32...');
    // Set request flag to trigger ESP32
    await db.ref('otp_request/generate').set(true);
    
    // Wait for ESP32 to generate and send OTP (max 10 seconds)
    let attempts = 0;
    const maxAttempts = 100; // 10 seconds (100 * 100ms)
    
    while (attempts < maxAttempts) {
      const otpSnapshot = await db.ref('live_otp').once('value');
      const otpData = otpSnapshot.val();
      
      console.log(`Attempt ${attempts + 1}: Checking for OTP...`, otpData);
      
      // Check if OTP was updated recently (within last 30 seconds)
      if (otpData && typeof otpData === 'string' && otpData.length === 6) {
        console.log('OTP received from ESP32:', otpData);
        return otpData;
      }
      
      // Also check if it's an object with otp property
      if (otpData && typeof otpData === 'object' && otpData.otp && typeof otpData.otp === 'string' && otpData.otp.length === 6) {
        console.log('OTP received from ESP32 (object format):', otpData.otp);
        return otpData.otp;
      }
      
      // Wait 100ms before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    throw new Error('ESP32 did not respond with OTP within 10 seconds. Please ensure hardware is connected and try again.');
  } catch (error) {
    console.error('Error in requestOTPFromESP32:', error);
    throw new Error('Failed to get OTP from ESP32: ' + error.message);
  }
};

/**
 * Generate a 6-digit OTP (fallback - not used when ESP32 is connected)
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Check if user can request OTP (30 second cooldown)
 */
const canRequestOTP = (userId) => {
  const lastRequest = otpRequestTimestamps.get(userId);
  if (!lastRequest) return true;
  
  const now = Date.now();
  const timeDiff = now - lastRequest;
  const cooldownPeriod = 30000; // 30 seconds in milliseconds
  
  return timeDiff >= cooldownPeriod;
};

/**
 * Get remaining cooldown time in seconds
 */
const getRemainingCooldown = (userId) => {
  const lastRequest = otpRequestTimestamps.get(userId);
  if (!lastRequest) return 0;
  
  const now = Date.now();
  const timeDiff = now - lastRequest;
  const cooldownPeriod = 30000;
  const remaining = cooldownPeriod - timeDiff;
  
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

/**
 * Store OTP in Firebase Realtime Database
 * Path: /otps/{userId}/{timestamp}
 */
const storeOTPInFirebase = async (userId, otp, orderData) => {
  if (!db) {
    throw new Error('Firebase database not initialized');
  }
  
  const timestamp = Date.now();
  const expiryTime = timestamp + (5 * 60 * 1000); // OTP expires in 5 minutes
  
  const otpData = {
    otp,
    userId,
    orderData: {
      amount: orderData.amount,
      products: orderData.products,
      orderId: orderData.orderId
    },
    timestamp,
    expiryTime,
    used: false,
    createdAt: new Date().toISOString()
  };
  
  // Store in Firebase
  const otpRef = db.ref(`otps/${userId}/${timestamp}`);
  await otpRef.set(otpData);
  
  // Note: OTP is already set by ESP32 at /live_otp
  // We just store additional metadata
  const esp32MetadataRef = db.ref('live_otp_metadata');
  await esp32MetadataRef.set({
    amount: orderData.amount,
    orderId: orderData.orderId,
    timestamp,
    expiryTime,
    products: orderData.products.map(p => `${p.name} x${p.quantity}`).join(', ')
  });
  
  // Update rate limiting timestamp
  otpRequestTimestamps.set(userId, timestamp);
  
  // Clean up old OTPs (older than 10 minutes)
  await cleanupOldOTPs(userId);
  
  return { timestamp, expiryTime };
};

/**
 * Verify OTP from Firebase
 */
const verifyOTPFromFirebase = async (userId, otp) => {
  if (!db) {
    throw new Error('Firebase database not initialized');
  }
  
  try {
    // Get all OTPs for user
    const otpsRef = db.ref(`otps/${userId}`);
    const snapshot = await otpsRef.once('value');
    const otps = snapshot.val();
    
    if (!otps) {
      return { valid: false, message: 'No OTP found' };
    }
    
    // Find matching OTP
    const now = Date.now();
    let matchedOTP = null;
    let matchedTimestamp = null;
    
    for (const [timestamp, otpData] of Object.entries(otps)) {
      if (otpData.otp === otp && !otpData.used && now < otpData.expiryTime) {
        matchedOTP = otpData;
        matchedTimestamp = timestamp;
        break;
      }
    }
    
    if (!matchedOTP) {
      return { valid: false, message: 'Invalid or expired OTP' };
    }
    
    // Mark OTP as used
    await db.ref(`otps/${userId}/${matchedTimestamp}/used`).set(true);
    await db.ref(`otps/${userId}/${matchedTimestamp}/usedAt`).set(new Date().toISOString());
    
    // Clear OTP from ESP32 display
    await db.ref('live_otp').set({
      otp: null,
      displayMessage: 'Payment Verified!',
      status: 'completed',
      timestamp: Date.now()
    });
    
    return {
      valid: true,
      message: 'OTP verified successfully',
      orderData: matchedOTP.orderData
    };
  } catch (error) {
    console.log('Error verifying OTP from Firebase:', error.message);
    return { valid: false, message: 'OTP verification failed' };
  }
};

/**
 * Clean up old OTPs (older than 10 minutes)
 */
const cleanupOldOTPs = async (userId) => {
  if (!db) return;
  
  try {
    const otpsRef = db.ref(`otps/${userId}`);
    const snapshot = await otpsRef.once('value');
    const otps = snapshot.val();
    
    if (!otps) return;
    
    const now = Date.now();
    const cleanupThreshold = 10 * 60 * 1000; // 10 minutes
    
    for (const [timestamp, otpData] of Object.entries(otps)) {
      if (now - otpData.timestamp > cleanupThreshold) {
        await db.ref(`otps/${userId}/${timestamp}`).remove();
      }
    }
  } catch (error) {
    console.error('Error cleaning up old OTPs:', error);
  }
};

/**
 * Get current OTP for user (for ESP32 to read)
 */
const getCurrentOTP = async (userId) => {
  if (!db) {
    throw new Error('Firebase database not initialized');
  }
  
  const otpsRef = db.ref(`otps/${userId}`);
  const snapshot = await otpsRef.orderByChild('timestamp').limitToLast(1).once('value');
  const otps = snapshot.val();
  
  if (!otps) {
    return null;
  }
  
  const latestOTP = Object.values(otps)[0];
  const now = Date.now();
  
  if (latestOTP && !latestOTP.used && now < latestOTP.expiryTime) {
    return {
      otp: latestOTP.otp,
      expiryTime: latestOTP.expiryTime,
      orderData: latestOTP.orderData
    };
  }
  
  return null;
};

module.exports = {
  generateOTP,
  requestOTPFromESP32,
  canRequestOTP,
  getRemainingCooldown,
  storeOTPInFirebase,
  verifyOTPFromFirebase,
  getCurrentOTP
};
