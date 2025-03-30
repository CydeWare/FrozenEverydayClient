import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "../../actions/products.js"
// import no_product_img from "../images/no-product5.webp";
// import FileBase from "react-file-base64";
import Navbar from "../Navbar/Navbar.js";
import axios from "axios";
import Footer from "../Footer/Footer.js";

const Sell = () => {
  const dispatch = useDispatch();

  const [productData, setProductData] = useState({
    video: null,
    videoPreview: "",
    selectedFile: [],
    title: "",
    price: 0,
    itemsSold: 0,
    rating: 0,
    variants: [],
    variantsPrice: [],
    variants2: [],
    variants2Price: [],
    category: "",
    description: "",
  });

  const [isValidData, setIsValidData] = useState({
    notValid: false,
    type: "selectedFile",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const [videoFile, setVideoFile] = useState({});

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("profile"))

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
    if (file.type.startsWith("image/")){
        const reader = new FileReader();
      
      // This event is triggered when the file has been read
      reader.onloadend = () => {
        // Set the Base64 string into the state
            let newSelectedFile =
                          productData.selectedFile.concat(reader.result);
                        if (newSelectedFile.length < 8) {
                          return setProductData({
                            ...productData,
                            selectedFile: newSelectedFile,
                          });}
      };
      
      fileInputRef.current.value = "";
      // Start reading the file as a Base64 string
      reader.readAsDataURL(file);
    } else {
        alert("Please select a photo file!");
    }
      
      
    }
  };

  const handleVideoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.type.startsWith("video/")) {
            videoInputRef.current.value = "";
          //   const formData = new FormData();
          //   formData.append("video", file);
          //   const respon = await fetch("http://localhost:5000/products", {
          //     method: "POST",
          //     body: formData,
          // });

            setVideoFile(file);
            
            // setProductData({ ...productData,video: file });
            setProductData({ ...productData,videoPreview: URL.createObjectURL(file), video: file  });
            
            console.log("Video: ", file);
            console.log("Video Preview: ", URL.createObjectURL(file));

        } else {
            alert("Please select a video file!");
        }
        
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(productData);

    for (const key in productData) {
      if (productData.hasOwnProperty(key)) {
        if (key === "variants") {
          continue;
        } else if (key === "video"){
          continue;
        } else if (key === "videoPreview"){
          continue;
        } else if (key === "description"){
          continue;
        } else if (key === "variantsPrice") {
          continue;
        } else if (key === "variants2") {
          continue;
        } else if (key === "variants2Price") {
          continue;
        }
        
        else if (!productData[key] || productData[key].length === 0) {
          return setIsValidData({
            notValid: true,
            type: key === "selectedFile" ? "photo" : key,
          });
        } else {
          setIsValidData({ notValid: false, type: "already valid" });
        }
      }
    }

    setProductData({...productData, variantsPrice: productData.variantsPrice.map(parseFloat)})

    try {

      const formData = new FormData();
      formData.append("video", productData.video);
      formData.append("product", JSON.stringify(productData));

      // console.log("Form Data: ", formData);

    //   for (let pair of formData.entries()) {
    //     console.log(pair[0], pair[1]); // This will show the file
    // }
      // const response = await axios.post("http://localhost:5000/products", {
      //   product: formData
      // })

      // const response = await axios.post("http://localhost:5000/products", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data", // Needed for FormData
      //   },
      // });

      dispatch(createProduct(formData));
        // navigate("/products")
        // clear();
  
      // console.log("Response: ", response);
      // console.log("Data: ", response.data);
      // clear();
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Something went wrong, please try again!");
      console.log("Error: ", err);
    }
    
  }

  const clear = () => {
    // setCurrentId(null);
    setProductData({
      video: {},
      videoPreview: "",
      selectedFile: [],
      title: "",
      price: 0,
      itemsSold: 0,
      rating: 0,
      variants: [],
      variantsPrice: [],
      variants2: [],
      variants2Price: [],
      category: "",
      description: "",
    });
  };

  const deletePhoto = useCallback(
    (index) => {
      const fileIndex = productData.selectedFile[index];

      let newSelectedFile = productData.selectedFile.filter((file) => {
        return file !== fileIndex;
      });
      
      setProductData({ ...productData, selectedFile: newSelectedFile });
    },
    [productData.selectedFile]
  );

  function doNothing(e){
    e.preventDefault();
    return;
  }

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Selling in Frozen Everyday</title>
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

      <div className="container">
        <form autoComplete="off" noValidate onSubmit={(e) => doNothing(e)}>
          <div className="small-container sell-container">
            <h1>Tell Us About Your Product</h1>
            <hr className="line" />
          </div>
          <div className="row-vertical">
            <div className="upload-title-container">
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
                  {/* <img className="main-photo" src={productData.selectedFile !== [] ? productData.selectedFile : images["product-2.jpg"]} alt="" /> */}
                </div>
                {productData.selectedFile.length > 8 && (
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
                    //   mutiple={false}
                    //   onDone={({ base64 }) => {
                    //     let newSelectedFile =
                    //       productData.selectedFile.concat(base64);
                    //     if (newSelectedFile.length < 5) {
                    //       return setProductData({
                    //         ...productData,
                    //         selectedFile: newSelectedFile,
                    //       });
                    //     }
                    //   }}
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
            <hr />
            {/* <div className="col-6">
                  <h2 className="write-title">Write your Name</h2>
                  <p>Name of the Seller</p>
                  <input className="title-input" type="text" placeholder="Name" name="name" id="name" value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value})} />
                </div> */}
            <div className="col-6">
              <h2 className="write-title">Write the Title of the product</h2>
              <p>Title of the product</p>
              <input
                className="title-input"
                type="text"
                placeholder="Title"
                name="title"
                id="title"
                value={productData.title}
                onChange={(e) =>
                  setProductData({ ...productData, title: e.target.value })
                }
              />
            </div>
            <hr />
            <div className="col-6">
              <h2 className="write-title">Describe your product (Optional)</h2>
              <p>Description</p>
              <textarea
                className="description-input"
                type="text"
                placeholder="Description"
                name="title"
                id="title"
                value={productData.description}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <hr />
            {/* <div className="col-6">
              <h2 className="write-title">Write your Address (Optional)</h2>
              <p>Address (Optional)</p>
              <input
                className="title-input"
                type="text"
                placeholder="Address"
                name="title"
                id="title"
                value={productData.address}
                onChange={(e) =>
                  setProductData({ ...productData, address: e.target.value })
                }
              />
            </div>
            <hr /> */}
            <div className="col-6">
              <h2 className="write-title">Choose your price</h2>
              <h2 className="price-title">Price</h2>
              <input
                className="price-input"
                type="number"
                placeholder="Price"
                name="title"
                id="title"
                min="0"
                onWheel={(e) => e.target.blur()}
                value={productData.price}
                onChange={(e) =>
                  setProductData({ ...productData, price: e.target.value })
                }
              />
              {/* <select
                value={productData.currency}
                onChange={(e) =>
                  setProductData({ ...productData, currency: e.target.value })
                }
              >
                <option>Select Currency</option>
                <option>USD $</option>
                <option>Euro €</option>
                <option>Pound £</option>
                <option>Rupee</option>
                <option>Rupiah</option>
                <option>Peso</option>
              </select> */}
              <div className="col-6">
                <h2 className="quantity-title">
                  Number of Items that are Sold
                </h2>
                <input
                  className="quantity-input"
                  type="number"
                  placeholder="Number of Items Sold"
                  name="itemsSold"
                  id="itemsSold"
                  onWheel={(e) => e.target.blur()}
                  // min="0"
                  value={productData.itemsSold}
                  onChange={(e) =>
                    setProductData({ ...productData, itemsSold: e.target.value })
                  }
                />
              </div>
            </div>
            <hr />
            <div className="col-6">
                <h2 className="quantity-title">
                  Enter the rating
                </h2>
                <input
                  className="quantity-input"
                  type="number"
                  placeholder="Rating"
                  name="rating"
                  id="rating"
                  min="0"
                  onWheel={(e) => e.target.blur()}
                  value={productData.rating}
                  onChange={(e) =>
                    setProductData({ ...productData, rating: e.target.value })
                  }
                />
            </div>
            <hr />
            <div className="col-6">
              <h2 className="write-title">Add Variants (if there is, optional, SPLIT WITH COMMA (,))</h2>
              <p>Variants</p>
              <input
                className="title-input"
                type="text"
                placeholder="Variants"
                name="variants"
                id="variants"
                value={productData.variants}
                onChange={(e) =>
                  setProductData({ ...productData, variants: e.target.value.split(",") })
                }
              />
            </div>
            <hr />
            <div className="col-6">
              <h2 className="write-title">Add Variants Price (if there is, optional, SPLIT WITH COMMA (,))</h2>
              <p>Variants Price</p>
              <input
                className="title-input"
                type="text"
                placeholder="Variants Price"
                name="variantsPrice"
                id="variantsPrice"
                value={productData.variantsPrice}
                onChange={(e) =>
                  setProductData({ ...productData, variantsPrice: e.target.value.split(",") })
                }
              />
            </div>
            <hr />
            <div className="col-6">
              <h2 className="write-title">Add Variants 2 (if there is, optional, SPLIT WITH COMMA (,))</h2>
              <p>Variants 2</p>
              <input
                className="title-input"
                type="text"
                placeholder="Variants 2"
                name="variants2"
                id="variants2"
                value={productData.variants2}
                onChange={(e) =>
                  setProductData({ ...productData, variants2: e.target.value.split(",") })
                }
              />
            </div>
            <hr />
            <div className="col-6">
              <h2 className="write-title">Add Variants 2 Price (if there is, optional, SPLIT WITH COMMA (,))</h2>
              <p>Variants 2 Price</p>
              <input
                className="title-input"
                type="text"
                placeholder="Variants 2 Price"
                name="variants2Price"
                id="variants2Price"
                value={productData.variants2Price}
                onChange={(e) =>
                  setProductData({ ...productData, variants2Price: e.target.value.split(",") })
                }
              />
            </div>
            <hr />
            
            

            <div className="col-6">
              <h2 className="write-title">Choose the category</h2>
              <select
                value={productData.category}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    category: e.target.value,
                  })
                }
              >
                <option>Select Category</option>
                <option>Semua Produk</option>
                <option>Cedea</option>
                <option>Paket Hemat</option>
                <option>Kanzler</option>
                <option>Cimory</option>
                <option>Buah Frozen</option>
                <option>Ikan Frozen</option>
                <option>Coklat</option>
              </select>
              {/* <div className="col-6">
                <h2 className="quantity-title">Package Weight</h2>
                <div className="shipping-container">
                  <input
                    className="quantity-input"
                    type="number"
                    placeholder="Weight"
                    name="title"
                    id="title"
                    value={productData.weight}
                    onChange={(e) =>
                      setProductData({ ...productData, weight: e.target.value })
                    }
                  />
                  <p>lbs.</p>
                </div>
              </div> */}
            </div>
            <div className="button-container">
              {isValidData.notValid === true && (
                <p className="warning-title">
                  {isValidData.type === "photo"
                    ? "Please insert the photo"
                    : isValidData.type === "currency"
                    ? "Please select the currency"
                    : isValidData.type === "shipping_method"
                    ? "Please select the shipping method"
                    : "Please type the " + isValidData.type}
                </p>
              )}
              {errorMsg.length > 0 && (
                <p className="warning-title">
                  {errorMsg}
                </p>
              )}
              <button className="sell-btn" type="submit">
                Submit Product
              </button>
              <button
                className="clear-btn"
                onClick={() => clear()}
                type="button"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

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

export default Sell;
