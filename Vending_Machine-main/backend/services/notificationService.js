const twilio = require('twilio');
const smsCooldown = require('../utils/smsCooldown');

class NotificationService {
  constructor() {
    // Initialize Twilio client if credentials are available
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
      console.log('✅ Twilio initialized successfully');
      console.log('📱 Admin phone:', process.env.ADMIN_PHONE);
    } else {
      console.log('⚠️  Twilio credentials not found in environment variables');
    }
  }

  // Send SMS notification for low stock (with cooldown check)
  async sendLowStockSMS(adminPhone, productName, quantity, productId = null) {
    if (!this.twilioClient) {
      console.log('Twilio not configured. SMS notification skipped.');
      return { success: false, message: 'Twilio not configured' };
    }

    // Check cooldown if productId is provided
    // Only send SMS if: 1) Never sent before OR 2) 3 hours passed AND stock still ≤3
    if (productId && !smsCooldown.canSendSMS(productId)) {
      const remainingMinutes = smsCooldown.getRemainingCooldown(productId);
      console.log(`⏳ SMS cooldown active for ${productName}. Will check again in ${remainingMinutes} minutes.`);
      return { 
        success: false, 
        message: 'SMS cooldown active',
        remainingMinutes,
        cooldownActive: true
      };
    }

    try {
      const message = await this.twilioClient.messages.create({
        body: `🚨 LOW STOCK ALERT: ${productName} has only ${quantity} unit(s) left. Please restock soon!`,
        from: this.twilioPhoneNumber,
        to: adminPhone
      });

      console.log(`✅ SMS sent successfully: ${message.sid} for ${productName} (${quantity} left)`);
      
      // Record cooldown if productId is provided
      // Next SMS will be sent after 3 hours if stock is still ≤3
      if (productId) {
        smsCooldown.recordSMSSent(productId);
      }
      
      return { success: true, messageSid: message.sid };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send email notification (placeholder - requires email service like SendGrid/Nodemailer)
  async sendLowStockEmail(adminEmail, productName, quantity) {
    // TODO: Implement email sending using SendGrid or Nodemailer
    console.log(`Email notification: ${productName} low stock (${quantity} left) to ${adminEmail}`);
    
    // For now, just log
    return {
      success: true,
      message: 'Email notification logged (implementation pending)'
    };
  }

  // Check and notify for low stock products
  async checkAndNotifyLowStock(threshold = 3) {
    const Product = require('../models/Product');
    const lowStockProducts = await Product.find({
      quantity: { $lte: threshold },
      isAvailable: true
    });

    if (lowStockProducts.length === 0) {
      return { success: true, message: 'No low stock products' };
    }

    // Get admin contact info from environment variables
    const adminPhone = process.env.ADMIN_PHONE;
    const adminEmail = process.env.ADMIN_EMAIL;

    const notifications = [];

    for (const product of lowStockProducts) {
      // Send SMS if phone is configured
      if (adminPhone) {
        const smsResult = await this.sendLowStockSMS(adminPhone, product.name, product.quantity, product._id.toString());
        notifications.push({ type: 'SMS', product: product.name, ...smsResult });
      }

      // Send Email if email is configured
      if (adminEmail) {
        const emailResult = await this.sendLowStockEmail(adminEmail, product.name, product.quantity);
        notifications.push({ type: 'Email', product: product.name, ...emailResult });
      }
    }

    return {
      success: true,
      lowStockCount: lowStockProducts.length,
      notifications
    };
  }
}

module.exports = new NotificationService();
