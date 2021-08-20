import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux"; 

export const PrivateRoute = ({ component: Component, user,roles, ...rest }) => {
 // const { user } = props;
 let token = localStorage.refreshToken ? 
 localStorage.refreshToken === undefined ? "" : 
 localStorage.refreshToken === "undefined" ? "" : localStorage.refreshToken: "";

 let role = localStorage.user_role ? 
 localStorage.user_role === undefined ? "" : 
 localStorage.user_role === "undefined" ? "" : localStorage.user_role: ""
 if(token){
  if(roles&&roles.includes(role)){
    return(
      <Route
      {...rest}
      render={props => (
        <Component {...props} />
      )
          }/>
          );
  }else{
    return (
      <Redirect  to={{
        pathname: "/admin/access_denied",
      }}
    />
     );
  }
 
  }else{
    return (
      <Redirect  to={{
        pathname: "/admin/login",
      }}
    />
     );
   
  
  }
}
const mapStateToProps = state => ({
  user: state.loginData.user
});
export default connect(mapStateToProps)(PrivateRoute);






   