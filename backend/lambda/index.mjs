import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// --- Configuration from environment variables ---
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
const SES_REGION = process.env.SES_REGION || "ap-south-1";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const SENDER_EMAIL = process.env.SENDER_EMAIL || `noreply@zyphr.co.in`;

const sesClient = new SESClient({ region: SES_REGION });

// --- Validation helpers ---

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

function validateRequiredFields(body) {
  const errors = [];
  if (!body.name || !body.name.trim()) errors.push("Full Name is required.");
  if (!body.email || !body.email.trim()) errors.push("Email is required.");
  else if (!EMAIL_REGEX.test(body.email.trim()))
    errors.push("A valid email address is required.");
  if (!body.message || !body.message.trim())
    errors.push("Message is required.");
  if (body.name && body.name.trim().length > 200)
    errors.push("Full Name must be under 200 characters.");
  if (body.email && body.email.trim().length > 320)
    errors.push("Email must be under 320 characters.");
  if (body.message && body.message.trim().length > 5000)
    errors.push("Message must be under 5000 characters.");
  return errors;
}

// --- CORS helper ---

function getCorsHeaders(origin) {
  const isAllowed =
    ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0] || "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function buildResponse(statusCode, body, origin) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(origin || ""),
    },
    body: JSON.stringify(body),
  };
}

// --- Email builder ---

function buildEmailBody(data) {
  const timestamp = new Date().toISOString();
  return {
    subject: `New Contact Form Submission — ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1A1A2E; color: #f0f0f0; padding: 32px; border-radius: 12px;">
        <h2 style="color: #A855F7; margin-bottom: 24px;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e; color: #9ca3af; width: 160px;">Full Name</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e; color: #9ca3af;">Email</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e;"><a href="mailto:${data.email}" style="color: #60A5FA;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e; color: #9ca3af;">Company</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e;">${data.company || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e; color: #9ca3af;">Service Interested In</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e;">${data.service || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e; color: #9ca3af;">Budget Range</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #2a2a4e;">${data.budget || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; color: #9ca3af; vertical-align: top;">Message</td>
            <td style="padding: 12px 8px; white-space: pre-wrap;">${data.message}</td>
          </tr>
        </table>
        <hr style="border: 1px solid #2a2a4e; margin: 24px 0;" />
        <p style="color: #6b7280; font-size: 12px;">Submitted at: ${timestamp}</p>
      </div>
    `,
    text: `New Contact Form Submission\n\nFull Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || "Not provided"}\nService: ${data.service || "Not specified"}\nBudget: ${data.budget || "Not specified"}\n\nMessage:\n${data.message}\n\nSubmitted at: ${timestamp}`,
  };
}

// --- Lambda Handler ---

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";

  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return buildResponse(200, {}, origin);
  }

  try {
    // Parse body
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return buildResponse(400, { error: "Invalid JSON in request body." }, origin);
    }

    // Honeypot check — if the hidden field is filled, it's a bot
    // Silently return success to not alert the bot
    if (body.website && body.website.trim().length > 0) {
      return buildResponse(200, { message: "Thank you for your submission." }, origin);
    }

    // Validate required fields
    const errors = validateRequiredFields(body);
    if (errors.length > 0) {
      return buildResponse(400, { error: "Validation failed.", details: errors }, origin);
    }

    // Sanitize all fields
    const sanitizedData = {
      name: sanitize(body.name),
      email: sanitize(body.email),
      company: sanitize(body.company || ""),
      service: sanitize(body.service || ""),
      budget: sanitize(body.budget || ""),
      message: sanitize(body.message),
    };

    // Build and send email
    const emailContent = buildEmailBody(sanitizedData);

    const sendCommand = new SendEmailCommand({
      Source: SENDER_EMAIL,
      Destination: {
        ToAddresses: [RECIPIENT_EMAIL],
      },
      Message: {
        Subject: { Data: emailContent.subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: emailContent.html, Charset: "UTF-8" },
          Text: { Data: emailContent.text, Charset: "UTF-8" },
        },
      },
    });

    await sesClient.send(sendCommand);

    return buildResponse(
      200,
      { message: "Thank you for sharing your dream with us! We'll be in touch within 24 hours." },
      origin
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return buildResponse(
      500,
      { error: "Something went wrong. Please try again later or email us directly." },
      origin
    );
  }
};
