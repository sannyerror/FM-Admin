import React, { Component } from 'react';
import { checkDomain } from '../api/api';
import '../App.css'
export class FindDomain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: '',
            error: '',
            Canonical : window.location.host
        }
    }
    
    signin = async (e) => {
        e.preventDefault();
        const { domain } = this.state
        if (!domain) {
            return this.setState({
                error: "Please enter Domain name."
            })
        } else {
            try {
                const response = await checkDomain(domain);
                
                
                if (response.message !== "domain not verified") {
                    //console.log(domain,"response2")
                    //  const { domain } = response.data;
                    // this.setState({
                    //     domain: e.target.value
                        
                    // })
                    
                    const url = `http://3.7.135.210/${domain}`
                    
                window.location.replace(url)
                   
                } else {
                    this.setState({
                        error: "Domain not verified"
                    })
                }
                

            }
            catch (e) {
                this.setState({
                    error: "Invalid Domain entered."
                })
            }
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    render() {
         
        return (
            <div>
                <form>
                    <div className="text-center"><h2>Organization Login</h2></div>
                    <div className="text-center mb-4 mt-4">Please add your organization subdomain name.</div>

                    <div className="form-group row d-flex justify-content-center">
                    <label className="form-label text-md-right font-weight-bold">https://www.firstmatch.com/</label>
                    <div className="col-md-3">
                    
                            <input type="text" className="form-control" name="domain" onChange={this.handleChange}
                                value={this.state.domain} required />
                        </div>
                       
                        
                    </div>

                        {this.state.error && 
                         <div className="col text-center text-danger mb-3">
                         {this.state.error}
                     </div>
                      }
                        <div className="row d-flex justify-content-center">
                            <div className="col text-center mb-3">
                                <button className="button" onClick={this.signin} >Submit</button>
                            </div>
                        </div>
                    

                </form>
                
            </div>


        )
    }
}

export default FindDomain;

