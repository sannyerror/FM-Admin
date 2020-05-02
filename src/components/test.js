import React from 'react'
import axios from 'axios';

class Test extends React.Component {

    UPLOAD_ENDPOINT = 'http://3.6.90.1:8005/assets';
    constructor(props) {
        super(props);
        this.state ={
          file:null
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
    }
    async onSubmit(e){
        e.preventDefault() 
        let res = await this.uploadFile(this.state.file);
        console.log(res,"ress");
        //console.log(this.state.file,"res");
    }
    async onChange(e) {
      e.preventDefault() 
        this.setState({file:e.target.files[0]})
        let file =e.target.files[0]
        let res = await this.uploadFile(file);
        console.log(res,"ress");
    }
    async uploadFile(file){
      console.log(file,"res");

        const formData = new FormData();
        
        formData.append('assets',file)
        
        return  await axios.post(this.UPLOAD_ENDPOINT, formData,{
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
      }
    
      render() {
        return (
          <form onSubmit={ this.onSubmit }>
            <h1> React File Upload Example</h1>
            <input type="file" onChange={ this.onChange } />
            <button type="submit">Upload File</button>
          </form>
       )
      }
        
}

export default Test;