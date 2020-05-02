import React from 'react';
import { fetchQuestions } from '../api/api';
import { connect } from 'react-redux';
import '../App.css';
export class QuestionsList extends React.Component {
    constructor() {
        super();
        this.state = {
            Questions: [],
            showPopup: false
        }
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    async componentDidMount() {
        await fetchQuestions();
        this.setState({
            Questions: this.props.questionsList,
        })
    }
    render() {
        return (
            <div className="container-fluid">
            <div className="row p-2 bg-primary text-white">Questions List</div>
                <ul className="list-group">
                    {this.props.questionsList.response &&
                    this.props.questionsList.response.map((ques, index) => (<li className="list-group-item mt-1">{ques.id} . {ques.question}</li>))}
                    {/* <li className="list-group-item font-weight-bold" onClick={this.togglePopup.bind(this)}>Add New Question</li> */}
                </ul>
                
                <div className="form-group row d-flex justify-content-center">
                        &nbsp;
                            </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        questionsList: state.questions.questionsList,
    }
}
export default connect(mapStateToProps)(QuestionsList);