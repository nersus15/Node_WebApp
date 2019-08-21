// import packages, modules dan Functions;
import React, { Component, Fragment } from 'react';

// import Components
// import context
import AuthContext from '../Context/auth-context';
import Roler from '../Components/Loader/roler';
import { isNull } from 'util';



class Profile extends Component {
    static contextType = AuthContext;
    state = {
        creating: false,
        events: [],
        userInfo: {},
        isLoading: false,
        isShowDetil: false,
        isNull: true,
        selectedEvent: null,
    }
    isActive = true;

    // custom Function
    loadEvents = () => {
        this.setState({ isLoading: true });
        const GraphQlRequest = {
            query: `               
                query{
                    users{      
                        _id
                        username
                        email                           
                        createdEvents{
                            _id
                            title
                            description
                            price
                            date
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
                const events = result.data.users[0].createdEvents
                if (this.isActive) {
                    this.setState({
                        events: events,
                        userInfo: {
                            Id: result.data.users[0]._id,
                            username: result.data.users[0].username,
                            email: result.data.users[0].email,
                        },
                        isLoading: false
                    });
                }
            })
            .catch(err => {
                console.log(err);
                if (this.isActive) {
                    this.setState({ isLoading: false });
                }
            });
    }
    deleteEventHandler = (eventId) => {
        if (!this.context.token) {
            this.setState({ isShowDetil: false })
            return;
        }
        if (eventId.length === 0) {
            this.setState({ isShowDetil: false })
            return;
        }

        const GraphQlRequest = {
            query: `               
                mutation{
                    deleteEvent(eventId:"${eventId}"){
                        title                        
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
                console.log(result)
                this.loadEvents();
                if (!isNull(this.state.events)) {
                    this.setState({ isNull: false })
                }
            })
            .catch(err => {
                console.log(err)
            });
        this.setState({ isLoading: false })
    }

    // Default Function
    componentDidMount() {
        this.loadEvents();
        if (!isNull(this.state.events)) {
            this.setState({ isNull: false })
        }
    }
    render() {
        const list = this.state.events.map(event => {
            return (
                <tr key={event._id} className='table-data'>
                    <td>{event._id}</td>
                    <td>{event.title}</td>
                    <td>{event.description}</td>
                    <td>Rp.{event.price}</td>
                    <td>{new Date(parseInt(event.date)).toLocaleDateString()}</td>
                    <td className='table-data-action'>
                        <button onClick={this.deleteEventHandler.bind(this, event._id)} className="btn btn-danger">Delete</button>
                        <button className="btn btn-warning">Update</button>
                    </td>
                </tr>
            );
        })

        return (
            <Fragment>
                <div className='user-info'>
                    <h1>User Info</h1>
                    <hr />
                    <p>User Id: {this.state.userInfo.Id}</p>
                    <p>Username: {this.state.userInfo.username}</p>
                    <p>email: {this.state.userInfo.email}</p>
                </div>
                {this.state.isLoading ? (<Roler />) : (
                    <div className='user-createdEvents'>
                        <h1>Created Events</h1>
                        <hr />
                        <div className="created-events">
                            <table cellPadding='5' cellSpacing='10'>
                                <tbody>
                                    <tr className='table-header'>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                    {!this.state.isNull ? list : (
                                        <tr key="123" className='table-data'>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Fragment>
        );
    }
}
export default Profile;