// import packages
import React, { Component, Fragment } from 'react';

// import Components
import Roler from '../Components/Loader/roler';
import BookingList from '../Components/booking list/BookingList';


// import context
import AuthContext from '../Context/auth-context';

class BookingsPage extends Component {
    static contextType = AuthContext;
    state = {
        bookings: [],
        isLoading: false,
    }
    loadBooking = () => {
        this.setState({ isLoading: true });
        const GraphQlRequest = {
            query: `               
            query{
                bookings {
                  _id
                  createdAt
                  user {
                    _id
                    username
                    email
                  }
                  event {
                    _id
                    title
                    description
                    price
                    date
                    creator{
                        _id
                        username
                    }
                  }
                }
              }
                           
            `
        };
        fetch('http://localhost:3001/myapi', {
            method: 'POST',
            body: JSON.stringify(GraphQlRequest),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Request Failed');
                }
                return res.json();
            })
            .then(result => {
                const bookings = result.data.bookings;
                this.setState({ bookings: bookings, isLoading: false });
            })
            .catch(err => {
                console.log(err);
                this.setState({ isLoading: false });
            });

    }
    deleteBookingHandler = (bookingId) => {
        this.setState({ isLoading: true });
        const GraphQlRequest = {
            query: `               
                mutation CancelBooking($id:ID!){
                    cancelBooking(bookingId:$id){
                        _id
                        title
                    }
                }                      
            `,
            variables: {
                id: bookingId
            }
        };
        fetch('http://localhost:3001/myapi', {
            method: 'POST',
            body: JSON.stringify(GraphQlRequest),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Request Failed');
                }
                return res.json();
            })
            .then(result => {
                this.setState({ isLoading: false });
                this.loadBooking();
            })
            .catch(err => {
                console.log(err);
                this.setState({ isLoading: false });
            });

    }
    componentDidMount() {
        this.loadBooking();
    }

    render() {
        return (
            <Fragment>
                {this.state.isLoading ? (
                    <Roler />
                ) : (
                        <BookingList onDelete={this.deleteBookingHandler} myBookings={this.state.bookings} />
                    )}
            </Fragment>
        );
    }
}
export default BookingsPage;