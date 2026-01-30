import { useEffect, useState } from "react";
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

  const loadReviews = async () => {
    const r = await axios.get(`${API}/reviews/${id}`);
    setReviews(r.data.reviews || []);
  };

  useEffect(() => {
    (async () => {
      const p = await axios.get(`${API}/products/${id}`);
      setProduct(p.data.product);

      await loadReviews();

      if (localStorage.getItem("auth_token")) {
        axios
          .get(`${API}/orders/has-bought/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          })
          .then((res) => setCanReview(res.data.hasBought))
          .catch(() => setCanReview(false));
      }
    })();
  }, [id, token]);

  if (!product) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <img src={product.imageUrl} alt={product.name} className={styles.img} />
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
      {canReview && (
        <AddReview productId={id} onSuccess={() => window.location.reload()} />
      )}

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
