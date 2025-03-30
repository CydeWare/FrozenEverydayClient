import React, { Component, useState, useEffect, useMemo, useRef, useCallback } from "react";
import Navbar from "../Navbar/Navbar.js";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { CircularProgress } from '@material-ui/core'
import {
  getProducts,
  getProductsByPagination,
  getProductsBySearch,
  getSortedProducts
} from "../../actions/products.js";
import { getFirstFiles, deleteAllFiles, getAllFiles } from "../../actions/files.js";
import { deleteAllVariants } from "../../actions/variants.js";
import moment from "moment";
import Product from "../Products/Product/Product.js";
import Footer from "../Footer/Footer.js";

const Home = () => {
  const [menuHeight, setMenuHeight] = useState("0px");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(null);
  const [stableProductFiles, setStableProductFiles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  // Handle menu toggle
  const menutoggle = () => {
    setMenuHeight(menuHeight === "0px" ? "300px" : "0px");
  };

  // Handle carousel slide change
  const moveToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Handle autoplay and pause on hover
  // const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null); // Store interval reference

  const updateIndex = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1));
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(updateIndex, 8000);

    return () => clearInterval(intervalRef.current); // Cleanup interval
  }, [updateIndex]); // Dependency on function to ensure stability

  // Create dot indicators dynamically
  const dots = Array.from({ length: 3 }, (_, i) => (
    <button
      key={i}
      className={`dot ${i === currentIndex ? "active" : ""}`}
      onClick={() => moveToSlide(i)}
    />
  ));

  const [latestProducts, setLatestProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit, setLimit] = useState(12);
  // const [products, setProducts] = useState([]);
  const [imageCache, setImageCache] = useState({});
  const [sortByValue, setSortByValue] = useState("");

  const products = useSelector((state) => {
    return state.products.products;
  });

  const productsData = useSelector((state) => {
    return state.products;
  });

  const files = useSelector((state) => {
    return state.files;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsByPagination(page, limit));
    // dispatch(getFirstFiles());
    dispatch(getAllFiles());
    dispatch(deleteAllVariants());

    console.log("PRODUCTS: ", products);
    console.log("FILES: ", files);
  }, [dispatch]);

  // useEffect(() => {
  //   setProducts(productsData.products);
  // }, [productsData])

  const productFiles = useMemo(() => {
    return products.map((product) => ({
      ...product,
      image: files.find((file) => file.ProductID === product.ProductID),
    }));
  }, [products, files]);

  useEffect(() => {
    // if (productFiles.length > 0) {
      setTimeout(() => {
        setStableProductFiles(productFiles);
      }, 300);  // Add delay before updating the UI
    // }
  }, [productFiles]); 

  // useEffect(() => {
  //   const newLatestProducts = products.filter((product) => {
  //     let days = moment().diff(moment(product.createdAt), "days");
  //     console.log("Days:" + days);

  //     return days <= 1; //Products for less than 1 day
  //   });
  //   setLatestProducts(newLatestProducts);
  // }, [products]);

  useEffect(() => {
    // setProducts(productsData.products);
    setPage(productsData.currentPage);
    setTotalPages(productsData.totalPages);
    setTotalProducts(productsData.totalProducts);
  }, [productsData, products, page]);


  useEffect(() => {
    // Cache base64 images for faster re-rendering
    const newCache = {};
    productFiles.forEach((product) => {
      if (product.image) {
        newCache[product.ProductID] = `data:image/jpeg;base64,${product.image}`;
      }
    });
    setImageCache(newCache);
  }, [productFiles]);

  function onPageChange(pageNum) {
    setPage(pageNum);
    setIsSearching(false);
    setSearchQuery("");
    if(sortByValue.length > 0){
      return dispatch(getSortedProducts(sortByValue, "desc", pageNum, limit));
    }
    dispatch(getProductsByPagination(pageNum, limit));
  }

  function handleSearchClick(query){
    console.log("Search Query after entering: ", searchQuery);
    setIsSearching(true);
    dispatch(getProductsBySearch(query));

    // const delaySearch = setTimeout(() => {
    //   setIsSearching(false);
    // }, 500);

    // return () => clearTimeout(delaySearch);
  }

  function handleSearchChange(e){
    console.log("Event value: ", e.target.value);
    setSearchQuery(e.target.value);
    
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick(searchQuery);
    }
  };

  const sortProducts = (e) => {
    setSearchQuery("");
    setIsSearching(false);
    if(e.target.value === "default"){
      dispatch(getProductsByPagination(page, limit))
    } else {
      dispatch(getSortedProducts(e.target.value, "desc", page, limit));
    }
    
  }

  const handleSortByChange = (e) => {
    setSearchQuery("");
    setIsSearching(false);
    if(e.target.value === "default") {
      return setSortByValue("");
    }
    setSortByValue(e.target.value);
  }

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Frozen Everyday</title>
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
      <link rel="stylesheet" href="styles.css" />

      <Navbar />

      <div className="small-container-2">
        <div className="carousel">
          <div
            className="carousel-container"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            <div className="carousel-slide">
              <img src={images["chicken-nugget-poster.jpg"]} alt="Slide 1" />
            </div>
            <div className="carousel-slide three">
              <img
                src={images["Red Frozen Food Available Here Poster.png"]}
                alt="Slide 2"
              />
            </div>
            <div className="carousel-slide three">
              <img
                src={images["Black and White Frozen Goods Banner.png"]}
                alt="Slide 3"
              />
            </div>
          </div>
          {/* Navigation arrows */}
          <button
            className="prev-btn"
            onClick={() =>
              setCurrentIndex(currentIndex === 0 ? 2 : currentIndex - 1)
            }
          >
            &lt;
          </button>
          <button
            className="next-btn"
            onClick={() =>
              setCurrentIndex(currentIndex === 2 ? 0 : currentIndex + 1)
            }
          >
            &gt;
          </button>
          {/* Dot indicators */}
          <div className="carousel-dots">{dots}</div>
        </div>
      </div>

      <div className="small-container">
        <div className="row">
          <div className="col-4 more-col">
            <Link to="/products">
              <img src={images["semua-produk.webp"]} alt="" />
            </Link>
            <Link to="/products">
              <h1>Semua Produk</h1>
            </Link>
          </div>
          <div className="col-4 more-col">
            <Link to="/category/Cedea">
              <img src={images["cedea.webp"]} alt="" />
            </Link>
            <Link to="/category/Cedea">
              <h1>Cedea</h1>
            </Link>
          </div>
          <div className="col-4 more-col">
            <Link to="/category/Paket Hemat">
              <img src={images["paket-hemat.webp"]} alt="" />
            </Link>
            <Link to="/category/Paket Hemat">
              <h1>Paket Hemat</h1>
            </Link>
          </div>
          <div className="col-4 more-col">
            <Link to="/category/Kanzler">
              <img src={images["Kanzler.webp"]} alt="" />
            </Link>
            <Link to="/category/Kanzler">
              <h1>Kanzler</h1>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-4 more-col">
            <Link to="/category/Cimory">
              <img src={images["cimory.webp"]} alt="" />
            </Link>
            <Link to="/category/Cimory">
              <h1>Cimory</h1>
            </Link>
          </div>
          <div className="col-4 more-col">
            <Link to="/category/Buah Frozen">
              <img src={images["buah-frozen.webp"]} alt="" />
            </Link>
            <Link to="/category/Buah Frozen">
              <h1>Buah Frozen</h1>
            </Link>
          </div>
          <div className="col-4 more-col">
            <Link to="/category/Ikan Frozen">
              <img src={images["ikan-frozen.webp"]} alt="" />
            </Link>
            <Link to="/category/Ikan Frozen">
              <h1>Ikan Frozen</h1>
            </Link>
          </div>
          <div className="col-4 more-col">
            <Link to="/category/Coklat">
              <img src={images["coklat.webp"]} alt="" />
            </Link>
            <Link to="/category/Coklat">
              <h1>Coklat</h1>
            </Link>
          </div>
        </div>
      </div>

      <hr className="line-2" />

      {(stableProductFiles.length > 0 && files.length > 0 && products.length > 0) && (
        <div class="small-container search-container">
          <div class="wrap">
            <div class="search">
              <button class="searchButton" onClick={() => handleSearchClick(searchQuery)}>
                <i class="fa fa-search"></i>
              </button>
              <input
                type="text"
                class="searchTerm"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e)}
                onKeyDown={(e) => handleKeyPress(e)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="small-container">
        <div className="no-bootstrap row row-2" style={{marginTop: "80px"}}>
          <h2>
            Recommended <i className="fa fa-thumbs-up" aria-hidden="true" />
          </h2>
          <select onChange={(e) => {
            handleSortByChange(e);
            return sortProducts(e);}}>
            <option value="default">Default Sorting</option>
            <option value="price">Sort dari harga</option>
            <option value="rating">Sort dari rating</option>
            <option value="itemsSold">Sort dari popularitas</option>
          </select>
        </div>
        <div className="row row22 products">
        {(isSearching === true && stableProductFiles.length === 0) && (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%', marginTop: '50px', marginBottom: '70px'}}	>
            <h3
              style={{
                // margin: "auto",
                fontSize: "34px",
                marginBottom: "30px",
                // marginTop: "10px",
              }}
            >
              Tidak ada produk yang ditemukan dalam pencarian Anda.
            </h3>
            <span className="btn" onClick={() => {
              setIsSearching(false);
              return onPageChange(1);
            }}>Kembali ←</span>
            </div>
        )}
        {(stableProductFiles.length === 0 && isSearching === false) ? (
            // <CircularProgress
            //   style={{ marginBottom: "100px", marginTop: "50px" }}
            // />
            <div className="loader"></div>
          ) : (
            stableProductFiles.map((product, i) => {
              return (
                <Product
                  key={i}
                  product={product}
                  // image={files.find((file) => {
                  //   return file.ProductID === product.ProductID;
                  // }) || { FileName: images["no-product5.webp"] }}
                  // image={files[i]}
                />
              );
            })
          )}
        </div>
        <div className="page-btn">
          {/* <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>→</span> */}
          {productsData &&
            Array.from({ length: totalPages }, (_, index) => (
              <span key={index + 1} onClick={() => onPageChange(index + 1)} style={{backgroundColor: (page === (index + 1)) && "#de1011", color: (page === (index + 1)) && "#fff"}}>
                {index + 1}
              </span>
            ))}
          <span onClick={() => (page < totalPages) && onPageChange(page + 1)}>
            →
          </span>
        </div>
      </div>
      {/* - Footer  */}
      {/* <div className="footer">
        <div className="container">
          <div className="row">
            {/* <div class="footer-col-1">
              <h3>Download Our App</h3>
              <p>Download App for Android and ios mobile phone.</p>
              <div class="app-logo">
                  <img src={images["play-store.png"]} alt="">
                  <img src={images["app-store.png"]} alt="">
              </div>
          </div> */}
            {/* <div className="footer-col-2">
              <img src={images["logo-white.png"]} alt="" />
              <p>
                Tujuan kami adalah menjualkan produk makanan frozen yang
                terbaik.
              </p>
            </div> */}
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
          </div> 
          </div>
          <hr />
          <p className="copyright">Copyright 2025 - Frozen Everyday</p>
        </div>
      </div> */}
      <Footer />
    </>
  );

  function search(e){
    const searchInput = document.querySelector(".searchTerm")
  const elements = document.querySelectorAll(".col-4");
  
  let users = []
  
  const headerArr = Array.from(document.querySelectorAll(".place-name")).map(t => t.innerText);
  const bodyArr = Array.from(document.querySelectorAll(".place-location")).map(t => t.innerText);
  // const descriptionArr = Array.from(document.querySelectorAll(".layer-description")).map(t => t.innerText);
  
  
  for(let i = 0; i < headerArr.length; i++) {
    users.push({
      name: headerArr[i],
      email: bodyArr[i],
      // description: descriptionArr[i],
      element: elements[i]
    })
  }
  
  const value = e.target.value.toLowerCase()
    users.forEach(user => {
      const isVisible =
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) 
        // || user.description.toLowerCase().includes(value)
      user.element.classList.toggle("hide", !isVisible)
    })
  }
};

export default Home;
