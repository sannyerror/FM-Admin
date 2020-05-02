import React from 'react';
import { fetchEiflist } from '../api/api';
import { connect } from 'react-redux';
import '../App.css';
export class EIFList extends React.Component {
    constructor() {
        super();
        this.state = {
            eiflist: [],
            listID:"",
            listData:[]

        }
    }
    async componentDidMount() { 
        await fetchEiflist();
        this.setState({
            eiflist: this.props.EifList.response,
        })
        console.log(this.state.eiflist,"listdata1")
    }
    
    getDetails = (e) => {
        e.preventDefault();
        let listID = this.state.listID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            listID = e.currentTarget.dataset.id ;
          }
        //   const List = this.state.eiflist.filter(listdata => listdata.id == listID)
        const List = this.state.eiflist.filter(listdata => (console.log(listdata.id,listID,"list")))
        
          console.log(this.state.eiflist,"LL")
          this.setState({ listID: listID, listData:List });
          
    }
    render() {
           let listID = this.state.listID;
           console.log(this.state.eiflist,"listdata")
        //    if(listID !== "ddd"){
        //     return (
        //         <div className="container-fluid">
        //             <div className="row p-2 bg-primary text-white mb-1">EIF List Details</div>
        //             <ul className="list-group">
        //                 {this.state.listData.map(info => (    
        //                     info.questions.map(qinfo =>    (qinfo.answers.map(q =>           
        //                     (
        //                         <li className="list-group-item mb-1" onClick={this.getDetails}>
        //                             <span className="text-primary "> {qinfo.question}</span> <br />
        //                             <span className=" ">Q</span> - <span className="text-primary font-weight-bold">{q.answer}</span>
        //                         </li>))))) )}
        //             </ul>
        //             <div className="form-group row d-flex justify-content-center">
        //                 &nbsp;
        //                         </div>
        //         </div>
        //     );
        //    }
        //    else{
        //     return (
        //         <div className="container-fluid">
        //             <div className="row p-2 bg-primary text-white mb-1">EIF List</div> 
        //             <ul className="list-group">
        //                 {this.props.EifList.response && this.props.EifList.response.map((ques, index) =>
                        
        //                     (
        //                         <li className="list-group-item mb-1" data-id={ques.id} onClick={this.getDetails}>
        //                             <span className="text-primary ">{ques.org_name}</span> <br />
        //                             <span className=" ">Created On</span> - <span className="text-primary font-weight-bold">{ques.date_created}</span>
        //                         </li>))}
        //             </ul>
        //             <div className="form-group row mt-3 mb-3">
        //                         <div className="col-sm-1  ">
        //                             &nbsp;
        //                     </div>
        //                         <div className="col-sm-5 d-flex justify-content-center">
        //                             <button type="submit" className="btn btn-primary pr-5 pl-5" onClick={this.addQues}>Approve</button>
        //                         </div>
        //                         <div className="col-sm-5 d-flex justify-content-center">
        //                             <button type="submit" className="btn btn-secondary pr-5 pl-5" onClick={this.addQues}>Reject</button>
        //                         </div>
        //                         <div className="col-sm-1">
        //                             &nbsp;
        //                     </div>
        //                     </div>
        //                     <div className="m-0">
        //                 &nbsp;
        //                         </div>
        //         </div>
        //     );
        //    }
        return (
                    <div className="container-fluid">
                        <div className="row p-2 bg-primary text-white mb-1">EIF List Details</div> 
                        <ul className="list-group">
                            {this.props.EifList.response && this.props.EifList.response.map((ques, index) =>
                            
                                (
                                    <li className="list-group-item mb-1" data-id={ques.id} onClick={this.getDetails}>
                                        <span className="text-primary ">{ques.org_name}</span> <br />
                                        <span className=" ">Created On</span> - <span className="text-primary font-weight-bold">{ques.date_created}</span>
                                    </li>))}
                        </ul>
                        {/* <div className="form-group row mt-3 mb-3">
                                    <div className="col-sm-1  ">
                                        &nbsp;
                                </div>
                                    <div className="col-sm-5 d-flex justify-content-center">
                                        <button type="submit" className="btn btn-primary pr-5 pl-5" onClick={this.addQues}>Approve</button>
                                    </div>
                                    <div className="col-sm-5 d-flex justify-content-center">
                                        <button type="submit" className="btn btn-secondary pr-5 pl-5" onClick={this.addQues}>Reject</button>
                                    </div>
                                    <div className="col-sm-1">
                                        &nbsp;
                                </div>
                                </div> */}
                                <div className="m-0">
                            &nbsp;
                                    </div>
                    </div>
                );
        
    }
}
const mapStateToProps = state => {
    return {
        EifList: state.eiflist.EifList,
    }
}
export default connect(mapStateToProps)(EIFList);