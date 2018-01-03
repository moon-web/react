import React, { Component } from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import Head from '../../component/common/head/head';
class Admin extends React.Component {
    constructor() {
        super();
        this.state={
            key:""
        }
        this.submit = this.submit.bind(this)
    }
    submit(val){
        this.setState({
            key:val
        })
    }
    render(){
        return(
            <div id="Admin">
                <div className="homepage" style={{marginBottom:'10px',minHeight:'900px'}}>
                    <Head hanlSubmit={this.submit.bind(this)}/>
                </div>
            </div>
        )
    }
}

export default Admin;

