import { useEffect, useState } from "react";
import styles from "./CheckoutPage.module.css";
import CheckoutForm from "../components/CheckoutForm";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function CheckoutPage() {
  const [cartTotal, setCartTotal] = useState(5000); 
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState(null);
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    (async () => {
      // demo: create order to get orderId
      if (!token) return;
      try {
        const user_id = localStorage.getItem("user_id");
        const products = []; // attach selected product IDs here
        const { data } = await axios.post(`${API}/orders`, {
          user: user_id, products, totalAmount: cartTotal
        }, { headers: { Authorization: `Bearer ${token}` }});
        setOrderId(data.order?._id);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token, cartTotal]);

  return (
    <div className={styles.wrap}>
      <h1>Checkout</h1>
      <div className={styles.card}>
        <div className={styles.row}>
          <label>Contact Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        {orderId ? (
          <CheckoutForm orderId={orderId} email={email} amount={cartTotal} />
        ) : (
          <div className={styles.note}>Preparing your order…</div>
        )}
      </div>
    </div>
  );
}
