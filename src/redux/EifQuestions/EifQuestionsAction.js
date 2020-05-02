import { EIF_QUESTIONS_REQUEST } from './EifQuestionsTypes'
import { EIF_QUESTIONS_SUCCESS } from './EifQuestionsTypes'
import { EIF_QUESTIONS_FAILURE } from './EifQuestionsTypes'
import { EIF_QUESTIONS_UPDATE } from './EifQuestionsTypes'

export function eifQuestionsRequest(){
    return {
        type : EIF_QUESTIONS_REQUEST
    }
}
export function eifQuestionsSuccess(loadquestions){
    return {
      type: EIF_QUESTIONS_SUCCESS,
      loadquestions
    }
}
export function eifQuestionsFailure(error){
    return {
        type: EIF_QUESTIONS_FAILURE,
        error
    }
}
export function update(loadquestions){
    return {
        type: EIF_QUESTIONS_UPDATE,
        loadquestions
    }
}



export default  { eifQuestionsRequest ,eifQuestionsSuccess, eifQuestionsFailure}