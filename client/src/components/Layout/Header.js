import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import axios from "axios";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [products, setProducts] = useState([]);
  const [openProd, setOpenProd] = useState(false); // for hover toggle
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API || "http://localhost:5000";

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product/get-product`);
      if (data?.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Handle "All Categories" click
  const handleAllCategories = () => {
    navigate("/categories", { state: { products: products } });
    setOpenProd(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand">
              🛒 ShopEasy
            </Link>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <SearchInput />

              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>

              {/* Categories Dropdown with all Products */}
              <li
                className={`nav-item dropdown ${openProd ? "show" : ""}`}
                onMouseEnter={() => setOpenProd(true)}
                onMouseLeave={() => setOpenProd(false)}
              >
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  type="button"
                >
                  Categories
                </button>
                <ul className={`dropdown-menu ${openProd ? "show" : ""}`}>
                  <li>
                    <span
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={handleAllCategories}
                    >
                      All Categories
                    </span>
                  </li>
                  {products?.length > 0 ? (
                    products.map((p) => (
                      <li key={p._id}>
                        <Link
                          className="dropdown-item"
                          to={`/product/${p.slug}`}
                          onClick={() => setOpenProd(false)}
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="dropdown-item">No Products Found</span>
                    </li>
                  )}
                </ul>
              </li>

              {/* Auth Links */}
              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    {auth?.user?.name}
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink
                        to={`/dashboard/${
                          auth?.user?.role === 1 ? "admin" : "user"
                        }`}
                        className="dropdown-item"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={handleLogout}
                        to="/login"
                        className="dropdown-item"
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </li>
              )}

              {/* Cart */}
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link">
                  <Badge count={cart?.length} showZero offset={[10, -5]}>
                    Cart
                  </Badge>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
