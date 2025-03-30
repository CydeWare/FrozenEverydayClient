import { UPDATE, FETCH_ALL, DELETE, CREATE, RATE, FETCH_ALL_BY_PAGINATION, FETCH_ALL_BY_SEARCH, FETCH_ALL_SORTED, FETCH_ALL_BY_PAGINATION_AND_CATEGORY, DELETE_ALL_PRODUCTS } from "../constants/actionTypes.js";

const initialState = {
    products: [],
    totalPages: 1,
    currentPage: 1,
    totalProducts: 1
}

const productReducer = (productsState = initialState, action) => {
    switch(action.type) {
        case FETCH_ALL:
            console.log("Fetched Reducer", {...productsState, products: action.payload})
            return {...productsState, products: action.payload};
        case CREATE:
            console.log("product Reducer", {...productsState, products: [...productsState.products, action.payload]})
            return {...productsState, products: [...productsState.products, action.payload]};
        case UPDATE:
            return productsState.products.map((product) => {return product.ProductID === action.payload.ProductID ? action.payload : product});
        case DELETE:
            return productsState.products.filter((product) => {return product.ProductID !== action.payload})
        case RATE:
            console.log("Rate reducer")
            return productsState.products.map((product) => product._id === action.payload._id ? action.payload : product)
        case FETCH_ALL_BY_PAGINATION:
            console.log("Fetched Reducer By Pagination", action.payload)
            return action.payload;
        case FETCH_ALL_BY_SEARCH:
            console.log("Fetched Reducer By Search", {...productsState, products: action.payload})
            return {...productsState, products: action.payload};
        case FETCH_ALL_SORTED:
            console.log("Fetched Reducer Sorted", action.payload)
            return action.payload;
        case FETCH_ALL_BY_PAGINATION_AND_CATEGORY:
            console.log("Fetched Reducer By Pagination And Category", action.payload)
            return action.payload;
        case DELETE_ALL_PRODUCTS:
            console.log("Deleting all products.......");
            return {...initialState, products: []};
        default:
            return productsState;
    }
}

export default productReducer;