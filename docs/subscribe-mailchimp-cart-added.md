# Subscribe Lambda: Mailchimp-only flow

## Architectural change

The `scripts/subscribe.py` Lambda no longer sends transactional emails through SES.
It now performs a Mailchimp-only workflow:

1. Upsert member in the configured audience (`PUT /lists/{list_id}/members/{subscriber_hash}`).
2. Add the `cart-added` tag to the same member (`POST /lists/{list_id}/members/{subscriber_hash}/tags`).

## Runtime impact

- Removed SES runtime dependency (`boto3`) from this Lambda.
- Removed SES/PDF-related environment variable requirements from this Lambda.
- Existing contacts are handled idempotently via upsert and still receive the `cart-added` tag.
