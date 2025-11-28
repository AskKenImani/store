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

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadAll = async () => {
    setLoading(true);
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

      {/* Orders section */}
      <div className={styles.section}>
        <h3>All Orders</h3>
        <div className={styles.list}>
          {!orders.length && (
            <div className={styles.empty}>No orders yet.</div>
          )}
          {orders.map((o) => (
            <div key={o._id} className={styles.itemRow}>
              <div>
                <strong>Order ID:</strong> {o._id}
              </div>
              <div>
                <strong>Total:</strong> ₦
                {Number(o.totalAmount).toLocaleString()}
              </div>
              <div>
                <strong>Status:</strong> {o.paymentStatus}
              </div>
              <div>
                <strong>User:</strong>{" "}
                {o.user
                  ? `${o.user.name} (${o.user.email}) [${o.user.role}]`
                  : "N/A"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users & roles section */}
      <div className={styles.section}>
        <h3>Users & Roles</h3>
        <div className={styles.list}>
          {!users.length && (
            <div className={styles.empty}>No users registered yet.</div>
          )}
          {users.map((u) => (
            <div key={u._id} className={styles.itemRow}>
              <div>
                <strong>{u.name}</strong> ({u.email})
              </div>
              <div>
                Current role: <strong>{u.role}</strong>
              </div>
              <div>
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
