/*
* @Author: pc
* @Date:   2017-12-13 10:29:36
* @Last Modified by:   pc
* @Last Modified time: 2017-12-13 10:31:51
*/
import React, { Component } from 'react';
import WechatIMG910 from '../../assets/images/WechatIMG910.pic'
class LoginFooter extends Component {
  render() {
    return (
    	<div className="footer logofooter">
    		<div className="backfoot"><div style={{width:'300px',margin:'0 auto', padding:'10px 0',display:'block',float:'left'}}>
			     <a target="_blank" href=" " style={{display:'inline-block',textDecoration:'none',height:'20px',lineHeight:'30px'}}>
			     < img src={WechatIMG910} style={{float:'left'}}/>
			     <p style={{float:'left',height:'20px',margin: '0px 0px 0px 5px', color:'#939393'}}>浙公网安备 33010402003410号</p ></ a>
			</div>
			<div className="address">浙ICP备17056416</div>
			</div>
    		
    	</div>
    );
  }
}

export default LoginFooter;