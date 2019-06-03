import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import VolunteerManage from './index'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { GET_VOLUNTEER_LIST_SUCCESS, UPDATE_VOLUNTEER_STATUS_SUCCESS, UPDATE_VOLUNTEER_STATUS_ERROR } from '../../../contants/users/volunteerListTypes'


function mapStateToProps(state, props) {
    const { isFetch, oldVolunteerList, newVolunteerList, searchData, pageNo, pageSize, total } = state.volunteerListReducer;
    const { userInfo } = state.loginReducer
    const { permissionList, b2bUserStatus, b2bUserType } = state.commonReducer
    const volunteerList = union(oldVolunteerList, newVolunteerList)
    return {
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        volunteerList,
        userInfo,
        permissionList,
        b2bUserStatus,
        b2bUserType
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getVolunteerList: (oldList, data) => {
            dispatch(actionCreator(GET_VOLUNTEER_LIST_SUCCESS, {isFetch: true}))
            Api.getVolunteerPage(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_VOLUNTEER_LIST_SUCCESS, { oldVolunteerList: oldList, newVolunteerList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records, isFetch: false  }))
                } else {
                    dispatch(actionCreator(GET_VOLUNTEER_LIST_SUCCESS, {newVolunteerList: [], isFetch: false}))
                }
            })
        },
        updateVolunteerItem: (data, oldList, callback) => {
            Api.changeStatusById(data).then(res => {
                if (res.success) {
                    let result = [];
                    for (let i = 0; i < oldList.length; i++) {
                        const element = oldList[i];
                        if (element.userId === data.makeUserId) {
                            element.status = data.status
                            element.statusName =  data.statusName
                            element.statusNameEn =  data.statusNameEn
                        }
                        result.push(element)
                    }
                    dispatch(actionCreator(UPDATE_VOLUNTEER_STATUS_SUCCESS, {newVolunteerList: result}))
                    message.info('用户状态更新成功')
                } else {
                    dispatch(actionCreator(UPDATE_VOLUNTEER_STATUS_ERROR, { oldVolunteerList: oldList }))
                    message.info('用户状态更新失败，请重试')
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(VolunteerManage))
