import { CHECK_DOMAIN_REQUEST } from './CheckDomainTypes'
import { CHECK_DOMAIN_SUCCESS } from './CheckDomainTypes'
import { CHECK_DOMAIN_FAILURE } from './CheckDomainTypes'
import { CHECK_DOMAIN_UPDATE } from './CheckDomainTypes'

export function checkDomainRequest(){
    return {
        type : CHECK_DOMAIN_REQUEST
    }
}
export function checkDomainSuccess(checkdomain){
    return {
      type: CHECK_DOMAIN_SUCCESS,
      checkdomain
    }
}
export function checkDomainFailure(error){
    return {
        type: CHECK_DOMAIN_FAILURE,
        error
    }
}
export function update(checkdomain){
    return {
        type: CHECK_DOMAIN_UPDATE,
        checkdomain
    }
}



export default  { checkDomainRequest ,checkDomainSuccess, checkDomainFailure}