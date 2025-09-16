import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Search = () => {
  const [values] = useSearch();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // ✅ Use environment variable or fallback for backend
  const backendURL = process.env.REACT_APP_API || "http://localhost:5000/api/v1";

  // ✅ Prevent duplicate items in cart
  const handleAddToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      toast.error("Item already in cart");
    } else {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item Added to cart");
    }
  };

  return (
    <Layout title={`Search Results (${values?.results?.length || 0})`}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results?.length < 1
              ? "No Products Found"
              : `Found ${values?.results?.length} product(s)`}
          </h6>
        </div>

        <div className="d-flex flex-wrap mt-4">
          {values?.results?.map((p) => (
            <div className="card m-2" key={p._id} style={{ width: "18rem" }}>
              <img
                src={`${backendURL}/product/product-photo/${p._id}`}
                onError={(e) => (e.target.src = "/default-product.png")} // ✅ fallback image
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price d-flex justify-content-between">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p?.price
                      ? p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      : "N/A"}
                  </h5>
                </div>
                <p className="card-text">
                  {p.description?.substring(0, 60)}...
                </p>
                <div className="card-name-price d-flex justify-content-between">
                  <button
                    className="btn btn-info"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() => handleAddToCart(p)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
