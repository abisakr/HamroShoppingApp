import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import GoogleSignIn from "./GoogleSignin";


const Nav = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    return (
        <>
            <NavLink to="/">Home</NavLink>
            {!isLoggedIn ? (
               <>
               <>
            <NavLink to="/register">Register</NavLink>
                <NavLink to="/login">Login</NavLink></>
                <GoogleSignIn /></>
            ) : (
                <>
                    <NavLink to="/cart">My Carts</NavLink>
                    <NavLink to="/" onClick={handleLogout}>Logout</NavLink>
                </>
            )}
        </>
    );
};

export default Nav;
