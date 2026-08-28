// Labels for the vocabulary the public order routes actually emit.
//
// `ConsumerOrderStatus` and `PaymentStatus` serialize as lowercase snake_case
// (tachyonfield `packages/commerce/src/domain/consumer_order.rs`). The pickup
// flow this shop runs on is `placed → confirmed → preparing → ready →
// picked_up`, so `placed` and `picked_up` are the two states a customer is most
// likely to look at — leaving them unmapped showed them the raw wire value.
const ORDER_STATUS_LABELS: Record<string, string> = {
  placed: "受付中",
  pending: "受付中",
  confirmed: "確定",
  preparing: "準備中",
  ready: "受取可能",
  picked_up: "受取済み",
  shipped: "発送済み",
  delivered: "配達完了",
  cancelled: "キャンセル済み",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "店頭支払い前",
  paid: "支払い済み",
  refunded: "返金済み",
};

/**
 * Falls back to the raw value rather than inventing one: a status this build
 * has not seen is better shown verbatim than mislabelled.
 */
function label(labels: Record<string, string>, status: string): string {
  return labels[status.toLowerCase()] ?? status;
}

export function orderStatusLabel(status: string): string {
  return label(ORDER_STATUS_LABELS, status);
}

export function paymentStatusLabel(status: string): string {
  return label(PAYMENT_STATUS_LABELS, status);
}

/** Delivery orders that have not left the store yet. */
export const PRE_SHIPMENT_STATUSES = new Set([
  "placed",
  "pending",
  "confirmed",
  "preparing",
]);

/** Delivery orders that are on their way or have arrived. */
export const SHIPPED_STATUSES = new Set(["shipped", "delivered"]);
