import { SIGNIN_PIN } from "./loginTypes"
import { FETCH_USERS_REQUEST } from './loginTypes'
import { FETCH_USERS_SUCCESS } from './loginTypes'
import { FETCH_USERS_FAILURE } from './loginTypes'
import { FETCH_USERS_UPDATE }  from './loginTypes'
import { CLEAR_USER } from './loginTypes'
import { fetchUsersFailure } from './loginAction'
import { fetchUsersRequest } from './loginAction'
import { fetchUsersSuccess } from './loginAction'
import { update } from './loginAction'
import axios from 'axios'
import store from "../configureStore"
const initialstate = {
    email: '',
    password: '',
    loading : true , 
    user : [],
    error : '',
    
}
export function LoginReducer(state=initialstate ,action) {
    switch(action.type){
        case SIGNIN_PIN : return {
            ...state,
            email : action.email,
            password: action.password
        }
        case FETCH_USERS_REQUEST :  return {
            ...state,
            loading : true
        }
        case FETCH_USERS_SUCCESS :  return {
            loading : false,
            user : action.user,
            error : ''
        }
        case FETCH_USERS_FAILURE :  return {
            loading : false,
            user : [],
            error : action.payload 
        }
        case FETCH_USERS_UPDATE : return {
            loading : false,
            user : action.user,
            error : ''
        }
        case CLEAR_USER : return {
            loading : true,
            user : []
        }
           default : return state
    }
}



export const Update = (user)=> {
  store.dispatch(update(user));
}
export default { LoginReducer  , Update }