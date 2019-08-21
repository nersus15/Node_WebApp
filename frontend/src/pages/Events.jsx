// import packages
import React, { Component, Fragment } from 'react';

// import Components
import Modal from '../Components/modal/Modal';
import Backdrop from '../Components/backdrop/BackDrop';
import EventList from '../Components/event list/EventList';
import Roler from '../Components/Loader/roler';

// import context
import AuthContext from '../Context/auth-context';


class EventsPage extends Component {
    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
        this.descriptionEl = React.createRef();
    }
    state = {
        creating: false,
        myBookings: [],
        events: [],
        isLoading: false,
        isShowDetil: false,
        selectedEvent: null,
        isActive: true
    }

    static contextType = AuthContext;

    // Custom Function
    createEventHandler = () => {
        this.setState({ creating: true })
    }

    modalCancelHandler = () => {
        this.setState({ creating: false, isShowDetil: false })
    }
    modalConfirmHandler = () => {
        const title = this.titleEl.current.value;
        const price = +this.priceEl.current.value;
        const date = this.dateEl.current.value;
        const description = this.descriptionEl.current.value;

        if (
            title.trim().length === 0 ||
            price < 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }
        // memasukkan inputan ke mongoDB melalui GraphQl
        // Metode inputan yang digunakan disini berbeda dengan metode di booking, login, dan signup
        // metode seperti ini digunakan juga di cancelBooking
        const GraphQlRequest = {
            query: `               
                    mutation createEvent($title:String!, $description:String!, $price:Float!, $date:String!){
                        createEvent(inputNewEvent:{
                            title:$title
                            description:$description
                            price:$price
                            date:$date
                        }){
                            _id
                            title
                            price
                            description
                            date                            
                        }
                    }                      
            `,
            variables: {
                title: title,
                description: description,
                price: price,
                date: date,
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
                this.setState(prevState => {
                    const newEvent = [...prevState.events];
                    newEvent.push({
                        _id: result.data.createEvent._id,
                        title: result.data.createEvent.title,
                        description: result.data.createEvent.description,
                        date: result.data.createEvent.date,
                        price: result.data.createEvent.price,
                        creator: {
                            _id: this.context.userId,
                            username: this.context.username,
                            email: this.context.email,
                        }
                    })
                    return { events: newEvent };
                });
            })
            .catch(err => {
                console.log(err)
            });
        this.setState({ creating: false })
        // ...
    }
    modalBookHandler = () => {
        let isExist = false;
        const eventId = this.state.selectedEvent._id;
        this.state.myBookings.forEach(booking => {
            if (eventId === booking.event._id) {
                isExist = true
            }
        });
        if (!this.context.token) {
            this.setState({ isShowDetil: false })
            return;
        }
        if (eventId.length === 0 || isExist) {
            this.setState({ isShowDetil: false })
            return;
        }

        const GraphQlRequest = {
            query: `               
                mutation{
                    bookEvent(eventId:"${eventId}"){
                        _id
                        user{
                            username
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
                this.setState({ isShowDetil: false })
                isExist = false;
            })
            .catch(err => {
                console.log(err)
            });
        this.setState({ isShowDetil: false })
    }
    loadEvents = () => {
        this.setState({ isLoading: true });
        const GraphQlRequest = {
            query: `               
                query{
                    events{
                        _id
                        title
                        description
                        date
                        price
                        creator{
                            _id
                            username
                            email
                        }
                    }
                 }                      
            `
        };
        fetch('http://localhost:3001/myapi', {
            method: 'POST',
            body: JSON.stringify(GraphQlRequest),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Request Failed');
                }
                return res.json();
            })
            .then(result => {
                const events = result.data.events;
                if (this.state.isActive) {
                    this.setState({ events: events, isLoading: false })
                }
            })
            .catch(err => {
                console.log(err);
                if (this.state.isActive) {
                    this.setState({ isLoading: false });
                }
            });
    }

    showDetilHandler = (eventId) => {
        this.loadMyBooking();
        this.setState(prevState => {
            const SelectedEvent = prevState.events.find(event => event._id === eventId);
            return { selectedEvent: SelectedEvent, isShowDetil: true };
        });

    }
    loadMyBooking = () => {
        const GraphQlRequest = {
            query: `               
            query{
                bookings {
                  event {
                    _id                   
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
                this.setState({ myBookings: bookings });
            })
            .catch(err => {
                console.log(err);
            });
    }
    // ....


    // Default Function from React
    componentDidMount() {
        this.loadEvents();
    }
    componentWillUnmount() {
        this.setState({ isActive: false })
    }
    render() {
        return (
            <Fragment>
                {(this.state.creating || this.state.isShowDetil) && < Backdrop />}
                {this.state.creating && (
                    <div>
                        <Modal
                            title="Add Event"
                            onConfirm={this.modalConfirmHandler}
                            onCancel={this.modalCancelHandler}
                            canCancel
                            confirmText="Add"
                            canConfirm
                            Child={
                                <Fragment>

                                    <div className="form-control">
                                        <label htmlFor="title">Title</label>
                                        <input ref={this.titleEl} type='text' name='title' id='title' />
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="price">Price</label>
                                        <input ref={this.priceEl} placeholder='default price = Rp.0' type='number' name='price' id='price' />
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="date">Date</label>
                                        <input ref={this.dateEl} type='datetime-local' name='date' id='date' />
                                    </div>
                                    <div className="form-control">
                                        <label htmlFor="desc">Description</label>
                                        <textarea ref={this.descriptionEl} rows='5' type='text' name='desc' id='desc' />
                                    </div>

                                </Fragment>
                            }
                        >
                        </Modal>
                    </div>
                )}

                {this.state.isShowDetil && (
                    <div>
                        <Modal
                            title={this.state.selectedEvent.title}
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalBookHandler}
                            confirmText={this.context.token ? "Book" : "Confirm"}
                            canCancel
                            canConfirm
                            Child={
                                <div>
                                    <h1>{this.state.selectedEvent.title}</h1>
                                    <h2>Rp.{this.state.selectedEvent.price} - Date:{new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                                    <div>
                                        <p>{this.state.selectedEvent.description}</p>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                )}

                {this.context.token && (
                    <div className="event-controls">
                        <p>Share your own Events!</p>
                        <button onClick={this.createEventHandler} className='btn btn-primary' type="button"> Create Event</button>
                    </div>
                )}
                {this.state.isLoading ? (
                    <Roler />
                ) : (
                        <EventList
                            userId={this.context.userId}
                            events={this.state.events}
                            onViewDetil={this.showDetilHandler}
                        />
                    )}
            </Fragment>
        );
    }
}
export default EventsPage;