import React from 'react';
import '../App.css';
import { AddQuestionsCategory, fetchQuestionsCategory } from '../api/api';
class AddQuestionCategory extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            description: "",
            isUpdated: false,
            category_type: "",
            Category_list: [],
            CheckedSub: false,
            parent: "",
            error: ""
        }
    }
    addCategory = async (e) => {
        e.preventDefault();
        const { title, description, parent } = this.state;
        const data = {
            title: title,
            description: description,
            parent: parent
        }
        try {
            const response = await AddQuestionsCategory(data);
            if (response.status === "failed") {
                this.setState({
                    error: response.title ? response.title : "Please select sub category."
                });
            } else {
                this.setState({ isUpdated: true })
            }

        }
        catch (e) {
            this.setState({
                error: e.data.title
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
    addAnother = (e) => {
        this.setState({ title: "", description: "", isUpdated: false })
    }

    onRadioChange = async (e) => {
        const { name, value } = e.target;
        if (value === "sub") {
            const response = await fetchQuestionsCategory();
            this.setState({
                Category_list: response,
                CheckedSub: true
            })
        } else {
            this.setState({
                CheckedSub: false
            })
        }
    }

    categoryList = () => {
        const categoryList = this.state.Category_list.response &&
            this.state.Category_list.response.map((data, idx) =>
                <option value={data.id}>{data.title}</option>
            )
        return categoryList
    }

    render() {
        const { CheckedSub, Category_list } = this.state;
        return (

            <div className="container-fluid">
                <form >
                    <div className="form-group d-flex flex-column bd-highlight mb-2">
                        <div className="row p-2 bg-primary text-white mb-3">Add Question Categories</div>
                        {this.state.error &&
                            <div className="form-group row d-flex justify-content-center  text-danger mb-3 font-weight-bold">
                                {this.state.error}<br/>
                            </div>
                        }
                        <div className="row p-2 bd-highlight align">
                            <div className="form-check col col-1 form-check-inline"></div>
                            <div className="form-check col col-3 form-check-inline">
                                <input
                                    onChange={this.onRadioChange}
                                    className="form-check-input" name="category_type"
                                    type="radio" id="gridCheck1" value="cat"
                                    checked={CheckedSub ? "" : true}
                                />
                                <label className="form-check-label" >
                                    Category
                                    </label>
                            </div>
                            <div className="form-check col col-3 form-check-inline">
                                <input
                                    onChange={this.onRadioChange}
                                    className="form-check-input" name="category_type"
                                    type="radio" id="gridCheck1" value="sub"
                                    checked={CheckedSub ? true : ""}
                                />
                                <label className="form-check-label" >
                                    Sub Category
                                    </label>
                            </div>
                        </div>
                        
                        {this.state.CheckedSub &&
                            <div className="row p-2 bd-highlight align">
                               <div className="form-group  col-2 ">
                                    <label className="font-weight-bold  " >Select Category</label>
                                </div>
                                <div className="form-group  col-3 ">
                                    <select name="parent" className="form-control" id="exampleFormControlSelect1" onChange={this.handleChange} required>
                                        <option value="">Select...</option>
                                        {this.categoryList()}
                                    </select>
                                </div>
                            </div>
                        }
                        
                        <div className="row p-2 bd-highlight align">
                            <div className="col col-2">
                                <label for="inputEmail3" className="form-label font-weight-bold ">
                                    Question Category:</label>
                            </div>
                            <div className="col col-4 form-group row">

                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.title}
                                    name="title"
                                    className="form-control "
                                    id="inputEmail3" placeholder="" />
                            </div>


                            {this.state.isUpdated ?
                                (<><div className="col col-1"> <span className="text-primary">Saved!{this.state.isUpdated}</span></div>
                                    <div className="col col-2"><button type="button" className="btn btn-primary" onClick={this.addAnother}>Add Another</button></div>
                                </>) :
                                (<div className="col col-1"><button className="btn btn-primary" onClick={this.addCategory}>Save{this.state.isUpdated}</button></div>)}


                        </div>

                    </div>
                    <div className="form-group row d-flex justify-content-center">
                        &nbsp;
                            </div>
                </form>

            </div>

        );
    }
}

export default AddQuestionCategory;