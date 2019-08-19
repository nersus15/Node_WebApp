// import packages
import React, { Component, Fragment } from 'react';

// import Components
import Modal from '../Components/modal/Modal';
import Backdrop from '../Components/backdrop/BackDrop';


// import context
import AuthContext from '../Context/auth-context';
import EventList from '../Components/event list/EventList';

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
        events: [],
    }
    static contextType = AuthContext;

    createEventHandler = () => {
        this.setState({ creating: true })
    }

    modalCancelHandler = () => {
        this.setState({ creating: false })
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

        // const newEvent = { title, price, date, description };
        // console.log(newEvent);

        // memasukkan inputan ke mongoDB melalui GraphQl
        const GraphQlRequest = {
            query: `               
                    mutation{
                        createEvent(inputNewEvent:{
                            title:"${title}"
                            description:"${description}"
                            price:${price}
                            date:"${date}"
                        }){
                            creator{
                                _id
                                username
                                email
                            }
                            _id
                            title
                            price
                            description
                            date
                            
                        }
                    }                      
            `
        };
        const token = this.context.token;
        fetch('http://localhost:3001/myapi', {
            method: 'POST',
            body: JSON.stringify(GraphQlRequest),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Request Failed');
                }
                return res.json();
            })
            .then(result => {
                this.loadEvents();
            })
            .catch(err => {
                console.log(err)
            });
        this.setState({ creating: false })
        // ...
    }
    loadEvents = () => {
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
        const token = this.context.token;
        fetch('http://localhost:3001/myapi', {
            method: 'POST',
            body: JSON.stringify(GraphQlRequest),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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
                this.setState({ events: events })
            })
            .catch(err => {
                console.log(err)
            });
        this.setState({ creating: false })
    }

    componentDidMount() {
        this.loadEvents();
    }

    render() {
        return (
            <Fragment>
                {this.state.creating && (
                    <div>
                        < Backdrop />
                        <Modal
                            title="Add Event"
                            onConfirm={this.modalConfirmHandler}
                            onCancel={this.modalCancelHandler}
                            canCancel
                            canConfirm
                            Child={
                                <form>
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
                                </form>
                            }
                        >
                        </Modal>
                    </div>
                )}
                {this.context.token && (
                    <div className="event-controls">
                        <p>Share your own Events!</p>
                        <button onClick={this.createEventHandler} className='btn btn-primary' type="button"> Create Event</button>
                    </div>
                )}
                <EventList events={this.state.events} />
            </Fragment>
        );
    }
}
export default EventsPage;