import React from "react";     
import io from 'socket.io-client';
    // socket = io('https://anon-message.herokuapp.com/', {secure: true});
let socket = io('localhost:3000');

import SideBar from "../components/SideBar.jsx";
import NavBar from "../components/NavBar.jsx";

class Body extends React.Component {    
    constructor(props) {
      super(props);
      this.state = {
        profile : this.props.user_profile
      }
    }
    render(){
      return (
        <div>
          <SideBar profile = {this.state.profile}/>
          <NavBar profile = {this.state.profile}/> 
          <img id = "background" src = '/images/raymond.jpg' />        
        </div>
      )
    }
}

export default Body;

