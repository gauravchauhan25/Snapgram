import nodemailer from "nodemailer";

export default async function (req) {
  try {
    const payload = req.payload ? JSON.parse(req.payload) : {};
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

    console.log("✅ Email sent:", info.messageId);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("❌ Email send error:", error);
    return { success: false, error: error.message };
  }
}
