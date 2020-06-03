import React from 'react';
import Modal from 'react-modal';
import { fetchQuestions, fetchQuestionsCategory, alterQuestions, baseApiUrl } from '../api/api';
import { connect } from 'react-redux';
import '../App.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios'
import { store } from '../App'

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
        }
    }
    async componentDidMount() {
        const response = await fetchQuestionsCategory();
        this.setState({
            QuestionsCategory: response,
        })

    }

    handleShow = () => {

        this.setState({
            showPOPUP: true
        })
    }
    handleClose = () => {
        this.setState({
            showPOPUP: false
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
        const response = await fetchQuestions(value);
        this.setState({
            Questions: response,
        })

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
        const { name, value } = e.target;
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
            })
                .then(response => {
                    return response.data;
                })
            if (response.status === "failed") {
                this.setState({
                    error: response.status
                });
            } else {
                const res = await fetchQuestions(this.state.subCategoryVal);
                this.setState({
                    Questions: res,
                })

            }
        }
        catch (error) {
            console.log(error, 'error')
        }
    }

    Question = () => {
        const Question = this.state.Questions.response &&
            this.state.Questions.response.map((data, idx) =>
                <div className="row">
                    <div className="list-group-item col-10  mt-1 text-primary ">
                        {data.question}</div>
                    <div className="list-group-item col-1  ml-1 mt-1 text-primary text-center ">
                        <a data-id={data.id} onClick={this.handleDelete}>Delete</a></div>
                </div>
            )
        return Question
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
                data.children.map(t => <option value={t.id}>{t.title}</option>)
            )
        return subcategory
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
                            <select name="Category" className="form-control" id="exampleFormControlSelect1" onChange={this.handleSubChange}>
                                <option value="">Select...</option>
                                {this.subcategory()}
                            </select>
                        </div>
                    }
                </div>
                <DragDropContext
                    onDragEnd={async (param, props) => {
                        const srcI = param.source.index;
                        const desI = param.destination?.index;
                        if (desI) {
                            const src = list[srcI].id;
                            const des = list[desI].id;
                            list.splice(desI, 0, list.splice(srcI, 1)[0]);
                            await this.saveList(list);
                            await alterQuestions(src, des)
                        }
                    }}
                >
                    <div className="form-group ml-4">
                        <Droppable droppableId="droppable-1">
                            {(provided, _) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {list &&
                                        list.map((item, i) => (
                                            <div className="row">
                                                <Draggable
                                                    key={item.id}
                                                    draggableId={"draggable-" + item.id}
                                                    index={i}

                                                >
                                                    {(provided, snapshot) => (
                                                        <> <div className="list-group-item col-10  mt-1 "
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                boxShadow: snapshot.isDragging
                                                                    ? "0 0 .4rem #666"
                                                                    : "none",
                                                            }}
                                                        >
                                                            {/* <DragHandle {...provided.dragHandleProps} /> */}
                                                            <span className="text-primary ">{item.id}. {item.question}</span>
                                                            <div style={{
                                                                position: "absolute",
                                                                top: "10px",
                                                                right: "-60px",
                                                                width: "auto",
                                                                height: "49px",
                                                                border: "1px solid rgba(0,0,0,.125);",
                                                                // backgroundColor: "#d9534f",
                                                                borderRadius: "5px 5px",
                                                                textAlign: "center",
                                                                 color: "#0275d8",
                                                            }} className="text-center "
                                                                data-id={item.id}
                                                                onClick={this.handleShow} >Delete</div>
                                                            <div style={{
                                                                position: "absolute",
                                                                top: "10px",
                                                                right: "-100px",
                                                                width: "auto",
                                                                height: "25px",
                                                                border: "1px solid rgba(0,0,0,.125);",
                                                                curser: "pointer",
                                                                // backgroundColor: "#5bc0de",
                                                                borderRadius: "5px 5px",
                                                                textAlign: "center",
                                                                 color: "#0275d8"
                                                            }} className=" text-center "
                                                                data-id={item.id}
                                                                onClick={this.handleEdit} >
                                                               / Edit
                                                            </div>
                                                        </div>

                                                            {/* <div className="list-group-item col-1  mt-1 text-primary text-center ">Delete</div> */}
                                                        </>
                                                    )}

                                                </Draggable>

                                            </div>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}

                        </Droppable>

                    </div>
                </DragDropContext>
                <Modal
                    isOpen={this.state.showPOPUP}
                    //   onAfterOpen={afterOpenModal}
                    onRequestClose={this.handleClose}
                    style={customStyles}
                    contentLabel="Forgot Password"
                    ariaHideApp={false}
                >
                    <h4 className="text-primary">Are you sure to delete this Question?</h4>
                    <div className="form-group row d-flex justify-content-center">
                    
                            </div>
                    <div className="row ">
                        <div className="col-6 text-center ">
                            <button className="button" onClick={this.handleDelete} >Yes</button>
                        </div>
                        <div className="col-6 text-center ">
                            <button className="button btn-secondary" onClick={this.handleClose} >No</button>
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