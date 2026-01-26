import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

export default function ChangePassword() {
  const { token } = useAuth();
  const [password, setPassword] = useState("");

  const submit = async () => {
    await axios.patch(
      `${API}/users/change-password`,
      { password },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Password changed successfully. Please login again.");
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h2>Change Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit}>Update</button>
    </div>
  );
}
