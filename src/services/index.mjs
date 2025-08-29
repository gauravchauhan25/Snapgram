import nodemailer from "nodemailer";
import { Client, Users } from "node-appwrite";
import config from "./config.js";

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: Number(config.smtpPort || 587),
  secure: Number(config.smtpPort) === 465, // true for 465
  auth: { user: config.smtpUser, pass: config.smtpPass },
});

function buildHtml(name) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Arial">
    <h2>Hey ${name || "there"} 👋</h2>
    <p>Welcome to <b>Snapgram</b> — you’re all set 🎉</p>
    <p>
      <a href="https://your-snapgram-domain.com"
         style="background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">
        Open Snapgram
      </a>
    </p>
    <hr/>
    <small>If this wasn’t you, reply to this email and we’ll help.</small>
  </div>`;
}

export default async ({ req, res, log, error }) => {
  try {
    const eventData = JSON.parse(req.body || "{}"); // Appwrite User object
    const userId = eventData?.$id;
    const email = eventData?.email;
    const name = eventData?.name;

    if (!userId || !email) {
      log("Missing userId/email in payload, skipping.");
      return res.send("No-op", 200);
    }

    // Admin client to read & update user prefs
    const sdk = new Client()
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectID)
      .setKey(APPWRITE_API_KEY);
    const users = new Users(sdk);

    // Avoid duplicates
    const user = await users.get(userId);
    if (user?.prefs?.welcomeSent) {
      log(`Welcome already sent to ${email}`);
      return res.send("Already sent", 200);
    }

    // Send email
    await transporter.sendMail({
      from: `${FROM_NAME || "Snapgram Team"} <${FROM_EMAIL}>`,
      to: email,
      subject: "Welcome to Snapgram 🎉",
      html: buildHtml(name),
    });

    // Mark sent
    await users.updatePrefs(userId, {
      ...(user.prefs || {}),
      welcomeSent: true,
      welcomeSentAt: new Date().toISOString(),
    });

    log(`Welcome email sent to ${email}`);
    return res.send("OK", 200);
  } catch (e) {
    error(e?.stack || String(e));
    return res.send("Function error", 500);
  }
};
