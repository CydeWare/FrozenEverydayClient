import * as api from "../API/index.js";
import { AUTH, ERROR, LOGOUT, NOERROR} from "../constants/actionTypes"; //We use this so it will give an error if we mispell something

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        // log in the user

        console.log("Signing in...");
        const { data } = await api.signIn(formData);

        
        const { result } = data;
        const { PasswordHash, ...safeResult } = result;
        const safeData = { ...data, result: safeResult };

        dispatch({ type: AUTH, data })
        dispatch({ type: NOERROR })

        localStorage.setItem("profile", JSON.stringify(safeData));

        navigate("/")
    } catch (error){
        console.log(error.response.data.message)
        dispatch({ type: ERROR, data: error.response.data.message})
    }
}

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        // sign up the user
        console.log("Signing up...");
        const { data } = await api.signUp(formData);

        
        const { result } = data;
        const { PasswordHash, ...safeResult } = result;
        const safeData = { ...data, result: safeResult };

        dispatch({ type: AUTH, data })
        dispatch({ type: NOERROR });

        localStorage.setItem("profile", JSON.stringify(safeData));

        navigate("/")
    } catch (error){
        console.log(error.response.data.message)
        dispatch({ type: ERROR, data: error.response.data.message})
    }
}

export const sign = (result, navigate) => async (dispatch) => {
    try {
        // sign up the user
        const { data } = await api.sign(result);

        // const { result } = data;
        // const { PasswordHash, ...safeResult } = result;
        // const safeData = { ...data, result: safeResult };

        // console.log(safeUser);

        // { UserID: 1, FullName: "John Doe", Email: "john@example.com" }


        dispatch({ type: AUTH, data })
        dispatch({ type: NOERROR })

        localStorage.setItem("profile", JSON.stringify(data));

        navigate("/")
    } catch (error){
        console.log(error.response.data.message)
        dispatch({ type: ERROR, data: error.response.data.message})
    }
}

export const logout = (navigate) => async (dispatch) => {
    try {
        
        dispatch({ type: LOGOUT })

        localStorage.clear();

        navigate("/")
    } catch (error){
        console.log(error.response.data.message)
        dispatch({ type: ERROR, data: error.response.data.message})
    }
}