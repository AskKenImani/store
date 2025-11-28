import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductPage.module.css";
import axios from "axios";
import ReviewCard from "../components/ReviewCard";

const API = process.env.REACT_APP_API_URL;

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      const p = await axios.get(`${API}/products/${id}`);
      setProduct(p.data.product);
      const r = await axios.get(`${API}/reviews/${id}`);
      setReviews(r.data.reviews || []);
    })();
  }, [id]);

  if (!product) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <img src={product.imageUrl} alt={product.name} className={styles.img} />
        <div className={styles.info}>
          <h1>{product.name}</h1>
          <p className={styles.desc}>{product.description}</p>
          <div className={styles.meta}>
            <span className={styles.price}>₦{Number(product.price).toLocaleString()}</span>
            <span className={styles.by}>Uploaded by {product.uploadedBy}</span>
          </div>
        </div>
      </div>

      <h2 className={styles.h2}>Reviews</h2>
      <div className={styles.reviews}>
        {reviews.length ? reviews.map(rv => <ReviewCard key={rv._id} review={rv} />) : (
          <div className={styles.noReviews}>No reviews yet.</div>
        )}
      </div>
    </div>
  );
}
