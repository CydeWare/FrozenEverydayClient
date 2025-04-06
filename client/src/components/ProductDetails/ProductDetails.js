import React, { Component, useEffect, useState, useRef } from "react";
import {
  Link,
  useSearchParams,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../actions/products.js";
import {
  getFilesByProductID,
  getAllFiles,
  deleteAllFiles,
} from "../../actions/files.js";
import { getAllVariantsByProductID, deleteAllVariants } from "../../actions/variants.js";
// import { CircularProgress } from "@material-ui/core";
import Navbar from "../Navbar/Navbar";
import { createCartItem, getCartItems } from "../../actions/cart.js";
import * as api from "../../API/index.js";
import Footer from "../Footer/Footer.js";
import VideoThumbnail from "../VideoThumbnail/VideoThumbnail.js";
// import Form from "../Form/Form.js";
// import Navbar from "../Navbar/Navbar.js";

const ProductDetails = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [selectedVariant, setSelectedVariant] = useState("");
  const [product, setProduct] = useState({});
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [variantPrice, setVariantPrice] = useState(0);
  const [variants, setVariants] = useState([]);

  // const [numberRating, setNumberRating] = useState(0);

  const location = useLocation();

  const products = useSelector((state) => {
    return state.products.products;
  });

  const productFiles = useSelector((state) => {
    return state.files;
  });

  const variantsState = useSelector((state) => {
    return state.variants;
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const params = useParams();
  const id = params.id;

  // useEffect(() => {
  //   dispatch(deleteAllFiles());
  // }, [])

  useEffect(() => {
    console.log("PARAMS ID: ", id);

    setVariants([]);

    dispatch({ type: "DELETE_ALL_VARIANTS" });
    // dispatch({ type: "DELETE_ALL_FILES" });
    
    const fetchFiles = () => {
      // dispatch(deleteAllFiles());
      dispatch(getAllFiles()); // Ensures delete finishes before fetching new files
      setLoadingFiles(false);
    };

    const fetchVariants = () => {
      setVariants([]);
      dispatch(deleteAllVariants());
      dispatch(getAllVariantsByProductID(id));
    }
    
    setSelectedVariant("");
    // dispatch();
    dispatch(getProducts());
    // dispatch(getAllVariantsByProductID(id));
    
    fetchFiles();
    fetchVariants();
  }, [dispatch, id, location]);

  useEffect(() => {
    dispatch(deleteAllVariants());
  }, [id])

  useEffect(() => {
    const productToFind =
      products.length > 0
        ? products.find((product) => {
            return product.ProductID === id;
          })
        : null;

    setProduct(productToFind);
  }, [products]);

  useEffect(() => {
    if (!loadingFiles) {
      const filesFiltered = productFiles.filter(
        (file) => file.ProductID === id
      );
      setFiles(filesFiltered);
    }
  }, [productFiles, loadingFiles]);

  useEffect(() => {
    if(variantsState?.length > 0){
      setVariants(variantsState);
    }
  }, [variantsState])

  useEffect(() => {
    if(variants.length > 0){
      const variantToFind = variants?.find((variant) => {
        return variant?.VariantName === selectedVariant;
      })

      console.log("VARIANT FOUND: ", variantToFind);
      console.log("Variant price: ", parseFloat(variantToFind?.AdditionalPrice));
      console.log("Product price: ", product?.Price);
      console.log("Type of variant price: ", typeof variantToFind?.AdditionalPrice);
      console.log("Type of product price: ", typeof product?.Price);

      if(variantToFind){
        setVariantPrice(variantToFind?.AdditionalPrice ? parseFloat(variantToFind?.AdditionalPrice) : 0)
      }
    }

  }, [selectedVariant]);

  useEffect(() => {
    if(variants.length > 0){
      setSelectedVariant(variants[0].VariantName ? variants[0].VariantName : "");
    } else {
      // setVariants([]);
      setSelectedVariant("");
    }
  }, [variants])

  // setNumberRating(roundToHalf(product?.Rating));

  console.log("ID: ", id);
  console.log("Product: ", product);

  // console.log("Files after fetching:", files);
  // console.log("Variants after fetching: ", variants);

  const [quantity, setQuantity] = useState(1);
  const [emailMsg, setEmailMsg] = useState("");

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const images = importAll(
    require.context("../images", false, /\.(png|jpe?g|svg|webp|avif)$/)
  );

  if (!product) {
    console.log("NO SUCH PRODUCTS WITH ID: " + id);
  }

  function handleCart(e) {
    e.preventDefault();

    console.log("Total price: ", (parseFloat(product?.Price) + variantPrice));

    const cartItem = {
      ProductID: product.ProductID,
      UserID: user?.result?.UserID ? user?.result?.UserID : user?.result?.sub,
      SelectedFile: files,
      Title: product.Title,
      Price: (parseFloat(product?.Price) + variantPrice),
      Quantity: quantity,
      Subtotal: ((parseFloat(product?.Price) + variantPrice) * quantity),
      Variant: selectedVariant,
    };
    
    setSelectedVariant("");
    dispatch({ type: "DELETE_ALL_VARIANTS" });

    dispatch(
      createCartItem(
        { ...cartItem },
        user?.result?.UserID ? user?.result?.UserID : user?.result?.sub
      )
    );
    // dispatch(getCartItems());
    navigate("/cart");
  }

  // function handleDelete() {
  //   dispatch(deleteProduct(id));
  //   navigate("/products");
  // }

  const functions = { smallImg0, smallImg1, smallImg2, smallImg3 };

  const doFunction = (num) => {
    const func = functions[`smallImg${num}`];
    return func ? func() : <p>Image not found</p>;
  };

  const changeVideoToImage = (i) => {
    setImageIndex(i);
    if (isVideoPlaying === true) {
      setIsVideoPlaying(false);
      setTimeout(() => doFunction(i), 150);
    } else {
      doFunction(i);
    }
  };

  //  const playVideo = () => {
  //     // setI sVideoPlaying(!isVideoPlaying);
  //   };

  function roundToHalf(num) {
    return Math.round(num * 2) / 2;
  }

  function sanitizeForURL(str) {
    return str.replace(/[^a-zA-Z0-9-_\. ]/g, '');
  }

  function cleanForWhatsAppAndEmail(str) {
    // Replace & with "and"
    let cleaned = str.replace(/&/g, 'and');
  
    // Remove unwanted special characters but keep %0A, :, !, ?, and other WhatsApp/email-friendly characters
    cleaned = cleaned.replace(/[^a-zA-Z0-9 @._#%\-:!?]/g, '');
  
    return cleaned;
  }
  

  const generateWhatsAppMessage = (totalPrice) => {
    const phoneNumber = "6289507932832"; // Replace with merchant's WhatsApp number (use international format)

    let message = `Halo, saya mau pesan produk:%0A%0A- ${product?.Title} ${
    selectedVariant ? `(${selectedVariant})` : ""}- ${quantity} pcs - Rp. ${formatRupiah(totalPrice)}%0A%0A`; // WhatsApp uses %0A for
    // line breaks

    message += `*Total Harga: Rp. ${formatRupiah(
      totalPrice
    )}*%0A%0ASaya dari negara ${
      user?.result?.Country
    } dan minta produk ini dikirim ke kota ${
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

  const sendOrder = async (totalPrice) => {
    try {
      setEmailMsg("Mohon tunggu, sedang mengirim email...");

      // const response = await fetch("http://localhost:5000/order/", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({cartItems: cartItems, user: user?.result, totalPrice: totalPrice}),
      // });
      const productItemsArr = [
        { ...product, Price: (parseFloat(product?.Price) + variantPrice), Quantity: quantity, Variant: selectedVariant },
      ];

      console.log("Product Items Array: ", productItemsArr);

      const response = await api.order({
        cartItems: productItemsArr,
        user: user?.result,
        totalPrice: totalPrice,
      });

      console.log(response);

      const data = response.data;
      console.log(data.message);
      alert(data.message);
      setEmailMsg(data.message);
    } catch (error) {
      alert("Ada masalah ketika mengirimkan email. Mohon coba lagi.");
      setEmailMsg("Ada masalah ketika mengirimkan email. Mohon coba lagi.");
      console.error("Error sending order:", error);
    }
  };

  const handleVariantChange = (event) => {
    setSelectedVariant(event.target.value);
    // console.log("Selected:", event.target.value);
  };

  function formatRupiah(price) {
    // Convert to fixed 3 decimal places
    let formattedPrice = parseFloat(price).toFixed(3);

    // Replace thousand separator (, → .)
    return formattedPrice;
  }

  function calculateMaxHeight(length, width){
    	if(length < 4){
        return "117px";
      }
      
      let maxHeightString;
      let maxHeight = width - (19 * (length - 3));
      
      if(length > 6){
        maxHeight = maxHeight + 19;
        maxHeightString = maxHeight.toString() + "px";
        return maxHeightString;
      }
      maxHeightString = maxHeight.toString() + "px";
      return maxHeightString;
  }

  // const [maxHeight, setMaxHeight] = useState(117);

  // useEffect(() => {
  //   if (files.length > 0) {
  //     const maxPerRow = 5; // Max columns per row
  //     const rows = Math.ceil(files.length / maxPerRow);
  //     setMaxHeight(Math.max(60, 150 / rows)); // Scale height based on row count
  //   }
  // }, [files]);

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Product Details</title>
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
        {/* <button class="show-modal" onClick={() => showButton()}>Show Modal</button> */}
        <span class="overlay" onClick={() => overlayFunc()}></span>
        <div class="modal-box">
          <i
            class="fa fa-window-close-o close-icon"
            aria-hidden="true"
            onClick={() => closeBtnFunc()}
          ></i>
          <i class="fa fa-whatsapp whatsapp" aria-hidden="true"></i>
          <h2>Terkirim</h2>
          <h3>
            Anda akan diarahkan ke akun WhatsApp penjual. Silahkan kirimkan
            pesan WhatsApp ke penjual.
          </h3>
          <div class="buttons">
            <button class="close-btn" onClick={() => closeBtnFunc()}>
              Tutup
            </button>
            <button
              onClick={() => generateWhatsAppMessage(((parseFloat(product?.Price) + variantPrice) * quantity))}
            >
              Kirim ulang
            </button>
          </div>
          <h3 style={{ marginTop: "10px" }}>Atau kirim lewat cara lain:</h3>
          {/* <i class="fa fa-envelope email-icon" aria-hidden="true"></i> */}
          <img
            style={{ width: "100px", marginTop: "10px", marginBottom: "10px" }}
            src={images["gmail-logo-2.png"]}
            alt="email"
          />
          <h4>Email</h4>

          <div class="buttons">
            <button onClick={() => sendOrder(((parseFloat(product?.Price) + variantPrice) * quantity))}>
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
      {/* ----- single product details ------- */}

      {/* <div className="loader"></div> */}
      {/* <div className="loader2"></div> */}
      {product ? (
        <div className="small-container single-product">
          <div className="row">
            <div className="col-2">
              {/* {files.length > 0 ? (
                <img src={files[0].FileData} width="100%" id="ProductImg" />
              ) : (
                <div className="loader2"></div>
              )} */}

              {product &&
                (product?.Video ? (
                  isVideoPlaying ? (
                    <video crossorigin="anonymous" className="video-player" controls>
                      <source src={product.Video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : files.length > 0 ? (
                    <img
                      src={files[imageIndex]?.FileData}
                      width="100%"
                      id="ProductImg"
                      loading="lazy" 
                      decoding="async"
                      alt=""
                    />
                  ) : (
                    <div className="loader2"></div>
                  )
                ) : files.length > 0 ? (
                  <img
                    src={files[imageIndex]?.FileData}
                    loading="lazy" 
                    decoding="async"
                    width="100%"
                    id="ProductImg"
                    alt=""
                  />
                ) : (
                  <div className="loader2"></div>
                ))}

              <div className="small-img-row">
                {product && product?.Video && files?.length > 0 && (
                  <div
                    className="small-img-col video-container"
                    onClick={() => setIsVideoPlaying(true)}
                  >

                    <div class="play-icon"></div>
                    <video crossorigin="anonymous" className="bottom-video-player" preload="metadata">
                        <source src={product?.Video} type="video/mp4" />
                    </video>
                    
                    {/* <VideoThumbnail videoSrc={product?.Video} /> */}
                    

                  </div>
                )}

                

                {files.length > 0 ? (
                  files.map((file, i) => {
                    return (
                      <div className="small-img-col" key={i}>
                        <img
                          src={file?.FileData}
                          width="100%"
                          alt=""
                          className="small-img"
                            loading="lazy" 
                      decoding="async"
                          onClick={() => 
                            file?.FileData && changeVideoToImage(i)
                          }
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="small-img-col">
                    <div className="loader3"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-2">
              <p>Frozen Everyday</p>
              <h1>{product?.Title}</h1>
              <h4>Rp. {formatRupiah((parseFloat(product?.Price) + variantPrice) * quantity)}</h4>
              {/* <select>
              <option>Select Size</option>
              <option>XXL</option>
              <option>XL</option>
              <option>Large</option>
              <option>Medium</option>
              <option>Small</option>
          </select> */}
              {variants.length > 0 && (
                <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                  Pilih varian:{" "}
                </p>
              )}
              {variants.length > 0 &&
                variants.map((variant, i) => {
                  return (
                    <span>
                      <input
                        type="radio"
                        name="choice"
                        id={`variant${i}`}
                        checked={selectedVariant === variant.VariantName}
                        value={variant.VariantName}
                        // style={{ marginLeft: i === 0 ? "0px" : "12.5px" }}
                        style={{ marginRight: "12.5px" }}
                        onChange={(e) => handleVariantChange(e)}
                      />
                      <label
                        for={`variant${i}`}
                        // style={{ marginLeft: i === 0 ? "0px" : "12.5px" }}
                        // style={{ gap: "50px" }}
                        style={{ marginRight: "12.5px" }}
                      >
                        {variant.VariantName}
                      </label>
                    </span>
                  );
                })}
              <span className="input-container2">
                <p>Kuantitas: </p>
                <input
                  type="number"
                  // defaultValue="1"
                  min="1"
                  value={quantity}
                  id="quantity"
                  onChange={(event) => {
                    return setQuantity(
                      event.target.value < 1 ? 1 : event.target.value
                    );
                  }}
                />
              </span>
              {user ? (
                <span className="btn-container">
                  <span className="cart-btn" onClick={(e) => handleCart(e)}>
                    <i className="fa fa-cart-plus" aria-hidden="true" />{" "}
                    Masukkan Keranjang
                  </span>
                  <span
                    className="btn"
                    onClick={() => {
                      showButton();
                      return generateWhatsAppMessage(product?.Price * quantity);
                    }}
                  >
                    Beli Sekarang
                  </span>
                </span>
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
                  <p
                    className="sign-in-warning"
                    style={{
                      fontSize: "20px",
                      padding: "5px 10px 5px 10px",
                      textAlign: "center",
                    }}
                  >
                    Tolong Sign In untuk Membelikan Makanan Ini!
                  </p>
                  <Link to="/account">
                    <span
                      style={{
                        fontSize: "16px",
                        padding: "7.5px 15px 7.5px 15px",
                        marginRight: "20px",
                      }}
                      className="btn"
                    >
                      Sign In
                    </span>
                  </Link>
                </div>
              )}

              {/* <h3>Product Details <i class="fa fa-indent"></i></h3>
          <br>
          <p>Give your summer wardrobe a style upgrade with the HRX Men's Active T-shirt. Team it with a pair of shorts for your morning workout or a denims for an evening out with the guys.</p> */}
              <div className="rating product-details">
                {product?.Rating ? (
                  product?.Rating === "0.00" ? (
                    <div className="rating product-details" style={{marginBottom: "40px"}}>
                      <p
                        style={{
                          fontSize: "24px",
                          color: "#222222",
                          fontWeight: "550",
                          marginRight: "2px",
                        }}
                      >
                        Belum ada penilaian
                      </p>
                      <p
                        className="rating-num"
                        style={{ marginLeft: "2px", fontSize: "16px" }}
                      >
                        ({product?.ItemsSold ? product?.ItemsSold : 0} terjual)
                      </p>
                    </div>
                  ) : (
                    <div className="rating product-details">
                      {(() => {
                        let td = [];
                        for (
                          let i = 0;
                          i < Math.floor(roundToHalf(product?.Rating));
                          i++
                        ) {
                          td.push(<i className="fa fa-star" key={i}></i>);
                        }
                        return td;
                      })()}

                      {roundToHalf(product?.Rating) % 1 !== 0 && (
                        <i class="fa fa-star-half-o"></i>
                      )}

                      {(() => {
                        let td = [];
                        for (
                          let i = 0;
                          i < 5 - Math.ceil(roundToHalf(product?.Rating));
                          i++
                        ) {
                          td.push(<i className="fa fa-star-o"></i>);
                        }
                        return td;
                      })()}
                      <p className="rating-num">({product?.ItemsSold})</p>
                    </div>
                  )
                ) : (
                  <div className="rating product-details">
                    <i className="fa fa-star-o"></i>
                    <i className="fa fa-star-o"></i>
                    <i className="fa fa-star-o"></i>
                    <i className="fa fa-star-o"></i>
                    <i className="fa fa-star-o"></i>
                    <p className="rating-num">
                      ({product?.ItemsSold ? product?.ItemsSold : 0})
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader"></div>
      )}

      {/*       
      <div className="small-container">
        <div className="row row-2">
          <h2>Produk Terkait</h2>
          <p>Lihat Lebih Banyak</p>
        </div>
      </div>
      
      <div className="small-container">
        <div className="row products">
          <div className="col-4 related">
            <div className="layer-container">
              <a href="product-details.html">
                <img src={images["sosis-ayam.webp"]} alt="" />
              </a>
              <a href="product-details.html">
                <div className="layer">
                  <p>Sosis ayam dengan bahan-bahan terbaik!</p>
                </div>
              </a>
            </div>
            <a href="product-details.html">
              <h4 className="place-name">
                CHAMP SOSIS AYAM 375gr (Chicken Sausages)
              </h4>
            </a>
            <div className="rating">
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star-o" aria-hidden="true" />
              <p>• 31 terjual</p>
            </div>
            <p className="place-location">Rp. 20.000</p>
          </div>
          <div className="col-4 related">
            <div className="layer-container">
              <a href="product-details2.html">
                <img src={images["fish-dumpling.webp"]} alt="" />
              </a>
              <a href="product-details2.html">
                <div className="layer">
                  <p>Steam Dumplings!</p>
                </div>
              </a>
            </div>
            <a href="product-details2.html">
              <h4 className="place-name">CEDEA Fish Dumpling Cheese 500gr</h4>
            </a>
            <div className="rating">
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star-half-o" aria-hidden="true" />
              <p>• 29 terjual</p>
            </div>
            <p className="place-location">Rp. 30.500</p>
          </div>
          <div className="col-4 related">
            <div className="layer-container">
              <a href="product-details3.html">
                <img src={images["chicken-nugget.webp"]} alt="" />
              </a>
              <a href="product-details3.html">
                <div className="layer">
                  <p>Chicken nugget terbaik!</p>
                </div>
              </a>
            </div>
            <a href="product-details3.html">
              <h4 className="place-name">
                Kanzler Crispy Chicken Nugget 450gr
              </h4>
            </a>
            <div className="rating">
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star-half-o" />
              <i className="fa fa-star-o" aria-hidden="true" />
              <p>• 210 terjual</p>
            </div>
            <p className="place-location">Rp. 41.500</p>
          </div>
          <div className="col-4 related">
            <div className="layer-container">
              <a href="product-details4.html">
                <img src={images["fiesta-french-fries.webp"]} alt="" />
              </a>
              <a href="product-details4.html">
                <div className="layer">
                  <p>French fries yang lembut dan lezat!</p>
                </div>
              </a>
            </div>
            <a href="product-details4.html">
              <h4 className="place-name">
                FIESTA FRENCH FRIES SHOESTRING 500gr...
              </h4>
            </a>
            <div className="rating">
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star-o" />
              <i className="fa fa-star-o" aria-hidden="true" />
              <p>• 24 terjual</p>
            </div>
            <p className="place-location">Rp. 23.000</p>
          </div>
        </div>
      </div> */}
      {/* - Footer  */}
      <div style={{marginTop: "50px"}}></div>
      <Footer  />
      {/* JS for toggle menu */}
      {/* js for product gallery */}
    </>
  );

  function smallImg0() {
    // setIsVideoPlaying(false);

    let ProductImg = document.getElementById("ProductImg");
    let SmallImg = document.getElementsByClassName("small-img"); //an array

    if (!SmallImg[0].src) {
      return;
    }

    ProductImg.src = SmallImg[0].src;
  }

  function smallImg1() {
    // setIsVideoPlaying(false);

    let ProductImg = document.getElementById("ProductImg");
    let SmallImg = document.getElementsByClassName("small-img"); //an array

    if (!SmallImg[1].src) {
      return;
    }

    ProductImg.src = SmallImg[1].src;
  }

  function smallImg2() {
    // setIsVideoPlaying(false);

    let ProductImg = document.getElementById("ProductImg");
    let SmallImg = document.getElementsByClassName("small-img"); //an array

    if (!SmallImg[2].src) {
      return;
    }

    ProductImg.src = SmallImg[2].src;
  }

  function smallImg3() {
    // setIsVideoPlaying(false);

    let ProductImg = document.getElementById("ProductImg");
    let SmallImg = document.getElementsByClassName("small-img"); //an array

    if (!SmallImg[3].src) {
      return;
    }

    ProductImg.src = SmallImg[3].src;
  }

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

export default ProductDetails;
