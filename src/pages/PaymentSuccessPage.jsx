import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    const reference = params.get("reference");

    if (!reference) {
      navigate("/user-dashboard");
      return;
    }

    (async () => {
      try {
        await axios.post(`${API}/payments/verify`, { reference });
        clearCart(); // ✅ empty cart after success
        navigate("/user-dashboard?paid=1");
      } catch (err) {
        console.error("Verification failed:", err);
        alert("Payment verification failed. Please contact support.");
        navigate("/user-dashboard");
      }
    })();
  }, [params, navigate, clearCart]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Verifying payment…</h2>
      <p>Please wait</p>
    </div>
  );
}
