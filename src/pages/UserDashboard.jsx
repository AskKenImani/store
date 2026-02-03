import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import styles from "./UserDashboard.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;
const ONE_HOUR = 1 * 60 * 60 * 1000;

export default function UserDashboard() {
  const { user, token } = useAuth();
  const { cart, addToCart, total, setCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();

  // Fetch orders
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data.orders || []))
      .catch(console.error);
  }, [token, search]);

  // Fetch products
  useEffect(() => {
    setLoadingProducts(true);
    axios
      .get(`${API}/products`)
      .then((res) => setProducts(res.data.products || []))
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  // Cancel expired order
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this pending order?")) return;

    try {
      await axios.delete(`${API}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert("Failed to cancel order");
    }
  };

  // Continue payment
  const continuePayment = (order) => {
    if (order.products?.length) {
      const items = order.products.map((p) => ({
        _id: p.product._id,
        name: p.product.name,
        price: p.product.price,
        qty: p.quantity,
      }));
      setCart(items);
    }

    navigate("/checkout");
  };

  return (
    <div className={styles.wrap}>
      <h1>Welcome back, {user?.name} 👋</h1>

      {/* PRODUCTS */}
      <div className={styles.card}>
        <h3>Featured Products</h3>
        {loadingProducts && (
          <div className={styles.empty}>Loading products...</div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {products.map((p) => (
            <div key={p._id} style={{ width: "220px" }}>
              <ProductCard product={p} />
              <button
                style={{
                  marginTop: "5px",
                  width: "30%",
                  padding: "6px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#3b82f6",
                  color: "#fff",
                }}
                onClick={() => addToCart(p)}
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* CART SUMMARY */}
        {cart.length > 0 && (
          <div className={styles.cartBox}>
            <h4>Cart Summary</h4>
            {cart.map((item) => (
              <div key={item._id} className={styles.cartRow}>
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>
                  ₦{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
            <strong>Total: ₦{total.toLocaleString()}</strong>
            <Link to="/checkout">
              <button className={styles.checkoutBtn}>
                Go to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* ORDERS */}
      <div className={styles.card} style={{ marginTop: "20px" }}>
        <h3>My Orders</h3>
        {!orders.length && (
          <div className={styles.empty}>No orders yet.</div>
        )}

        {orders.map((o) => {
          const createdTime = o.createdAt
            ? new Date(o.createdAt).getTime()
            : 0;

          const expired =
            o.paymentStatus?.toLowerCase() === "pending" &&
            createdTime &&
            Date.now() - createdTime > ONE_HOUR;

          return (
            <div key={o._id} className={styles.row}>
              <div><strong>ID:</strong> {o._id}</div>
              <div><strong>Total:</strong> ₦{Number(o.totalAmount).toLocaleString()}</div>
              <div><strong>Status:</strong> {o.paymentStatus}</div>
              <div><strong>Date:</strong> {new Date(o.createdAt).toLocaleString()}</div>

              {expired && (
                <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                  <button
                    className={styles.resolveBtn}
                    onClick={() => continuePayment(o)}
                  >
                    Continue Payment
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => cancelOrder(o._id)}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
