import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Link } from "react-router-dom";

const Footer = () => {
  const [menuHeight, setMenuHeight] = useState("0px");

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const images = importAll(
    require.context("../images", false, /\.(png|jpe?g|svg)$/)
  );

  const menutoggle = () => {
    setMenuHeight(menuHeight === "0px" ? "300px" : "0px");
  };

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  return (
    <div className="footer">
        <div className="container">
          <div className="row">
            
            <div className="footer-col-2">
            <img
              src={images["frozen-everyday-logo-removebg-preview.png"]}
              style={{width: "100px"}}
              alt="logo"
            />
              <p>
                Tujuan kami adalah menjualkan produk makanan frozen yang
                terbaik.
              </p>
            </div>
            {/* <div class="footer-col-3">
              <h3>Useful Link</h3>
              <ul>
                  <li>Coupons</li>
                  <li>Blog Post</li>
                  <li>Return Policy</li>
                  <li>Join Affiliate</li>
              </ul>
          </div> */}
            {/* <div class="footer-col-4">
              <h3>Follow Us</h3>
              <ul class="follow-us">
                  <li>Facebook<i class="fa fa-facebook-official" aria-hidden="true"></i></li>
                  <li>Twitter<i class="fa fa-twitter" aria-hidden="true"></i></li>
                  <li>Instagram<i class="fa fa-instagram" aria-hidden="true"></i></li>
                  <li>YouTube<i class="fa fa-youtube-play" aria-hidden="true"></i></li>
              </ul>
          </div> */}
          </div>
          <hr />
          <p className="copyright">Copyright 2025 - Frozen Everyday</p>
        </div>
      </div>
  );

  //   function menutoggle() {
  //     let MenuItems = document.getElementById("MenuItems");

  //     if (MenuItems.style.maxHeight === "300px") {
  //       MenuItems.style.maxHeight = "0px";
  //     } else {
  //       MenuItems.style.maxHeight = "300px";
  //     }
  //   }
};

export default Footer;
