import { useState } from "react";
import styles from "./Auth.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API = process.env.REACT_APP_API_URL;

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/auth/login`, form);
      localStorage.setItem("auth_token", data.token);

      const me = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const role = me.data.role || "user";

      localStorage.setItem("role", role);
      localStorage.setItem("user_name", me.data.name || "");
      localStorage.setItem("user_id", me.data._id || "");

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
        <p className={styles.subtitle}>Sign in to continue</p>

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
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* Register link */}
        <p className={styles.switchAuth}>
          Don’t have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>

        {/* ForgotPassword link */}
        <p className={styles.switchAuth1}>
          Forget your password?{" "}
          <Link to="/forgot-password">Reset</Link>
        </p>

      </form>
    </div>
  );
}
