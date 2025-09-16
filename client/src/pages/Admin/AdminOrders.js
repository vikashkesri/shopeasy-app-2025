import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import { server } from "../../config"; // ✅ import server

const { Option } = Select;

const AdminOrders = () => {
  const [status] = useState(["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/auth/all-orders`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setOrders(data.orders);
    } catch (error) {
      console.log("GET orders error =>", error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(
        `${server}/api/v1/auth/order-status/${orderId}`,
        { status: value },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      toast.success("Order status updated");
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Error updating status");
    }
  };

  return (
    <Layout title="All Orders Data">
      <div className="row dashboard">
        <div className="col-md-3"><AdminMenu /></div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          {orders?.length === 0 && <p className="text-center">No orders found</p>}
          {orders?.map((o, i) => (
            <div key={o._id} className="border shadow mb-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Buyer</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      <Select bordered={false} onChange={(value) => handleChange(o._id, value)} defaultValue={o?.status}>
                        {status.map((s, idx) => <Option key={idx} value={s}>{s}</Option>)}
                      </Select>
                    </td>
                    <td>{o?.buyer?.name}</td>
                    <td>{moment(o?.createdAt).fromNow()}</td>
                    <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                    <td>{o?.products?.length}</td>
                  </tr>
                </tbody>
              </table>
              <div className="container">
                {o?.products?.map((p) => (
                  <div className="row mb-2 p-3 card flex-row" key={p._id}>
                    <div className="col-md-4">
                      <img src={`${server}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} width="100px" height="100px"/>
                    </div>
                    <div className="col-md-8">
                      <p>{p.name}</p>
                      <p>{p.description.substring(0, 30)}...</p>
                      <p>Price : ₹{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
