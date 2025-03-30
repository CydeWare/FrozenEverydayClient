import { UPDATE_CART, FETCH_ALL_CART_BY_USER_ID, FETCH_ALL_CART, DELETE_CART, CREATE_CART, DELETE_ALL_CART } from "../constants/actionTypes.js";

const cartReducer = (cart = [], action) => {
    switch(action.type) {
        case FETCH_ALL_CART:
            console.log("Fetched Reducer Cart", action.payload)
            return action.payload;
        case FETCH_ALL_CART_BY_USER_ID:
            console.log("Fetched Reducer By User ID Cart", action.payload)
            return action.payload;
        case CREATE_CART:
            console.log("Post Reducer Cart", action.payload)
            return [...cart, action.payload];
        case UPDATE_CART:
            return cart.map((item) => {return item.CartItemID === action.payload.CartItemID ? action.payload : item});
        case DELETE_CART:
            return cart.filter((item) => {return item.CartItemID !== action.payload})
        case DELETE_ALL_CART:
            console.log("Deleting All Carts........");
            return [];
        default:
            return cart;
    }
}

export default cartReducer;