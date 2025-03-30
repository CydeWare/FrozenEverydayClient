import React, { Component, useState, useEffect, useMemo } from "react";
import Navbar from "../Navbar/Navbar.js";

import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { CircularProgress } from '@material-ui/core'
import {
  getProducts,
  getProductsByPagination,
  getProductsBySearch,
  getSortedProducts,
  getProductsByPaginationAndCategory,
  deleteAllProducts
} from "../../actions/products.js";
import { getFirstFiles, deleteAllFiles, getAllFiles } from "../../actions/files.js";
import { deleteAllVariants } from "../../actions/variants.js";
import moment from "moment";
import Product from "../Products/Product/Product.js";
import Footer from "../Footer/Footer.js";
// import Navbar from '../Navbar/Navbar.js';

const CategoryProducts = () => {
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
  const [isSearching, setIsSearching] = useState(false);
  const [sortByValue, setSortByValue] = useState("");
  const [stableProductFiles, setStableProductFiles] = useState([]);

  const params = useParams();
  const category = params.category;

  console.log("Category: ", category);

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
    if(products.length  > 0){
      dispatch(deleteAllProducts());
    }
    

    // setTimeout(() => {
      
    dispatch(deleteAllVariants());
    dispatch(getAllFiles());

    if(category){
      dispatch(getProductsByPaginationAndCategory(page, limit, category));
    }
   
    // }, 300); 
    
    

    // console.log("PRODUCTS: ", products);
    // console.log("FILES: ", files);
  }, [dispatch, category]);

  // useEffect(() => {
  //   setProducts(productsData.products);
  // }, [productsData])

  const productFiles = useMemo(() => {
    const firstFiles = {};
  files.forEach((file) => {
    if (!firstFiles[file.ProductID]) {
      firstFiles[file.ProductID] = file;
    }
  });

  // Merge products with their first file
  return products.map((product) => ({
    ...product,
    image: firstFiles[product.ProductID] || null,
  }));
  }, [products, files]);

  useEffect(() => {
    // if (productFiles.length > 0) {
      setTimeout(() => {
        setStableProductFiles(productFiles);
      }, 300); // Add delay before updating the UI
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

  useEffect(() => {
    // Cache base64 images for faster re-rendering
    const newCache = {};
    productFiles?.forEach((product) => {
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
    if (sortByValue.length > 0) {
      return dispatch(getSortedProducts(sortByValue, "desc", pageNum, limit, category));
    }
    dispatch(getProductsByPaginationAndCategory(pageNum, limit, category));
  }

  function handleSearchClick(query) {
    console.log("Search Query after entering: ", searchQuery);
    setIsSearching(true);
    dispatch(getProductsBySearch(query, category));

    // const delaySearch = setTimeout(() => {
    //   setIsSearching(false);
    // }, 500);

    // return () => clearTimeout(delaySearch);
  }

  function handleSearchChange(e) {
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
    if (e.target.value === "default") {
      dispatch(getProductsByPaginationAndCategory(page, limit, category));
    } else {
      dispatch(getSortedProducts(e.target.value, "desc", page, limit, category));
    }
  };

  const handleSortByChange = (e) => {
    setSearchQuery("");
    setIsSearching(false);
    if (e.target.value === "default") {
      return setSortByValue("");
    }
    setSortByValue(e.target.value);
  };

  function checkCategory(category){
    if (
      category &&
      category != "Semua Produk" &&
      category != "Cedea" &&
      category != "Paket Hemat" &&
      category != "Kanzler" &&
      category != "Cimory" &&
      category != "Buah Frozen" &&
      category != "Ikan Frozen" &&
      category != "Coklat"
    ) {
      return false;
    } 

      return true;
    
  }

  // if(checkCategory(category)){
  //   return (
  //     <div>
  //       <meta charSet="UTF-8" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //       <title>Frozen Everyday</title>
  //       <link rel="stylesheet" href="styles.css" />
  //       <link rel="preconnect" href="https://fonts.googleapis.com" />
  //       <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  //       <link
  //         href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200&display=swap"
  //         rel="stylesheet"
  //       />
  //       <link
  //         rel="stylesheet"
  //         href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
  //       />


  //    </div>
  //   )
  // } 

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
      {/* <div className="navbar">
    <div className="logo">
      <a href="index.html">
        <img src={images["batavia-logo.png"]} width="100px" alt="logo" />
      </a>
    </div>
    <nav>
      {/* <div class="search-bar-container">
          <i class="fa fa-search" aria-hidden="true"></i>
          <input type="text" />
      </div> 
      <i className="fa fa-search search-icon" aria-hidden="true" />
      <input type="text" placeholder="Search" className="search-bar" />
      <ul id="MenuItems">
        <li>
          <a href="index.html">Home</a>
        </li>
        <li>
          <a href="product.html">Makanan</a>
        </li>
      </ul>
    </nav>
    <a href="cart.html">
      <img
        src={images["shopping-cart-icon-removebg-preview.png"]}
        className="cart-logo"
        width="30px"
        height="30px"
      />
    </a>
    <img
      src={images["menu.png"]}
      className="menu-icon"
      alt="menu"
      onclick="menutoggle()"
    />
  </div> */}

      <Navbar />

      {checkCategory(category) === true && ((stableProductFiles?.length > 0 &&
        files?.length > 0 &&
        products?.length > 0) && (
          <div class="small-container search-container">
            <div class="wrap">
              <div class="search">
                <button
                  class="searchButton"
                  onClick={() => handleSearchClick(searchQuery)}
                >
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
        )) } 

      

      {/* <i className="fa fa-search search-icon" aria-hidden="true" />
    <input type="text" placeholder="Search" className="search-bar" /> */}
      {checkCategory(category) === true ? (<div className="small-container">
        <div className="row row-2" style={{ marginTop: "60px" }}>
          <h2 style={{marginLeft: "15px"}}>
            {category}
          </h2>
          <select
            onChange={(e) => {
              handleSortByChange(e);
              return sortProducts(e);
            }}
          >
            <option value="default">Default Sorting</option>
            <option value="price">Sort dari harga</option>
            <option value="rating">Sort dari rating</option>
            <option value="itemsSold">Sort dari popularitas</option>
          </select>
        </div>
        <div className="row row22 products">
          {/* {notFound === true && (
            <h3
              style={{
                margin: "auto",
                fontSize: "24px",
                marginBottom: "70px",
                marginTop: "10px",
              }}
            >
              Tidak ada produk yang ditemukan dalam pencarian Anda.
            </h3>
          )} */}
          {(isSearching === true && stableProductFiles.length === 0) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
                marginTop: "50px",
                marginBottom: "70px",
              }}
            >
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
              <span
                className="btn"
                onClick={() => {
                  setIsSearching(false);
                  return onPageChange(1);
                }}
              >
                Kembali ←
              </span>
            </div>
          )}
          {stableProductFiles.length === 0 && isSearching === false ? (
            // <CircularProgress
            //   style={{ marginBottom: "100px", marginTop: "50px" }}
            // />
            <div className="loader"></div>
          ) : (
            stableProductFiles?.map((product, i) => {
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
              <span
                key={index + 1}
                onClick={() => onPageChange(index + 1)}
                style={{
                  backgroundColor: page === index + 1 && "#de1011",
                  color: page === index + 1 && "#fff",
                }}
              >
                {index + 1}
              </span>
            ))}
          <span onClick={() => page < totalPages && onPageChange(page + 1)}>
            →
          </span>
        </div>
      </div>) : (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "140px", marginBottom: "100px"}}>
        <h1>
          Kategori tidak ditemukan.
        </h1>
        
        </div>)}
      
      {/* - Footer  */}
      <Footer />
    </>
  );

  function menutoggle() {
    let MenuItems = document.getElementById("MenuItems");

    if (MenuItems.style.maxHeight === "300px") {
      MenuItems.style.maxHeight = "0px";
    } else {
      MenuItems.style.maxHeight = "300px";
    }
  }

  // const searchInput = document.querySelector(".searchTerm")
  // const elements = document.querySelectorAll(".col-4");

  // let users = []

  // const headerArr = Array.from(document.querySelectorAll(".place-name")).map(t => t.innerText);
  // const bodyArr = Array.from(document.querySelectorAll(".place-location")).map(t => t.innerText);

  // for(let i = 0; i < headerArr.length; i++) {
  //   users.push({
  //     name: headerArr[i],
  //     email: bodyArr[i],
  //     element: elements[i]
  //   })
  // }

  // console.log(users);

  // searchInput.addEventListener("input", e => {
  //   const value = e.target.value.toLowerCase()
  //   users.forEach(user => {
  //     const isVisible =
  //       user.name.toLowerCase().includes(value) ||
  //       user.email.toLowerCase().includes(value)
  //     user.element.classList.toggle("hide", !isVisible)
  //   })
  // })

  function search(e) {
    const searchInput = document.querySelector(".searchTerm");
    const elements = document.querySelectorAll(".col-4");

    let users = [];

    const headerArr = Array.from(document.querySelectorAll(".place-name")).map(
      (t) => t.innerText
    );
    const bodyArr = Array.from(
      document.querySelectorAll(".place-location")
    ).map((t) => t.innerText);
    const descriptionArr = Array.from(
      document.querySelectorAll(".layer-description")
    ).map((t) => t.innerText);

    for (let i = 0; i < headerArr.length; i++) {
      users.push({
        name: headerArr[i],
        email: bodyArr[i],
        description: descriptionArr[i],
        element: elements[i],
      });
    }

    const value = e.target.value.toLowerCase();
    let found = false; // Track if any matching product is found

    users.forEach((user) => {
      const isVisible =
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.description.toLowerCase().includes(value);

      user.element.classList.toggle("hide", !isVisible);

      if (isVisible) {
        found = true;
      }

      setNotFound(!found); // If no product is found, setNotFound(true)
    });
  }
};

export default CategoryProducts;
