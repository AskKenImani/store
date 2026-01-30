import { useState } from "react";
import axios from "axios";
import styles from "./ReviewCard.module.css";

const API = process.env.REACT_APP_API_URL;

export default function AddReview({ productId, token, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Please write a comment");

    try {
      setLoading(true);
      await axios.post(
        `${API}/reviews`,
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComment("");
      setRating(5);
      onSuccess(); // reload reviews
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <h3>Write a Review</h3>

      <label>Rating</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>{n} Star{n > 1 && "s"}</option>
        ))}
      </select>

      <label>Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />

      <button disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
