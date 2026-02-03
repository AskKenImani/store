import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function AddReview({ productId, token, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitReview = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await axios.post(
        `${API}/reviews`,
        {
          productId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");
      setRating(5);
      onSuccess(); // reload reviews
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "You must purchase this product to review it"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitReview}
      style={{
        margin: "20px 0",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3>Write a Review</h3>

      {error && (
        <div style={{ color: "red", marginBottom: "8px" }}>
          {error}
        </div>
      )}

      <label>Rating</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        style={{ display: "block", marginBottom: "10px" }}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 && "s"}
          </option>
        ))}
      </select>

      <label>Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        rows={4}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
