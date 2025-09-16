import React, { useEffect, useState } from "react";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [cart, setCart] = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const API_URL = process.env.REACT_APP_API || "http://localhost:5000";
  const navigate = useNavigate();

  // ✅ Fetch all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data.category);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error.response || error);
      toast.error("Error loading categories");
    }
  };

  // ✅ Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product/get-product`);
      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error.response || error);
      toast.error("Failed to load products");
    }
  };

  // ✅ Fetch products by category
  const getProductsByCategory = async (slug) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/product/product-category/${slug}`
      );
      if (data?.success) {
        setProducts(data.products);
        setSelectedCategory(slug);
        toast.success(`Showing ${slug} products`);
      } else {
        toast.error("No products found in this category");
      }
    } catch (error) {
      console.error(
        "Error fetching products by category:",
        error.response || error
      );
      toast.error("Error loading products by category");
    }
  };

  // ✅ Add to cart
  const handleAddToCart = (product) => {
    const isExist = cart.find((item) => item._id === product._id);
    if (isExist) {
      toast.error("Product already in cart");
      return;
    }
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${product.name} added to cart`);
  };

  // ✅ Load data on mount
  useEffect(() => {
    getAllCategories();
    getAllProducts();
  }, []);

  return (
    <Layout title="All Categories">
      <div className="container mt-5 pt-5">
        <h1 className="mb-4">All Categories</h1>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.length > 0 ? (
            categories.map((c) => (
              <button
                key={c._id}
                className={`btn ${
                  selectedCategory === c.slug
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => getProductsByCategory(c.slug)}
              >
                {c.name}
              </button>
            ))
          ) : (
            <h4>No Categories Found</h4>
          )}
        </div>

        <h1 className="mb-4">Products</h1>
        <div className="row">
          {products.length > 0 ? (
            products.map((p) => (
              <div className="col-md-3 mb-4" key={p._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={`${API_URL}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "250px", objectFit: "cover" }} // ✅ same as Home.js
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text flex-grow-1">
                      {p.description.substring(0, 60)}...
                    </p>
                    <h6>
                      Price:{" "}
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h6>
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-info"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(p)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h4>No Products Found</h4>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
