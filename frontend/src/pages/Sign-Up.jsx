// import packages
import React, { Component, Fragment } from 'react';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.usernameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }
    signupHandler = (event) => {
        event.preventDefault();
        const username = this.usernameEl.current.value;
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || username.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        const GraphQlRequest = {
            query: `
            mutation{
                createUSer(inputNewUSer:{username:"${username}" email:"${email}" password:"${password}"}){
                _id
                    username
                email
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
                console.log(result)
            })
            .catch(err => {
                throw err;
            });
        // ...
    }
    render() {
        return (
            <Fragment>
                <form onSubmit={this.signupHandler} className='form'>
                    <div className="form-control">
                        <label className='form-label' htmlFor="username">Username</label>
                        <input ref={this.usernameEl} className='form-input' placeholder='your username' type="text" name="username" id="username" />
                    </div>
                    <div className="form-control">
                        <label className='form-label' htmlFor="email">E-mail</label>
                        <input ref={this.emailEl} className='form-input' placeholder='your email' type="email" name="email" id="email" />
                    </div>
                    <div className="form-control">
                        <label className='form-label' htmlFor="password">Password</label>
                        <input ref={this.passwordEl} className='form-input' placeholder='your password' type="password" name="password" id="password" />
                    </div>
                    <div className="form-action">
                        <small>already have account.? click <a href="/login">here </a>to login</small>
                        <button className='btn btn-primary' type="submit">Sign Up</button>
                    </div>
                </form>
            </Fragment>
        );
    }
}
export default SignUp;