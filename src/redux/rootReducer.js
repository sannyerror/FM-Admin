import { combineReducers } from 'redux';
import {AddQuestionsReducer} from './AddQuestions/AddQuestionsReducer'
import { LoginReducer }  from './login/loginReducer' 
import { QuestionsReducer }  from './FetchQuestions/QuestionsReducer' 
import { AddQuestionsCategoryReducer }  from './AddQuestionsCategory/AddQuestionsCategoryReducer' 
import { QuestionsCategoryReducer }  from './FetchQuestionsCategory/QuestionsCategoryReducer'
import { EifQuestionsReducer }  from './EifQuestions/EifQuestionsReducer' 
import { RafQuestionsReducer }  from './RafQuestions/RafQuestionsReducer' 
import { AddEIFReducer }  from './AddEIF/AddEIFReducer' 
import { AddRAFReducer }  from './AddRAF/AddRAFReducer' 
import { EIFListReducer }  from './FetchEIFList/EIFListReducer' 
import { RAFListReducer }  from './FetchRAFList/RAFListReducer' 
import { CheckDomainReducer }  from './CheckDomain/CheckDomainReducer'
import { AddUsersReducer }  from './AddUsers/AddUsersReducer'
import { GetUsersReducer }  from './GetUsers/GetUsersReducer' 
import { GetOrganizationsReducer} from './GetOrganizations/GetOrganizationsReducer'
import { AddOrganizationsReducer }  from './AddOrganization/AddOrganizationsReducer'


export const rootReducer = combineReducers({
  loginData: LoginReducer,
  questions: QuestionsReducer,
  addquestion:AddQuestionsReducer,
  addquestionscategory:AddQuestionsCategoryReducer,
  categoryList: QuestionsCategoryReducer,
  loadquestion: EifQuestionsReducer,
  rafquestions: RafQuestionsReducer,
  eif:AddEIFReducer,
  raf:AddRAFReducer,
  eiflist:EIFListReducer,
  raflists:RAFListReducer,
  domain:CheckDomainReducer,
  adduser: AddUsersReducer,
  getusers: GetUsersReducer,
  getorganization: GetOrganizationsReducer,
  addorganization: AddOrganizationsReducer
});

export default rootReducer;
