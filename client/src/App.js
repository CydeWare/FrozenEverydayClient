import React from 'react';
import Home from "./components/Home/Home.js";
// import Contact from "./components/Contact/Contact.js";
import ProductDetails from './components/ProductDetails/ProductDetails.js';
// import About from "./components/About/About.js";
// import Sell from "./components/Sell/Sell.js";
// import SellDetails from "./components/Sell-details/SellDetails.js";
// import Account from "./components/Account/Account.js";
import Products from "./components/Products/Products.js";
// import Cart from "./components/Cart/Cart.js";
// import Test from "./components/Test/Test.js";
// import Form from './components/Form/Form.js';
import "./styles.css"


import { BrowserRouter, Routes, Route } from "react-router-dom"; //Switch is not supported anymore in react-router-dom new version v6
import Cart from './components/Cart/Cart.js';
import NotFound from './components/NotFound/NotFound.js';
import CategoryProducts from "./components/Category-Products/Category-Products.js"
// import Export from './components/Export/Export.js';
import Sell from './components/Sell/Sell.js';
import Account from './components/Account/Account.js';
import AccountDetails from './components/AccountDetails/AccountDetails.js';
// import Sell2 from './components/Sell/Sell2.js';


const App = () => {

    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={< Home/>} />
                <Route path="/products" exact element={< Products/>} />
                <Route path="/product-details/:id" exact element={< ProductDetails />} />
                <Route path="/category/:category" exact element={< CategoryProducts />} />
                {/* <Route path="/about" exact element={< About/>} />
                <Route path="/contact" exact element={< Contact/>} />
                <Route path="/sell" exact element={< Sell/>} />
                <Route path="/sell-details" exact element={< SellDetails/>} /> */ }
                <Route path="/account" exact element={< Account/>} /> 
                <Route path="/account-details" exact element={< AccountDetails />} /> 
                <Route path="/cart" exact element={< Cart />} /> 
                {/* <Route path="/export" exact element={< Export />} /> */}
                <Route path="/sell" exact element={< Sell />} />
                {/* <Route path="/sell2" exact element={< Sell2 />} /> */}
                <Route path="*" exact element={< NotFound />} /> 
                
            </Routes>
            
        </BrowserRouter>
        

    );
}

//            <Container max-width="lg">

/*

<Routes>
                <Route path="/" exact element={< Home/>} />
                <Route path="/auth" exact element={< Auth />} />
            </Routes>
            <Container max-width="lg">
            <Navbar />
            
        </Container>

*/
 
export default App;