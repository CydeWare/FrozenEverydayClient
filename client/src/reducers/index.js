import {combineReducers} from "redux";
import productReducer from "./products.js";
import filesReducer from "./files.js";
import variantsReducer from "./variants.js";
import cartReducer from "./cart.js";
import errorReducer from "./error.js";

const allReducers = combineReducers({
    products: productReducer,
    files: filesReducer,
    variants: variantsReducer,
    cart: cartReducer,
    error: errorReducer,
})

export default allReducers;