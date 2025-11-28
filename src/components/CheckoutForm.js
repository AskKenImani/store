import { useState } from "react";
import styles from "./CheckoutForm.module.css";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function CheckoutForm({ orderId, email, amount }) {
  const [loading, setLoading] = useState(false);

  const pay = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.post(`${API}/payments/pay`, { amount, orderId, email }, { headers });
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl; // Paystack authorization_url
      } else {
        alert("Unable to initialize Paystack payment");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Payment init failed");
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
        <input value={amount} readOnly />
      </div>
      <button className={styles.btn} disabled={loading}>
        {loading ? "Redirecting..." : "Pay with Paystack"}
      </button>
    </form>
  );
}
