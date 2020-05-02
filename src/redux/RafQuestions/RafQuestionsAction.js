import { RAF_QUESTIONS_REQUEST } from './RafQuestionsTypes'
import { RAF_QUESTIONS_SUCCESS } from './RafQuestionsTypes'
import { RAF_QUESTIONS_FAILURE } from './RafQuestionsTypes'
import { RAF_QUESTIONS_UPDATE } from './RafQuestionsTypes'

export function rafQuestionsRequest(){
    return {
        type : RAF_QUESTIONS_REQUEST
    }
}
export function rafQuestionsSuccess(loadrafquestions){
    return {
      type: RAF_QUESTIONS_SUCCESS,
      loadrafquestions
    }
}
export function rafQuestionsFailure(error){
    return {
        type: RAF_QUESTIONS_FAILURE,
        error
    }
}
export function update(loadrafquestions){
    return {
        type: RAF_QUESTIONS_UPDATE,
        loadrafquestions
    }
}



export default  { rafQuestionsRequest ,rafQuestionsSuccess, rafQuestionsFailure}