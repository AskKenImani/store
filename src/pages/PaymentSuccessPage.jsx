import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setStatus("Invalid payment reference");
      return;
    }

    const verifyPayment = async () => {
      try {
        await axios.post(
          `${API}/payments/verify`,
          { reference },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStatus("Payment successful! Redirecting...");
        setTimeout(() => navigate("/user-dashboard"), 2000);
      } catch (err) {
        console.error(err);
        setStatus("Payment verification failed");
      }
    };

    verifyPayment();
  }, [searchParams, token, navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>{status}</h2>
      <p>Please do not refresh this page.</p>
    </div>
  );
}
