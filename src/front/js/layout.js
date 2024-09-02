import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";


import { Home } from "./pages/home";
import injectContext from "./store/appContext";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Register from "./pages/register";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import NavbarTop from "./component/navbarTop";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <NavbarTop />
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />                     
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<Login />} path="/login" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
