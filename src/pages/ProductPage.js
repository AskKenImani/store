import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductPage.module.css";
import axios from "axios";
import ReviewCard from "../components/ReviewCard";
import AddReview from "../components/AddReview";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

export default function ProductPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);

  const loadReviews = useCallback(async () => {
    const r = await axios.get(`${API}/reviews/${id}`);
    setReviews(r.data.reviews || []);
  }, [id]);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const p = await axios.get(`${API}/products/${id}`);
        setProduct(p.data.product);

        await loadReviews();

        const authToken = localStorage.getItem("auth_token");
        if (authToken) {
          const res = await axios.get(`${API}/orders/has-bought/${id}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setCanReview(res.data.hasBought);
        }
      } catch (err) {
        console.error(err);
        setCanReview(false);
      }
    };

    loadProductData();
  }, [id, loadReviews]);

  if (!product) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={styles.img}
        />
        <div className={styles.info}>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <strong>₦{Number(product.price).toLocaleString()}</strong>
        </div>
      </div>

      {canReview && (
        <AddReview
          productId={id}
          token={token}
          onSuccess={loadReviews}
        />
      )}

      <h2>Reviews</h2>

      <div className={styles.reviews}>
        {reviews.length ? (
          reviews.map((rv) => (
            <ReviewCard key={rv._id} review={rv} />
          ))
        ) : (
          <div>No reviews yet.</div>
        )}
      </div>
    </div>
  );
}
