// import packages
import React from 'react';
import { NavLink } from 'react-router-dom';


const Navbar = () => {
    return (
        <div className="Navbar">
            <div className="Navbar-brand">
                <p className="brand-title">My Website</p>
            </div>
            <NavLink className="Navbar-item" to="/login">Login</NavLink>
            <NavLink className="Navbar-item" to="/events">Events</NavLink>
            <NavLink className="Navbar-item" to="/bookings">Bookings</NavLink>
        </div>
    );
}
export default Navbar