import React from "react";

import * as api from "../API";
import { DELETE_ALL_VARIANTS, FETCH_ALL_VARIANTS, FETCH_ALL_VARIANTS_BY_PRODUCT_ID } from "../constants/actionTypes";

export const getAllVariants = () => async (dispatch) => {
    try {
        console.log("Variants Fetched")
        const { data } = await api.getAllVariants();

        const action = {
            type: FETCH_ALL_VARIANTS,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}

export const getAllVariantsByProductID = (id) => async (dispatch) => {
    try {
        console.log("Variants By Product ID Fetched!")
        const { data } = await api.getAllVariantsByProductID(id);

        const action = {
            type: FETCH_ALL_VARIANTS_BY_PRODUCT_ID,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}

export const deleteAllVariants = () => async (dispatch) => {
    try {

        const action = {
            type: DELETE_ALL_VARIANTS
        }

        dispatch(action);
    }catch(error) {
        console.log(error.message);
    }
}

// export const getFilesByProductID = (id) => async (dispatch) => {
//     try {
//         console.log("Files By Product ID Fetched!")
//         const { data } = await api.getAllFilesByProductID(id);

//         const action = {
//             type: FETCH_ALL_VARIANTS_BY_PRODUCT_ID,
//             payload: data
//         }

//         dispatch(action)
//     }catch(error) {
//         console.log(error.message);
//     }
// }