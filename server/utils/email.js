import nodemailer from "nodemailer";

// Create a transporter using Gmail (or configure for other services)
// NOTE: For Gmail, you might need to use an App Password if 2FA is enabled.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // e.g. "your-email@gmail.com"
        pass: process.env.EMAIL_PASS  // e.g. "your-app-password"
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: `"ThreadSense Intelligence" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 [EMAIL SENT] Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("❌ [EMAIL ERROR] Failed to send email:", error);
        // We don't throw here to avoid crashing the auth flow, 
        // but in a real app you might want to handle this more gracefully.
        return null;
    }
};

export default sendEmail;
