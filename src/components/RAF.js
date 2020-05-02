import React, { Component } from 'react';
import '../App.css';
import { rafQuestions, submitRAF, baseApiUrl } from '../api/api';
import { connect } from 'react-redux';
import axios from 'axios'


class RAF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            file: null,
            loadrafquestions: [],
            customer:""
        }
        
    }
    
    async componentDidMount() {
        const { customer } = this.props.match.params;
        this.setState({customer:customer})
        await rafQuestions();
        this.setState({
            loadrafquestions: this.props.loadrafquestions,
        })
        
    }
     onChange = async(e) => {
        e.preventDefault() 
          //this.setState({file:e.target.files[0]})
          
          let {name}=e.target;
          let file =e.target.files[0]
          let res = await this.uploadFile(file);
          
          this.setState({
            data: {
                ...this.state.data,
           [name]: res.data.response,
            }
        })
        
      }
     uploadFile = async(file) =>{
        const formData = new FormData();

        formData.append('assets', file)

        return await axios.post(`${baseApiUrl}/assets`, formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            data: {
                ...this.state.data,
                [name]: value
            }
        })
    }

    handleCheckboxChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            data: {
                ...this.state.data,
                [name]: value,
            }
        })
    }

   handleSubmit = async (e) => {
        e.preventDefault();
        const { data,customer } = this.state;
        let newArray = [];
        for (let k in data) {
            newArray.push({ "id": parseInt(k), "answer": data[k] });
        }
        try {
            await submitRAF(newArray,customer);
            this.props.history.push('/rafmsg');
        }
        catch (e) {
            console.log(e)
            this.setState({
                error: e
            });
            return;
        }

    }

    display = () => {
        const display = this.props.loadrafquestions.response && this.props.loadrafquestions.response
            .map((data, id) =>
                <><div className="row p-2 mb-3 bg-primary text-white">{data.title}</div>
                    {data.questions.map((quest, idx) =>
                        quest.question_type === 'TEXT' ?
                            <><p key={idx}>{quest.question}</p>
                                <div className="form-group">
                                    <input className="form-control" id='questionText' type='TEXT'
                                        name={quest.id} value={this.state.name} onChange={this.handleChange} /></div></>
                            : quest.question_type === 'RADIO' ? quest.suggested_answers.map((suggested, idy) =>
                                <>{idy === 0 ? <p key={idy}>{quest.question}</p> : null}
                                    <div className="form-check form-check-inline">
                                        <input type="radio"
                                            className="form-check-input"
                                            name={quest.id}
                                            value={suggested.answer}
                                            onChange={this.handleCheckboxChange} />
                                        <label className="form-check-label">{suggested.answer}</label>
                                    </div>
                                </>) : quest.question_type === 'FILE' ?
                                    <><p key={idx}>{quest.question}</p>
                                        <div className="form-group">
                                            <input type="file" name={quest.id} onChange={this.onChange} />
                                            
                                        </div></>
                                    : quest.question_type === 'CHECKBOX' ? quest.suggested_answers.map((suggested, idy) =>
                                        <>{idy === 0 ? <p key={idy}>{quest.question}</p> : null}
                                            <div className="form-check form-check-inline">
                                                <input type="CHECKBOX"
                                                    className="form-check-input"
                                                    name={quest.id}
                                                    value={suggested.answer}
                                                    onChange={this.handleCheckboxChange} />
                                                <label className="form-check-label">{suggested.answer}</label>
                                            </div>
                                        </>) : quest.question_type === 'SELECT' ? quest.suggested_answers.map((suggested, idy) =>
                                            <>{idy === 0 ? <p key={idy}>{quest.question}</p> : null}
                                                <div className="form-group row">
                                                    <select name={quest.id} class="form-control" id="exampleFormControlSelect1">
                                                        <option value={suggested.answer}>{suggested.answer}</option>
                                                    </select>
                                                </div>
                                            </>) : '')} 
                </>
            )
        return display
    }

    render() {
        
        return (
            <div className="cotainer-fluid">
                <div className="text-center"><h2>Readiness Assessment FORM</h2></div>
                <div className="text-center col-sm">Thanks for your interest in being part of the FirstMatch initiative. Please fill in the assessment form below.</div>
                <div className="card-body">
                    <form action="" method="">
                        <fieldset className="form-group">
                            {this.display()}
                            <hr />
                            <div className="form-group row d-flex justify-content-center">
                                <div className="col-sm-3">
                                    &nbsp;
                            </div>
                                <div className="col-sm-6 d-flex justify-content-center">
                                    <button type="submit" className="btn btn-primary btn btn-block" onClick={this.handleSubmit}>Submit</button>
                                </div>
                                <div className="col-sm-3  ">
                                    &nbsp;
                            </div>
                            </div>
                            <div className="form-group row d-flex justify-content-center"></div>
                        </fieldset>
                    </form>
                </div>
            </div>

        )
    }
}


const mapStateToProps = state => {
    return {
        loadrafquestions: state.rafquestions.loadrafquestions,
    }
}
export default connect(mapStateToProps)(RAF);

