import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Step 1: Create a transporter (the mailman)
// its indirect version of saying
// host: "smtp.google.com" (Gmail's SMTP server, use when u need full ctrl over SMTP settings),
// port: 587 ( 587 for STARTLS - secure connection after handshake, 465 for SSL/TLS - secure from the start ),
// secure: false (tells nodemailer whether to use SSL/TLS encryption immediately, 'false' means: 'Start with plain connection, then upgrade to secure (STARTTLS)'.)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, //  ignore self-signed certs (dev only)
  },
});

await transporter.verify();
console.log("Mailer ready");

export async function sendOtpEmail(recipientEmail, otp) {
  // Step 2: Define the mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "OTP from BookBridge! Enjoy Reading!",
    text: `Hi there! Your OTP is ${otp}. It is valid for only 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #4CAF50;">BookBridge Email Verification</h2>
        <p>Hi there!</p>
        <p>Your OTP is:</p>
        <h1 style="background: #f0f0f0; padding: 10px; display: inline-block;">${otp}</h1>
        <p>This code is valid for only <strong>5 minutes</strong>.</p>
        <p>Enjoy reading and sharing with BookBridge!</p>
      </div>
    `,
  };

  // Step 3: Send the mail
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Error while sending mail", err);
    return false;
  }
}


// // Step 2: generate OTP
// const generateOTP = () =>
//   Math.floor(100000 + Math.random() * 900000).toString();
// const otp = generateOTP();