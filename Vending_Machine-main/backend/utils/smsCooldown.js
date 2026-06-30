/**
 * SMS Cooldown Manager
 * Prevents sending duplicate SMS alerts for the same product within 3 hours
 */

// In-memory storage for SMS cooldowns
// Format: { productId: lastSentTimestamp }
const smsCooldowns = new Map();

// Cooldown period: 3 hours in milliseconds
const COOLDOWN_PERIOD = 3 * 60 * 60 * 1000; // 3 hours

/**
 * Check if SMS can be sent for a product
 * @param {string} productId - Product ID
 * @returns {boolean} - True if SMS can be sent, false if in cooldown
 */
const canSendSMS = (productId) => {
  const lastSent = smsCooldowns.get(productId);
  
  if (!lastSent) {
    return true; // Never sent before
  }
  
  const now = Date.now();
  const timeSinceLastSent = now - lastSent;
  
  return timeSinceLastSent >= COOLDOWN_PERIOD;
};

/**
 * Get remaining cooldown time in minutes
 * @param {string} productId - Product ID
 * @returns {number} - Remaining minutes, or 0 if no cooldown
 */
const getRemainingCooldown = (productId) => {
  const lastSent = smsCooldowns.get(productId);
  
  if (!lastSent) {
    return 0;
  }
  
  const now = Date.now();
  const timeSinceLastSent = now - lastSent;
  const remainingMs = COOLDOWN_PERIOD - timeSinceLastSent;
  
  if (remainingMs <= 0) {
    return 0;
  }
  
  return Math.ceil(remainingMs / (60 * 1000)); // Convert to minutes
};

/**
 * Record that SMS was sent for a product
 * @param {string} productId - Product ID
 */
const recordSMSSent = (productId) => {
  smsCooldowns.set(productId, Date.now());
  console.log(`📝 SMS cooldown recorded for product: ${productId} (3 hour cooldown active)`);
};

/**
 * Reset cooldown for a product (useful for testing or manual override)
 * @param {string} productId - Product ID
 */
const resetCooldown = (productId) => {
  smsCooldowns.delete(productId);
  console.log(`🔄 SMS cooldown reset for product: ${productId}`);
};

/**
 * Clear all cooldowns (useful for testing)
 */
const clearAllCooldowns = () => {
  smsCooldowns.clear();
  console.log('🔄 All SMS cooldowns cleared');
};

/**
 * Get all active cooldowns (for debugging)
 */
const getActiveCooldowns = () => {
  const active = [];
  const now = Date.now();
  
  smsCooldowns.forEach((timestamp, productId) => {
    const remainingMs = COOLDOWN_PERIOD - (now - timestamp);
    if (remainingMs > 0) {
      active.push({
        productId,
        remainingMinutes: Math.ceil(remainingMs / (60 * 1000)),
        remainingHours: (remainingMs / (60 * 60 * 1000)).toFixed(1)
      });
    }
  });
  
  return active;
};

module.exports = {
  canSendSMS,
  getRemainingCooldown,
  recordSMSSent,
  resetCooldown,
  clearAllCooldowns,
  getActiveCooldowns,
  COOLDOWN_PERIOD
};
