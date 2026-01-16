import { useState } from "react";
import styles from "./Auth.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // modern icons

const API = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/signup`, form);

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("user_name", form.name);

      const me = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      localStorage.setItem("user_id", me.data._id || "");
      navigate("/user-dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={submit}>
        <h1>Create account</h1>
        <p className={styles.subtitle}>Join us and start shopping</p>

        <div className={styles.row}>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className={styles.row}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className={styles.row}>
          <label>Phone</label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={onChange}
            placeholder="08012345678"
            required
          />
        </div>

        {/* Password with toggle */}
        <div className={styles.row}>
          <label>Password</label>
          <div className={styles.passwordWrap}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button className={styles.btn} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        {/* Login link */}
        <p className={styles.switchAuth}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
