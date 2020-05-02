import { FETCH_RAFLIST_REQUEST } from './RAFListTypes'
import { FETCH_RAFLIST_SUCCESS } from './RAFListTypes'
import { FETCH_RAFLIST_FAILURE } from './RAFListTypes'
import { FETCH_RAFLIST_UPDATE } from './RAFListTypes'

export function fetchRafListRequest(){
    return {
        type : FETCH_RAFLIST_REQUEST
    }
}
export function fetchRafListSuccess(RafList){
    return {
      type: FETCH_RAFLIST_SUCCESS,
      RafList
    }
}
export function fetchRafListFailure(error){
    return {
        type: FETCH_RAFLIST_FAILURE,
        error
    }
}
export function update(RafList){
    return {
        type: FETCH_RAFLIST_UPDATE,
        RafList
    }
}



export default  { fetchRafListRequest ,fetchRafListSuccess, fetchRafListFailure}