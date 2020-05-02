import axios from 'axios'; 
import { baseApiUrl } from '../api/api';
import React,{Component} from 'react'; 

class Test extends Component { 
  state = { 
  
    // Initially, no file is selected 
    selectedFile: null
  }; 
   
  // On file select (from the pop up) 
  onFileChange = event => { 
   
    // Update the state 
    this.setState({ selectedFile: event.target.files[0] }); 
    let formData = new FormData();
    formData.append( 
      "assets", 
      fileInput.files[0], 
      this.state.selectedFile.name 
     ); 
  }; 
   
  // On file upload (click the upload button) 
  onFileUpload = () => { 
   
    // Create an object of formData 
    let formData = new FormData(); 
   let file = this.state.selectedFile
    // Update the formData object 
    formData.append( 
      "assets", 
      file, 
      this.state.selectedFile.name 
     ); 
     let options = {assets:formData}
    // Details of the uploaded file 
    console.log(file,"file"); 
   
    // Request made to the backend api 
    // Send formData object 
    // axios.post("api/uploadfile", formData); 
    const response = axios.post(`${baseApiUrl}/assets`,{
      options});
      console.log(response,'response')
  }; 
   
  // File content to be displayed after 
  // file upload is complete 
  fileData = () => { 
   
    if (this.state.selectedFile) { 
        
      return ( 
        <div> 
          <h2>File Details:</h2> 
          <p>File Name: {this.state.selectedFile.name}</p> 
          <p>File Type: {this.state.selectedFile.type}</p> 
          <p> 
            Last Modified:{" "} 
            {this.state.selectedFile.lastModifiedDate.toDateString()} 
          </p> 
        </div> 
      ); 
    } else { 
      return ( 
        <div> 
          <br /> 
          <h4>Choose before Pressing the Upload button</h4> 
        </div> 
      ); 
    } 
  }; 
   
  render() { 
   
    return ( 
      <div> 
          <h3>
            File Upload using React! 
          </h3> 
          <div> 
              <input type="file" onChange={this.onFileChange} /> 
              <button onClick={this.onFileUpload}> 
                Upload! 
              </button> 
          </div> 
        {this.fileData()} 
      </div> 
    ); 
  } 
} 

export default Test; 
