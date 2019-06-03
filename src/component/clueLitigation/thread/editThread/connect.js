import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import ThreadEdit from './index'
import { actionCreator,union } from '../../../../utils/util'
import { UPDATE_THREAD_LIST_SUCCESS, UPDATE_THREAD_LIST_ERROR, UPDATE_THREAD_CLASSIFICATION_SUCCESS, 
    GET_THREAD_DETAILS } from '../../../../contants/thread/threadTypes.js'
import { message } from 'antd'
import Api from '../../../../api/index'
function mapStateToProps(state, props) {
    const userInfo = state.loginReducer.userInfo || {}
    const { platfromList, threadTortTypeList, threadMainTag, threadMainBodyType, threadStatus=[], volunteerThreadStatus=[], cluesClassification=[], cluesValue = [] } = state.commonReducer;
    const { oldThreadList, newThreadList, queryThreadDetail } = state.threadReducer
    const threadList = union(oldThreadList, newThreadList)
    return {
        threadList,
        queryThreadDetail,
        userInfo,
        platfromList,
        threadTortTypeList,
        threadMainTag,
        threadMainBodyType,
        threadStatus,
        volunteerThreadStatus,
        cluesClassification,
        cluesValue
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //查询统计详情信息
        queryThreadDetails(data, callback) {
            Api.getQueryClueInfoById(data).then((res)=>{
                if(res.success){                    
                    let dataObject = res.dataObject
                    if(dataObject.fileUrl){
                        dataObject.fileUrl = JSON.parse(dataObject.fileUrl)
                    }
                    dispatch(actionCreator(GET_THREAD_DETAILS, { queryThreadDetail: dataObject }))
                    typeof callback === 'function' && callback(dataObject)
                }else{
                    message.error(res.msg)
                    dispatch(actionCreator(GET_THREAD_DETAILS, { queryThreadDetail: {}  }))
                }
            })
        },
        //线索审核
        clueAudit:(data,oldThreadList, callback) => {
            Api.clueAudit(data).then(res => {
                if(res.success) {
                    let newThreadList = [];
                    if (oldThreadList.length) {
                        for (let i = 0; i < oldThreadList.length; i++) {
                            let element = oldThreadList[i];
                            if (element.id == data.id) {
                                element.status = data.status;
                                element.statusName = data.statusName;
                                element.statusNameEn = data.statusNameEn;
                                if(data.reason) {
                                    element.sendReason = data.sendReason;
                                }
                                if(data.targetVolume) {
                                    element.targetVolume = data.targetVolume;
                                }
                                element.suitFlag = data.suitFlag
                                element.suitFlagName = data.suitFlagName
                                element.suitFlagNameEn = data.suitFlagNameEn
                                element.caseType = data.caseType
                                element.caseTypeName = data.caseTypeName
                                element.caseTypeNameEn = data.caseTypeNameEn          
                            }
                            newThreadList.push(element);
                        }
                    }
                    dispatch(actionCreator(UPDATE_THREAD_LIST_SUCCESS, { newThreadList }))
                    typeof callback === 'function' && callback()
                    props.history.goBack()
                } else {
                    message.error(res.msg)
                    dispatch(actionCreator(UPDATE_THREAD_LIST_ERROR, { oldThreadList }))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ThreadEdit))
