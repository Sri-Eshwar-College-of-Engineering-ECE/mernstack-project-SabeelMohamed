const nodemailer = require('nodemailer');
const twilio = require('twilio');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendEmailAlert(email, severity, details) {
  const severityColors = {
    low: '#FFA500',
    mid: '#FF6B6B',
    severe: '#DC143C'
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `🚨 IntrusionX Alert: ${severity.toUpperCase()} Threat Detected`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${severityColors[severity]}; color: white; padding: 20px; text-align: center;">
          <h1>Network Intrusion Detected</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <h2>Alert Details</h2>
          <p><strong>Severity:</strong> <span style="color: ${severityColors[severity]};">${severity.toUpperCase()}</span></p>
          <p><strong>Confidence:</strong> ${(details.confidence * 100).toFixed(2)}%</p>
          <p><strong>Protocol:</strong> ${details.protocol}</p>
          <p><strong>Port:</strong> ${details.port}</p>
          <p><strong>Packet Size:</strong> ${details.packet_size} bytes</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p>Please check your IntrusionX dashboard for more details and take appropriate action.</p>
        </div>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

async function sendSMSAlert(phoneNumber, severity, details) {
  // Validate phone number
  if (!phoneNumber) {
    console.error('SMS send error: Phone number is missing or undefined');
    return false;
  }

  // Ensure phone number is in correct format (E.164)
  let formattedPhone = phoneNumber.toString().trim();
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+' + formattedPhone;
  }

  try {
    await twilioClient.messages.create({
      body: `🚨 IntrusionX: ${severity.toUpperCase()} threat detected! Confidence: ${(details.confidence * 100).toFixed(0)}%. Port: ${details.port}. Check dashboard immediately.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });
    console.log(`SMS sent successfully to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error('SMS send error:', error.message);
    return false;
  }
}

module.exports = { sendEmailAlert, sendSMSAlert };
