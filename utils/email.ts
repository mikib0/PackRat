import nodemailer from 'nodemailer';

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: false,
});

// Send an email
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  await transporter.sendMail({
    from: `"PackRat" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}

// Send a verification code email
export async function sendVerificationCodeEmail(to: string, code: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email Address</h2>
      <p>Thank you for signing up for PackRat! Please verify your email address by entering the code below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
          ${code}
        </div>
      </div>
      <p>This code will expire in 24 hours.</p>
      <p>If you didn't create an account with us, you can safely ignore this email.</p>
      <p>Best regards,<br>The PackRat Team</p>
    </div>
  `;

  await sendEmail(to, 'Verify Your PackRat Account', html);
}

// Send a password reset email
export async function sendPasswordResetEmail(to: string, code: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>You requested to reset your password for your PackRat account. Enter the code below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
          ${code}
        </div>
      </div>
      <p>This code will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Best regards,<br>The PackRat Team</p>
    </div>
  `;

  await sendEmail(to, 'Reset Your PackRat Password', html);
}
