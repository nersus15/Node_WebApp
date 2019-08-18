import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// import Pages and Components
import LoginPage from "./pages/Login";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import Navbar from './Components/Stateless/Navigation/Navbar';
import SignUp from './pages/Sign-Up';



class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <main className="main-content">
          <Switch>
            <Route path='/' exact component={null} />
            <Route path='/login' component={LoginPage} />
            <Route path='/sign-up' component={SignUp} />
            <Route path='/events' component={EventsPage} />
            <Route path='/bookings' component={BookingsPage} />
          </Switch>
        </main>
      </Router>
    );
  }
}

export default App;
