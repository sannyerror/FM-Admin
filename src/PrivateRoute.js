import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
export const PrivateRoute = ({ component: Component, user, ...rest }) => {
 // const { user } = props;
 console.log(user)
 console.log(localStorage)
 if(localStorage.refreshToken){
  return(
    <Route
    {...rest}
    render={props =>
      <Component {...props} />
        }/>
        );
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






   