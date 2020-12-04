import React from 'react';
import Modal from 'react-modal';
import { fetchQuestions, fetchQuestionsCategory, alterQuestions, baseApiUrl } from '../api/api';
import { connect } from 'react-redux';
import '../App.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from '../App'

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

export class QuestionsList extends React.Component {
    constructor() {
        super();
        this.state = {
            Questions: [],
            QuestionsCategory: [],
            Category: "",
            subCategory: "",
            subCategoryVal: "",
            listID: "",
            showPOPUP: false,
            list: [],
            btnAction: ""
        }
    }
    async componentDidMount() {
        const response = await fetchQuestionsCategory();
        this.setState({
            QuestionsCategory: response,
        })

    }

    handleShow = (e) => {

        this.setState({
            showPOPUP: true,
            btnAction: e.currentTarget.dataset.id
        })
    }

    handleClose = () => {
        this.setState({
            showPOPUP: false,
            btnAction: ""
        })
    }

    handleChange = async (e) => {
        const { name, value } = e.target;
        const subCat = this.state.QuestionsCategory.response &&
            this.state.QuestionsCategory.response.filter((data, idx) =>
                data.children.length > 0 ? data.id == value : null
            )

        this.setState({
            [name]: value,
            subCategory: subCat

        })

        const param = subCat[0] ? subCat[0].children ? subCat[0].children[0].id : "" : ""
        if (param) {
            const res = await fetchQuestions(param);
            this.setState({
                Questions: res,
            })
        } else {
            const response = await fetchQuestions(value);
            this.setState({
                Questions: response,
            })
        }

    }

    getList() {
        return (
            (localStorage.getItem("theList") &&
                JSON.parse(localStorage.getItem("theList"))) ||
            this.list
        );
    }
    saveList = (list) => {
        localStorage.setItem("theList", JSON.stringify(list));
    }

    handleSubChange = async (e) => {
        const { value } = e.target;
        const response = await fetchQuestions(value);
        this.setState({
            Questions: response,
            subCategoryVal: value
        })

    }

    handleEdit = async (e) => {
        e.preventDefault();
        let userID = this.state.userID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            userID = e.currentTarget.dataset.id;
        }
        this.setState({
            userID: userID,
            prompt: true
        })
        this.props.history.push(`/configure/question/edit=true&id=${userID}`);
    }

    handleDelete = async (e) => {
        let listID = this.state.listID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            listID = e.currentTarget.dataset.id;
        }
        const currentUser = store.getState().loginData.user.token;
        try {
            const response = await axios.delete(`${baseApiUrl}/questions/${listID}/`, {
                headers: {
                    'Authorization': `Bearer ${currentUser}`
                }
            });
            
            if (response.status === "failed") {
                this.setState({
                    error: response.status,
                    showPOPUP: false,
                    btnAction: ""
                });
            } else {
                const res = await fetchQuestions(this.state.subCategoryVal);
                this.setState({
                    Questions: res,
                    showPOPUP: false,
                    btnAction: ""
                })
                toast.info('Question deleted successfully.', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
            }
        }
        catch (error) {
            console.log(error, 'error')
        }
    }

    handleMove = async (e) => {
        e.preventDefault();
        const { srcI, desI, list } = this.state;
        if (desI) {

        }
        const src = list[srcI].id;
        const des = list[desI].id;
        list.splice(desI, 0, list.splice(srcI, 1)[0]);
        this.saveList(list);
        const res = await alterQuestions(src, des);
        this.setState({
            showPOPUP: false,
            btnAction: ""
        })

    }
    category = () => {
        const category = this.state.QuestionsCategory.response &&
            this.state.QuestionsCategory.response.map((data, idx) =>
                <option value={data.id}>{data.title}</option>
            )
        return category
    }
    subcategory = () => {
        const subcategory = this.state.subCategory &&
            this.state.subCategory.map((data, idx) =>
                data.children.map((t, i) => (i === 0 ?
                    (<option selected="selected" value={t.id}>{t.title}</option>)
                    : <option value={t.id}>{t.title}</option>))
            )
        return subcategory
    }
    render() {

        toast.configure()
        const list = this.state.Questions.response
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white"><span className="ml-4">Questions List</span></div>

                <div className="row">
                    <div className="form-group  col-3 ml-4">
                        <label className="font-weight-bold ml-4" >Select Category</label>
                        <select name="Category" className="form-control " id="exampleFormControlSelect1" onChange={this.handleChange}>
                            <option value="">Select...</option>
                            {this.category()}
                        </select>
                    </div>

                    {this.state.subCategory.length > 0 &&
                        <div className="form-group  col-3 ml-4">
                            <label className="font-weight-bold  ml-4" >Select Sub Category</label>
                            <select name="Category" className="form-control" id="exampleFormControlSelect1" onChange={this.handleSubChange} >
                                <option value="">Select...</option>
                                {this.subcategory()}
                            </select>
                        </div>
                    }
                </div>
                <div className="form-group ml-4">
                    {list && list.map((item, i) => (
                        <div key={i} className="row">
                            <div className="list-group-item col-10  mt-1 ">
                                {/* <DragHandle {...provided.dragHandleProps} /> */}
                                <span className="text-primary "> {item.question}</span>
                                <i style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "-35px",
                                    width: "auto",
                                    height: "49px",
                                    // border: "1px solid rgba(0,0,0,.125)",
                                    // backgroundColor: "#d9534f",
                                    borderRadius: "5px 5px",
                                    textAlign: "center",
                                    color: "red",
                                    fontSize: "24px"
                                }} className="text-center fa fa-trash"
                                    data-id={item.id}
                                    onClick={this.handleShow} ></i>
                                {this.state.Category !== "1" &&
                                    <i style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "-100px",
                                        width: "auto",
                                        height: "25px",
                                        //border: "1px solid rgba(0,0,0,.125)",
                                        curser: "pointer",
                                        // backgroundColor: "#5bc0de",
                                        borderRadius: "5px 5px",
                                        textAlign: "center",
                                        fontSize: "24px",
                                        color: "#000000"
                                    }} className="text-center fa fa-edit"
                                        data-id={item.id}
                                        onClick={this.handleEdit} >

                                    </i>
                                }
                            </div>

                        </div>
                    ))}

                </div>

                <Modal
                    isOpen={this.state.showPOPUP}
                    onRequestClose={this.handleClose}
                    style={customStyles}
                    contentLabel="Forgot Password"
                    ariaHideApp={false}
                >
                    <h4 className="text-primary">Are you sure to {this.state.btnAction ? "delete" : "move"} this question?</h4>
                    <div className="form-group row d-flex justify-content-center">

                    </div>
                    <div className="row ">
                        <div className="col-6 text-center ">
                            <button className="button-pop" data-id={this.state.btnAction} onClick={this.state.btnAction ? this.handleDelete : this.handleMove} >Yes</button>

                        </div>
                        <div className="col-6 text-center ">
                            <button className="button-pop" onClick={this.handleClose} >No</button>
                        </div>
                    </div>
                </Modal>


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