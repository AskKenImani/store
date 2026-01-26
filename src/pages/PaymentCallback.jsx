import { useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const reference = params.get("reference");
    if (!reference) return;

    axios.post(`${API}/payments/verify`, { reference })
      .then(() => {
        localStorage.removeItem("cart_items"); // clear cart
        navigate("/dashboard");
      })
      .catch(() => {
        navigate("/payment-failed");
      });
  }, []);

  return <p>Verifying payment...</p>;
}
