import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Thread from './index'
import { actionCreator,union } from '../../../../utils/util'
import { GET_THREAD_LIST_SUCCESS } from '../../../../contants/thread/threadTypes.js'
import { message } from 'antd'
import Api from '../../../../api/index'
function mapStateToProps(state, props) {
    const userInfo = state.loginReducer.userInfo || {}
    const { oldThreadList, newThreadList, total, isFetch, pageNo, pageSize, searchData,  } = state.threadReducer
    const { permissionList=[], platfromList=[], threadStatus=[], lawyerBrand=[], cluesClassification=[] }=state.commonReducer
    const threadList = union(oldThreadList, newThreadList)
    // 属性 
    return {
		userInfo,
        threadList,
        total,
        isFetch,
        pageNo,
        pageSize,
        searchData,
        permissionList,
        threadStatus,
        platfromList,
        lawyerBrand,
        cluesClassification
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
        getThreadListData: (data,oldThreadList) => {
            dispatch(actionCreator(GET_THREAD_LIST_SUCCESS, { isFetch: true }))
            Api.getCluePage(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_THREAD_LIST_SUCCESS, { oldThreadList, newThreadList: res.result ? res.result : [], total: res.records, pageNo: data.pageNo, pageSize: data.pageSize, isFetch: false, searchData: data }))
                }else{
                    message.error(res.msg)
                }
            })
        }   
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Thread))
