import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";

const API = process.env.REACT_APP_API_URL;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    (async () => {
      const p = await axios.get(`${API}/products`);
      setProducts(p.data.products || []);
      // demo: pick first product's reviews
      if (p.data.products?.[0]?._id) {
        const r = await axios.get(`${API}/reviews/${p.data.products[0]._id}`);
        setRecentReviews(r.data.reviews || []);
      }
    })();
  }, []);

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Modern • Sleek • Animated</h1>
          <p>Discover premium products, smooth checkout, and verified reviews.</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Featured Products</h2>
        <div className={styles.grid}>
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>What shoppers say</h2>
        <div className={styles.reviews}>
          {recentReviews.slice(0,4).map(rv => <ReviewCard key={rv._id} review={rv} />)}
        </div>
      </section>
    </div>
  );
}
