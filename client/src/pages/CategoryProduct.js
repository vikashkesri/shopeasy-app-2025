import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API || "http://localhost:5000";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/v1/category/get-category`);
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Could not fetch categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout title="All Categories">
      <div className="container mt-5 pt-5">
        <h2 className="text-center mb-4">All Categories</h2>

        {loading && <h4 className="text-center">Loading Categories...</h4>}
        {error && <h4 className="text-center text-danger">{error}</h4>}
        {!loading && !error && categories.length === 0 && (
          <h4 className="text-center">No Categories Found</h4>
        )}

        <div className="row">
          {!loading &&
            !error &&
            categories.map((category) => (
              <div key={category._id} className="col-md-3 mb-3">
                <Link
                  to={`/category/${category.slug}`}
                  className="card text-center p-3 text-decoration-none text-dark"
                >
                  <h5>{category.name}</h5>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default AllCategories;
