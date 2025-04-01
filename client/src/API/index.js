import axios from 'axios';

const API = axios.create({ baseURL: 'https://frozeneverydayserver-production.up.railway.app'})

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    return req;
})


export const getProducts = () => API.get("/products");
export const createProduct = (newProduct) => API.post("/products", newProduct, {
    headers: {
        "Content-Type": "multipart/form-data", // Needed for FormData
      },
});
export const getProductsByPagination = (page, limit) => API.get(`/products/pagination?page=${page}&limit=${limit}`);
export const getProductsBySearch = (query, category = null) => category ? API.get(`/products/search?query=${query}&category=${category}`) : API.get(`/products/search?query=${query}`);
export const getSortedProducts = (sortBy, order, page, limit, category = null) => category ? API.get(`/products/sorted?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}&category=${category}`) : API.get(`/products/sorted?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`);
export const getProductsByPaginationAndCategory = (page, limit, category) => API.get(`/products/pagination/category?page=${page}&limit=${limit}&category=${category}`);

export const getAllFiles = () => API.get("/files");
export const getFirstFiles = () => API.get("/files/first");
export const getAllFilesByProductID = (id) => API.get(`/files/product/${id}`);


export const getAllVariants = () => API.get("/variants");
export const getAllVariantsByProductID = (id) => API.get(`/variants/${id}`);



export const getCartItems = () => API.get("/cart");
export const getCartItemsByUserID = (userId) => API.get(`/cart/${userId}`);
export const createCartItem = (newCartItem, userId) => API.post("/cart", {...newCartItem, userId: userId});
export const updateCartItem = (id, updatedCartItem, userId) => API.patch(`/cart/${id}`, {...updatedCartItem, userId: userId})
export const deleteCartItem = (id, userId) => API.delete(`/cart/${id}`, {
    headers: {
      Authorization: ""
    },
    data: {
      source: userId
    }
  })

export const signIn = (formData) => API.post("/user/signin", formData)
export const signUp = (formData) => API.post("/user/signup", formData)
export const sign = (formData) => API.post("/user/sign", formData)

export const order = (data) => API.post("/order", data);
