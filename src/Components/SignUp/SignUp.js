import React, { Component } from "react";
import "./SignUp.css";
import './Images/Background.jpg';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from "../../utils/storage";

class SignUp extends Component {

    constructor(props) {
      super(props);

      this.state = {
        isLoading: true,
        token: '',
        signUpError: "",
        signUpUsername: "",
        signUpEmail: "",
        signUpPassword: ""
      };

      this.onTextBoxChangeSignUpUsername = this.onTextBoxChangeSignUpUsername.bind(this);
      this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
      this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
     
      this.onSignUp = this.onSignUp.bind(this);
      this.logout = this.logout.bind(this);
    }
    // Setting the component's initial state
    
  
    componentDidMount() {
      const obj = getFromStorage("the_main_app");
      if (obj && obj.token) {
        const { token } = obj;
        // verify token
        fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
         if (json.success) {
           this.setState({
             token,
             isLoading: false
           });
         } else {
           this.setState({
             isLoading: false,
           });
         }
        });
      } else {
        this.setState({
          isLoading: false,
        });
      }
    }

    onTextBoxChangeSignUpUsername(event) {
      this.setState({
        signUpUsername: event.target.value,
      });
    }
  
  
    onTextBoxChangeSignUpEmail(event) {
      this.setState({
        signUpEmail: event.target.value,
      });
    }
  
    onTextBoxChangeSignUpPassword(event) {
      this.setState({
        signUpPassword: event.target.value,
      });
    }

    onSignUp () {
      //Grab state
     const {
       signUpUsername,
       signUpEmail,
       signUpPassword
     } = this.state;
 
     this.setState({
       isLoading: true,
     })
 
       //POST req to backend
       fetch('/api/account/signup', { 
         method: 'POST', 
         headers: {
           'Content-Type': 'application/json'
           ,'Accept': 'application/json'
         },
         body: JSON.stringify({
           username: signUpUsername,
           email: signUpEmail,
           password: signUpPassword,
         }),
       }).then(res => res.json())
         .then(json => {
           if(json.success) { 
             this.setState({
               signUpError: json.message,
               isLoading: false,
               signUpUsername: "",
               signUpEmail: "",
               signUpPassword: ""
           });
         } else {
           this.setState({
             signUpError: json.message,
             isLoading: false,
           });
         }
       });
   }

  logout () {
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      // verify token
      fetch('/api/account/logout?token=' + token)
      .then(res => res.json())
      .then(json => {
       if (json.success) {
         this.setState({
           token: '',
           isLoading: false
         });
       } else {
         this.setState({
           isLoading: false,
         });
       }
      });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }
  
    render(){

      const {
      isLoading,
      token,
      signUpUsername,
      signUpEmail,
      signUpPassword,
      signUpError
    } = this.state;
      
    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }

    if (!token){
      return (

       

        <div id="all">
        <div>
            {
                (signUpError) ? (
                  <p>{signUpError}</p>
                ) : (null)
              }

        </div>
                <h2 className="title">Chordinate</h2>
                <div id="login-box">
                    <div className="left-box">
                        <div id="signUp">
                            <h1>Chordinate</h1>
                            <hr></hr>
                            <h5>Discover Live Music</h5>
                            <h5>Without Ever Getting Lost</h5>
                        </div>
                        <form className="form">
                        <input
                            value={signUpUsername}
                            name="username"
                            onChange={this.onTextBoxChangeSignUpUsername}
                            type="username-text-center"
                            placeholder="Username"
                        />
                        <input
                            value={signUpEmail}
                            name="email"
                            onChange={this.onTextBoxChangeSignUpEmail}
                            type="email-text-center"
                            placeholder="Email"
                        />
                        <input
                            value={signUpPassword}
                            name="password"
                            onChange={this.onTextBoxChangeSignUpPassword}
                            type="password"
                            placeholder="Password"
                        />                    
                        <button class="signup-button" onClick={this.onSignUp}>Sign Up</button>
                        </form>
                        <p>Have An Account?<a href="LOG IN GOES HERE">Login</a></p>
                    </div>
                    <div className="right-box">
                        <button className='social facebook'>Login With Facebook</button>
                        <button className="social twitter">Login With Twitter</button> 
                        <button className= "social google">Login With Google</button>
                    </div>
                    <div className="or">OR</div>
                </div>
            </div>

        )
      }

      return (
        <div>
          <p>Account</p>
          <button onClick={this.logout}>Logout</button>
        </div>
      )
        
  };

}
export default SignUp; 
