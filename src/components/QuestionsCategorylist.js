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
                <><li key={id} className="list-group-item  mt-1 text-primary">{data.title}</li>
                   <ul>
                    {data.children.length >= 1 ? 
                        data.children.map((child, i) => <><li key={i} className="list-group-item  mr-3 ">{child.title}</li>
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
                   {this.display()}
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