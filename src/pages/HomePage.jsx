import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";

const API = process.env.REACT_APP_API_URL;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [productsRes, reviewsRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/reviews/recent`)
        ]);

        setProducts(productsRes.data.products || []);
        setRecentReviews(reviewsRes.data || []);
      } catch (err) {
        console.error("Homepage load failed", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadHomeData();
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

        {loadingReviews && <div>Loading reviews…</div>}

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
