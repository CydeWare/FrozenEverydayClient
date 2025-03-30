import React, { Component, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { deleteAllFiles } from "../../../actions/files";

const Product = ({ product }) => {
  // const Product = ({product}) => {

  // console.log(product)

  const { ProductID } = product;

  const { image } = product;

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const images = useMemo(
    () =>
      importAll(
        require.context("../../images", false, /\.(png|jpe?g|svg|webp|avif)$/)
      ),
    []
  );

  function formatRupiah(price) {
    // Convert to fixed 3 decimal places
    let formattedPrice = parseFloat(price).toFixed(3);

    // Replace thousand separator (, → .)
    return formattedPrice;
  }

  function roundToHalf(num) {
    return Math.round(num * 2) / 2;
  }

  if (!product) return null;

  return (
    <div className="col-4">
      <div className="layer-container">
        <Link to={`/product-details/${product.ProductID}`}>
          {/* <img src={image ? image.FileData : images["no-product5.webp"]} alt="" /> */}
          {/* {image?.FileData ? <img src={image ? image.FileData : images["no-product5.webp"]} alt="" /> : <div className="loader2"></div>} */}
          {image?.FileData ? (
            <img
              src={image.FileData}
              alt={product.Title}
              onError={(e) => (e.target.src = images["no-product5.webp"])}
            />
          ) : (
            // <img src={images["no-product5.webp"]} alt="No Product" />
            <div className="loader2"></div>
          )}
        </Link>
        <Link to={`/product-details/${product.ProductID}`}>
          <div className="layer">
            <p className="layer-description">{product.Description}</p>
          </div>
        </Link>
      </div>
      <Link to={`/product-details/${product.ProductID}`}>
        <h4 className="place-name">
          {product.Title.length > 42
            ? `${product.Title.substring(0, 40)}...`
            : product.Title}
        </h4>
      </Link>
      {/* <div className="rating">
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star-o" />
              <i className="fa fa-star-o" aria-hidden="true" />
              <p>• {product.ItemsSold} terjual</p>
            </div> */}
      {product?.Rating ? (
        product?.Rating === "0.00" ? (
          <div className="rating">
            <p
              style={{
                fontSize: "24px",
                color: "#222222",
                fontWeight: "550",
                // marginRight: "2px",
              }}
            >
              Belum ada penilaian
            </p>
            <p
              // className="rating-num"
              style={{ fontSize: "16px" }}
            >
              • {product.ItemsSold} terjual
            </p>
          </div>
        ) : (
          <div className="rating">
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
              <i className="fa fa-star-half-o"></i>
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
            <p>• {product.ItemsSold} terjual</p>
          </div>
        )
      ) : (
        <div className="rating">
          <i className="fa fa-star-o"></i>
          <i className="fa fa-star-o"></i>
          <i className="fa fa-star-o"></i>
          <i className="fa fa-star-o"></i>
          <i className="fa fa-star-o"></i>
          <p>• 0 terjual</p>
        </div>
      )}
      <p className="place-location">Rp. {formatRupiah(product.Price)}</p>
    </div>
  );
};

export default Product;
