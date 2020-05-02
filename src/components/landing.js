import React, { Component } from 'react';
import NewHeader from './NewHeader';
import '../App.css'
export class Landing extends Component {
        render() {
        return (
            <>
            <NewHeader />
                 <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div style={{ marginBottom: "100px", alignItems: 'center' }}></div>
                                    <div className="row d-flex justify-content-center">
                                         <div className="col-md-xs-3">
                                                <a href="/configuration" type="button" className="btn btn-secondary btn-lg">Configuration</a>
                                                </div>
                                                <div className="col-md-xs-1">
                                                &nbsp;
                                                </div> 
                                                <div className="col-md-xs-3">
                                                <a href="/eiflist" type="button" className="btn btn-secondary btn-lg">EIF List</a>
                                                </div>
                                                <div className="col-md-xs-1">
                                                &nbsp;
                                                </div> 
                                                <div className="col-md-xs-3">
                                                <a href="/riflist" type="button" className="btn btn-secondary btn-lg">RIF List</a>
                                                </div>
                                             </div>
                                            <div className="row">&nbsp;</div>
                                </div>
                           </div>
                       </>
                      
        )
    }
}

export default Landing;

