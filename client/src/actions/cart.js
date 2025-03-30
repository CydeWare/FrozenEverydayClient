import * as api from "../API";
import { UPDATE_CART, FETCH_ALL_CART, FETCH_ALL_CART_BY_USER_ID, DELETE_CART, CREATE_CART } from "../constants/actionTypes"; //We use this so it will give an error if we mispell something

export const getCartItems = () => async (dispatch) => {
    try {
        
        const { data } = await api.getCartItems();
        console.log("Cart Items Fetched" + data)

        const action = {
            type: FETCH_ALL_CART,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}

export const getCartItemsByUserID = (userId) => async (dispatch) => {
    try {
        
        const { data } = await api.getCartItemsByUserID(userId);
        console.log("Cart Items Fetched" + data)

        const action = {
            type: FETCH_ALL_CART_BY_USER_ID,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}

export const createCartItem = (cartItem, userId) => async (dispatch) => {
    try {
        
        const { data } = await api.createCartItem(cartItem, userId);

        console.log("cartItem TO FIND NAME:", data)

        const action = {
            type: CREATE_CART,
            payload: data
        }

        console.log("cartItem Created", data)

        dispatch(action);
    }catch(error) {
        console.log(error.response.data);
    }
}

export const updateCartItem = (id, cartItem, userId) => async (dispatch) => {
    try {
        const { data } = await api.updateCartItem(id, cartItem, userId);

        dispatch({type: UPDATE_CART, payload: data});
    } catch(error) {
        console.log(error.message);
    }
}

export const deleteCartItem = (id, userId) => async (dispatch) => {
    try{
        await api.deleteCartItem(id, userId);

        console.log("cartItem deleted")

        dispatch({type: DELETE_CART, payload: id})

    }catch(error){
        console.log(error);
    }
}

