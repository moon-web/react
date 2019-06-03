import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import RewardDetails from './index'
import { actionCreator } from '../../../../utils/util'
import { GET_REWORDDETAILS_SUCCESS } from '../../../../contants/investigationreport/details/rewardDetailsTypes'
import Api from '../../../../api/index'
import { message } from 'antd'

function mapStateToProps(state, props) {
    const userInfo = state.loginReducer.userInfo || {}
    const { rewardDetails } = state.rewardDetailsReducer
    // 属性 
    return {
		userInfo,
        rewardDetails,
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //查询详情
        getRewardList: (data) => {
            Api.getReportAwardListDetail(data).then(res=>{
                if(res.success){
                    dispatch(actionCreator(GET_REWORDDETAILS_SUCCESS, { rewardDetails: res.dataObject}))
                }else{
                    message.error(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(RewardDetails))
