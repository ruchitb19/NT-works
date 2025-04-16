require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// ✅ Debug email env status
console.log("Email User:", process.env.EMAIL_USER || "Not Loaded");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

// ✅ Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Multer config for file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 📩 Handle Contact Form Submission
app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `📝 New Message from ${name} - Contact Form`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #007BFF;">📧 New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007BFF;">${email}</a></p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #007BFF;">
                    ${message}
                </blockquote>
                <p style="font-size: 14px; color: #666;">🔹 Sent from your website contact form.</p>
            </div>
        `,
    };

    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "📩 Copy of Your Contact Form Submission",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #28a745;">✅ Your Message Has Been Received!</h2>
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for reaching out! Below is a copy of your message:</p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #007BFF;">
                    ${message}
                </blockquote>
                <p style="font-size: 14px; color: #666;">🔹 If this wasn't you, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
        res.json({ message: "Email sent successfully! A copy has been sent to you." });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: "Failed to send email", error });
    }
});

// 📩 Handle Email Subscription
app.post("/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required!" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Subscription Confirmation",
        text: "Thank you for subscribing! We'll keep you updated."
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Subscription successful!" });
    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).json({ message: "Subscription failed", error });
    }
});

// 📤 Handle Resume Upload and Send as Attachment
app.post('/upload-resume', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded." });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to your email
        subject: "📎 New Resume Submission",
        text: "A new resume has been uploaded.",
        attachments: [{
            filename: req.file.originalname,
            content: req.file.buffer
        }]
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Resume uploaded and emailed successfully!" });
    } catch (error) {
        console.error("Resume Upload Error:", error);
        res.status(500).json({ message: "Failed to send resume", error });
    }
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
