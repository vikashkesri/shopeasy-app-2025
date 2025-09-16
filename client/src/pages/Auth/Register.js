import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import "../../styles/AuthStyles.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  // from function
const handleSubmit = async (e) => {
  e.preventDefault();

  // Phone number validation (basic check)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    toast.error("Please enter a valid phone number.");
    return;
  }

  try {
    // ✅ FIX: Allow cookies/auth headers to be sent across origins
    axios.defaults.withCredentials = true;

    const res = await axios.post("http://localhost:5000/api/v1/auth/register", {
      name,
      email,
      password,
      phone,
      address,
      answer
    });

    if (res && res.data.success) {
      toast.success(res.data.message);
      navigate("/login");
    } else {
      toast.error(res.data.message || "Registration failed.");
    }

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again.");
  }
};

  return (
    <Layout title={"Register - Ecommerce App"}>
      <div className="register-bg">
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control" 
              id="exampleInputName1" 
              placeholder="Enter Your Name"
              required
            />
          </div>

          <div className="mb-3">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control" 
              id="exampleInputEmail1" 
              placeholder="Enter Your Email"
              required
            />
          </div>

          <div className="mb-3">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control" 
              id="exampleInputPassword1"
              placeholder="Enter Your Password" 
              required
            />
          </div>

          <div className="mb-3">
            <input 
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control" 
              id="exampleInputPhone1" 
              placeholder="Enter Your Phone"
              required
            />
          </div>

          <div className="mb-3">
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control" 
              id="exampleInputAddress1"
              placeholder="Enter Your Address" 
              required
            />
          </div>

          <div className="mb-3">
            <input 
              type="text" 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control" 
              id="exampleInputAnswer1"
              placeholder="What is Your Favorite Sports" 
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">REGISTER</button>
        </form>
      </div>
      </div>
    </Layout>
  );
};

export default Register;



