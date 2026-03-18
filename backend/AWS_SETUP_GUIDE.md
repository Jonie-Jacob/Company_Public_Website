# Zyphr Contact Form — AWS Backend Setup Guide

## Overview

This guide covers the complete setup of the serverless contact form backend:
- **AWS SES** — Email delivery
- **AWS Lambda** — Form processing function
- **AWS API Gateway** — HTTP endpoint

---

## Prerequisites

- AWS account with admin or sufficient IAM permissions
- AWS CLI installed and configured (`aws configure`)
- Domain `zyphr.co.in` registered (GoDaddy)
- Access to GoDaddy DNS management panel

---

## Step 1: AWS SES Configuration

### 1.1 Verify Sender Domain

```bash
aws ses verify-domain-identity --domain zyphr.co.in --region ap-south-1
```

This returns a **TXT record**. Add it to GoDaddy DNS:

| Type | Name | Value |
|------|------|-------|
| TXT | `_amazonses.zyphr.co.in` | (Value from AWS response) |

### 1.2 Set Up DKIM (Recommended)

```bash
aws ses verify-domain-dkim --domain zyphr.co.in --region ap-south-1
```

Add the 3 CNAME records returned to GoDaddy DNS.

### 1.3 Verify Recipient Email

While in SES sandbox mode, you must also verify the recipient email:

```bash
aws ses verify-email-identity --email-address contact@zyphr.co.in --region ap-south-1
```

Check your inbox and click the verification link.

### 1.4 Request Production Access (Before Launch)

In the **AWS SES Console → Account Dashboard**, click **Request Production Access**.

Fill in:
- **Mail type:** Transactional
- **Website URL:** https://zyphr.co.in
- **Use case description:** "Contact form submissions from our company website. Low volume, estimated <100 emails/month. All emails are sent to our own recipient address in response to user-submitted forms with proper consent."

### 1.5 Test SES

```bash
aws ses send-email \
  --from noreply@zyphr.co.in \
  --to contact@zyphr.co.in \
  --subject "SES Test" \
  --text "SES is working." \
  --region ap-south-1
```

---

## Step 2: IAM Role for Lambda

### 2.1 Create IAM Policy

Create a file `lambda-ses-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ses:FromAddress": "noreply@zyphr.co.in"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

```bash
aws iam create-policy \
  --policy-name ZyphrContactFormLambdaPolicy \
  --policy-document file://lambda-ses-policy.json
```

### 2.2 Create IAM Role

Create `lambda-trust-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

```bash
aws iam create-role \
  --role-name ZyphrContactFormLambdaRole \
  --assume-role-policy-document file://lambda-trust-policy.json

aws iam attach-role-policy \
  --role-name ZyphrContactFormLambdaRole \
  --policy-arn arn:aws:iam::<ACCOUNT_ID>:policy/ZyphrContactFormLambdaPolicy
```

> Replace `<ACCOUNT_ID>` with your AWS account ID.

---

## Step 3: Deploy Lambda Function

### 3.1 Create Deployment Package

From the `backend/lambda/` directory:

**Windows (PowerShell):**
```powershell
Compress-Archive -Path index.mjs, package.json -DestinationPath deployment-package.zip -Force
```

**Linux/Mac:**
```bash
zip deployment-package.zip index.mjs package.json
```

> Note: The `@aws-sdk/client-ses` module is included in the Lambda Node.js 20 runtime — no need to bundle it.

### 3.2 Create Lambda Function

```bash
aws lambda create-function \
  --function-name zyphr-contact-form-handler \
  --runtime nodejs20.x \
  --role arn:aws:iam::<ACCOUNT_ID>:role/ZyphrContactFormLambdaRole \
  --handler index.handler \
  --zip-file fileb://deployment-package.zip \
  --timeout 10 \
  --memory-size 256 \
  --environment "Variables={RECIPIENT_EMAIL=contact@zyphr.co.in,SES_REGION=ap-south-1,ALLOWED_ORIGINS=https://zyphr.co.in,SENDER_EMAIL=noreply@zyphr.co.in}" \
  --region ap-south-1
```

### 3.3 Update Lambda Function (After Code Changes)

```bash
aws lambda update-function-code \
  --function-name zyphr-contact-form-handler \
  --zip-file fileb://deployment-package.zip \
  --region ap-south-1
```

### 3.4 Update Environment Variables

```bash
aws lambda update-function-configuration \
  --function-name zyphr-contact-form-handler \
  --environment "Variables={RECIPIENT_EMAIL=contact@zyphr.co.in,SES_REGION=ap-south-1,ALLOWED_ORIGINS=https://zyphr.co.in\,http://localhost:3000,SENDER_EMAIL=noreply@zyphr.co.in}" \
  --region ap-south-1
```

