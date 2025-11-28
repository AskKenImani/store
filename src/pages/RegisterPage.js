import { useState } from "react";
import styles from "./Auth.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
  const [form, setForm] = useState({ name:"", email:"", password:"", phoneNumber:"" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm(prev => ({...prev, [e.target.name]: e.target.value}));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/signup`, form);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("user_name", form.name);
      const me = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${data.token}` }});
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
        <div className={styles.row}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} required />
        </div>
        <div className={styles.row}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div className={styles.row}>
          <label>Phone</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={onChange} required />
        </div>
        <div className={styles.row}>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </div>
        <button className={styles.btn} disabled={loading}>{loading ? "Creating..." : "Register"}</button>
      </form>
    </div>
  );
}
