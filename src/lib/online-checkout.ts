const API_BASE = "https://tachyon-field-api.txcloud.app";
const OPERATOR_ID = "tn_01kptmrtgnm746m5mpr78e2esd";

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function createOnlinePickupOrder(input: {
  cartId: string;
  name: string;
  phone: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; checkoutUrl: string }> {
  const response = await fetch(`${API_BASE}/v1/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-operator-id": OPERATOR_ID,
    },
    body: JSON.stringify({
      query: `mutation OnlineCheckout($input: CheckoutInput!) {
        checkout(input: $input) {
          id
          checkoutUrl
        }
      }`,
      variables: {
        input: {
          cartId: input.cartId,
          fulfillmentMethod: "pickup",
          paymentMethod: "online",
          shippingName: input.name,
          shippingPhone: input.phone,
          customerEmail: input.email,
          successUrl: input.successUrl,
          cancelUrl: input.cancelUrl,
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`GraphQL API error: ${response.status}`);
  const payload = (await response.json()) as GraphqlResponse<{
    checkout: { id: string; checkoutUrl: string | null };
  }>;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }
  if (!payload.data?.checkout.checkoutUrl) throw new Error("Online checkout URL is missing");
  return { id: payload.data.checkout.id, checkoutUrl: payload.data.checkout.checkoutUrl };
}
