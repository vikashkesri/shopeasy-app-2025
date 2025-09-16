import React from 'react';
import {Link} from "react-router-dom"

function Footer() {
  return (
    <div className="footer">
       <h1 className="text-center">All Righ Reserved ©copy:Vikasha2k</h1>
       <p className="text-center my-3">
        <Link to="/about">About</Link> |
        <Link to="/contact">Contact</Link> |
        <Link to="/policy">Privacy Policy</Link>
       </p>
    </div>

  )
}

export default Footer;