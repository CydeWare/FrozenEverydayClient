import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import decode from "jwt-decode";
import useStyles from "./styles.js";
import Avatar from "@mui/material/Avatar";
// import { Link } from "react-router-dom";

const Navbar = () => {
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
  const classes = useStyles();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    dispatch({ type: "LOGOUT" });

    localStorage.clear();

    setUser(null);

    dispatch({ type: "DELETE_ALL_CART" });

    navigate("/");
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      //decodedToken.exp is in miliseconds so we have to mutiply by 1000
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logout();
      }
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  const avatar = useRef();
  const profileContainer = useRef();

  console.log("User from Navbar: ", user);

  // useEffect(() => {
  //     const token = user?.token

  //     if(token){
  //         const decodedToken = decode(token);

  //         //decodedToken.exp is in miliseconds so we have to mutiply by 1000
  //         if(decodedToken.exp * 1000 < new Date().getTime()) {
  //             logout();
  //         }
  //     }

  //     setUser(JSON.parse(localStorage.getItem("profile")))
  // }, [location]);

  // const avatar = useRef();

  // // useEffect(() => {

  // // //   avatar.current.on('click touchstart', function(){
  // // //     // profileContainer.current.styles.maxHeight = "200px";
  // // // });

  // // avatar.current.addEventListener('tap', () => {
  // //   alert('Mobile click / Tap');
  // //   console.log("Mobile clicked")
  // // });

  // // }, [])

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img
              src={images["frozen-everyday-logo-removebg-preview.png"]}
              width="60px"
              alt="logo"
            />
          </Link>
        </div>
        <nav>
          {/* <i className="fa fa-search search-icon" aria-hidden="true" />
          <input type="text" placeholder="Search" className="search-bar" /> */}
          <ul id="MenuItems" style={{ maxHeight: menuHeight }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Makanan</Link>
            </li>
          </ul>
        </nav>
        {!user && (
          <Link to="/account">
            {/* <i class="fa fa-user-circle account-icon" aria-hidden="true"></i> */}
            {/* <i class="fa-regular fa-user"></i> */}
            <img
              src={images["user-icon-removebg-preview.png"]}
              className="cart-logo account-icon-img"
              width="40px"
              height="40px"
            />
          </Link>
        )}

        <Link to="/cart">
          <img
            src={images["shopping-cart-icon-removebg-preview.png"]}
            className="cart-logo"
            width="30px"
            height="30px"
          />
        </Link>

        {user && (
          
            <div className="profile" onClick={() => navigate("/account-details")}>
              {/* <Link to="/account-details"> */}
              <Avatar
                className={classes.purple}
                alt={
                  user?.result?.FullName
                    ? user?.result?.FullName
                    : user.result.name
                }
                src={user?.result?.picture}
                onTouchStart={() => {
                  return showProfile();
                }}
              >
                {user?.result?.FullName
                  ? user?.result?.FullName.charAt(0)
                  : user?.result?.name?.charAt(0)}
              </Avatar>
              {/* </Link> */}
              <div className="profile-container" id="profile-container">
                {/* <Link to="/account-details"> */}
                <p style={{fontSize: "16px"}}>
                  {user.result.FullName
                    ? user.result.FullName.split(" ")[0].length > 6
                      ? `${user.result.FullName.split(" ")[0].substring(
                          0,
                          6
                        )}..`
                      : user.result.FullName.split(" ")[0]
                    : user.result.name}
                </p>
                {/* </Link> */}
                <span className="logout-btn" style={{zIndex: "8"}} onClick={(e) => {e.stopPropagation(); return logout();}}>
                  Logout
                </span>
              </div>
            </div>
          
        )}

        <img
          src={images["menu.png"]}
          className="menu-icon"
          alt="menu"
          onClick={menutoggle}
        />
      </div>
      {/* <script src="https://kit.fontawesome.com/e36d8da8c9.js" crossorigin="anonymous"></script> */}
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

  function showProfile() {
    let profile = document.getElementById("profile-container");

    if (profile.style.maxHeight === "200px") {
      profile.style.padding = "0";
      profile.style.border = "none";
      profile.style.maxHeight = "0px";
    } else {
      profile.style.padding = "10px 15px 10px 15px";
      profile.style.border = "2px solid #201f1f";
      profile.style.maxHeight = "200px";
    }
  }
};

export default Navbar;
