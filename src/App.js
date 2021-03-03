import React from 'react';
import createHistory from 'history/createBrowserHistory';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './redux/configureStore';
import { Switch, Route, BrowserRouter as Router, Redirect} from "react-router-dom";
import './App.css';
import Login from './components/Login'
import EIFMSG from './components/EIFMSG'
import EIF from './components/EIF'
import QuestionsList from './components/Questionslist'
import AddQuestion from './components/AddQuestion';
import PrivateRoute from "../src/PrivateRoute";
import Configure from "./components/Configure";
import AddQuestionCategory from "./components/AddQuestionCategory";
import QuestionsCategorylist from "./components/QuestionsCategorylist";
import EIFList from "./components/EIFList";
import RAFList from "./components/RAFList";
import Header from './components/Header';
import RAF from "./components/RAF"
import RAFMSG from "./components/RAFMSG";
import FindDomain from "./components/FindDomain";
import AddUser from "./components/AddUser";
import Userslist from "./components/Userslist";
import Organizationlist from "./components/Organizationlist";
import ChangePassword from "./components/ChangePassword";
import AddOrganization from "./components/AddOrganization"
import EmailList from "./components/Emaillist";
import BillingDetails from "./components/BillingDetails";
import FormConfigure from "./components/FormConfigure";
import ConfigureOrg from "./components/ConfigureOrg";

export const { store , persistor } = configureStore(createHistory());
function App() {
  return (
    <div className="Container-fluid">
      <div className="App">
       <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
              <Router>
                <Header/>
              <Switch>
              <Route exact path="/">
                          <Redirect to="/admin/configure" />
                          {/* <Redirect to="/login" />  */}
              </Route>
                 <Route path="/admin/eif" component={EIF}/>
                <Route path="/admin/eifmsg" component={EIFMSG}/>
                <Route path="/admin/rafmsg" component={RAFMSG} />
                <Route path="/admin/login" component={Login}/>
                <Route path="/admin/finddomain" component={FindDomain}/>
                <Route path="/admin/raf/:customer" component={RAF} />
                </Switch>
                <Switch>
                <PrivateRoute path="/admin/changepassword" component={ChangePassword}/>
                <PrivateRoute path="/admin/billing/org=:org&name=:name" component={BillingDetails}/>
                <PrivateRoute exact path="/admin/configure" component={Configure}/>
                <PrivateRoute path="/admin/configure/questions" component={QuestionsList}/>
                <PrivateRoute path="/admin/configure/question/edit=:edit&id=:id" component={AddQuestion}/>
                <PrivateRoute path="/admin/configure/addquestion" component={AddQuestion}/>
                <PrivateRoute path="/admin/configure/adduser" component={AddUser}/>
                <PrivateRoute path="/admin/configure/user/edit=:edit&id=:id" component={AddUser}/>
                <PrivateRoute path="/admin/configure/userslist" component={Userslist}/>
                <PrivateRoute path="/admin/configure/addorganization" component={AddOrganization}/>
                <PrivateRoute path="/admin/configure/organizationlist" component={Organizationlist}/> 
                <PrivateRoute path="/admin/configure/organization/edit=:edit&id=:id" component={AddOrganization}/> 
                <PrivateRoute path="/admin/configure/questioncategory" component={AddQuestionCategory}/>
                <PrivateRoute path="/admin/eiflist" component={EIFList}/>
                <PrivateRoute path="/admin/raflist" component={RAFList}/>
                <PrivateRoute path="/admin/configure/emailslist" component={EmailList}/>
                <PrivateRoute path="/admin/org-configure/" component={ConfigureOrg}/>
                <PrivateRoute path="/admin/questions-configure/Org=:Org&id=:id" component={FormConfigure}/>
                <PrivateRoute path="/admin/configure/questioncategorylist" component={QuestionsCategorylist}/>
                </Switch>
               </Router>
                </PersistGate>
        </Provider>
        </div>
    </div>
  );
}

export default App;
