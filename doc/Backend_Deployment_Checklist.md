# Zyphr — Backend Deployment Checklist

**Purpose:** Steps to deploy the backend to AWS after frontend development is complete.  
**Reference:** [AWS Setup Guide](../backend/AWS_SETUP_GUIDE.md)

---

## Pre-requisites

- [ ] AWS account with admin access
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Access to GoDaddy DNS panel for zyphr.co.in
- [ ] Decide on the recipient email for contact form submissions (e.g., contact@zyphr.co.in)

---

## Step 1: SES Setup

- [ ] Verify sender domain (`zyphr.co.in`) in SES — add TXT record in GoDaddy
- [ ] Set up DKIM — add 3 CNAME records in GoDaddy
- [ ] Verify recipient email address in SES
- [ ] Send a test email via SES console to confirm delivery
- [ ] Request SES production access (move out of sandbox)

## Step 2: IAM Setup

- [ ] Create IAM policy `ZyphrContactFormLambdaPolicy` using `backend/iam/lambda-ses-policy.json`
- [ ] Create IAM role `ZyphrContactFormLambdaRole` using `backend/iam/lambda-trust-policy.json`
- [ ] Attach the policy to the role

## Step 3: Lambda Deployment

- [ ] Create deployment ZIP: `index.mjs` + `package.json` (no `node_modules` needed — AWS SDK is built into Node.js 20 runtime)
- [ ] Create Lambda function `zyphr-contact-form-handler` (Node.js 20, 256 MB, 10s timeout)
- [ ] Set environment variables:
  - `RECIPIENT_EMAIL` = your chosen email
  - `SES_REGION` = `ap-south-1`
  - `ALLOWED_ORIGINS` = `https://zyphr.co.in`
  - `SENDER_EMAIL` = `noreply@zyphr.co.in`

## Step 4: API Gateway

- [ ] Create HTTP API in API Gateway
- [ ] Create Lambda integration (AWS_PROXY, payload format 2.0)
- [ ] Create route: `POST /contact`
- [ ] Create `prod` stage with auto-deploy
- [ ] Add Lambda invoke permission for API Gateway
- [ ] Configure throttling: 10 req/s, 100 burst
- [ ] Note the API URL: `https://<API_ID>.execute-api.ap-south-1.amazonaws.com/prod/contact`

## Step 5: Frontend Environment Variable

- [ ] Set `NEXT_PUBLIC_CONTACT_API_URL` in `.env.local` to the API Gateway URL above

## Step 6: Testing

- [ ] Send a valid test submission via `curl` — verify email received
- [ ] Send missing fields — verify 400 response
- [ ] Send with honeypot filled — verify silent 200 (no email)
- [ ] Test from browser (localhost:3000) — verify CORS works
- [ ] Remove `http://localhost:3000` from `ALLOWED_ORIGINS` before production launch

---

*See [backend/AWS_SETUP_GUIDE.md](../backend/AWS_SETUP_GUIDE.md) for detailed commands for each step.*
