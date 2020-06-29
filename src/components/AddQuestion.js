import React from 'react';
import axios from 'axios'
import '../App.css';
import { AddQuestions, fetchQuestionsCategory, baseApiUrl } from '../api/api';
import { connect } from 'react-redux';
import {  toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { store } from '../App'

class AddQuestion extends React.Component {
    constructor() {
        super();
        this.state = {
            question: "",
            question_type: "",
            category: "",
            free_text: "",
            suggested_answers: [""],
            error: "",
            disabled: true,
            is_mandatory: "false"
             
        }
    }

    async componentDidMount() {
        await fetchQuestionsCategory();
        const { id } = this.props.match.params;
        const currentUser = store.getState().loginData.user.token;
        if (id) {

            try {
                const response = await axios.get(`${baseApiUrl}/questions/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser}`
                    }
                })
                    .then(response => {

                        return response.data;
                    })
                this.setState({
                    question: response.question,
                    question_type: response.question_type,
                    category: response.category,
                    suggested_answers: response.suggested_answers,
                    is_mandatory: response.is_mandatory

                })
            }
            catch (error) {
                console.log(error, 'error')
            }
        }else{
            this.setState({
                

            })
        }
    }

    handleText = i => e => {
        let suggested_answers = [...this.state.suggested_answers]
        suggested_answers[i] = e.target.value
        this.setState({
            suggested_answers
        })
    }

    handleDelete = i => e => {
        e.preventDefault()
        let suggested_answers = [
            ...this.state.suggested_answers.slice(0, i),
            ...this.state.suggested_answers.slice(i + 1)
        ]
        this.setState({
            suggested_answers
        })
    }

    addQuestion = e => {
        e.preventDefault()
        let suggested_answers = this.state.suggested_answers.concat([''])
        this.setState({
            suggested_answers
        })
    }
    addQues = async (e) => {
        e.preventDefault();
        const { id } = this.props.match.params;
      const data = {
        question: this.state.question,
        question_type: this.state.question_type,
        category: this.state.category,
        free_text: this.state.free_text,
        suggested_answers: [this.state.suggested_answers],
        is_mandatory: this.state.is_mandatory.toString()
         
    }
        try {
            const response = await AddQuestions(data, id);
            if (response.status === "failed") {
                this.setState({
                    error: response.message.question
                });
            } else {
                toast.info(`Question ${id ? "updated" : "added"}  successfully.`, { position: toast.POSITION.TOP_CENTER,autoClose:3000 })
                this.props.history.push('/configure/questions');
            }

        }
        catch (e) {
            this.setState({
                error: e.message.question
            });
            return;
        }
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }
    onRadioChange = (e) => {
        const { name, value } = e.target;
        if (name === "category") {
            this.setState({
                category: value
            })
        } else {
            if (name === "is_mandatory") {
                const val = value === "true" ? false : true
                this.setState({
                    is_mandatory: val
                })
            } else {
                this.setState({
                    question_type: value
                })
            }
        }
    }
    display = () => {
        const display = this.props.questionscategoryList.response &&
            this.props.questionscategoryList.response
                .map((data, id) =>
                    <><div  key={id} className="form-check">

                        <input
                            className="form-check-input"
                            onChange={this.onRadioChange}
                            value={data.id}
                            type="radio" name="category"
                            checked={this.state.category == data.id} 
                            />
                        <label className="form-check-label" >
                            {data.title}
                        </label>
                    </div>

                        {data.children.length >= 1 ?
                            data.children.map((child, i) =>
                                <div key={i} className="form-check form-check-inline mr-4 ml-4">
                                    <input
                                        className="form-check-input"
                                        onChange={this.onRadioChange}
                                        value={child.id}
                                        type="radio" name="category"
                                        checked={this.state.category == child.id}
                                    />
                                    <label className="form-check-label" >
                                        {child.title}
                                    </label>
                                </div>) : ''

                        }

                    </>
                )
        return display
    }
    render() {
        const { id } = this.props.match.params
        toast.configure()
        return (
            <div className="container-fluid">
                <form className="" onSubmit={this.addQues}>
                    <div className="row p-2 bg-primary text-white">{id ? "Edit" : "Add New"} Question</div><br />
                    {this.state.error &&
                        <div className="col text-center text-danger mb-3 font-weight-bold">
                            {this.state.error}
                        </div>
                    }
                    <fieldset className="form-group">
                        <div className="row">
                            <legend className="col-form-label col-sm-2 pt-0  font-weight-bold">Category:</legend>
                            <div className="col-sm-10">
                                {this.display()}

                            </div>
                        </div>
                    </fieldset>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label font-weight-bold ">Question:</label>
                        <div className="col-sm-9">
                            <input type="text"
                                onChange={this.handleChange}
                                value={this.state.question}
                                name="question"
                                className="form-control " id="inputEmail3" required />
                        </div>
                    </div>
                    <fieldset className="form-group">
                        <div className="row">
                            <legend className="col-form-label col-sm-2 font-weight-bold">Question Type:</legend>
                            <div className="col-sm-10">
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type"
                                        type="radio" checked={this.state.question_type === "SELECT"}
                                        disabled={id && this.state.question_type !== "SELECT" ? true : false}
                                        value="SELECT" required />
                                    <label className="form-check-label" >
                                        Drop Down
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type"
                                        checked={this.state.question_type === "TEXT"}
                                        type="radio" value="TEXT" disabled={id && this.state.question_type !== "TEXT" ? true : false} required />
                                    <label className="form-check-label" >
                                        Text
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type"
                                        checked={this.state.question_type === "CHECKBOX"}
                                        type="radio" value="CHECKBOX"
                                        disabled={id && this.state.question_type !== "CHECKBOX" ? true : false} required/>
                                    <label className="form-check-label" >
                                        Checkbox
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type"
                                        checked={this.state.question_type === "RADIO"}
                                        type="radio" value="RADIO"
                                        disabled={id && this.state.question_type !== "RADIO" ? true : false} required/>
                                    <label className="form-check-label" >
                                        Radio
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type" type="radio"
                                        value="FILE"
                                        disabled={id && this.state.question_type !== "FILE" ? true : false}
                                        required/>
                                    <label className="form-check-label" >
                                        Upload File
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {this.state.question_type === "FILE" || this.state.question_type === "TEXT" ? "" : this.state.suggested_answers.map((question, index) => (
                        <div key={index} className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold">Answer {index + 1}:</label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    onChange={this.handleText(index)}
                                    value={question.answer}
                                    className="form-control" required
                                />
                                <div style={{
                                    position: "absolute",
                                    top: "1px",
                                    right: "-0px",
                                    width: "25px",
                                    height: "25px",
                                    border: "1px solid #d9534f",
                                    backgroundColor: "#d9534f",
                                    borderRadius: "200px",
                                    textAlign: "center",
                                    color: "white"
                                }} className="font-text-bold text-center "
                                    onClick={this.handleDelete(index)} ><b>X</b></div>
                            </div>

                        </div>

                    ))}
                    <div className="form-check form-check-inline">
                        <input type="checkbox"
                            className="form-check-input"
                            name="is_mandatory"
                            value={this.state.is_mandatory }
                            checked={this.state.is_mandatory === true }
                            onChange={this.onRadioChange}   />
                        <label className="form-check-label font-weight-bold">Mandatory</label>
                        
                    </div>
                    {this.state.question_type === "FILE" || this.state.question_type === "TEXT" ?
                        "" : <div className="form-group row d-flex justify-content-center">
                            <div className="">
                                <button className="btn btn-primary" onClick={this.addQuestion}>Click here to Add Answers</button>
                            </div>
                        </div>}
                    <div className="form-group row d-flex justify-content-center ">
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary" >Submit</button>
                        </div>
                    </div>

                </form>

            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        questionscategoryList: state.categoryList.questionscategoryList,
    }
}
export default connect(mapStateToProps)(AddQuestion);