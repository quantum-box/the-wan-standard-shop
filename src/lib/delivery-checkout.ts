const API_BASE = "https://tachyon-field-api.txcloud.app";
const OPERATOR_ID = "tn_01kptmrtgnm746m5mpr78e2esd";

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface DeliveryOrderInput {
  cartId: string;
  name: string;
  phone: string;
  email?: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createDeliveryOrder(
  input: DeliveryOrderInput
): Promise<{ id: string; checkoutUrl: string | null }> {
  const shippingAddress = [
    `〒${input.postalCode}`,
    input.prefecture,
    input.city,
    input.addressLine1,
    input.addressLine2,
  ]
    .filter(Boolean)
    .join(" ");

  const response = await fetch(`${API_BASE}/v1/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-operator-id": OPERATOR_ID,
    },
    body: JSON.stringify({
      query: `mutation DeliveryCheckout($input: CheckoutInput!) {
        checkout(input: $input) {
          id
          checkoutUrl
          shippingFeeNanodollar
          totalNanodollar
        }
      }`,
      variables: {
        input: {
          cartId: input.cartId,
          fulfillmentMethod: "delivery",
          paymentMethod: "online",
          shippingName: input.name,
          shippingPhone: input.phone,
          shippingAddress,
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
  if (!payload.data?.checkout) throw new Error("Delivery checkout failed");
  return payload.data.checkout;
}
