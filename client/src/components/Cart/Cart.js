import React, { Component, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems, getCartItemsByUserID } from "../../actions/cart.js";
import CartItem from "./CartItem/CartItem.js";
import * as api from "../../API/index.js";
// import { CircularProgress } from '@material-ui/core'
// import Navbar from '../Navbar/Navbar.js';
// import Checkout from "../Checkout/Checkout.js";

const Cart = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [emailMsg, setEmailMsg] = useState("");
  const [cart, setCart] = useState([]);

  let cartItems = useSelector((state) => {
    return state.cart;
  });

  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (user) {
      dispatch(
        getCartItemsByUserID(
          user?.result?.UserID ? user?.result?.UserID : user?.result?.sub
        )
      );

      setCart(cartItems);
    } else {
      // setCart(undefined);
      cartItems = undefined;
    }

    console.log("Cart Items: ", cartItems);
  }, [user]);

  useEffect(() => {
    setCart(cartItems);
  }, [cartItems]);

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const images = importAll(
    require.context("../images", false, /\.(png|jpe?g|svg|avif|webp)$/)
  );

  // For adding the subtotal
  let total = 0;

  function cleanForWhatsAppAndEmail(str) {
    // Replace & with "and"
    let cleaned = str.replace(/&/g, 'and');
  
    // Remove unwanted special characters but keep %0A, :, !, ?, and other WhatsApp/email-friendly characters
    cleaned = cleaned.replace(/[^a-zA-Z0-9 @._#%\-:!?]/g, '');
  
    return cleaned;
  }
  

  // useEffect(() => {
  //   cart?.map((cartItem) => {
  //     total =
  //       total +
  //       parseFloat(
  //         parseFloat(cartItem?.Price) * parseFloat(cartItem?.Quantity)
  //       );
  //     // parseFloat(cartItem?.Price);
  //   });

  //   console.log("Total: ", total);

  //   setSubtotal(parseFloat(total));
  // }, [cart]);

  useEffect(() => {
  let total = 0;
  cart?.forEach(cartItem => {
    total += parseFloat(cartItem?.Price) * parseFloat(cartItem?.Quantity);
  });
  setSubtotal(total);
}, [cart]);

  const generateWhatsAppMessage = (cartItems, totalPrice) => {
    const phoneNumber = "6289507932832"; // Replace with merchant's WhatsApp number (use international format)

    let message = `Halo, saya mau pesan produk-produk berikut:%0A%0A`; // WhatsApp uses %0A for
    // line breaks

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.Title} ${item.Variant ? `(${item.Variant})` : ""} - ${
        item.Quantity
      } pcs - Rp. ${formatRupiah(item.Price * item.Quantity)}%0A`;
    });

    message += `%0A*Total Harga: Rp. ${formatRupiah(
      totalPrice
    )}*%0A%0ASaya dari negara ${
      user?.result?.Country
    } dan minta produk-produk ini dikirim ke kota ${
      user?.result?.City
    } dengan alamat ${user?.result?.Address} dan postal code ${
      user?.result?.PostalCode
    }.%0A%0ATerima Kasih!`;

    

    message = cleanForWhatsAppAndEmail(message);

    console.log(message);

    // Generate the WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Redirect to WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  function formatRupiah(price) {
    // Convert to fixed 3 decimal places
    let formattedPrice = parseFloat(price).toFixed(3);

    // Replace thousand separator (, → .)
    return formattedPrice;
  }

  const sendOrder = async (cartItems, totalPrice) => {
    // const orderData = {
    //     userEmail: "customer@gmail.com",
    //     merchantEmail: "merchant@gmail.com",
    //     products: [
    //         { name: "Frozen Chicken", quantity: 2, price: 50000 },
    //         { name: "Frozen Fish", quantity: 1, price: 75000 },
    //     ],
    //     totalPrice: 125000,
    // };

    try {
      setEmailMsg("Mohon tunggu, sedang mengirim email...");

      // const response = await fetch("http://localhost:5000/order/", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({cartItems: cartItems, user: user?.result, totalPrice: totalPrice}),
      // });

      const response = await api.order({
        cartItems: cartItems,
        user: user?.result,
        totalPrice: totalPrice,
      });

      console.log(response);

      const data = await response.data;
      console.log(data.message);
      alert(data.message);
      setEmailMsg(data.message);
    } catch (error) {
      alert("Ada masalah ketika mengirimkan email. Mohon coba lagi.");
      setEmailMsg("Ada masalah ketika mengirimkan email. Mohon coba lagi.");
      console.error("Error sending order:", error);
    }
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Frozen Everyday</title>
      <link rel="stylesheet" href="styles.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
      />
      <section className="modal">
        {/* <button className="show-modal" onClick={() => showButton()}>Show Modal</button> */}
        <span className="overlay" onClick={() => overlayFunc()}></span>
        <div className="modal-box">
          <i
            className="fa fa-window-close-o close-icon"
            aria-hidden="true"
            onClick={() => closeBtnFunc()}
          ></i>
          <i className="fa fa-whatsapp whatsapp" aria-hidden="true"></i>
          <h2>Terkirim</h2>
          <h3>
            Anda akan diarahkan ke akun WhatsApp penjual. Silahkan kirimkan
            pesan WhatsApp ke penjual.
          </h3>
          <div className="buttons">
            <button className="close-btn" onClick={() => closeBtnFunc()}>
              Tutup
            </button>
            <button
              onClick={() => generateWhatsAppMessage(cartItems, subtotal)}
            >
              Kirim ulang
            </button>
          </div>
          <h3 style={{ marginTop: "10px" }}>Atau kirim lewat cara lain:</h3>
          {/* <i className="fa fa-envelope email-icon" aria-hidden="true"></i> */}
          <img
            style={{ width: "100px", marginTop: "10px", marginBottom: "10px" }}
            src={images["gmail-logo-2.png"]}
            alt="email"
          />
          <h4>Email</h4>

          <div className="buttons">
            <button onClick={() => sendOrder(cartItems, subtotal)}>
              Kirim lewat Email
            </button>
          </div>
          {emailMsg.length > 0 && (
            <h4
              style={{
                marginTop: "10px",
                fontWeight: "500",
                color: "#000",
                textAlign: "center",
              }}
            >
              {emailMsg}
            </h4>
          )}
        </div>
      </section>
      <Navbar />

      <div className="small-container contact-container">
        <h1>Cart</h1>
        <hr className="line" />
      </div>
      {/* ------ cart items details -------- */}

      <div className="small-container cart-page">
        <table>
          <tbody>
            <tr>
              <th>Makanan</th>
              <th>Kuantitas</th>
              <th>Subtotal</th>
            </tr>
            {/* <tr>
              <td>
                <div className="cart-info">
                  <img src={images["chicken-nugget.webp"]} alt="" />
                  <div>
                    <p>Kanzler Crispy Chicken Nugget 450gr</p>
                    <small>Harga: Rp. 41.500</small>
                    <br />
                    <a href="">Hapus</a>
                  </div>
                </div>
              </td>
              <td>
                <input type="number" defaultValue={1} />
              </td>
              <td>Rp. 41.500</td>
            </tr>
            <tr>
              <td>
                <div className="cart-info">
                  <img src={images["sosis-ayam.webp"]} alt="" />
                  <div>
                    <p>CHAMP SOSIS AYAM 375gr (Chicken Sausages)</p>
                    <small>Harga: Rp. 20.000</small>
                    <br />
                    <a href="">Hapus</a>
                  </div>
                </div>
              </td>
              <td>
                <input type="number" defaultValue={1} />
              </td>
              <td>Rp. 20.000</td>
            </tr> */}

            {user?.result ? (
              cart ? (
                cart.length === 0 ? (
  <tr>
    <td colSpan="3" style={{ textAlign: "center", padding: "40px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1>Tidak ada produk di dalam keranjang.</h1>
        <Link to="/products">
          <span className="btn">Beli makanan</span>
        </Link>
      </div>
    </td>
  </tr>
) : (
  cart.map((cartItem) => (
    <CartItem
      key={cartItem.id}
      cartItem={{
        ...cartItem,
        CartItemID: cartItem.CartItemID,
      }}
    />
  ))
)) : (
                // <div
                //   style={{
                //     marginTop: "50px",
                //     marginBottom: "70px",
                //     display: "flex",
                //     flexDirection: "column",
                //   }}
                // >
                //   <h1>No products are added to your cart</h1>
                //   <Link to="/products">
                //     <span className="btn">Buy Something</span>
                //   </Link>
                // </div>
                <div className="loader"></div>
              )
            ) : (
              <div
                className="sign-in-warning-container"
                style={{
                  marginTop: "50px",
                  marginBottom: "70px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p className="sign-in-warning" style={{ fontSize: "24px" }}>
                  Mohon Sign In untuk Menambahkan Produk Ke Keranjang!
                </p>
                <Link to="/account">
                  <span
                    style={{ fontSize: "20px", padding: "10px 20px 10px 20px" }}
                    className="btn"
                  >
                    Sign In
                  </span>
                </Link>
              </div>
            )}
          </tbody>
        </table>
        <div className="total-price">
          <table>
            {/* <tr>
              <td>Subtotal</td>
              <td>Rp. </td>
          </tr>
          <tr>
              <td>Tax</td>
              <td>$35.00</td>
          </tr> */}
            <tbody>
              <tr>
                <td>Total</td>
                <td>
                  Rp. {subtotal === 0 ? subtotal : formatRupiah(subtotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="check-out-container">
          {/* <span className="paypal-logo-button">
        <img
          className="paypal-logo"
          src={images["paypal-logo-removebg-preview.png"]}
        />
      </span> */}
          {user && cart?.length > 0 && (
            <span
              className="btn"
              // onClick={() => generateWhatsAppMessage(cart, subtotal)}
              onClick={() => {
                showButton();
                return generateWhatsAppMessage(cart, subtotal);
              }}
            >
              Check Out
            </span>
          )}
        </div>
      </div>
      {/* - Footer  */}
      <div className="footer">
        <div className="container">
          <div className="row">
            {/* <div className="footer-col-1">
                <h3>Download Our App</h3>
                <p>Download App for Android and ios mobile phone.</p>
                <div className="app-logo">
                    <img src={images["play-store.png"]} alt="">
                    <img src={images["app-store.png"]} alt="">
                </div>
            </div> */}
            <div className="footer-col-2">
              <img src={images["logo-white.png"]} alt="" />
              <p>
                Tujuan kami adalah menjualkan produk makanan frozen yang
                terbaik.
              </p>
            </div>
            {/* <div className="footer-col-3">
                <h3>Useful Link</h3>
                <ul>
                    <li>Coupons</li>
                    <li>Blog Post</li>
                    <li>Return Policy</li>
                    <li>Join Affiliate</li>
                </ul>
            </div> */}
            {/* <div className="footer-col-4">
                <h3>Follow Us</h3>
                <ul className="follow-us">
                    <li>Facebook<i className="fa fa-facebook-official" aria-hidden="true"></i></li>
                    <li>Twitter<i className="fa fa-twitter" aria-hidden="true"></i></li>
                    <li>Instagram<i className="fa fa-instagram" aria-hidden="true"></i></li>
                    <li>YouTube<i className="fa fa-youtube-play" aria-hidden="true"></i></li>
                </ul>
            </div> */}
          </div>
          <hr />
          <p className="copyright">Copyright 2025 - Frozen Everyday</p>
        </div>
      </div>
    </>
  );

  //   function checkout(){
  //     let updateForm = document.getElementById("checkout-form");
  //     let containerForm = document.getElementById("checkout-form-storage");

  //     if(containerForm.style.visibility === "visible"){
  //       updateForm.style.visibility = "hidden";
  //       updateForm.style.opacity = "0";
  //       containerForm.style.visibility = "hidden";
  //       containerForm.style.opacity = "0";
  //     } else {
  //       updateForm.style.visibility = "visible";
  //       updateForm.style.opacity = "1";
  //       containerForm.style.visibility = "visible";
  //       containerForm.style.opacity = "1";
  //     }
  //   }

  //   function closeCheckout(){
  //     let updateForm = document.getElementById("checkout-form");
  //     let containerForm = document.getElementById("checkout-form-storage");

  //     dispatch(getCartItems()); //To refresh the product data if closed

  //     updateForm.style.visibility = "hidden";
  //     updateForm.style.opacity = "0";
  //     containerForm.style.visibility = "hidden";
  //     containerForm.style.opacity = "0";
  //   }

  const section = document.querySelector("section"),
    overlay = document.querySelector(".overlay"),
    showBtn = document.querySelector(".show-modal"),
    closeBtn = document.querySelector(".close-btn");
  showBtn.addEventListener("click", () => section.classList.add("active"));
  overlay.addEventListener("click", () => section.classList.remove("active"));
  closeBtn.addEventListener("click", () => section.classList.remove("active"));

  function showButton() {
    const section = document.querySelector("section"),
      overlay = document.querySelector(".overlay"),
      showBtn = document.querySelector(".show-modal"),
      closeBtn = document.querySelector(".close-btn");

    setEmailMsg("");
    section.classList.add("active");
    section.style.zIndex = "8";
  }

  function overlayFunc() {
    const section = document.querySelector("section"),
      overlay = document.querySelector(".overlay"),
      showBtn = document.querySelector(".show-modal"),
      closeBtn = document.querySelector(".close-btn");

    setEmailMsg("");
    section.classList.remove("active");
    section.style.zIndex = "-8";
  }

  function closeBtnFunc() {
    const section = document.querySelector("section"),
      overlay = document.querySelector(".overlay"),
      showBtn = document.querySelector(".show-modal"),
      closeBtn = document.querySelector(".close-btn");

    setEmailMsg("");
    section.classList.remove("active");
    section.style.zIndex = "-8";
  }
};

export default Cart;