> Add `http://localhost:3000` to ALLOWED_ORIGINS during development. Remove it before production launch.

---

## Step 4: API Gateway

### 4.1 Create HTTP API

```bash
aws apigatewayv2 create-api \
  --name ZyphrContactFormAPI \
  --protocol-type HTTP \
  --region ap-south-1
```

Note the **ApiId** from the response.

### 4.2 Create Integration

```bash
aws apigatewayv2 create-integration \
  --api-id <API_ID> \
  --integration-type AWS_PROXY \
  --integration-uri arn:aws:lambda:ap-south-1:<ACCOUNT_ID>:function:zyphr-contact-form-handler \
  --payload-format-version 2.0 \
  --region ap-south-1
```

Note the **IntegrationId** from the response.

### 4.3 Create Route

```bash
aws apigatewayv2 create-route \
  --api-id <API_ID> \
  --route-key "POST /contact" \
  --target integrations/<INTEGRATION_ID> \
  --region ap-south-1
```

### 4.4 Create Stage (Auto-Deploy)

```bash
aws apigatewayv2 create-stage \
  --api-id <API_ID> \
  --stage-name prod \
  --auto-deploy \
  --region ap-south-1
```

### 4.5 Add Lambda Permission for API Gateway

```bash
aws lambda add-permission \
  --function-name zyphr-contact-form-handler \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:ap-south-1:<ACCOUNT_ID>:<API_ID>/*" \
  --region ap-south-1
```

### 4.6 Configure Throttling

In the AWS Console → API Gateway → your API → Routes → POST /contact → Route throttling:
- **Rate:** 10 requests/second
- **Burst:** 100 requests

Or via CLI:

```bash
aws apigatewayv2 update-stage \
  --api-id <API_ID> \
  --stage-name prod \
  --route-settings '{"POST /contact":{"ThrottlingBurstLimit":100,"ThrottlingRateLimit":10}}' \
  --region ap-south-1
```

### 4.7 Get Your API URL

```bash
aws apigatewayv2 get-api --api-id <API_ID> --region ap-south-1
```

Your endpoint will be:
```
https://<API_ID>.execute-api.ap-south-1.amazonaws.com/prod/contact
```

Save this URL — it will be used as `NEXT_PUBLIC_CONTACT_API_URL` in the frontend.

---

## Step 5: Testing

### 5.1 Local Validation Tests

From `backend/lambda/`:

```bash
node test.mjs
```

This tests validation, sanitization, honeypot, and CORS logic locally. SES calls will fail locally (expected).

### 5.2 Live API Test (After Deployment)

**Valid submission:**

```bash
curl -X POST https://<API_ID>.execute-api.ap-south-1.amazonaws.com/prod/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://zyphr.co.in" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Corp",
    "service": "Custom Software Development",
    "budget": "Let'\''s Discuss",
    "message": "This is a test submission from the deployment verification."
  }'
```

**Expected:** 200 response + email received at contact@zyphr.co.in

**Missing fields test:**

```bash
curl -X POST https://<API_ID>.execute-api.ap-south-1.amazonaws.com/prod/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://zyphr.co.in" \
  -d '{"name": "", "email": "", "message": ""}'
```

**Expected:** 400 with validation errors

**Bot test (honeypot):**

```bash
curl -X POST https://<API_ID>.execute-api.ap-south-1.amazonaws.com/prod/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://zyphr.co.in" \
  -d '{"name": "Bot", "email": "bot@spam.com", "message": "spam", "website": "http://spam.com"}'
```

**Expected:** 200 response but NO email sent

---

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `RECIPIENT_EMAIL` | `contact@zyphr.co.in` | Email address that receives form submissions |
| `SES_REGION` | `ap-south-1` | AWS region for SES |
| `ALLOWED_ORIGINS` | `https://zyphr.co.in` | Comma-separated allowed CORS origins |
| `SENDER_EMAIL` | `noreply@zyphr.co.in` | "From" address for SES emails |

> During development, add `http://localhost:3000` to `ALLOWED_ORIGINS`. Remove before production launch.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| SES "Email address not verified" | Verify both sender domain and recipient email in SES |
| SES "Sending to non-verified address" | You're still in SES sandbox. Request production access |
| CORS errors from browser | Check `ALLOWED_ORIGINS` env var includes your frontend origin |
| Lambda timeout | Check CloudWatch logs, increase timeout if needed |
| 403 Forbidden from API Gateway | Check Lambda permission allows API Gateway invocation |
| "Internal Server Error" from API | Check CloudWatch logs for the Lambda function |

---
