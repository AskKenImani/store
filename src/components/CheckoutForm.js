import { useState } from "react";
import styles from "./CheckoutForm.module.css";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function CheckoutForm({ orderId, email, amount }) {
  const [loading, setLoading] = useState(false);

  const pay = async (e) => {
    e.preventDefault();

    if (!orderId) {
      alert("Order not ready. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);

      // ✅ make sure this key matches your auth system
      const token =
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token");

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const { data } = await axios.post(
        `${API}/payments/pay`,
        {
          orderId,
          email,
          amount: amount * 100, // ✅ CONVERT TO KOBO
        },
        { headers }
      );

      if (data?.paymentUrl) {
        // ✅ Paystack redirect
        window.location.href = data.paymentUrl;
      } else {
        alert("Unable to initialize Paystack payment");
      }
    } catch (err) {
      console.error("Payment init error:", err);
      alert(
        err?.response?.data?.message ||
          "Payment initialization failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={pay}>
      <div className={styles.row}>
        <label>Email</label>
        <input value={email} readOnly />
      </div>

      <div className={styles.row}>
        <label>Amount (₦)</label>
        <input value={amount.toLocaleString()} readOnly />
      </div>

      <button
        className={styles.btn}
        disabled={loading || !orderId}
      >
        {loading ? "Redirecting..." : "Pay with Paystack"}
      </button>
    </form>
  );
}
