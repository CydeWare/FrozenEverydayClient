import { ERROR, NOERROR } from "../constants/actionTypes"; //We use this so it will give an error if we mispell something

const errorReducer = (state = "", action) => {
    switch (action.type) {
        case ERROR:
            return action.data;
        case NOERROR:
            return "";
        default:
            return state;
    }
}

export default errorReducer;