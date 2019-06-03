import UploadFile from './index'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
function mapStateToProps(state,props) {
	const userInfo = state.loginReducer.userInfo || {};
	const { permissionList } = state.commonReducer;
	return {
		userInfo,
		permissionList
    }
}
function mapDispatchToProps(dispatch,props) {
	return {
		
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(UploadFile))