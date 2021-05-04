import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
export const PrivateRoute = ({ component: Component, user, ...rest }) => {
 // const { user } = props;
 if(!localStorage.refreshToken){
    return (
      <Redirect  to={{
        pathname: "/admin/login",
      }}
    />
     );
  }else{
    return(
    <Route
    {...rest}
    render={props =>
      <Component {...props} />
        }/>
        );
  
  }
}
const mapStateToProps = state => ({
  user: state.loginData.user
});
export default connect(mapStateToProps)(PrivateRoute);






   