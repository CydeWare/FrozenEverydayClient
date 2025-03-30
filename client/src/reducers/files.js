import { FETCH_ALL_FILES, FETCH_ALL_FILES_FIRST, FETCH_ALL_FILES_BY_PRODUCT_ID, DELETE_ALL_FILES } from "../constants/actionTypes.js";

// const initialState = {
//     files: []
// };

const filesReducer = (files = [], action) => {
    switch(action.type) {
        case DELETE_ALL_FILES:
            console.log("Deleting all files....");
            return [];
        case FETCH_ALL_FILES:
            // console.log("Fetched Reducer", {...initialState, files: action.payload})
            return action.payload;
        case FETCH_ALL_FILES_FIRST:
            // console.log("Fetched All Files Reducer", {...initialState, files: action.payload.data})
            return action.payload.data;
        // case UPDATE:
        //     return products.map((product) => {return product._id === action.payload._id ? action.payload : product});
        case FETCH_ALL_FILES_BY_PRODUCT_ID:
            console.log("Fetched Files By Product ID Reducer",action.payload.data)
            // return files.filter((file) => {return file.ProductID === action.payload.data[0].ProductID})
            
            return action.payload.data;
        
        default:
            return files;
    }
}

export default filesReducer;