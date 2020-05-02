import React from 'react';
import { fetchQuestionsCategory } from '../api/api';
import { connect } from 'react-redux';
import '../App.css';
export class QuestionsCategorylist extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            Questions: [],
            showPopup: false
        }
    }
   
    async componentDidMount() {
        await fetchQuestionsCategory();
        this.setState({
            Questions: this.props.questionscategoryList,
        })
    }
    display = () => {
        const display = this.props.questionscategoryList.response && this.props.questionscategoryList.response
            .map((data, id) =>
                <><li className="list-group-item  mt-1 text-primary">{data.title}</li>
                   <ul>
                    {data.children.length >= 1 ?
                        data.children.map((child, i) => <><li className="list-group-item  mr-3 ">{child.title}</li>
                            </>) : ''

                    }
                    </ul>
                </>
            )
        return display
    }
    render() {
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white">Question Categories</div>
                <ul className="list-group">
                    {/* {this.props.questionscategoryList.response &&
                    this.props.questionscategoryList.response.map(ques => 
                    ( <><li className="list-group-item  mt-1">{ques.id} . {ques.title} </li>
                     
                     
                                </>
                     ))} */}
                     {this.display()}
                    {/* <ul className="list-group pr- pl-5">
                      <li className="p-2 bg-primary text-white list-group-item ">Question Sub Categories</li>
                     {this.props.questionscategoryList.response && this.props.questionscategoryList.response.map((info,r) => (    
                            info.children.map((q, i) =>             
                            (<> 
                                <li className="list-group-item mb-" onClick={this.getDetails}>
                                    <span className="text-primary ">{q.id} . {q.title}</span> <br />
                                    
                                </li>
                                </>))) )}
                     </ul> */}
                     
                    
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
        questionscategoryList: state.categoryList.questionscategoryList,
    }
}
export default connect(mapStateToProps)(QuestionsCategorylist);