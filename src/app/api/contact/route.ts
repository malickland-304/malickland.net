import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      inquiryType,
      propertyType,
      county,
      budget,
      message,
      preferredContact,
    } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const emailBody = `
New Contact Form Submission — MalickLand.net
============================================

Name:              ${firstName} ${lastName}
Email:             ${email}
Phone:             ${phone || "Not provided"}
Preferred Contact: ${preferredContact || "Not specified"}

Inquiry Type:      ${inquiryType || "Not specified"}
Property Type:     ${propertyType || "Not specified"}
County:            ${county || "Not specified"}
Budget:            ${budget || "Not specified"}

Message:
${message}

============================================
Submitted via malickland.net contact form
    `.trim();

    await transporter.sendMail({
      from: `"MalickLand Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Inquiry from ${firstName} ${lastName} — ${inquiryType || "General"}`,
      text: emailBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
