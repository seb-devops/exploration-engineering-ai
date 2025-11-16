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

## Available Endpoints

### GET `/`
Home page - renders the Express index view.

### POST `/users/analyze`
Financial agent analysis endpoint. Sends a request to the financial agent for transaction analysis.

**Request Body:**
```json
{
  "input": "Your question or analysis request",
  "transactions": [ /* optional transaction data */ ]
}
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

## Environment Variables

You can customize the base URL by modifying the `@baseUrl` variable at the top of `api.http`:

```http
@baseUrl = http://localhost:3000
```

## Troubleshooting

- **Connection refused**: Make sure the server is running (`npm run dev` or `npm start`)
- **404 errors**: Check that the endpoint path is correct (`/users/analyze`)
- **500 errors**: Check server logs for details. The agent might not be built or initialized properly.

