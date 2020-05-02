import { ADD_EIF_REQUEST } from './AddEIFTypes'
import { ADD_EIF_SUCCESS } from './AddEIFTypes'
import { ADD_EIF_FAILURE } from './AddEIFTypes'
import { ADD_EIF_UPDATE } from './AddEIFTypes'

export function addEifRequest(){
    return {
        type : ADD_EIF_REQUEST
    }
}
export function addEifSuccess(addeif){
    return {
      type: ADD_EIF_SUCCESS,
      addeif
    }
}
export function addEifFailure(error){
    return {
        type: ADD_EIF_FAILURE,
        error
    }
}
export function update(addeif){
    return {
        type: ADD_EIF_UPDATE,
        addeif
    }
}



export default  { addEifRequest ,addEifSuccess, addEifFailure}