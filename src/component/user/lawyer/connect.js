import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Lawyer from './index'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { GET_LAWYER_LIST_SUCCESS, UPDATE_LAWYER_LIST_SUCCESS, UPDATE_LAWYER_LIST_ERROR } from '../../../contants/users/lawyerListTypes.js'
import { message } from 'antd'

function mapStateToProps(state, props) {
    const { isFetch, oldLawyerList, newLawyerList, searchData, pageNo, pageSize, total } = state.lawyerListReducer;
    const { userInfo } = state.loginReducer
    const { permissionList, b2bUserStatus, lawyerRoleType } = state.commonReducer
    const lawyerList = union(oldLawyerList, newLawyerList)
    return {
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        lawyerList,
        userInfo,
        permissionList,
        b2bUserStatus,
        lawyerRoleType
    }
}
function mapDispatchToProps(dispatch, props) {
    return {
        getLawyerList: (oldList, data) => {
            dispatch(actionCreator(GET_LAWYER_LIST_SUCCESS, {isFetch: true}))
            Api.lawyerList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_LAWYER_LIST_SUCCESS, { oldLawyerList: oldList, newLawyerList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records, isFetch: false  }))
                } else {
                    dispatch(actionCreator(GET_LAWYER_LIST_SUCCESS, {newLawyerList: [], isFetch: false}))
                }
            })
        },
        getLawyerOn: (data, oldList) => {
            Api.lawyerOn(data).then(res => {
                if (res.success) {
                    let result = [];
                    for (let i = 0; i < oldList.length; i++) {
                        const element = oldList[i];
                        if (element.userId === data.userId) {
                            element.status = data.status
                            element.statusName =  data.statusName
                            element.statusNameEn =  data.statusNameEn
                        }
                        result.push(element)
                    }
                    dispatch(actionCreator(UPDATE_LAWYER_LIST_SUCCESS, {newLawyerList: result}))
                    message.info('用户状态更新成功')
                }else {
                    dispatch(actionCreator(UPDATE_LAWYER_LIST_ERROR, {oldLawyerList: oldList}))
                    message.info(res.msg)
                }
            })
        },
        getLawyerOff: (data, oldList) => {
            Api.lawyerOff(data).then(res => {
                if(res.success) {
                    let result = [];
                    for (let i = 0; i < oldList.length; i++) {
                        const element = oldList[i];
                        if (element.userId === data.userId) {  
                            element.status = data.status
                            element.statusName =  data.statusName
                            element.statusNameEn =  data.statusNameEn
                        }
                        result.push(element)
                    }
                    dispatch(actionCreator(UPDATE_LAWYER_LIST_SUCCESS, {newLawyerList: result}))
                    message.info('用户状态更新成功')
                }else {
                    dispatch(actionCreator(UPDATE_LAWYER_LIST_ERROR, {oldLawyerList: oldList}))
                    message.info(res.msg)
                }
            })
        },
        //用户新增
        getLlawyerAdd: (data, callback) => {
            Api.lawyerAdd(data).then(res => {
                if(res.success) {
                    message.info("新增成功")
                    typeof callback === 'function' && callback()
                }else {
                    message.info(res.msg)
                }
            })
        },

        
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Lawyer))