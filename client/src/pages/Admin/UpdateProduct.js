import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [productId, setProductId] = useState("");

  // get token (protected routes)
  const token = (() => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      return authData?.token || "";
    } catch {
      return "";
    }
  })();

  // Fetch categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/category/get-category"
      );
      if (data?.success) setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch single product (✅ correct endpoint)
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/product/get-product/${slug}`
      );
      if (data?.success) {
        const p = data.product;
        setProductId(p._id);
        setName(p.name);
        setDescription(p.description);
        setPrice(p.price);
        setQuantity(p.quantity);
        setCategory(p.category?._id || "");
        setShipping(p.shipping ? "1" : "0");
      } else {
        toast.error(data?.message || "Failed to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product:", error?.response || error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch product details"
      );
    }
  };

  useEffect(() => {
    getAllCategory();
    getSingleProduct();
    // eslint-disable-next-line
  }, [slug]);

  // Update product (✅ add Authorization header; let axios set Content-Type)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        toast.error("You are not authorized");
        return;
      }

      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("shipping", shipping); // "1" | "0"
      if (photo) productData.append("photo", photo);

      const { data } = await axios.put(
        `http://localhost:5000/api/v1/product/update-product/${productId}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Do NOT manually set Content-Type for FormData; axios will handle boundary
          },
        }
      );

      if (data?.success) {
        toast.success("Product updated successfully!");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Something went wrong while updating");
      }
    } catch (error) {
      console.error("Error updating product:", error?.response || error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while updating product"
      );
    }
  };

  // Delete product (✅ correct endpoint + token)
  const handleDelete = async () => {
    try {
      if (!token) {
        toast.error("You are not authorized");
        return;
      }
      const { data } = await axios.delete(
        `http://localhost:5000/api/v1/product/delete-product/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.success) {
        toast.success("Product deleted successfully!");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete Error:", error?.response || error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while deleting the product"
      );
    }
  };

  return (
    <Layout title="Dashboard - Update Product">
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                className="form-select mb-3"
                value={category}
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {(photo || productId) && (
                <div className="text-center mb-3">
                  <img
                    src={
                      photo
                        ? URL.createObjectURL(photo)
                        : `http://localhost:5000/api/v1/product/product-photo/${productId}` // ✅ singular
                    }
                    alt="product_photo"
                    height="200px"
                  />
                </div>
              )}

              <input
                type="text"
                value={name}
                placeholder="Write a name"
                className="form-control mb-3"
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                value={description}
                placeholder="Write a description"
                className="form-control mb-3"
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="number"
                value={price}
                placeholder="Write a price"
                className="form-control mb-3"
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="number"
                value={quantity}
                placeholder="Write a quantity"
                className="form-control mb-3"
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Select
                bordered={false}
                placeholder="Select Shipping"
                size="large"
                className="form-select mb-3"
                value={shipping}
                onChange={(value) => setShipping(value)}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>

              <button className="btn btn-primary me-2" onClick={handleUpdate}>
                UPDATE PRODUCT
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                DELETE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
