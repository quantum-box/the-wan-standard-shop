// Static export client calls and the Pages Function intentionally share the
// same public Field API origin and tenant.
//
// The tenant travels in the URL path rather than an `x-operator-id` header:
// Field rejects a header-selected tenant on an unauthenticated call, so the
// public storefront routes are the only anonymous way in. Neither value below
// is a credential — the shop never sends a token to Field.
const FIELD_API_BASE = "https://tachyon-field-api.txcloud.app";

export const TENANT_ID = "tn_01kptmrtgnm746m5mpr78e2esd";

export const PUBLIC_STOREFRONT_BASE = `${FIELD_API_BASE}/v1/public/storefront/${TENANT_ID}`;
