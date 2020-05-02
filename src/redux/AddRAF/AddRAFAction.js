import { ADD_RAF_REQUEST } from './AddRAFTypes'
import { ADD_RAF_SUCCESS } from './AddRAFTypes'
import { ADD_RAF_FAILURE } from './AddRAFTypes'
import { ADD_RAF_UPDATE } from './AddRAFTypes'

export function addRafRequest(){
    return {
        type : ADD_RAF_REQUEST
    }
}
export function addRafSuccess(addraf){
    return {
      type: ADD_RAF_SUCCESS,
      addraf
    }
}
export function addRafFailure(error){
    return {
        type: ADD_RAF_FAILURE,
        error
    }
}
export function update(addraf){
    return {
        type: ADD_RAF_UPDATE,
        addraf
    }
}



export default  { addRafRequest ,addRafSuccess, addRafFailure}