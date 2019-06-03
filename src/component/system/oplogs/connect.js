import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Oplogs from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_OPLOGS_LIST_SUCCESS, GET_OPLOGS_LIST_ERROR } from '../../../contants/system/oplogsTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { optlogTypeList, optlogResultTypeList } = state.commonReducer;
    const { isFetch, oldOplogsList, newOplogsList, pageNo, total } = state.oplogsReducer;
    const oplogsList = union(oldOplogsList, newOplogsList)
    return {
        isFetch,
        pageNo,
        total,
        oplogsList,
        optlogTypeList,
        optlogResultTypeList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getSystemList: (data, oldOplogsList) => {
            dispatch(actionCreator(GET_OPLOGS_LIST_SUCCESS, { isFetch: true }))
            Api.systemOplogsPage(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_OPLOGS_LIST_SUCCESS, { oldOplogsList, newOplogsList: res.result, pageNo: data.pageNo, total: res.records, isFetch: false }))
                } else {
                    dispatch(actionCreator(GET_OPLOGS_LIST_ERROR, { isFetch: false, oldOplogsList }))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Oplogs))
