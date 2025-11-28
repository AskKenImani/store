import { useEffect, useState } from "react";
import styles from "./CheckoutPage.module.css";
import CheckoutForm from "../components/CheckoutForm";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function CheckoutPage() {
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const token = localStorage.getItem("auth_token");

  // 1) Load cart items from localStorage and compute total
  useEffect(() => {
    try {
      // 🔹 Adjust this key if your cart is stored under a different name
      const raw = localStorage.getItem("cart_items");
      if (!raw) {
        setCartItems([]);
        setCartTotal(0);
        return;
      }

      const parsed = JSON.parse(raw); // expect array: [{ _id / id, price, quantity }, ...]
      if (!Array.isArray(parsed)) {
        setCartItems([]);
        setCartTotal(0);
        return;
      }

      setCartItems(parsed);

      const total = parsed.reduce((sum, item) => {
        const price = Number(item.price || 0);
        const qty = Number(item.quantity || 1);
        return sum + price * qty;
      }, 0);

      setCartTotal(total);
    } catch (e) {
      console.error("Error reading cart from localStorage", e);
      setCartItems([]);
      setCartTotal(0);
    }
  }, []);

  // 2) Create order once we have cart items + total + token
  useEffect(() => {
    if (!token) return;
    if (!cartItems.length) return;
    if (cartTotal <= 0) return;
    if (orderId) return; // don't recreate if already created

    (async () => {
      try {
        setLoadingOrder(true);
        const user_id = localStorage.getItem("user_id");

        // 🔹 Map cart items to expected products payload
        const products = cartItems.map((item) => ({
          product: item._id || item.id, // adjust if your field is different
          quantity: item.quantity || 1,
        }));

        const { data } = await axios.post(
          `${API}/orders`,
          {
            user: user_id,
            products,
            totalAmount: cartTotal,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrderId(data.order?._id);
      } catch (e) {
        console.error("Error creating order", e);
      } finally {
        setLoadingOrder(false);
      }
    })();
  }, [token, cartItems, cartTotal, orderId]);

  return (
    <div className={styles.wrap}>
      <h1>Checkout</h1>
      <div className={styles.card}>
        <div className={styles.row}>
          <label>Contact Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className={styles.row}>
          <strong>Order Total:</strong> ₦{Number(cartTotal).toLocaleString()}
        </div>

        {loadingOrder && <div className={styles.note}>Preparing your order…</div>}

        {!loadingOrder && !orderId && (
          <div className={styles.note}>
            {cartItems.length
              ? "Creating your order…"
              : "Your cart is empty. Please add items first."}
          </div>
        )}

        {orderId && (
          <CheckoutForm orderId={orderId} email={email} amount={cartTotal} />
        )}
      </div>
    </div>
  );
}
