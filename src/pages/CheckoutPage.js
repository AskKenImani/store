import { useEffect, useState, useRef } from "react";
import styles from "./CheckoutPage.module.css";
import CheckoutForm from "../components/CheckoutForm";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const { token, user } = useAuth();

  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // Prevent duplicate order creation (React StrictMode safe)
  const orderCreatedRef = useRef(false);

  // Sync email when user loads
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // ✅ Create order ONCE
  useEffect(() => {
    if (!token) return;
    if (!cart.length) return;
    if (total <= 0) return;
    if (orderCreatedRef.current) return;

    orderCreatedRef.current = true;

    (async () => {
      try {
        setLoadingOrder(true);

        const products = cart.map((item) => ({
          product: item._id,
          quantity: item.qty,
        }));

        const { data } = await axios.post(
          `${API}/orders`,
          {
            products,
            totalAmount: total,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ MATCHES BACKEND RESPONSE
        setOrderId(data.orderId);
      } catch (err) {
        console.error("Order creation failed:", err);
        alert("Failed to create order. Please try again.");
        orderCreatedRef.current = false; // allow retry
      } finally {
        setLoadingOrder(false);
      }
    })();
  }, [cart, total, token]);

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
          <strong>Order Summary</strong>
        </div>

        {cart.map((item) => (
          <div key={item._id} className={styles.row}>
            {item.name} × {item.qty} — ₦
            {(item.price * item.qty).toLocaleString()}
          </div>
        ))}

        <div className={styles.row}>
          <strong>Total:</strong> ₦{total.toLocaleString()}
        </div>

        {loadingOrder && (
          <div className={styles.note}>Preparing your order…</div>
        )}

        {!loadingOrder && !orderId && (
          <div className={styles.note}>
            Creating your order…
          </div>
        )}

        {/* ✅ PAYSTACK BUTTON SHOWS ONLY WHEN ORDER EXISTS */}
        {orderId && (
          <CheckoutForm
            orderId={orderId}
            email={email}
            amount={total}
          />
        )}
      </div>
    </div>
  );
}
