import { useEffect, useState } from "react";
import styles from "./UserDashboard.module.css";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const { data } = await axios.get(`${API}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);

  return (
    <div className={styles.wrap}>
      <h1>My Dashboard</h1>
      <div className={styles.card}>
        <h3>My Orders</h3>
        {!orders.length && (
          <div className={styles.empty}>No orders yet.</div>
        )}
        {orders.map((o) => (
          <div key={o._id} className={styles.row}>
            <div>Order ID: {o._id}</div>
            <div>
              Total: ₦{Number(o.totalAmount).toLocaleString()}
            </div>
            <div>Status: {o.paymentStatus}</div>
            {o.createdAt && (
              <div>
                Date: {new Date(o.createdAt).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
