import * as api from "../API";
import { UPDATE, FETCH_ALL, DELETE, CREATE, RATE, FETCH_ALL_BY_PAGINATION, FETCH_ALL_BY_SEARCH, FETCH_ALL_SORTED, FETCH_ALL_BY_PAGINATION_AND_CATEGORY, DELETE_ALL_PRODUCTS } from "../constants/actionTypes"; //We use this so it will give an error if we mispell something

export const getProducts = () => async (dispatch) => {
    try {
        console.log("Products Fetched")
        const { data } = await api.getProducts();

        const action = {
            type: FETCH_ALL,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}


export const createProduct = (product) => async (dispatch) => {
    try {
        
        const { data } = await api.createProduct(product);

        console.log("Product TO FIND NAME:", data)

        const action = {
            type: CREATE,
            payload: data
        }

        console.log("Product Created", data)

        dispatch(action);
    }catch(error) {
        console.log(error.response.data);
    }
}

export const getProductsBySearch = (query, category = null) => async (dispatch) => {
    try {
        console.log("Products By Search Fetched")
        if(category){
            const { data } = await api.getProductsBySearch(query, category);

            const action = {
                type: FETCH_ALL_BY_SEARCH,
                payload: data
            }
    
            dispatch(action)

        } else {
        const { data } = await api.getProductsBySearch(query);

        const action = {
            type: FETCH_ALL_BY_SEARCH,
            payload: data
        }

        dispatch(action)
        }
    }catch(error) {
        console.log(error.message);
    }
}

export const getProductsByPagination = (page, limit) => async (dispatch) => {
    try {
        console.log("Products Fetched")
        const { data } = await api.getProductsByPagination(page, limit);

        const action = {
            type: FETCH_ALL_BY_PAGINATION,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}

export const getSortedProducts = (sortBy, order, page, limit, category = null) => async (dispatch) => {
    try {
        console.log("Products Sorted Fetched")
        // if(category){
            const { data } = await api.getSortedProducts(sortBy, order, page, limit, category);

            const action = {
                type: FETCH_ALL_SORTED,
                payload: data
            }
    
            dispatch(action)
        // } else{
        // const { data } = await api.getSortedProducts(sortBy, order, page, limit);

        // const action = {
        //     type: FETCH_ALL_SORTED,
        //     payload: data
        // }

        // dispatch(action)
    // }
    }catch(error) {
        console.log(error.message);
    }
}

export const getProductsByPaginationAndCategory = (page, limit, category) => async (dispatch) => {
    try {
        console.log("Products Fetched")
        const { data } = await api.getProductsByPaginationAndCategory(page, limit, category);

        const action = {
            type: FETCH_ALL_BY_PAGINATION_AND_CATEGORY,
            payload: data
        }

        dispatch(action)
    }catch(error) {
        console.log(error.message);
    }
}

export const deleteAllProducts = () => async (dispatch) => {
    try {

        const action = {
            type: DELETE_ALL_PRODUCTS
        }

        dispatch(action);
    }catch(error) {
        console.log(error.message);
    }
}