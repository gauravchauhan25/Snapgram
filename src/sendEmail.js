import nodemailer from 'nodemailer';

export default async function (context) {
  try {
    context.log('📩 Raw payload:', context.req.body);

    const payload = context.req.body ? JSON.parse(context.req.body) : {};
    context.log('📩 Parsed payload:', payload);

    const { email, otp, name } = payload;

    if (!email || !otp || !name) {
      throw new Error('Missing email, otp, or name in payload');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 12px; background-color: #ffffff; line-height: 1.6; color: #333;">

    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
      <img src="https://cdn-icons-png.flaticon.com/128/185/185985.png" alt="Snapgram Logo" style="width:50px; height:50px; object-fit: cover;" />
      <p style="margin: 0; font-weight: bold; font-size: 16px;">${name}</p>
    </div>

    <!-- Main Title -->
    <h2 style="color: #1877f2; text-align: center; font-size: 26px; margin-bottom: 20px;">One More Step to Sign Up</h2>

    <!-- Greeting -->
    <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
    <p style="font-size: 16px;">We received a request to create a Snapgram account. Use the confirmation code below to verify your email:</p>

    <!-- OTP Code Box -->
    <div style="background: #f0f4ff; padding: 25px; text-align: center; font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #333; border-radius: 10px; margin: 25px 0;">
      ${otp}
    </div>

    <!-- Warning -->
    <p style="color: #d32f2f; font-size: 14px; text-align: center; margin-top: 10px; font-weight: bold;">
      ⚠️ Don't share this code with anyone.
    </p>
    <p style="font-size: 14px; color: #555; text-align: center;">If someone asks for this code, do not share it—even if they claim to be from Snapgram.</p>

    <!-- Signature -->
    <p style="font-size: 16px; color: #333; margin-top: 30px;">
      Thanks,<br/>
      The <strong>Snapgram Security Team</strong>
    </p>

    <hr style="margin: 35px 0; border: none; border-top: 1px solid #eee;" />

    <!-- Verification Link Info -->
    <p style="font-size: 14px; color: #555; text-align: center;">
      Wondering if this email is really from us? Visit the Help Centre to confirm:<br/>
      <a href="https://snapgram-private.vercel.app/help-center" style="color:#1877f2; text-decoration: none;">Visit Help Center!</a>
    </p>

  </div>
  `,
    });

    context.log('✅ Email sent:', info.messageId);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    context.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
}
