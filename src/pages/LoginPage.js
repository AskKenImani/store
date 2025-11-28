import { useState } from "react";
import styles from "./Auth.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function LoginPage() {
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm(prev => ({...prev, [e.target.name]: e.target.value}));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login request
      const { data } = await axios.post(`${API}/auth/login`, form);
      localStorage.setItem("auth_token", data.token);

      // Fetch the user profile
      const me = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` }
      });

      const role = me.data.role || "user";

      localStorage.setItem("role", role);
      localStorage.setItem("user_name", me.data.name || "");
      localStorage.setItem("user_id", me.data._id || "");

      // 🔥 Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "manager") {
        navigate("/manager-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={submit}>
        <h1>Welcome back</h1>
        <div className={styles.row}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div className={styles.row}>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </div>
        <button className={styles.btn} disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>
    </div>
  );
}
