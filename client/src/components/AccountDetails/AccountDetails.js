import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProduct } from "../../actions/products.js";
// import no_product_img from "../images/no-product5.webp";
// import FileBase from "react-file-base64";
import Navbar from "../Navbar/Navbar.js";
import axios from "axios";
import Footer from "../Footer/Footer.js";

const AccountDetails = () => {
  const dispatch = useDispatch();

//   const params = useParams();
//   const id = params.id;

  

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  const [userData, setUserData] = useState({
    fullName: user?.result?.FullName,
    email: user?.result?.Email,
    phoneNumber: user?.result?.PhoneNumber,
    address: user?.result?.Address,
    city: user?.result?.City,
    postalCode: user?.result?.PostalCode,
    country: user?.result?.Country,
    role: user?.result?.Role,
  });

  const [videoFile, setVideoFile] = useState({});

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("profile"))

  //   const [isValidData, setIsValidData] = useState()

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

  // useEffect(() => {
  //     if(product) setProductData(product);

  // }, [product])

  //   async function handleSubmit(e) {
  //     e.preventDefault();

  //     console.log(productData);

  //     for (const key in productData) {
  //       if (productData.hasOwnProperty(key)) {
  //         if (key === "variants") {
  //           continue;
  //         } else if (key === "video"){
  //           continue;
  //         } else if (key === "videoPreview"){
  //           continue;
  //         } else if (key === "description"){
  //           continue;
  //         }

  //         else if (!productData[key] || productData[key].length === 0) {
  //           return setIsValidData({
  //             notValid: true,
  //             type: key === "selectedFile" ? "photo" : key,
  //           });
  //         } else {
  //           setIsValidData({ notValid: false, type: "already valid" });
  //         }
  //       }
  //     }

  //     try {

  //       const formData = new FormData();
  //       formData.append("video", productData.video);
  //       formData.append("product", JSON.stringify(productData));

  //       // console.log("Form Data: ", formData);

  //     //   for (let pair of formData.entries()) {
  //     //     console.log(pair[0], pair[1]); // This will show the file
  //     // }
  //       // const response = await axios.post("http://localhost:5000/products", {
  //       //   product: formData
  //       // })

  //       // const response = await axios.post("http://localhost:5000/products", formData, {
  //       //   headers: {
  //       //     "Content-Type": "multipart/form-data", // Needed for FormData
  //       //   },
  //       // });

  //       dispatch(createProduct(formData));
  //         // navigate("/products")
  //         // clear();

  //       // console.log("Response: ", response);
  //       // console.log("Data: ", response.data);

  //     } catch (err) {
  //       console.log("Error: ", err);
  //     }

  //   }

  //   const clear = () => {
  //     // setCurrentId(null);
  //     setProductData({
  //       video: {},
  //       videoPreview: "",
  //       selectedFile: [],
  //       title: "",
  //       price: 0,
  //       itemsSold: 0,
  //       rating: 0,
  //       variants: [],
  //       category: "",
  //       description: "",
  //     });
  //   };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Account Details in Frozen Everyday</title>
      <link rel="stylesheet" href="style.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
      />
      <Navbar />

      {/* sell details form */}

      {user ? (
        <div className="container">
          <form autoComplete="off" noValidate>
            <div className="small-container account-details-container">
              <h1>Account Details Anda</h1>
              <hr className="line" />
            </div>
            <div className="row-vertical">
              {/* <div className="upload-title-container">
              <h2 className="upload-title">Upload Your Photos &amp; Videos</h2>
              <p className="upload-desc">(You can upload more than one)</p>
            </div>
            <div className="row-3">
              <div className="main-photo-container">
                <div className="main-photo-storage">
                  

                  {
                    (productData.videoPreview !== "" && productData.video !== "") && (
                        
                        <div>
                            <p className="main-photo-title">Main Video</p>
                            <i
                            className="fa fa-trash-o"
                            aria-hidden="true"
                            onClick={() => {
                                setProductData({ ...productData, video: "" });
                                return setProductData({ ...productData, videoPreview: "" });
                            }}
                            ></i>
                            <video
                            className="main-photo"
                            src={productData.videoPreview}
                            alt=""
                            controls
                            />
                        </div>

                    )
                  }

                    

                  {productData.selectedFile.length !== 0 ? (
                    productData.selectedFile.map((base64, index) => {
                      return (
                        
                        <div key={index}>
                            {index === 0 && (<p className="main-photo-title">Main Photo</p>)}
                          <i
                            className="fa fa-trash-o"
                            aria-hidden="true"
                            onClick={() => {
                              return deletePhoto(index);
                            }}
                          ></i>
                          <img
                            className="main-photo"
                            key={index}
                            src={base64}
                            alt=""
                          />
                        </div>
                      );
                    })
                  ) : (
                    <img className="main-photo" src={images["no-product5.webp"]} alt="" />
                  )}
                  {/* <img className="main-photo" src={productData.selectedFile !== [] ? productData.selectedFile : images["product-2.jpg"]} alt="" /> 
                </div>
                {productData.selectedFile.length > 3 && (
                  <h1
                    className="warning-title"
                    style={{
                      width: "470px",
                      fontSize: "22px",
                      marginBottom: "5px",
                    }}
                  >
                    Maximum number of photos reached!
                  </h1>
                )}
              </div>
              <div className="col-6">
                <div className="icon-container">
                  <span className="input-file">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {handleFileChange(e);}}
                      ref={fileInputRef}
                    ></input>
                    <span className="icon-center">
                      <i className="fa fa-picture-o" aria-hidden="true" />
                      <h3 className="icon-title">
                        Upload your
                        <br /> photo
                      </h3>
                    </span>
                  </span>

                  <span className="input-file">
                    <input
                      type="file"
                 
                    ref={videoInputRef}
                    accept="video/*" 
                    onChange={(e) => {handleVideoChange(e);}}
                    ></input>
                    <span className="icon-center">
                      <i className="fa fa-video-camera" aria-hidden="true" />
                      <h3 className="icon-title">
                        Upload your
                        <br /> video
                      </h3>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <hr /> */}
              {/* <div className="col-6">
                  <h2 className="write-title">Write your Name</h2>
                  <p>Name of the Seller</p>
                  <input className="title-input" type="text" placeholder="Name" name="name" id="name" value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value})} />
                </div> */}
              <div className="col-6">
                <h2 className="write-title">Data Anda</h2>
                <p>Nama Lengkap</p>
                <input
                  className="title-input"
                  type="text"
                  placeholder="fullName"
                  name="fullName"
                  id="title"
                  value={userData.fullName}
                  readOnly
                  // onChange={(e) =>
                  //   setProductData({ ...productData, title: e.target.value })
                  // }
                />
              </div>
              <hr />
              <div className="col-6">
                {/* <h2 className="write-title">Email</h2> */}
                <p>Email</p>
                <input
                  className="title-input"
                  type="text"
                  placeholder="fullName"
                  name="fullName"
                  id="title"
                  value={userData.email}
                  readOnly
                  // onChange={(e) =>
                  //   setProductData({ ...productData, title: e.target.value })
                  // }
                />
              </div>
              <hr />
              <div className="col-6">
                {/* <h2 className="write-title">Phone Number</h2> */}
                <p>Nomor HP</p>
                <input
                  className="title-input"
                  type="text"
                  placeholder="fullName"
                  name="fullName"
                  id="title"
                  value={userData.phoneNumber}
                  readOnly
                  // onChange={(e) =>
                  //   setProductData({ ...productData, title: e.target.value })
                  // }
                />
              </div>
              <hr />
              <div className="col-6">
                {/* <h2 className="write-title">Phone Number</h2> */}
                <p>Country</p>
                <input
                  className="title-input"
                  type="text"
                  placeholder="fullName"
                  name="fullName"
                  id="title"
                  value={userData.country}
                  readOnly
                  // onChange={(e) =>
                  //   setProductData({ ...productData, title: e.target.value })
                  // }
                />
              </div>
              <hr />
              <div className="col-6">
                {/* <h2 className="write-title">Phone Number</h2> */}
                <p>Kota</p>
                <input
                  className="title-input"
                  type="text"
                  placeholder="fullName"
                  name="fullName"
                  id="title"
                  value={userData.city}
                  readOnly
                  // onChange={(e) =>
                  //   setProductData({ ...productData, title: e.target.value })
                  // }
                />
              </div>
              <hr />
              <div className="col-6">
                {/* <h2 className="write-title">Phone Number</h2> */}
                <p>Alamat</p>
                <input
                  className="title-input"
                  type="text"
                  placeholder="fullName"
                  name="fullName"
                  id="title"
                  value={userData.address}
                  readOnly
                  // onChange={(e) =>
                  //   setProductData({ ...productData, title: e.target.value })
                  // }
                />
              </div>
              <hr />
              <div className="col-6">
                {/* <h2 className="write-title">Phone Number</h2> */}
                <p>Postal Code</p>
                <input
                  className="title-input"
                  type="text"
                  placeholder="fullName"
                  name="fullName"
                  id="title"
                  value={userData.postalCode}
                  readOnly
                  // onChange={(e) =>
                  //   setProductData({ ...productData, title: e.target.value })
                  // }
                />
              </div>
              {/* <hr /> */}
            </div>
          </form>
        </div>
      ) : (
        <div
          style={{
            marginTop: "100px",
            marginBottom: "150px",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>Kamu belum Sign In</h1>
          <Link to="/account">
            <span className="btn">Sign In</span>
          </Link>
        </div>
      )}

      {/*-- Footer ---*/}
      <Footer />
      {/* JS for toggle menu */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.min.js"></script>
    </div>
  );

  function menutoggle() {
    let MenuItems = document.getElementById("MenuItems");

    if (MenuItems.style.maxHeight === "300px") {
      MenuItems.style.maxHeight = "0px";
    } else {
      MenuItems.style.maxHeight = "300px";
    }
  }
};

export default AccountDetails;
