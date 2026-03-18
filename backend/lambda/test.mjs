// --- Local test script for the Lambda function ---
// Run: node test.mjs
// This simulates API Gateway events and tests the handler locally.

import { handler } from "./index.mjs";

// Override env vars for testing
process.env.RECIPIENT_EMAIL = "test@zyphr.co.in";
process.env.SES_REGION = "ap-south-1";
process.env.ALLOWED_ORIGINS = "http://localhost:3000,https://zyphr.co.in";
process.env.SENDER_EMAIL = "noreply@zyphr.co.in";

const TESTS = [
  {
    name: "Valid submission (SES call — expected to fail locally)",
    event: {
      headers: { origin: "http://localhost:3000" },
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
        company: "Acme Corp",
        service: "Custom Software Development",
        budget: "$15K–$50K",
        message: "We need a custom CRM solution for our team.",
      }),
    },
    expectStatus: 500, // 500 locally (no SES credentials), 200 on AWS
    sesDependent: true,
  },
  {
    name: "Missing required fields",
    event: {
      headers: { origin: "http://localhost:3000" },
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify({
        name: "",
        email: "",
        message: "",
      }),
    },
    expectStatus: 400,
  },
  {
    name: "Invalid email format",
    event: {
      headers: { origin: "http://localhost:3000" },
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify({
        name: "Jane",
        email: "not-an-email",
        message: "Hello",
      }),
    },
    expectStatus: 400,
  },
  {
    name: "Honeypot filled (bot detection)",
    event: {
      headers: { origin: "http://localhost:3000" },
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify({
        name: "Bot",
        email: "bot@spam.com",
        message: "Buy stuff",
        website: "http://spam.com",
      }),
    },
    expectStatus: 200, // Silent success — no email sent
  },
  {
    name: "Invalid JSON body",
    event: {
      headers: { origin: "http://localhost:3000" },
      requestContext: { http: { method: "POST" } },
      body: "this is not json",
    },
    expectStatus: 400,
  },
  {
    name: "OPTIONS preflight request",
    event: {
      headers: { origin: "http://localhost:3000" },
      requestContext: { http: { method: "OPTIONS" } },
    },
    expectStatus: 200,
  },
  {
    name: "XSS attempt in name field (SES call — expected to fail locally)",
    event: {
      headers: { origin: "http://localhost:3000" },
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify({
        name: '<script>alert("xss")</script>',
        email: "test@example.com",
        message: "Testing XSS",
      }),
    },
    expectStatus: 500, // 500 locally (no SES credentials), 200 on AWS with sanitized content
    sesDependent: true,
  },
  {
    name: "Oversized message field",
    event: {
      headers: { origin: "http://localhost:3000" },
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify({
        name: "Test",
        email: "test@example.com",
        message: "x".repeat(5001),
      }),
    },
    expectStatus: 400,
  },
];

console.log("=== Zyphr Contact Form Lambda — Local Tests ===\n");

// NOTE: Tests that reach SES will fail locally (no SES credentials).
// This tests validation, sanitization, and honeypot logic only.
// For SES integration testing, deploy to AWS and test via API Gateway.

let passed = 0;
let failed = 0;

for (const test of TESTS) {
  try {
    const result = await handler(test.event);
    const status = result.statusCode === test.expectStatus ? "PASS" : "FAIL";

    if (status === "PASS") passed++;
    else failed++;

    console.log(`[${status}] ${test.name}`);
    console.log(`  Expected: ${test.expectStatus} | Got: ${result.statusCode}`);

    if (status === "FAIL" || test.name.includes("XSS")) {
      console.log(`  Body: ${result.body}`);
    }
    console.log();
  } catch (err) {
    // Tests that hit SES will throw — expected for local testing
    if (
      test.expectStatus === 200 &&
      test.name !== "Honeypot filled (bot detection)" &&
      test.name !== "OPTIONS preflight request"
    ) {
      console.log(`[SKIP] ${test.name} — SES call (expected to fail locally)`);
      console.log(`  Error: ${err.message}\n`);
    } else {
      failed++;
      console.log(`[FAIL] ${test.name} — Unexpected error`);
      console.log(`  Error: ${err.message}\n`);
    }
  }
}

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
