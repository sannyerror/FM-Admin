import React from 'react';
import '../App.css';
import { logOut } from '../api/api';
import {connect} from 'react-redux'
export class Header extends React.Component {
   
  handlelogout = () => {
   logOut();
    //this.props.history.push("/login"); 
  }
  render(){
      const { accessToken } =this.props.user
      const url = "https://firstmatchcom.wpcomstaging.com/"
    return (
      
    <div id="app" className="container-fluid">
    <nav className="navbar navbar-expand-lg navbar-light ">
        {/* <a className="navbar-brand" href="#">Navbar</a> */}
        <a className="navbar-brand" href={`${accessToken ? "/configure" : url}`}> 
      <img
          className="navbar-brand"
          alt="First Match Logo"
          src="/img/logo_stroke.png"
          width="40%" height="40%" 
        />
        </a>
        {/* </a> */}
        {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button> */}
        <div id="navbarNav" className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
               
                <li className="nav-item">
                   
                </li>

            </ul> 
            {accessToken ? (
                <ul className="navbar-nav mr-right">
                <li className="nav-item">
                    <a className="nav-link" href="/configure">Configure</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/eiflist">Interest Forms</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/raflist">Assessment Forms
                 </a>
                </li>
                <li className="nav-item">
                    <button className="btn btn-link" onClick={this.handlelogout}>Logout</button>
                </li>
            </ul>
            )
            :
              ""
            
            }
            
        </div>
    </nav>
</div>
    );
  }
}
  
const mapStateToProps = state => ({
    user: state.loginData.user
  });
  export default connect(mapStateToProps)(Header);