import type { OrderLookupResult } from "@/lib/storekit";

const API_BASE = "https://tachyon-field-api.txcloud.app";
const OPERATOR_ID = "tn_01kptmrtgnm746m5mpr78e2esd";

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface ExtendedOrderLookupResult extends OrderLookupResult {
  paymentMethod: string | null;
  shippingAddress: string | null;
  shippingPhone: string | null;
  updatedAt: string;
}

interface LookupPayload {
  lookupToken: string;
}

async function graphqlFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE}/v1/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-operator-id": OPERATOR_ID,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`GraphQL API error: ${response.status}`);
  const payload = (await response.json()) as GraphqlResponse<T>;
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join("; "));
  if (!payload.data) throw new Error("GraphQL API error: missing data");
  return payload.data;
}

export async function getOrderByLookupExtended(input: {
  phone: string;
  lastDigits: string;
}): Promise<ExtendedOrderLookupResult | null> {
  try {
    const lookupData = await graphqlFetch<{ consumerOrderByLookup: LookupPayload }>(
      `mutation ConsumerOrderByLookup($input: ConsumerOrderLookupInput!) {
        consumerOrderByLookup(input: $input) {
          lookupToken
        }
      }`,
      { input }
    );
    const detailData = await graphqlFetch<{ consumerOrderByLookupToken: ExtendedOrderLookupResult | null }>(
      `query ConsumerOrderByLookupToken($lookupToken: String!) {
        consumerOrderByLookupToken(lookupToken: $lookupToken) {
          id
          status
          paymentStatus
          fulfillmentMethod
          paymentMethod
          shippingName
          shippingAddress
          shippingPhone
          totalNanodollar
          createdAt
          updatedAt
          items {
            id
            productName
            quantity
            subtotalNanodollar
          }
        }
      }`,
      { lookupToken: lookupData.consumerOrderByLookup.lookupToken }
    );
    return detailData.consumerOrderByLookupToken;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Order lookup not found") || message.includes("not found")) return null;
    throw error;
  }
}
