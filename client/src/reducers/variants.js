import { FETCH_ALL_VARIANTS, FETCH_ALL_VARIANTS_BY_PRODUCT_ID, DELETE_ALL_VARIANTS } from "../constants/actionTypes.js";

const variantsReducer = (variants = [], action) => {
    switch(action.type) {
        case FETCH_ALL_VARIANTS:
            console.log("Fetched Reducer", action.payload.data)
            return action.payload.data;
        // case UPDATE:
        //     return products.map((product) => {return product._id === action.payload._id ? action.payload : product});
        case FETCH_ALL_VARIANTS_BY_PRODUCT_ID:
            console.log("Fetched All Variants By Product ID Reducer", action.payload.data)
            return action.payload.data;
        case DELETE_ALL_VARIANTS:
            console.log("Deleting all variants..........");
            return [];
        default:
            return variants;
    }
}

export default variantsReducer;