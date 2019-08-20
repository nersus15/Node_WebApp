// import packages, modules dan Functions;
import React, { Component, Fragment } from 'react';

// import Components
// import context
import AuthContext from '../Context/auth-context';
import Roler from '../Components/Loader/roler';



class Profile extends Component {
    static contextType = AuthContext;
    state = {
        creating: false,
        events: [],
        isLoading: false,
        isShowDetil: false,
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
                    this.setState({ events: events, isLoading: false })
                }
            })
            .catch(err => {
                console.log(err);
                if (this.isActive) {
                    this.setState({ isLoading: false });
                }
            });
    }


    // Default Function
    componentDidMount() {
        this.loadEvents();
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
                        <button className="btn btn-danger">Delete</button>
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
                    <p>User Id: </p>
                    <p>Username:</p>
                    <p>email: </p>
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
                                    {list}
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