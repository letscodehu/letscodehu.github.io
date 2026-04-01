## Waitlist Signup: Mailchimp to Lambda

### Architectural change
- Replaced client-side Mailchimp JSONP integration with a direct HTTP `POST` request to an AWS Lambda Function URL.
- Centralized endpoint and timeout configuration in `src/config.ts`:
  - `WAITLIST_SIGNUP_API_URL`
  - `WAITLIST_SIGNUP_TIMEOUT_MS`

### Request contract
- Endpoint: `https://hlzqq43xoyvmvxfojrgjrdin4m0pzskp.lambda-url.eu-central-1.on.aws/`
- Method: `POST`
- Content-Type: `application/json`
- Payload:
  - `email: string`
  - `firstName: string`

### Success and failure behavior
- Frontend treats any `2xx` response as successful signup.
- Timeout is enforced with `AbortController`; timeout and network failures map to existing localized error messages.
- Non-`2xx` responses are treated as generic submission failure.

### Privacy content update
- Removed Mailchimp-specific references from HU/EN privacy strings.
- Updated signup hint text to generic network retry guidance.
