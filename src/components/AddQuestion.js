import React from 'react';
import '../App.css';
import { AddQuestions, fetchQuestionsCategory } from '../api/api';
import { connect } from 'react-redux';

class AddQuestion extends React.Component {
    constructor() {
        super();
        this.state = {
            question: "",
            question_type: "",
            category: "",
            free_text: "",
            suggested_answers: [""],
            error:""
        }
    }

    async componentDidMount() {
        await fetchQuestionsCategory();
        // this.setState({
        //     Questions: this.props.questionscategoryList,
        // })
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
        // const email = this.state.email
        // const { question,question_type,category,free_text,suggested_answers}= this.state
        const data = this.state
        try {
            const response = await AddQuestions(data);
            if (response.status === "failed"){
                this.setState({
                    error:response.message
                });
            }else{
                this.props.history.push('/configure/questions');
            }
            
        }
        catch (e) {
            this.setState({
                error: e
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
            this.setState({
                question_type: value
            })
        }
    }
       display = () => {
        const display = this.props.questionscategoryList.response && this.props.questionscategoryList.response
            .map((data, id) =>
                <><div className="form-check">
                <input
                    className="form-check-input"
                    onChange={this.onRadioChange}
                    value={data.id}
                    type="radio" name="category" />
                <label className="form-check-label" >
                    {data.title}
                </label>
            </div>
                   
                    {data.children.length >= 1 ?
                        data.children.map((child, i) => 
                        <div className="form-check form-check-inline mr-4 ml-4">
                        <input
                            className="form-check-input"
                            onChange={this.onRadioChange}
                            value={child.id}
                            type="radio" name="category" />
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
        return (
            <div className="container-fluid">
                <form className="">
                    <div className="row p-2 bg-primary text-white">Add New Question</div><br />
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
                                className="form-control " id="inputEmail3" placeholder="" />
                        </div>
                    </div>
                    <fieldset className="form-group">
                        <div className="row">
                            <legend className="col-form-label col-sm-2 font-weight-bold">Question Type:</legend>
                            <div className="col-sm-10">
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type" type="radio" id="gridCheck1" value="SELECT" />
                                    <label className="form-check-label" >
                                        Select
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type" type="radio" id="gridCheck1" value="CHECKBOX" />
                                    <label className="form-check-label" >
                                        Checkbox
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type" type="radio" id="gridCheck1" value="RADIO" />
                                    <label className="form-check-label" >
                                        Radio
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        onChange={this.onRadioChange}
                                        className="form-check-input" name="question_type" type="radio" id="gridCheck1" value="FILE" />
                                    <label className="form-check-label" >
                                        Upload File
                                    </label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    {this.state.question_type !== "FILE" ? this.state.suggested_answers.map((question, index) => (
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold">Answer {index + 1}:</label>
                            <div className="col-sm-9">
                                <input
                                    //onChange={this.handleChange}
                                    type="text"
                                    onChange={this.handleText(index)}
                                    value={question}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-sm-1">
                                <button className="badge badge-primary" onClick={this.handleDelete(index)}>x</button>
                            </div>
                        </div>
                        
                    )):""}
                    {this.state.question_type !== "FILE" ?
                    <div className="form-group row d-flex justify-content-center">
                        <div className="">
                            <button className="btn btn-primary" onClick={this.addQuestion}>Click here to Add Answers</button>
                        </div>
                    </div> : "" }
                    <div className="form-group row d-flex justify-content-center ">
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary" onClick={this.addQues}>Submit</button>
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