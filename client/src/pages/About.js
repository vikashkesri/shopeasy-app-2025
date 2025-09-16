import React from 'react';
import Layout from '../components/Layout/Layout';

function About() {
  return (
    <Layout title={"About us - ShopEasy app"}>
      <div className="row contactus align-items-center my-5">

        {/* Left Side: Image */}
        <div className="col-md-6">
          <img
            src="/images/about.jpeg"
            alt="About Us"
            className="img-fluid"
            style={{ width: "100%" }}
          />
        </div>

        {/* Right Side: Text Content */}
        <div className="col-md-4">
          <p className="text-justify mt-2">
             Welcome to <strong>ShopEasy</strong>, your number one source for all things online shopping.
             We’re dedicated to providing you the very best products with a focus on <strong>quality</strong>, <strong>affordability</strong>, and <strong>excellent customer service</strong>.
          </p>

          <p className="text-justify mt-2">
            Our mission is simple – to make online shopping <strong>fast</strong>, <strong>easy</strong>, and <strong>enjoyable</strong> for everyone.
          </p>

          <p className="text-justify mt-2">
            With a wide range of products in <em>electronics, fashion, home essentials, and more</em>, we aim to serve all your shopping needs under one platform.
          </p>
        </div>

      </div>
    </Layout>
  );
};

export default About;
