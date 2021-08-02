import React from 'react';
import axios from 'axios'
import '../App.css';
import { AddQuestions, fetchQuestionsCategory, baseApiUrl, fetchQuestions } from '../api/api';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
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
            is_mandatory: "false",
            is_related: "false",
            suggested_jump: [],
            relatedQuestions: []

        }
    }

    async componentDidMount() {
        await fetchQuestionsCategory();
        const { id } = this.props.match.params;
        const currentUser = store.getState().loginData.user.token;
        if (id) {

            try {
                const response = await axios.get(`${baseApiUrl}/questions/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser}`
                    }
                })
                    .then(response => {
                        return response.data;
                    })
                    
                const res = await fetchQuestions(response.category);
                this.setState({
                    question: response.question,
                    question_type: response.question_type,
                    category: response.category,
                    suggested_answers: response.suggested_answers,
                    suggested_jump: response.suggested_jump,
                    is_mandatory: response.is_mandatory ? response.is_mandatory : "false",
                    is_related: response.is_related,
                    relatedQuestions: res.response
                })
            }
            catch (error) {
                console.log(error, 'error')
            }
        } else {
            this.setState({


            })
        }
    }

    handleJump = i => e => {
        let suggested_jump = [...this.state.suggested_jump]

        if (i >= 0) {
            suggested_jump[i] = e.target.value
        } else {
            suggested_jump = e.target.value
        }
       this.setState({
            suggested_jump
        })
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
            suggested_answers: this.state.suggested_answers,
            is_mandatory: this.state.is_mandatory?.toString(),
            is_related: this.state.is_related?.toString(),
            suggested_jump: this.state.suggested_jump

        }
       
        try {
            const response = await AddQuestions(data, id);
            if (response.status === "failed") {
                this.setState({
                    error: response.response.question
                });
            } else {
                toast.info(`Question ${id ? "updated" : "added"}  successfully.`, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
                this.props.history.push('/admin/configure/questions');
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

    onRadioChange = async (e) => {
        const { name, value } = e.target;
        if (name === "category") {
            const response = await fetchQuestions(value);
            this.setState({
                [name]: value,
                relatedQuestions: response.response
            })
        } else {
            if (name === "is_mandatory" || name === "is_related") {
                this.setState({
                    [name]: value === "true" ? false : true
                })
            } else {

                this.setState({
                    [name]: value
                })
            }
        }
    }

    display = () => {
        const display = this.props.questionscategoryList.response &&
            this.props.questionscategoryList.response
                .map((data, id) =>
                    <><div key={id} className="form-check">

                        <input
                            className="form-check-input"
                            onChange={this.onRadioChange}
                            value={data.id}
                            type="radio" name="category"
                            checked={this.state.category == data.id}
                            required
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
                                        required
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
        const { relatedQuestions } = this.state;
        toast.configure();
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
                        <div className="col-sm-5">
                            <input type="text"
                                onChange={this.handleChange}
                                value={this.state.question}
                                name="question"
                                className="form-control " id="inputEmail3" required />
                        </div>
                    </div>
                    <fieldset className="form-group">
                        <div className="row">
                            <legend className="col-form-label col-sm-2 font-weight-bold">Answer type:</legend>
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
                                        disabled={id && this.state.question_type !== "CHECKBOX" ? true : false} required />
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
                                        disabled={id && this.state.question_type !== "RADIO" ? true : false} required />
                                    <label className="form-check-label" >
                                        Radio
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type" 
                                        type="radio"
                                        value="FILE"
                                        disabled={id && this.state.question_type !== "FILE" ? true : false}
                                        checked={this.state.question_type === "FILE"}
                                        required />
                                    <label className="form-check-label" >
                                        Upload File
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {this.state.question_type === "FILE" || this.state.question_type === "TEXT" || this.state.question_type === "" ? "" : this.state.suggested_answers.map((question, index) => (
                        <div key={index} className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold">Answer {index + 1}:{question.answer}</label>
                            <div className="col-sm-3">
                                <input
                                    type="text"
                                    onChange={this.handleText(index)}
                                    value={question}
                                    className="form-control" required
                                />
                                {index !== 0 && <div style={{
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
                                    onClick={this.handleDelete(index)} ><b>X</b></div>}
                                {this.state.question_type === "FILE" || this.state.question_type === "TEXT" ?
                                    "" : index === this.state.suggested_answers.length - 1 && <div
                                        style={{
                                            position: "absolute",
                                            top: "1px",
                                            right: "-30px",
                                            width: "25px",
                                            height: "25px",
                                            // fontSize: "24px",
                                            //borderRadius: "200px",
                                            // backgroundColor: "#000000",
                                            textAlign: "center",
                                            color: "#000000"
                                        }}
                                        className="font-text-bold text-center "
                                        onClick={this.addQuestion} >
                                        <i className="fa fa-plus" style={{ fontSize: "36px" }} ></i>
                                    </div>}

                            </div>

                            <>
                                <label className="col-sm-1 col-form-label font-weight-bold ml-5" >Jump to:</label>
                                <div className="col-sm-3"> 
                                    <select name="jumpto"
                                        className="form-control" id="exampleFormControlSelect1"
                                        data-name="suggested_jump"
                                        onChange={this.handleJump(index)}
                                    >
                                        <option value="">Select</option>
                                        {relatedQuestions.filter((sec, key) => sec.is_related === true).map((ques, i) => 
                                        <option key={i} value={ques.question} selected={ques.question === this.state.suggested_jump[index]}>
                                            {ques.question}</option>
                                        )}
                                    </select>
                                </div>
                            </>
                        </div>
                    ))}
                    {this.state.question_type === "TEXT" ?
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold" >Jump to:</label>
                            <div className="col-sm-3">
                                <select name="jumpto"
                                    className="form-control" id="exampleFormControlSelect1"
                                    data-name="suggested_jump"
                                    onChange={this.handleJump()}
                                >
                                    <option value="" >Select</option>
                                    {relatedQuestions.map((sec, key) => sec.is_related === true && <option key={key} value={sec.question} selected={sec.question === this.state.suggested_jump}>{sec.question}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        : ""}
                    <div className="form-check form-check">
                        <input type="checkbox"
                            className="form-check-input"
                            name="is_related"
                            value={this.state.is_related}
                            checked={this.state.is_related === true}
                            onChange={this.onRadioChange} />
                        <label className="form-check-label font-weight-bold">Related</label>

                    </div>
                    <div className="form-check form-check">
                        <input type="checkbox"
                            className="form-check-input"
                            name="is_mandatory"
                            value={this.state.is_mandatory}
                            checked={this.state.is_mandatory === true}
                            onChange={this.onRadioChange} />
                        <label className="form-check-label font-weight-bold">Mandatory</label>

                    </div>
                    <div className="form-group">
                        <div className="mb-3 mt-3">
                            <button type="submit" className="btn btn-primary btn-block font-weight-bold" >Submit</button>
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