import React, { Component } from 'react';
import '../App.css';
import { rafQuestions, submitRAF, baseApiUrl } from '../api/api';
import { connect } from 'react-redux';
import axios from 'axios'
import Modal from 'react-modal';


class RAF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            file: null,
            loadrafquestions: [],
            customer: "",
            showPOPUP: false,
            btnAction:"",
            error:""
        }

    }

    async componentDidMount() {
        const { customer } = this.props.match.params;
        this.setState({ customer: customer })
        const response = await rafQuestions(customer);
        console.log(response,"rif")
        if(response&&response.message&&response.message==="form already submitted"){
            this.setState({
                error: "You have already submitted all data.",
            })
        }else{
            response.response.map(data=>data.questions.map(ques=>ques.customer_answers?ques.customer_answers.map(q=>this.setState({
                data: {
                    ...this.state.data,
                    [ques.id]: q.answer
                }
            })):"HH"))
            
        }
        this.setState({
            loadrafquestions: response,
        }) 
    }
    onChange = async (e) => {
        e.preventDefault()
        //this.setState({file:e.target.files[0]})

        let { name } = e.target;
        let file = e.target.files[0]
        let res = await this.uploadFile(file);

        this.setState({
            data: {
                ...this.state.data,
                [name]: res.data.response,
            }
        })

    }
    uploadFile = async (file) => {
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
        console.log(value,"value")
        this.setState({
            data: {
                ...this.state.data,
                [name]: value,
            }
        })
    }
    handleShow = (e) => {
        e.preventDefault();
        this.setState({
            showPOPUP: true,
            btnAction:e.currentTarget.dataset.id
        })
    }
    handleClose = () => {
        
        this.setState({
            showPOPUP: false,
            btnAction:""
        })
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        const {btnAction} = this.state
        console.log(btnAction,"value")
        const { data, customer } = this.state;
        const is_completely_filled = btnAction === "save" ? "false" : "true";
        console.log(is_completely_filled,"is_completely_filled")
        let newArray = [];
        for (let k in data) {
            newArray.push({ "id": parseInt(k), "answer": data[k] });
        }
        try {
           const res = await submitRAF(newArray, customer, is_completely_filled);
           console.log(res,"rifsubmit")
            this.props.history.push('/rafmsg');
        }
        catch (e) {
            console.log(e)
            this.setState({
                error: e,
                showPOPUP: false,
                    btnAction:""
            });
            return;
        }

    }

    display = () => {
        const display = this.state.loadrafquestions.response && this.state.loadrafquestions.response
            .map((data, id) =>
                <><div className="row p-2 mb-3 bg-primary text-white">{data.title}</div>
                    {data.questions.map((quest, idx) =>  
                        quest.question_type === 'TEXT' ?
                            <><div className="form-group">
                                <label key={idx} className="font-weight-bold">{quest.id - 6}. {quest.question}</label>
                                
                                    <input className="form-control col-10 ml-3" type='TEXT'
                                        name={quest.id} value={this.state.data[quest.id]} onChange={this.handleChange} /></div></>
                            : quest.question_type === 'RADIO' ? (
                            <fieldset class="form-group">
                                <legend class="col-form-label font-weight-bold pt-0">{quest.id - 6}. {quest.question}</legend>
                               {quest.suggested_answers.map((suggested, idy) =>
                                           <>
                                           <div className="form-check form-check-inline ml-4">
                                        <input type="radio"
                                            className="form-check-input"
                                            name={quest.id}
                                            value={this.state.data[quest.id]===suggested.answer?suggested.answer:suggested.answer==="yes"? "yes": "no"}
                                            checked={this.state.data[quest.id]===suggested.answer}
                                            onChange={this.handleCheckboxChange} />
                                        <label className="form-check-label">{suggested.answer}</label>
                                        </div>
                                   </>
                                )} </fieldset>) : quest.question_type === 'FILE' ?
                                    <><label key={idx} className="font-weight-bold">{quest.id - 6}. {quest.question}</label>
                                        <div className="form-group ml-4">
                                            <input type="file" name={quest.id}  />

                                        </div></>
                                    : quest.question_type === 'CHECKBOX' ? (
                                        <fieldset class="form-group">
                                            <legend class="col-form-label font-weight-bold pt-0">{quest.id - 6}. {quest.question}</legend>
                                           {quest.suggested_answers.map((suggested, idy) =>
                                                       <>
                                                       <div className="form-check form-check-inline ml-4">
                                                    <input type="checkbox"
                                                        className="form-check-input"
                                                        name={quest.id}
                                                        value={this.state.data[quest.id]===suggested.answer}
                                                        checked={this.state.data[quest.id]===suggested.answer}
                                                        onChange={this.handleCheckboxChange} />
                                                    <label className="form-check-label">{suggested.answer}</label>
                                                    </div>
                                               </>
                                            )} </fieldset>) : quest.question_type === 'SELECT' ? (
                                            <> <label className="font-weight-bold" >{quest.id - 6}. {quest.question}</label>
                                                <div className="form-group ml-4">
                                                    <select name={quest.id} className="form-control col-5" id="exampleFormControlSelect1" onChange={this.handleChange}>
                                                    <option value="">Select...</option>
                                                        {quest.suggested_answers.map((suggested, idy) =>
                                                            <option value={suggested.answer} selected={this.state.data[quest.id]===suggested.answer}>{suggested.answer}</option>
                                                        )}</select></div> </>) : '')}
                </>
            )
        return display
    }

    render() {
        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };
        console.log(this.state,"state")
        return (
            <div className="cotainer-fluid">
                
                <div className="text-center"><h2>Readiness Assessment FORM</h2></div>
                <div className="text-center col-sm">Thanks for your interest in being part of the FirstMatch initiative. Please fill in the assessment form below.</div>
                <div className="card-body">
                    {this.state.error ? this.state.error:(
                        <>
                       <form >
                       <fieldset className="form-group">
                           {this.display()}
                           <hr />
                           <div className="form-group row d-flex justify-content-center">
                               <div className="col-sm-3">
                                   &nbsp;
                           </div>
                               <div className="col-sm-6 d-flex justify-content-center">
                                   <button type="submit" className="btn btn-primary btn btn-block" data-id="submit" onClick={this.handleShow}>Submit</button>
                               </div>
                               <div className="col-sm-3  ">
                                   &nbsp;
                           </div>
                           </div>
                           
                           <div className="form-group row d-flex justify-content-center"></div>
                       </fieldset>
                       
                   </form>
                   <div style={{ position: "fixed", bottom: "50%", right: "5px" }}><button data-id="save" onClick={this.handleShow} className="btn btn-primary" >Save</button></div></>
                   
                    )}
                    <Modal
                    isOpen={this.state.showPOPUP}
                    //   onAfterOpen={afterOpenModal}
                    onRequestClose={this.handleClose}
                    style={customStyles}
                    contentLabel="Forgot Password"
                    ariaHideApp={false}
                >

                   <p className="text-center">
                       {this.state.btnAction ==="save" ? 
                       "Are you sure to save the data in midway? Once saved data can be accessible from same link until submit."
                       :
                       "Are you sure to submit the data ? Once submitted this link cannot be accessible."}
                       
                       </p>
                    
                        <div className="row ">
                        <div className="col text-center ">
                            <button className="button" data-id={this.state.btnAction} onClick={this.handleSubmit} >Yes</button>
                        </div>
                        <div className="col text-center ">
                            <button className="button" onClick={this.handleClose} >No</button>
                        </div>
                    </div>
                        
                   
                </Modal>
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

