import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";

const API = process.env.REACT_APP_API_URL;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [productsRes, reviewsRes, statsRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/reviews/recent`),
          axios.get(`${API}/stats/home`),
        ]);

        setProducts(productsRes.data.products || []);
        setRecentReviews(reviewsRes.data || []);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Homepage load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();

    // 🔁 Optional auto-refresh every 30 seconds (near real-time)
    const interval = setInterval(loadHomeData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrap}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Modern • Sleek • Trusted</h1>
          <p>
            Discover premium products, smooth checkout, and verified buyer
            reviews.
          </p>
        </div>
      </section>

      {/* STATS */}
      {stats && (
        <section className={styles.stats}>
          <div className={styles.statBox}>
            <strong>{stats.reviewPercent}%</strong>
            <span>Positive Reviews</span>
          </div>

          <div className={styles.statBox}>
            <strong>{stats.totalUsers.toLocaleString()}</strong>
            <span>Registered Users</span>
          </div>

          <div className={styles.statBox}>
            <strong>{stats.totalProductsSold.toLocaleString()}</strong>
            <span>Products Sold</span>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className={styles.section}>
        <h2 className={styles.h2}>Featured Products</h2>
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className={styles.section}>
        <h2 className={styles.h2}>What shoppers say</h2>

        {loading && <div>Loading reviews…</div>}

        <div className={styles.reviews}>
          {recentReviews.length ? (
            recentReviews.slice(0, 4).map((rv) => (
              <ReviewCard key={rv._id} review={rv} />
            ))
          ) : (
            <div>No reviews yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
