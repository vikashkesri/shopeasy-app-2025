import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  const backendURL = "http://localhost:5000/api/v1/product";

  // get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/get-product/${params.slug}`
      );
      setProduct(data?.product);

      // fetch related products
      if (data?.product) {
        getRelatedProducts(data.product._id, data.product.category._id);
      }
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  };

  // get related products
  const getRelatedProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${backendURL}/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products || []);
    } catch (error) {
      console.log("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    if (params?.slug) {
      getSingleProduct();
    }
  }, [params?.slug]);

  // Add to cart handler
  const handleAddToCart = (p) => {
    const existing = [...cart, p];
    setCart(existing);
    localStorage.setItem("cart", JSON.stringify(existing));
    toast.success("Item Added to cart");
  };

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`${backendURL}/product-photo/${product._id}`}
            className="card-img-top"
            alt={product?.name}
            height="300"
            width="350"
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product?.name}</h6>
          <h6>Description : {product?.description}</h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <button
            className="btn btn-dark ms-1"
            onClick={() => handleAddToCart(product)}
          >
            ADD TO CART
          </button>
        </div>
      </div>

      <hr />
      <div className="row container related-products">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id} style={{ width: "18rem" }}>
              <img
                src={`${backendURL}/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                <p className="card-text">{p.description.substring(0, 60)}...</p>
                <div className="d-flex justify-content-between">
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
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
