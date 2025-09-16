import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth"; // fixed
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner"; // fixed

const PrivateRoute = () => {
  const [auth, , authLoading] = useAuth();
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      if (!auth?.token) {
        setOk(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/v1/auth/user-auth", {
          headers: { Authorization: `Bearer ${auth.token}` },
          withCredentials: true,
        });
        setOk(res.data.ok);
      } catch (error) {
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) authCheck(); // wait for context to load
  }, [auth?.token, authLoading]);

  useEffect(() => {
    if (!loading && !ok) {
      navigate("/login", { replace: true });
    }
  }, [loading, ok, navigate]);

  if (loading || authLoading) return <Spinner />;

  return ok ? <Outlet /> : null;
};

export default PrivateRoute;
