const API_BASE = "https://tachyon-field-api.txcloud.app";
const OPERATOR_ID = "tn_01kptmrtgnm746m5mpr78e2esd";

interface GraphqlResponse<T> { data?: T; errors?: Array<{ message: string }>; }

export async function cancelConsumerOrder(orderId: string): Promise<{ id: string; status: string }> {
  const response = await fetch(`${API_BASE}/v1/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-operator-id": OPERATOR_ID },
    body: JSON.stringify({
      query: `mutation CancelOrder($orderId: ID!) {
        cancelOrder(orderId: $orderId) { id status }
      }`,
      variables: { orderId },
    }),
  });
  if (!response.ok) throw new Error(`GraphQL API error: ${response.status}`);
  const payload = (await response.json()) as GraphqlResponse<{ cancelOrder: { id: string; status: string } }>;
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join("; "));
  if (!payload.data?.cancelOrder) throw new Error("Cancel order failed");
  return payload.data.cancelOrder;
}
