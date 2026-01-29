import { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import axios from "axios";
import ProductForm from "../components/ProductForm";

const API = process.env.REACT_APP_API_URL;

export default function AdminDashboard() {
  const token = localStorage.getItem("auth_token");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadAll = async () => {
    setLoading(true);
    const reviewsRes = await axios.get(`${API}/reviews`, { headers: authHeaders });
    setReviews(reviewsRes.data.reviews || []);
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get(`${API}/products`), // products may or may not need auth
        axios.get(`${API}/orders`, { headers: authHeaders }),
        axios.get(`${API}/users`, { headers: authHeaders }),
      ]);

      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await axios.delete(`${API}/reviews/${id}`, { headers: authHeaders });
    loadAll();
  };

  const delProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: authHeaders,
      });
      await loadAll();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const resolveOrder = async (id) => {
    if (!window.confirm("Resolve this pending order?")) return;
    await axios.patch(`${API}/orders/${id}/resolve`, {}, { headers: authHeaders });
    loadAll();
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await axios.delete(`${API}/orders/${id}`, { headers: authHeaders });
    loadAll();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`${API}/users/${id}`, { headers: authHeaders });
    loadAll();
  };

  const changeRole = async (userId, newRole) => {
    if (!window.confirm(`Change role to "${newRole}"?`)) return;
    try {
      await axios.patch(
        `${API}/users/${userId}/role`,
        { role: newRole },
        { headers: authHeaders }
      );
      await loadAll();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update role");
    }
  };

  if (!token) {
    return (
      <div className={styles.wrap}>
        <h1>Admin Dashboard</h1>
        <p>Please log in again to access the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1>Admin Dashboard</h1>
      {loading && <div className={styles.loading}>Loading...</div>}

      {/* Products + product form */}
      <div className={styles.grid}>
        <div className={styles.left}>
          <h3>Create / Edit Product</h3>
          <ProductForm token={token} onSuccess={loadAll} />
        </div>

        <div className={styles.right}>
          <h3>Products</h3>
          <div className={styles.list}>
            {products.map((p) => (
              <div className={styles.item} key={p._id}>
                {p.imageUrl && <img src={p.imageUrl} alt={p.name} />}
                <div className={styles.meta}>
                  <div className={styles.name}>{p.name}</div>
                  <div className={styles.sub}>
                    ₦{Number(p.price).toLocaleString()} • {p.category}
                  </div>
                  <div className={styles.sub}>By {p.uploadedBy}</div>
                </div>
                <button
                  onClick={() => delProduct(p._id)}
                  className={styles.del}
                >
                  Delete
                </button>
              </div>
            ))}
            {!products.length && (
              <div className={styles.empty}>No products yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* ORDERS */}
      <h3>Orders</h3>
      {orders.map((o) => {
        const isPending = o.paymentStatus === "pending";
        return (
          <div key={o._id} className={styles.itemRow}>
            <div>₦{o.totalAmount.toLocaleString()}</div>
            <div>Status: {o.paymentStatus}</div>
            <div>User: {o.user?.email}</div>

            {isPending && (
              <button onClick={() => resolveOrder(o._id)}>
                Resolve
              </button>
            )}

            <button onClick={() => deleteOrder(o._id)} className={styles.del}>
              Delete
            </button>
          </div>
        );
      })}

      {/* USERS */}
      <h3>Users</h3>
      {users.map((u) => (
        <div key={u._id} className={styles.itemRow}>
          <div>{u.email}</div>
          <select
            value={u.role}
            onChange={(e) => changeRole(u._id, e.target.value)}
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={() => deleteUser(u._id)} className={styles.del}>
            Delete
          </button>
        </div>
      ))}

      <h3>Reviews</h3>
      {reviews.map((r) => (
        <div key={r._id} className={styles.itemRow}>
          <div>
            <strong>{r.user?.name}</strong> → {r.product?.name}
          </div>
          <div>{r.rating} ★</div>
          <div>{r.comment}</div>
          <button onClick={() => deleteReview(r._id)} className={styles.del}>
            Delete
          </button>
        </div>
      ))}
      
    </div>
  );
}
