import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/auth/admin-auth",
          {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
            withCredentials: true,
          }
        );

        setOk(res.data.ok);
      } catch (error) {
        console.error("Error during authentication check:", error);
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setLoading(false);
    }
  }, [auth?.token]);

  if (loading) return <Spinner />;

  return ok ? <Outlet /> : <Spinner path="" />;
}
