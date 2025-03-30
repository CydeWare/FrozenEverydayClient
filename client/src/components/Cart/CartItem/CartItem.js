import React, { Component, useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, updateCartItem } from '../../../actions/cart.js';
import no_product_img from "../../images/cancel.png"

function formatRupiah(price) {
  // Convert to fixed 3 decimal places
  let formattedPrice = parseFloat(price).toFixed(3);
  
  // Replace thousand separator (, → .)
  return formattedPrice;
}

const CartItem = React.memo(({ cartItem }) => {

    const dispatch = useDispatch();
    const {CartItemID} = cartItem;
    console.log("CART ITEM: ", cartItem);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

    const handleRemove = useCallback((cartItemID) => {
        return dispatch(deleteCartItem(cartItemID, user?.result?.UserID ? user?.result?.UserID : user?.result?.sub))

    }, [cartItem])

    const handleUpdate = useCallback((event, cartItemID, cartItem) => {

      return dispatch(updateCartItem(cartItemID, {...cartItem, Quantity: event.target.value}, user?.result?.UserID ? user?.result?.UserID : user?.result?.sub))
  }, [cartItem])

    return (
        <tr>
                  <td>
                    <div className="cart-info">
                      <img style={{border: "1px solid #ff523b", borderRadius: "5px"}}src={cartItem.Files ? cartItem.Files[0].FileData : no_product_img} alt="" />
                      <div>
                        <p className="cart-title">{cartItem.Title}{cartItem?.Variant?.length > 0 && ` (${cartItem.Variant})`}</p>
                        <small className="cart-price">Rp. {cartItem.Price}0</small>
                        <br />
                        <p className="cart-remove" onClick={() => {return handleRemove(CartItemID)}}>Hapus</p>
                      </div>
                    </div>
                  </td>
                  <td><input type="number" min="1" value={cartItem.Quantity ? cartItem.Quantity : 0} onChange={(event) => {return handleUpdate(event, CartItemID, cartItem)}}/></td>
                  <td>Rp. {formatRupiah(cartItem.Price * cartItem.Quantity)}</td>
        </tr>
    )
})

export default CartItem;