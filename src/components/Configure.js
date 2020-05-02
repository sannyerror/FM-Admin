import React from 'react';
import '../App.css';
class Configure extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        return (

            <div className="container-fluid">
                <form>
                    <div className="form-group d-flex flex-column bd-highlight mb-2">
                        <div className="row p-2 bg-primary text-white">Forms</div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3"><a href="/configure/questioncategorylist">Question Categories</a></div>
                            <div className="col col-2"><a href="/configure/questioncategory">Add</a></div>
                            {/* <div className="col col-2"><a href="">Edit</a></div> */}
                        </div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3"><a href="/configure/questions">Questions</a></div>
                            <div className="col col-2"><a href="/configure/addquestion">Add</a></div>
                            {/* <div className="col col-2"><a href="">Edit</a></div> */}
                        </div>
                        {/* <div className="row p-2 bg-primary text-white">Users</div> */}
                    </div>
                    <div className="form-group row d-flex justify-content-center">
                        &nbsp;
                            </div>
                </form>

            </div>

        );
    }
}

export default Configure;