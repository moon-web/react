import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Home from './index'
import { actionCreator } from '../../../utils/util'
import { GET_HOME_COUNT_SUCCESS, GET_HOME_SUIT_CASE_COUNT_SUCCESS  } from '../../../contants/home/homeTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    const { noticeList, suitCaseCount } = state.homeReducer;
    const userInfo = state.loginReducer.userInfo;
    // 属性 
    return {
        noticeList,
        userInfo,
        suitCaseCount
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getNotice: (data) => {
            Api.queryNotice(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_HOME_COUNT_SUCCESS, { noticeList: res.result }))
                } else {
                    dispatch(actionCreator(GET_HOME_COUNT_SUCCESS, { noticeList: [] }))
                }
            })
        },
        getSuitCaseCount: (data) => {
            Api.getSuitCaseCount(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_HOME_SUIT_CASE_COUNT_SUCCESS, { suitCaseCount: res.dataObject.statusMap4Suit  }))
                } else {
                    dispatch(actionCreator(GET_HOME_SUIT_CASE_COUNT_SUCCESS, { suitCaseCount: {} }))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Home))
