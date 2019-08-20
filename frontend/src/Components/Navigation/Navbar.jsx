// import packages
import React from 'react';
import { NavLink } from 'react-router-dom';

// import Context
import AuthContext from '../../Context/auth-context';

const Navbar = (props) => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <div className="Navbar">
                    <div className="Navbar-brand">
                        <p className="brand-title">My Website</p>
                    </div>
                    {!context.token && <NavLink className="Navbar-item" to="/login">Login</NavLink>}
                    <NavLink className="Navbar-item" to="/events">Events</NavLink>
                    {context.token && (
                        <React.Fragment>
                            <NavLink className="Navbar-item" to="/bookings">Bookings</NavLink>
                            <button onClick={context.logout} className="btn logout Navbar-item" >Logout</button>
                            <div className="user">
                                <p className="username">{context.username}</p>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            );
        }}
    </AuthContext.Consumer>
)
export default Navbar;