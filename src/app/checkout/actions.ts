import { CartItem } from "@/types/cart";

export async function createOrder(items: CartItem[], totalAmount: number) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, totalAmount }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    return data.order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}
