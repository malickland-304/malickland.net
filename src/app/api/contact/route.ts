import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  buildContactSubject,
  formatContactEmail,
  validateContactPayload,
} from "./validation";

function getGmailConfig() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();

  if (!user || !pass) return null;
  return { user, pass };
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const validation = validateContactPayload(body);
  if (!validation.ok) {
    return NextResponse.json(
      {
        error: "Please correct the highlighted fields.",
        fields: validation.errors,
      },
      { status: 400 }
    );
  }

  const gmail = getGmailConfig();
  if (!gmail) {
    console.error("Contact form mail is not configured.");
    return NextResponse.json(
      {
        error:
          "The contact form is temporarily unavailable. Please call Phil directly.",
      },
      { status: 503 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmail.user,
        pass: gmail.pass,
      },
    });

    const emailBody = formatContactEmail(validation.data);

    await transporter.sendMail({
      from: `"MalickLand Contact Form" <${gmail.user}>`,
      to: gmail.user,
      replyTo: validation.data.email,
      subject: buildContactSubject(validation.data),
      text: emailBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form mail send failed:", {
      message: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json(
      {
        error:
          "Failed to send message. Please try calling or emailing directly.",
      },
      { status: 500 }
    );
  }
}
