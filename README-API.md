# API Testing Guide

This project includes an HTTP test file (`api.http`) for testing the API endpoints.

## Prerequisites

- VS Code with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension, OR
- IntelliJ IDEA / WebStorm (built-in support), OR
- Any HTTP client that supports `.http` files

## Running the Server

Before testing, make sure the server is running:

```bash
# Development mode (with hot reload)
npm run dev

# Or build and start
npm run build
npm start
```

The server runs on `http://localhost:3000` by default (configurable via `PORT` environment variable).

### Required Environment Variables

Set the following variables in your `.env` file to secure and control the API surface:

| Variable | Description | Default |
| --- | --- | --- |
| `ANALYZE_API_KEY` | Shared secret required in the `x-api-key` header. Requests without it receive `401`. | _(unset ⇒ auth disabled)_ |
| `RATE_LIMIT_MAX` | Max requests per IP within the rate-limit window. | `100` |
| `RATE_LIMIT_WINDOW_MS` | Window duration in milliseconds. | `900000` (15 minutes) |
| `BODY_LIMIT` | Maximum JSON payload size processed by Express. | `1mb` |
| `CORS_ORIGIN` | Comma-separated list of allowed origins. | `*` |
| `TRUST_PROXY` | Express `trust proxy` setting. | `loopback, linklocal, uniquelocal` |

## Available Endpoints

### GET `/`
Home page - renders the Express index view.

### POST `/analyze`
Financial agent analysis endpoint. Sends a request to the financial agent for transaction analysis.

**Request Body:**
```json
{
  "input": "Your question or analysis request",
  "transactions": [
    {
      "date": "2024-01-15",
      "amount": 45.50,
      "vendor": "Starbucks",
      "category": "Food & Dining",
      "note": "Optional contextual note"
    }
  ],
  "metadata": {
    "accountId": "abc-123"
  }
}
```

**Headers:**

```
Content-Type: application/json
x-api-key: <value of ANALYZE_API_KEY>
```

**Response:**
```json
{
  "text": "Agent response text",
  // ... other agent response fields
}
```

## Using the HTTP Test File

1. Open `api.http` in your editor
2. Click the "Send Request" button above any request (in VS Code with REST Client extension)
3. Or use the keyboard shortcut (usually `Ctrl+Alt+R` or `Cmd+Alt+R`)

## Test Scenarios

The `api.http` file includes tests for:

- ✅ Basic health check
- ✅ Simple text analysis requests
- ✅ Transaction data analysis
- ✅ Spending summaries
- ✅ Budget comparisons
- ✅ Error cases (empty body, invalid endpoints)
- ✅ Complex financial queries
- ✅ Auth failures and rate limit responses

## Environment Variables

You can customize the base URL by modifying the `@baseUrl` variable at the top of `api.http`:

```http
@baseUrl = http://localhost:3000
```

## Troubleshooting

- **Connection refused**: Make sure the server is running (`npm run dev` or `npm start`)
- **404 errors**: Check that the endpoint path is correct (`/users/analyze`)
- **401 errors**: Confirm that you passed the correct `x-api-key` header.
- **429 errors**: You are being rate limited. Retry after the configured window or adjust `RATE_LIMIT_MAX`.
- **500 errors**: Check server logs for details. The agent might not be built or initialized properly.

