import { expect, test } from "@playwright/test";
import { getCheckoutDraft } from "../src/lib/checkout-storage";
import { getOrderReceipt } from "../src/lib/order-receipt-storage";
import { getOrderView } from "../src/lib/order-view-storage";
import { getDeliveryOrderView } from "../src/lib/delivery-order-storage";
import { orderStatusLabel, paymentStatusLabel } from "../src/lib/order-status";

/**
 * These modules read `sessionStorage`, which only exists in a browser. The
 * stand-in is enough for them: get, set and remove against a plain map.
 */
function withSessionStorage(entries: Record<string, string>, body: () => void) {
  const store = new Map(Object.entries(entries));
  const stub = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  };
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: stub });
  try {
    body();
    return store;
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else delete (globalThis as { window?: unknown }).window;
    if (originalStorage) Object.defineProperty(globalThis, "sessionStorage", originalStorage);
    else delete (globalThis as { sessionStorage?: unknown }).sessionStorage;
  }
}

// The shape this app wrote before the public-storefront migration: prices hung
// off the product, and neither the cart nor its lines carried an amount.
const LEGACY_DRAFT = JSON.stringify({
  cartId: "crt_01",
  contact: { name: "Wan", phone: "090-0000-0000", email: "" },
  cart: {
    id: "crt_01",
    items: [
      {
        itemId: "cri_01",
        productId: "pd_01",
        quantity: 2,
        product: { id: "pd_01", name: "Wan Bowl", price: 3200, stock: 5 },
      },
    ],
  },
  savedAt: "2026-08-27T00:00:00Z",
});

test("a checkout draft from the previous build is discarded, not rendered", () => {
  const store = withSessionStorage({ tws_checkout_draft: LEGACY_DRAFT }, () => {
    // Reading the old shape would hand the confirmation page `undefined`
    // amounts and crash it on `toLocaleString`.
    expect(getCheckoutDraft()).toBeNull();
  });
  expect(store.has("tws_checkout_draft")).toBe(false);
});

test("a checkout draft in the current shape survives", () => {
  const current = JSON.stringify({
    cartId: "crt_01",
    contact: { name: "Wan", phone: "090-0000-0000", email: "" },
    cart: {
      id: "crt_01",
      subtotal: 6400,
      items: [
        {
          itemId: "cri_01",
          productId: "pd_01",
          quantity: 2,
          unitPrice: 3200,
          subtotal: 6400,
          product: { id: "pd_01", name: "Wan Bowl", price: 3200, orderable: true },
        },
      ],
    },
    savedAt: "2026-08-28T00:00:00Z",
  });
  withSessionStorage({ tws_checkout_draft: current }, () => {
    expect(getCheckoutDraft()?.cart.subtotal).toBe(6400);
  });
});

test("order views and receipts from the previous build are discarded too", () => {
  const legacyOrder = JSON.stringify({
    id: "ord_01",
    status: "ready",
    totalNanodollar: "6400000000000",
    items: [],
  });
  withSessionStorage({ "tws_order_view:ord_01": legacyOrder }, () => {
    expect(getOrderView("ord_01")).toBeNull();
  });
  withSessionStorage({ tws_delivery_order_view: legacyOrder }, () => {
    expect(getDeliveryOrderView()).toBeNull();
  });
  withSessionStorage({ "tws_order_receipt:ord_01": LEGACY_DRAFT }, () => {
    expect(getOrderReceipt("ord_01")).toBeNull();
  });
});

test("the order status labels cover the vocabulary the public routes emit", () => {
  // `ConsumerOrderStatus` serializes snake_case; the pickup flow this shop runs
  // is placed → confirmed → preparing → ready → picked_up.
  for (const status of [
    "placed",
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "picked_up",
    "shipped",
    "delivered",
    "cancelled",
  ]) {
    expect(orderStatusLabel(status), `${status} should be translated`).not.toBe(status);
  }
  for (const status of ["unpaid", "paid", "refunded"]) {
    expect(paymentStatusLabel(status), `${status} should be translated`).not.toBe(status);
  }
  // An unknown status is shown verbatim rather than mislabelled.
  expect(orderStatusLabel("teleported")).toBe("teleported");
});
