import React, { Component } from 'react';
import Mapjindu from '../../../../assets/images/CombinedShape.png'
var width
export default class MapHead extends Component{
    constructor(props) {
        super(props);
        this.state={
            width:NaN,
            num:0,
            jinum:0
        }
    }
    componentDidMount(){
        width=this.refs.Map_wapper.clientWidth
        this.setState({
            width:width,
            num:this.props.data,
            jinum:this.props.jinum
        })
    }

    render(){
        let left=(this.props.data/this.state.jinum*100)
        if(left>100){
            left=100
        }
        return(
            <div className="Map">
                <div className="Map_jindu" id="Maps" >
                    <div className="Map_wapper"  ref="Map_wapper" style={{left:`${left}%`}}>
                        <span className="title">{this.props.data}</span>
                        <img src={Mapjindu} alt="" className="img" />
                    </div>
                </div>
            </div>
        )
    }
}