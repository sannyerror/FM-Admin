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
import Landing from './components/landing'
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
import Contactus from "./components/Contactus";
import AddUser from "./components/AddUser";
import Userslist from "./components/Userslist";
import Organizationlist from "./components/Organizationlist";
import ChangePassword from "./components/ChangePassword";
import AddOrganization from "./components/AddOrganization"
import EmailList from "./components/Emaillist"

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
                          <Redirect to="/configure" />
                          {/* <Redirect to="/login" />  */}
              </Route>
                 <Route path="/eif" component={EIF}/>
                <Route path="/eifmsg" component={EIFMSG}/>
                <Route path="/rafmsg" component={RAFMSG} />
                <Route path="/login" component={Login}/>
                <Route path="/finddomain" component={FindDomain}/>
                <Route path="/contactus" component={Contactus}/>
                {/* <Beforeunload onBeforeunload={() => "You'll lose your data!"} > */}
                <Route path="/raf/:customer" component={RAF} />
                {/* </Beforeunload> */}
                </Switch>
                <Switch>
                <PrivateRoute path="/changepassword" component={ChangePassword}/>
                <PrivateRoute exact path="/configure" component={Configure}/>
                <PrivateRoute path="/configure/questions" component={QuestionsList}/>
                <PrivateRoute path="/configure/question/edit=:edit&id=:id" component={AddQuestion}/>
                <PrivateRoute path="/configure/addquestion" component={AddQuestion}/>
                <PrivateRoute path="/configure/adduser" component={AddUser}/>
                <PrivateRoute path="/configure/user/edit=:edit&id=:id" component={AddUser}/>
                <PrivateRoute path="/configure/userslist" component={Userslist}/>
                <PrivateRoute path="/configure/addorganization" component={AddOrganization}/>
                <PrivateRoute path="/configure/organizationlist" component={Organizationlist}/> 
                <PrivateRoute path="/configure/organization/edit=:edit&id=:id" component={AddOrganization}/> 
                <PrivateRoute path="/list" component={Landing}/>
                <PrivateRoute path="/configure/questioncategory" component={AddQuestionCategory}/>
                <PrivateRoute path="/eiflist" component={EIFList}/>
                <PrivateRoute path="/raflist" component={RAFList}/>
                <PrivateRoute path="/configure/emailslist" component={EmailList}/>
                <PrivateRoute path="/configure/questioncategorylist" component={QuestionsCategorylist}/>
                </Switch>
               </Router>
                </PersistGate>
        </Provider>
        </div>
    </div>
  );
}

export default App;
