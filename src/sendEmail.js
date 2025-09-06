import nodemailer from "nodemailer";

export default async function (context) {
  try {
    context.log("📩 Raw payload:", context.req.body);

    const payload = context.req.body ? JSON.parse(context.req.body) : {};
    context.log("📩 Parsed payload:", payload);

    const { email, otp } = payload;

    if (!email || !otp) {
      throw new Error("Missing email or otp in payload");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
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
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    context.log("✅ Email sent:", info.messageId);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    context.error("❌ Email send error:", error);
    return { success: false, error: error.message };
  }
}
