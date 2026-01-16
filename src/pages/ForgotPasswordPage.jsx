import { useState } from "react";
import styles from "./Auth.module.css";
import axios from "axios";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setMsg("Password reset link sent. Check your email.");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={submit}>
        <h1>Forgot Password</h1>
        <p className={styles.subtitle}>
          Enter your email to receive a reset link
        </p>

        <div className={styles.row}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className={styles.btn} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {msg && <p className={styles.info}>{msg}</p>}

        <p className={styles.switchAuth}>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}
