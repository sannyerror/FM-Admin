import React, { Component } from 'react';
import '../App.css';
import { rafQuestions, submitRAF, baseApiUrl } from '../api/api';
import { connect } from 'react-redux';
import axios from 'axios'
import Modal from 'react-modal';
import {  toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { BeatLoader } from 'react-spinners'


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
            error:"",
            prevJump:[]
        }

    }
    onUnload = e => { // the method that will be used for both add and remove event
        e.preventDefault();
        e.returnValue = '';
     }
    async componentDidMount() {
       const { customer } = this.props.match.params;
        this.setState({ customer: customer })
        this.setState({ loading: true })
        const response = await rafQuestions(customer);
        console.log(response)
        if(response && response.message && response.message==="form already submitted" || response.message === "invalid customer"){
            this.setState({
                loading: false, 
                error: "You have already submitted all data.", 
            })
        }else{
            response.response.map(data=>
                data.questions.map(ques=>
                    ques.customer_answers?ques.customer_answers.map
                    (q=>this.setState({
                data: {
                    ...this.state.data,
                    [ques.id]: q.answer
                }
            })):""))
            
        }
        this.setState({
            loadrafquestions: response,
            loading: false
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
        const type = e.target.dataset.type;
        if(type){
            const length = e.target.dataset.length;
            var optionElement = e.target.childNodes[e.target.selectedIndex]
            let id = optionElement.getAttribute('data-id');
            let jump = optionElement.getAttribute('data-jump');
            console.log(id,jump)
            const loadrafquestions = this.state.loadrafquestions.response;
       loadrafquestions[id].questions.map((ques,i)=> ques.question === jump ? (
            loadrafquestions[id].questions[i].is_related = "false"
            
        ):
          ques.question === this.state.prevJump[name] && (
          loadrafquestions[id].questions[i].is_related = "true")
        )
        this.setState({
            prevJump: {
                [name]: jump,
               },
        })
        }else{
            const jump = e.target.dataset.jump;
            const id = e.target.dataset.id;
            const loadrafquestions = this.state.loadrafquestions.response;
            loadrafquestions[id].questions.map((ques,i)=> ques.question === jump ? (
                 loadrafquestions[id].questions[i].is_related = "false"
                 
             ):
               ques.question === this.state.prevJump[name] && (
               loadrafquestions[id].questions[i].is_related = "true")
             )
             this.setState({
                prevJump: {
                    [name]: jump,
                   },
            })
        }
        
        this.setState({
            data: {
                ...this.state.data,
                [name]: value
            }
        })
    }

    handleCheckboxChange = (e) => {
        const { name, value } = e.target;
        const jump = e.target.dataset.jump;
        const id = e.target.dataset.id;
       console.log(jump,id)
       const loadrafquestions = this.state.loadrafquestions.response;
       loadrafquestions[id].questions.map((ques,i)=> ques.question === jump ? (
            loadrafquestions[id].questions[i].is_related = "false"
            
        ):
          ques.question === this.state.prevJump[name] && (
          loadrafquestions[id].questions[i].is_related = "true")
        )
       this.setState({
            prevJump: {
                [name]: jump,
               },
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
        const { data, customer } = this.state;
        const is_completely_filled = btnAction === "" ? "false" : "true";
        let newArray = [];
        for (let k in data) {
            newArray.push({ "id": parseInt(k), "answer": data[k] });
        }
        try {
          await submitRAF(newArray, customer, is_completely_filled);
           {is_completely_filled === "true" ? this.props.history.push('/rafmsg') :
           toast.info('Data saved successfully.', { position: toast.POSITION.TOP_CENTER,autoClose:1500 }) }
            
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
                <><div key={id} className="row p-2 mb-3 bg-primary text-white">{data.title}</div>
                    {data.questions.map((quest, idx) =>  
                     quest.is_related === "true" ? "" :  
                        quest.question_type === 'TEXT' ?
                            <><div key={idx} className="form-group">
                                <label className="font-weight-bold">{quest.question}</label>
                                
                                    <input className="form-control col-10 ml-3" type='TEXT'
                                    data-jump={quest.suggested_jump}
                                    data-id={id} 
                                    name={quest.id} value={this.state.data[quest.id]} onChange={this.handleChange} /></div></>
                            : quest.question_type === 'RADIO' ? (
                            <fieldset className="form-group">
                                <legend className="col-form-label font-weight-bold pt-0">{quest.question}</legend>
                               {quest.suggested_answers.map((suggested, idy) =>
                                           <>
                                           <div key={idy}  className="form-check form-check-inline ml-4">
                                        <input type="radio"
                                            className="form-check-input"
                                            name={quest.id}
                                            data-jump={quest.suggested_jump[idy]}
                                            data-id={id}
                                            // value={this.state.data[quest.id]===suggested?suggested:suggested==="yes"? "yes": "no"}
                                            value={suggested}
                                            checked={this.state.data[quest.id]===suggested}
                                            onChange={this.handleCheckboxChange} />
                                        <label className="form-check-label">{suggested}</label> 
                                        </div>
                                   </>
                                )} </fieldset>) : quest.question_type === 'FILE' ?
                                    <><label key={idx} className="font-weight-bold">{quest.question}</label>
                                        <div className="form-group ml-4">
                                            <input type="file" name={quest.id}  />

                                        </div></>
                                    : quest.question_type === 'CHECKBOX' ? (
                                        <fieldset className="form-group">
                                            <legend className="col-form-label font-weight-bold pt-0">{quest.question}</legend>
                                           {quest.suggested_answers.map((suggested, idy) =>
                                                       <>
                                                       <div key={idy} className="form-check form-check-inline ml-4">
                                                    <input type="checkbox"
                                                        className="form-check-input"
                                                        name={quest.id}
                                                        data-jump={quest.suggested_jump[idy]}
                                                        data-id={id}
                                                        value={this.state.data[quest.id]===suggested}
                                                        checked={this.state.data[quest.id]===suggested}
                                                        onChange={this.handleCheckboxChange} />
                                                    <label className="form-check-label">{suggested}</label>
                                                    </div>
                                               </>
                                            )} </fieldset>) : quest.question_type === 'SELECT' ? (
                                            <> <label className="font-weight-bold" >{quest.question}</label>
                                                <div className="form-group ml-4">
                                                    <select name={quest.id} data-type="select" className="form-control col-5" id="exampleFormControlSelect1" onChange={this.handleChange}>
                                                    <option value="">Select...</option>
                                                        {quest.suggested_answers.map((suggested, idy) =>
                                                            <option key={idy} 
                                                            data-jump={quest.suggested_jump[idy]}
                                                            data-id={id} 
                                                            value={suggested} 
                                                            selected={this.state.data[quest.id]===suggested}>{suggested}</option>
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
        toast.configure()
        const loading = this.state.loading
        console.log(this.state)
        return (
            <div className="cotainer-fluid">
                <div className="text-center"><h2>Readiness Assessment FORM</h2></div>
                <div className="text-center col-sm text-info">Thanks for your interest in being part of the FirstMatch initiative. Please fill in the assessment form below.</div>
                {loading?<div className="form-group mt-5 row d-flex justify-content-center"><span className="font-weight-bold h5">Loading</span><BeatLoader size={24} color='#0099CC' loading={loading}/><BeatLoader size={24} color='#0099CC' loading={loading}/></div> :""}
                <div className="card-body shadow-sm p-3 m-3 bg-white rounded">
                    {this.state.error ? <div className="col-sm-12 d-flex shadow-lg p-3 mb-5 bg-white rounded justify-content-center text-info font-weight-bold h2">
                    {this.state.error}
                               </div>:(
                        <>
                        {loading ? "":
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
                        
                    </form>}
                  {loading ? "":    
                   <div style={{ position: "fixed", bottom: "50%", right: "5px" }}><button onClick={this.handleSubmit} className="btn btn-info" >Save</button></div>} </>
                   
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
                   Are you sure to submit the data ? Once submitted this link cannot be accessible
                       
                       </p>
                    
                        <div className="row ">
                        <div className="col text-center ">
                            <button className="button-pop" data-id={this.state.btnAction} onClick={this.handleSubmit} >Yes</button>
                        </div>
                        <div className="col text-center ">
                            <button className="button-pop" onClick={this.handleClose} >No</button>
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

