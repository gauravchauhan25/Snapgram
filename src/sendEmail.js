import nodemailer from "nodemailer";

export default async function(req, res) {
  try {
    const { email, otp } = JSON.parse(req.payload);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.REACT_APP_EMAIL_USER,
        pass: process.env.REACT_APP_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.REACT_APP_EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res.json({ success: false, error: error.message });
  }
}
