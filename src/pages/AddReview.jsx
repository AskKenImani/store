import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

export default function AddReview({ productId, onSuccess }) {
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    await axios.post(
      `${API}/reviews`,
      { productId, rating, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onSuccess();
  };

  return (
    <div>
      <h4>Write a Review</h4>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5,4,3,2,1].map(n => (
          <option key={n} value={n}>{n} Stars</option>
        ))}
      </select>
      <textarea
        placeholder="Your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={submit}>Submit Review</button>
    </div>
  );
}
