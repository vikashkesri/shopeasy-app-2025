import React, { useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, , loading] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API || "http://localhost:5000";

  useEffect(() => {
    if (cart.length > 0 && cart.every((item) => item.quantity === undefined)) {
      const updatedCart = cart.map((item) => ({
        ...item,
        quantity: 1,
      }));
      setCart(updatedCart);
    }
  }, []);

  const totalPrice = () => {
    return cart
      .reduce(
        (total, item) =>
          total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      )
      .toFixed(2);
  };

  const removeCartItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
    if (auth?.user?._id)
      localStorage.setItem(`cart_${auth.user._id}`, JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  const updateItemQuantity = (pid, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item._id === pid ? { ...item, quantity: newQuantity < 1 ? 1 : newQuantity } : item
    );
    setCart(updatedCart);
    if (auth?.user?._id)
      localStorage.setItem(`cart_${auth.user._id}`, JSON.stringify(updatedCart));
  };

  if (loading)
    return (
      <Layout>
        <p>Loading user info...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="cart-page container mt-4">
        <h2 className="text-center mb-3">
          {!auth?.user ? "Hello Guest" : `Hello ${auth.user.name}`}
        </h2>

        <h5 className="text-center mb-3">
          {cart.length > 0
            ? `You have ${cart.length} item(s) in your cart`
            : "Your cart is empty"}
        </h5>

        <div className="row justify-content-center">
          <div className="col-md-7">
            {cart.map((p, index) => (
              <div
                className="row card mb-3 flex-row align-items-center"
                key={`${p._id}-${index}`}
              >
                {/* Product Image */}
                <div className="col-md-4 p-0">
                  <img
                    src={`${API}/api/v1/product/product-photo/${p._id}`}
                    alt="Product"
                    className="cart-item-img"
                  />
                </div>

                {/* Product Details (Right Side of Image) */}
                <div className="col-md-5 d-flex flex-column justify-content-center p-2 product-details">
                  <h6 className="product-name">{p.name}</h6>
                  <p className="product-description">{p.description}</p>
                  <p className="product-price">Price: ${p.price}</p>

                  <div className="quantity-control mt-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        updateItemQuantity(p._id, (Number(p.quantity) || 1) - 1)
                      }
                      disabled={(Number(p.quantity) || 1) <= 1}
                    >
                      -
                    </button>

                    <span className="mx-2">{p.quantity || 1}</span>

                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        updateItemQuantity(p._id, (Number(p.quantity) || 1) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <div className="col-md-3 remove-btn-container">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-5 text-center">
            <h3>Cart Summary</h3>
            <hr />
            <h4>Total Price: ${totalPrice()}</h4>

            {auth?.user?.address ? (
              <div className="mb-3">
                <p>Address: {auth.user.address}</p>
                <button
                  className="btn btn-warning mb-2"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Update Address
                </button>
              </div>
            ) : (
              <div className="mb-3">
                <button
                  className="btn btn-warning mb-2"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Add Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
