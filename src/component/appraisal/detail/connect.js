import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import AppraisalDetail from './index'
import { actionCreator } from '../../../utils/util'
import { GET_APPRAISAL_DETAIL_SUCCESS } from '../../../contants/appraisal/appraisalDetailTypes'
import Api from '../../../api/index'
function mapStateToProps(state, props) {
	let { appraisalDetailList } = state.appraisalDetailReducer
	const userInfo = state.loginReducer.userInfo;
	return {
		appraisalDetailList,
		userInfo
	}
}
function mapDispatchToProps(dispatch, props) {
	return {
		getAppraisalDetail: (data) => {
			Api.appraisalDetail(data).then(res => {
				if(res.success) {
					dispatch(actionCreator(GET_APPRAISAL_DETAIL_SUCCESS,{appraisalDetailList: res.dataObject || {}}))
				}
			})
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AppraisalDetail))