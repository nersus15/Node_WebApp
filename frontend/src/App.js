// import packages, mthods and module
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import AuthContext from './Context/auth-context';
import jwt from 'jsonwebtoken';


// import Pages and Components
import LoginPage from "./pages/Login";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import SignUp from './pages/Sign-Up';
import Navbar from './Components/Navigation/Navbar';
import Profile from './pages/Profile';



class App extends Component {
  state = {
    token: null,
    userId: null,
    username: null,
    email: null,
  }
  // function to login and logout
  login = (token, userId, tokenExp) => {
    this.setState({
      token: token,
      userId: userId,
    });
    this.userInfo(token);
  };
  logout = () => {
    this.setState({
      token: null,
      userId: null
    });
  }
  userInfo = (token) => {
    let decodedToken = jwt.verify(token, '102408');
    if (!decodedToken) {
      return;
    }
    this.setState({
      username: decodedToken.username,
      email: decodedToken.email,
      userId: decodedToken.userId
    });
  }

  render() {
    return (
      <Router>
        <AuthContext.Provider value={{
          token: this.state.token,
          username: this.state.username,
          email: this.state.email,
          userId: this.state.userId,
          login: this.login,
          logout: this.logout
        }} >
          <Navbar />
          <main className="main-content">
            <Switch>
              {/* Setting Route untuk ketika User belum Login  */}
              {!this.state.token && <Redirect from='/' exact to='/login' />}
              {!this.state.token && <Redirect from='/bookings' exact to='/login' />}
              {!this.state.token && <Redirect from='/profile' exact to='/login' />}
              {!this.state.token && <Route path='/login' component={LoginPage} />}
              {!this.state.token && <Route path='/sign-up' component={SignUp} />}
              <Route path='/events' component={EventsPage} />

              {/* Setting Route untuk ketika User sudah Login */}
              {this.state.token && <Route path='/bookings' component={BookingsPage} />}
              {this.state.token && <Route path='/profile' component={Profile} />}
              {this.state.token && <Redirect from='/' exact to='/events' />}
              {this.state.token && <Redirect from='/login' exact to='/events' />}
              {this.state.token && <Redirect from='/sign-up' exact to='/events' />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </Router >
    );
  }
}

export default App;
