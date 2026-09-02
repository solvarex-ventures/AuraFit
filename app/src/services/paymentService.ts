// Payment layer — mirrors the fee structure in the blueprint (Razorpay,
// 2% + GST on cards/UPI/netbanking, ~1% extra on subscriptions).
// No EXPO_PUBLIC_API_BASE_URL set → simulates a successful checkout
// instantly so the full purchase flow (ebook, coaching, subscription) is
// demoable without a merchant account. Set it once /server has real
// RAZORPAY_KEY_ID/SECRET and every checkout below hits the real Razorpay
// order API — see server/src/routes/payments.ts.
//
// Deliberately does NOT fall back to a mock "success" if a *configured*
// server errors — a payment failure has to surface as a failure, never be
// silently smoothed over.

import { apiBaseUrl, authHeaders, isServerConfigured } from '@/services/api';

export interface CheckoutParams {
  itemId: string;
  itemLabel: string;
  amountInr: number;
  kind: 'ebook' | 'bundle' | 'subscription' | 'coaching' | 'consultation';
  billing?: 'per month' | 'per 12-week cycle';
  token?: string | null;
  guestEmail?: string;
}

export interface CheckoutResult {
  success: boolean;
  orderId: string;
  paymentId: string;
}

export async function startCheckout(params: CheckoutParams): Promise<CheckoutResult> {
  if (!isServerConfigured()) {
    await new Promise((r) => setTimeout(r, 900));
    return {
      success: true,
      orderId: `order_demo_${Date.now()}`,
      paymentId: `pay_demo_${Date.now()}`,
    };
  }

  // Real flow: ask our server to create a Razorpay Order (and, if a
  // database is configured, a matching pending purchase/subscription row),
  // then open the Razorpay Checkout SDK with that order id.
  const res = await fetch(`${apiBaseUrl()}/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(params.token ?? null) },
    body: JSON.stringify({
      itemId: params.itemId,
      itemLabel: params.itemLabel,
      amountInr: params.amountInr,
      kind: params.kind,
      billing: params.billing,
      guestEmail: params.guestEmail,
    }),
  });
  const order = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(order.error ?? `Could not create order (${res.status})`);

  // In a real build, hand `order.id` to react-native-razorpay here and
  // await the user completing checkout in the native Razorpay sheet, then
  // return { success: true, orderId: order.id, paymentId: <from Razorpay> }.
  throw new Error(
    `Order ${order.id} created for real (₹${(order.amount / 100).toLocaleString('en-IN')}) — install react-native-razorpay and open it with this order to finish live checkout.`
  );
}
