import { AUTH, LOGOUT } from "../constants/actionTypes"; //We use this so it will give an error if we mispell something

const authReducer = (state = { authData: null }, action) => {
    switch (action.type) {
        case AUTH:
            console.log("ACTION: ", action);
            console.log("ACTION DATA: ", action.data);
            localStorage.setItem("profile", JSON.stringify(action.data));
            return {...state, authData: {...action?.data}}
        case LOGOUT:
            localStorage.clear();

            return {...state, authData: null}
        default:
            return state;
    }
}

//E11000 duplicate key error collection: Aero.users index: username_1 dup key: { username: null }"


export default authReducer;