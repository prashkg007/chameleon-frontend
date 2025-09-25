# Chameleon Frontend

Lean SPA for landing, pricing, login, and subscription. Talks to API Gateway.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Outputs to `dist/` folder.

## Test

```bash
npm test
```

## Environment

Copy `.env.example` to `.env` and set your API Gateway URL:

```bash
VITE_API_BASE_URL=https://your-api-gateway-domain.com
```

## Deploy to S3

1. Build: `npm run build`
2. Upload `dist/` contents to S3 bucket
3. Configure S3 static website hosting
4. Set index document: `index.html`
5. Set error document: `index.html` (for SPA routing)

### S3 Bucket Policy (for public read)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### CloudFront (optional, recommended)

- Origin: S3 bucket
- Default root object: `index.html`
- Custom error pages: 403 → `/index.html` (200)
- Cache behaviors: `/*` with TTL 0 for HTML, longer for assets







