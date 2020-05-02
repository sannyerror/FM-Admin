import { FETCH_EIFLIST_REQUEST } from './EIFListTypes'
import { FETCH_EIFLIST_SUCCESS } from './EIFListTypes'
import { FETCH_EIFLIST_FAILURE } from './EIFListTypes'
import { FETCH_EIFLIST_UPDATE } from './EIFListTypes'

export function fetchEifListRequest(){
    return {
        type : FETCH_EIFLIST_REQUEST
    }
}
export function fetchEifListSuccess(EifList){
    return {
      type: FETCH_EIFLIST_SUCCESS,
      EifList
    }
}
export function fetchEifListFailure(error){
    return {
        type: FETCH_EIFLIST_FAILURE,
        error
    }
}
export function update(EifList){
    return {
        type: FETCH_EIFLIST_UPDATE,
        EifList
    }
}



export default  { fetchEifListRequest ,fetchEifListSuccess, fetchEifListFailure}