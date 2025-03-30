import React from "react";
import * as api from "../API";
import { DELETE_ALL_FILES, FETCH_ALL_FILES, FETCH_ALL_FILES_BY_PRODUCT_ID, FETCH_ALL_FILES_FIRST } from "../constants/actionTypes";

export const getAllFiles = () => async (dispatch) => {
    try {
        console.log("Files Fetched")
        const { data } = await api.getAllFiles();

        const action = {
            type: FETCH_ALL_FILES,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}

export const getFirstFiles = () => async (dispatch) => {
    try {
        console.log("First Files Fetched!")
        const { data } = await api.getFirstFiles();

        const action = {
            type: FETCH_ALL_FILES_FIRST,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}

export const getFilesByProductID = (id) => async (dispatch) => {
    try {
        console.log("Files By Product ID Fetched!")
        const { data } = await api.getAllFilesByProductID(id);

        const action = {
            type: FETCH_ALL_FILES_BY_PRODUCT_ID,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}

export const deleteAllFiles = () => async (dispatch) => {
    try {

        const action = {
            type: DELETE_ALL_FILES
        }

        dispatch(action);
    }catch(error) {
        console.log(error.message);
    }
}

