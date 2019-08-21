// import packages
import React, { Component, Fragment } from 'react';
import AuthContext from '../Context/auth-context';


class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }
    // membuat variabel static context untuk mengakses data dari AuthContext
    static contextType = AuthContext;




    // Handler/ Logic untuk Login
    loginHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        const GraphQlRequest = {
            query: `
                query{
                    login(email:"${email}",password:"${password}"){
                        token
                        tokenExp
                        userId
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
                if (result.data.login.token) {
                    this.context.login(
                        result.data.login.token,
                        result.data.login.userId,
                        result.data.login.tokenExp,
                    );
                }
            })
            .catch(err => {
                console.log(err)
            });
        // ...
    }
    render() {
        return (
            <Fragment>
                <form onSubmit={this.loginHandler} className='form'>
                    <div className="form-control">
                        <label className='form-label' htmlFor="email">E-mail</label>
                        <input ref={this.emailEl} className='form-input' placeholder='your email' type="email" name="email" id="email" />
                    </div>
                    <div className="form-control">
                        <label className='form-label' htmlFor="password">Password</label>
                        <input ref={this.passwordEl} className='form-input' current-password='true' placeholder='your password' type="password" name="password" id="password" />
                    </div>
                    <div className="form-action">
                        <small>Don't have account.? click <a href="/sign-up">here </a>to sign up</small>
                        <button className='btn btn-primary' type="submit">Login</button>
                    </div>
                </form>
            </Fragment>
        );
    }
}
export default LoginPage;