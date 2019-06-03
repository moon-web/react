import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import PermissionsManage from './index'
import { actionCreator } from '../../../utils/util'
import { GET_USER_ROLE_AUTH_TREE_SUCCESS } from '../../../contants/system/roleListTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    const userRoleAuthTree = state.roleListReducer.userRoleAuthTree;
    return {
        userRoleAuthTree
    }
}

function mapDispatchToProps(dispatch, props) {
    
    return {
        getUserAuthTree: (data) => {
            Api.roleAuthTree(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_USER_ROLE_AUTH_TREE_SUCCESS,  {userRoleAuthTree: res.dataObject}))
                } else {
                    dispatch(actionCreator(GET_USER_ROLE_AUTH_TREE_SUCCESS,  {userRoleAuthTree: []}))
                }
            })
        },
        updateRoleAuth: (data, callBack) => {
            Api.roleAuth(data).then(res => {
                typeof callBack === 'function' && callBack(res)
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PermissionsManage))
