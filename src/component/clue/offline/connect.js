import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import OffLine from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_OFF_LINE_SUCCESS, UPDATE_OFF_LINE_SUCCESS, UPDATE_OFF_LINE_ERROR } from '../../../contants/clue/offlineTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { isFetch, oldOffLineList, newOffLineList, pageNo, pageSize = 10, total } = state.offLineReducer;
    const offLineList = union(oldOffLineList, newOffLineList)
    const { brandList = [], reportKindListType = [], permissionList, offlineClueStatus } = state.commonReducer;
    const userInfo = state.loginReducer.userInfo || {};
    return {
        isFetch,
        offLineList,
        pageNo,
        pageSize,
        total,
        brandList,
        reportKindListType,
        permissionList,
        userInfo,
        offlineClueStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        // 获取列表
        getOffLineList: (oldOffLineList, data) => {
            dispatch(actionCreator(GET_OFF_LINE_SUCCESS, { isFetch: true }))
            Api.offLineClue(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_OFF_LINE_SUCCESS, { oldOffLineList, newOffLineList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records, isFetch: false }))
                }
            })
        },
        // 更新列表数据
        updateOffLineItem: (data, oldOffLineList, callback) => {
            Api.offLineClueExamin(data).then(res => {
                if (res.success) {
                    let newOffLineList = [];
                    for (let i = 0; i < oldOffLineList.length; i++) {
                        const element = oldOffLineList[i];
                        if (element.id === data.id) {
                            if (data.status) {
                                element.status = data.status
                                element.statusName = data.statusName
                                element.statusNameEn = data.statusNameEn
                            }
                        }
                        newOffLineList.push(element)
                    }
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(UPDATE_OFF_LINE_SUCCESS, { newOffLineList }))
                } else {
                    dispatch(actionCreator(UPDATE_OFF_LINE_ERROR, { oldOffLineList }))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OffLine))
