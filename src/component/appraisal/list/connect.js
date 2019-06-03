import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import AppraisalList from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_APPRAISAL_LIST_SUCCESS, UPDATE_APPRAISAL_LIST_SUCCESS, UPDATE_APPRAISAL_LIST_ERROR } from '../../../contants/appraisal/appraisalListTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { isFetch, oldAppraisalList, newAppraisalList, pageNo, pageSize = 10, total } = state.appraisalReducer;
    const appraisalList = union(oldAppraisalList, newAppraisalList)
    const { brandList = [], permissionList, appraisalLawStatus } = state.commonReducer;
    const userInfo = state.loginReducer.userInfo || {};
    return {
        isFetch,
        appraisalList,
        pageNo,
        pageSize,
        total,
        brandList,
        userInfo,
        permissionList,
        appraisalLawStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        // 获取列表
        getApprailList: (oldAppraisalList, data) => {
            dispatch(actionCreator(GET_APPRAISAL_LIST_SUCCESS, { isFetch: true }))
            Api.appraisalList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_APPRAISAL_LIST_SUCCESS, { oldAppraisalList, newAppraisalList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records, isFetch: false }))
                }
            })
        },
        // 更新列表数据
        updateApprailList: (data, oldAppraisalList, callback) => {
            Api.appraisalExamine(data).then(res => {
                if (res.success) {
                    let newAppraisalList = [];
                    for (let i = 0; i < oldAppraisalList.length; i++) {
                        const element = oldAppraisalList[i];
                        if (element.id === data.id) {
                            element.status = data.status;
                            element.statusName = data.statusName;
                            element.statusNameEn = data.statusNameEn;
                        }
                        newAppraisalList.push(element)
                    }
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(UPDATE_APPRAISAL_LIST_SUCCESS, { newAppraisalList }))
                } else {
                    dispatch(actionCreator(UPDATE_APPRAISAL_LIST_ERROR, { oldAppraisalList }))
                }
            })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AppraisalList))
