import React from 'react';
import '../App.css';
import { logOut } from '../api/api';
export class NewHeader extends React.Component {
   
  handlelogout = () => {
   logOut();
    //this.props.history.push("/login"); 
  }
  render(){
    return (
     <nav className="navbar fixed-top navbar-toggleable-md navbar-expand-xs ">
        
        <a href="https://firstmatch.com">  
    <img
        className="App-logo"
        alt="First Match Logo"
        src="/img/logo_stroke.png"
      />
       </a>
    
    {/* <div className="col col-6 d-flex justify-content-center">&nbsp;</div> */}
    {/* <div className="col col-1 d-flex justify-content-left"> */}
        <button className="btn btn-primary" onClick={this.handlelogout}>  
   Logout         </button>
    {/* </div> */}
   </nav>
   
    
  );
  }
    
  }
  
  export default NewHeader;