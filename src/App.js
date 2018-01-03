import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
} from 'react-router-dom'

//引入组件
//后台管理界面
import Admin from './component/index/index'
import Admin_login from './component/login/login';
import Admin_Register from './component/register/register';
import Modify from './component/modifypassword/modifypassword';

class App extends Component {
    constructor(){
        super();
        this.state={
            auth:null,
        }
    }
    componentWillMount(){
        if(localStorage.Login){
            this.setState({auth:true})
        }else{
            this.setState({auth:false})
        }
    }
  render() {
    return (
        <Router>
            <div className="App">
                <Route path="/" exact component={Admin}/>
                <Route path="/" render={()=>(
                    <div>
                        {this.state.auth?(null):(<Redirect to="/login"/>)}
                    </div>
                )}/>
                <Route path="/login" exact component={Admin_login}/>
                <Route path="/register" exact component={Admin_Register}/>
                <Route path="/modify" exact component={Modify}/>
            </div>
        </Router>
    );
  }
}

export default App;
