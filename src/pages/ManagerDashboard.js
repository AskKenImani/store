import { useEffect, useState } from "react";
import styles from "./ManagerDashboard.module.css";
import axios from "axios";
import ProductForm from "../components/ProductForm";

const API = process.env.REACT_APP_API_URL;

export default function ManagerDashboard() {
  const token = localStorage.getItem("auth_token");
  const [products, setProducts] = useState([]);

  const load = async () => {
    const { data } = await axios.get(`${API}/products`);
    setProducts(data.products || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className={styles.wrap}>
      <h1>Manager Dashboard</h1>
      <div className={styles.grid}>
        <div className={styles.left}>
          <h3>Upload Product</h3>
          <ProductForm token={token} onSuccess={load} />
        </div>
        <div className={styles.right}>
          <h3>My Category Products</h3>
          <div className={styles.list}>
            {products.map(p => (
              <div className={styles.item} key={p._id}>
                <img src={p.imageUrl} alt={p.name} />
                <div className={styles.meta}>
                  <div className={styles.name}>{p.name}</div>
                  <div className={styles.sub}>₦{Number(p.price).toLocaleString()} • {p.category}</div>
                  <div className={styles.sub}>By {p.uploadedBy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
