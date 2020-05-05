import React from 'react';
import { fetchUsers, baseApiUrl } from '../api/api';
import axios from 'axios'
import { connect } from 'react-redux';
import '../App.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { store } from '../App'
export class UsersList extends React.Component {
    constructor() {
        super();
        this.state = {
            Users: [],
            userID:"",
            prompt: false
           
        }
    }

    async componentDidMount() {
      await fetchUsers();
       
        this.setState({
            Users: this.props.usersList,
        })
    }

    handleDelete = async (e) => { 
        e.preventDefault();
        let userID = this.state.userID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            userID = e.currentTarget.dataset.id;
        }
        const currentUser = store.getState().loginData.user.token;
          try {
              const response =  await axios.delete(`${baseApiUrl}/users/${userID}`,{
            headers : {
              'Authorization' : `Bearer ${currentUser}`
            }            
                    })
                    .then(response => {
                      
                      return response.data;
                  })
              
              if (response.status === "failed"){
                this.setState({
                    error:response.status
                });
            }else{
                this.setState({
                    error:""
                });
            }
            }
          catch (error) {
            console.log(error,'error')
         }
      }

      handleEdit = async (e) => { 
        e.preventDefault();
        let userID = this.state.userID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            userID = e.currentTarget.dataset.id;
        }
        this.setState({
              userID: userID,
              prompt:true
          })
          this.props.history.push(`/configure/edituser/edit=true&id=${userID}`);
      }

     async componentDidUpdate(){
        const  response = await fetchUsers();
        
      }
    render() {
        
        return (
            <div className="container-fluid">
            <div className="row p-2 bg-primary text-white">Users List</div>
            <div class="table-responsive ">
            <table className="table table-striped table-sm table-bordered mt-5 ">
                        <thead class="bg-info text-white text-center">
                          <tr>
                            <th scope="col mb-4">Name</th>
                            <th scope="col">Email ID</th>
                            <th scope="col">Role</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                    {this.props.usersList&&
                    this.props.usersList.map((ques, index) => (
                        
                          <tr>
                            <td>{ques.full_name}</td>
                            <td>{ques.email_id}</td>
                            <td>{ques.role_type}</td>
                            <td><a href="" data-id={ques.id} onClick={this.handleEdit}>Edit</a></td>
                            <td><a  href="" data-id={ques.id}  
                            onClick={e =>
                                window.confirm("Are you sure you wish to delete this item?") &&
                                this.handleDelete(e)
                            }>Delete</a></td>
                          </tr>
                    
                    
                    
                    ))}
                   
                </tbody>
                </table>
                </div>
                <div className="form-group row d-flex justify-content-center">
                        &nbsp;
                            </div>
            </div>
        );
        
    }
}
const mapStateToProps = state => {
    return {
        usersList: state.getusers.usersList,
    }
}
export default connect(mapStateToProps)(UsersList);