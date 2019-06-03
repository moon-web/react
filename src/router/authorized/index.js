import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

export default class AuthorizedRouter extends Component {
    constructor(props) {
        super(props);
        this.loginState = null;
    }

    componentWillMount() {
        this.loginState = localStorage.getItem("Login");
        let userId = localStorage.getItem('userId');
        let userType = localStorage.getItem('type');
        let language = localStorage.getItem('lan')
        if (userId) {
            this.props.getPermissionList(userId)
            this.props.getSysDictList('')
            this.props.getBrandList()
            this.props.getProdList(userId)
            this.props.getFilterList(userId)
            this.props.getUserInfo({userId,userType})
            this.props.changeLanguage(language)
            this.props.getOwnedBrandListData()
            this.props.getLawyerBrand()
            this.props.getLawyerType()
        } 
        let that=this
        setInterval(function(){
            let { judgingVersionNumber } = that.props
            let data={
                type:1
            }
            judgingVersionNumber(data)
        },1000*60*60)
    }

    render() {
        const { component: Component } = this.props;
        return (
            <Route render={props => {
                if (this.loginState) {
                    return <Component {...this.props} />
                } else {
                    return <Redirect from={props.match.path} to="/login" />
                }
            }} />
        )
    }
}
