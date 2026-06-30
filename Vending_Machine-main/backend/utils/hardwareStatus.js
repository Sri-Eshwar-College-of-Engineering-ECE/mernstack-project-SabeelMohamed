const { db } = require('../config/firebase');

// DEVELOPMENT MODE: Set to true to bypass hardware check for testing
const DEV_MODE_BYPASS_HARDWARE = process.env.DEV_MODE_BYPASS_HARDWARE === 'true';

/**
 * Check if ESP32 hardware is online
 * ESP32 sends heartbeat every 5 seconds
 * If no heartbeat in last 15 seconds, consider offline
 */
const isESP32Online = async () => {
  // Development mode bypass
  if (DEV_MODE_BYPASS_HARDWARE) {
    console.log('⚠️  DEV MODE: Hardware check bypassed - simulating online hardware');
    return true;
  }

  if (!db) {
    console.log('Firebase not initialized, hardware is offline');
    return false;
  }

  try {
    const statusRef = db.ref('hardware_status');
    const snapshot = await statusRef.once('value');
    const status = snapshot.val();

    if (!status) {
      console.log('No hardware status found, hardware is offline');
      return false;
    }

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const lastHeartbeat = status.last_heartbeat || 0;
    const timeSinceHeartbeat = now - lastHeartbeat;

    // Validate timestamp - if it's too old (before 2020) or in the future, consider invalid
    const isValidTimestamp = lastHeartbeat > 1577836800 && lastHeartbeat < now + 60; // 2020-01-01 to now+1min
    
    // Consider online if ESP32 flag is true (supports boolean, string, numeric) AND recent heartbeat
    const esp32FlagTrue = status.esp32_online === true || status.esp32_online === 'true' || status.esp32_online === 1 || status.esp32_online === '1';
    // If timestamp is valid, check if heartbeat is within 30 seconds (ESP32 sends every 5s, allows network delays)
    // If timestamp is invalid but flag is true, trust the flag (for backwards compatibility)
    const isOnline = esp32FlagTrue && (isValidTimestamp ? timeSinceHeartbeat < 30 : true);

    console.log('Hardware Status Check:');
    console.log('  Current time:', now);
    console.log('  Last heartbeat:', lastHeartbeat);
    console.log('  Time since heartbeat:', timeSinceHeartbeat, 'seconds');
    console.log('  Valid timestamp:', isValidTimestamp);
    console.log('  ESP32 online flag:', status.esp32_online);
    console.log('  Is Online:', isOnline);

    return isOnline;
  } catch (error) {
    console.error('Error checking ESP32 status:', error);
    return false;
  }
};

/**
 * Get hardware status details
 */
const getHardwareStatus = async () => {
  // Development mode bypass
  if (DEV_MODE_BYPASS_HARDWARE) {
    return {
      online: true,
      message: '⚠️ DEV MODE: Hardware check bypassed',
      lastHeartbeat: Math.floor(Date.now() / 1000),
      timeSinceHeartbeat: 0,
      isValidTimestamp: true,
      status: 'simulated'
    };
  }

  if (!db) {
    return {
      online: false,
      message: 'Firebase not initialized - hardware offline',
      lastHeartbeat: null
    };
  }

  try {
    const statusRef = db.ref('hardware_status');
    const snapshot = await statusRef.once('value');
    const status = snapshot.val();

    if (!status) {
      return {
        online: false,
        message: 'Hardware not connected',
        lastHeartbeat: null
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const lastHeartbeat = status.last_heartbeat || 0;
    const timeSinceHeartbeat = now - lastHeartbeat;
    
    // Validate timestamp - if it's too old (before 2020) or in the future, consider invalid
    const isValidTimestamp = lastHeartbeat > 1577836800 && lastHeartbeat < now + 60; // 2020-01-01 to now+1min
    
    // Consider online if ESP32 flag is true (supports boolean, string, numeric) AND recent heartbeat
    const esp32FlagTrue = status.esp32_online === true || status.esp32_online === 'true' || status.esp32_online === 1 || status.esp32_online === '1';
    // If timestamp is valid, check if heartbeat is within 30 seconds (ESP32 sends every 5s, allows network delays)
    // If timestamp is invalid but flag is true, trust the flag (for backwards compatibility)
    const isOnline = esp32FlagTrue && (isValidTimestamp ? timeSinceHeartbeat < 30 : true);

    return {
      online: isOnline,
      message: isOnline ? 'Hardware connected' : 'Hardware offline',
      lastHeartbeat: lastHeartbeat,
      timeSinceHeartbeat: timeSinceHeartbeat,
      isValidTimestamp: isValidTimestamp,
      status: status.status || 'unknown'
    };
  } catch (error) {
    console.error('Error getting hardware status:', error);
    return {
      online: false,
      message: 'Error checking hardware status - hardware offline',
      error: error.message
    };
  }
};

module.exports = {
  isESP32Online,
  getHardwareStatus
};
