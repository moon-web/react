import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import VersionNumber from './index'
import { actionCreator ,union, getFormatDate } from '../../../utils/util'
import { GET_VERSION_LIST_SUCCESS ,UPDATE_VERSION_LIST_SUCCESS,UPDATE_VERSION_LIST_ERROR} from '../../../contants/system/versionTypes'
import Api from '../../../api/index'
import { message } from 'antd';

function mapStateToProps(state, props) {
    // 属性 
    const { isFetch, oldVersionList, newVersionList, searchData, } = state.versionReducer;
    const versionList = union(oldVersionList, newVersionList)
    const {  brandList, versionType, permissionList } = state.commonReducer;
    return {
        versionList,
        isFetch,
        searchData,
        brandList,
        versionType,
        permissionList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getVersionList:(data,oldVersionList,callback) =>{
            dispatch(actionCreator(GET_VERSION_LIST_SUCCESS, { isFetch: true }))
            Api.versionList(data).then(res => {
                dispatch(actionCreator(GET_VERSION_LIST_SUCCESS, { oldVersionList, newVersionList: res.dataObject || [], isFetch: false }))
                typeof callback === 'function' && callback()
            })
        },
        modifyVersion:(data,oldVersionList,callback) =>{
            Api.modifyVersion(data).then((res)=>{
                if(res.success){
                    let newVersionList = [];
                    let newDate = new Date();
                    let dateTime = getFormatDate('yyyy-MM-dd hh:mm:ss',newDate)
					for(let i = 0; i < oldVersionList.length; i ++){
                        const element = oldVersionList[i]
						if(element.id === data.id){
                            element.versionStr = data.versionStr
                            element.gmtModify = dateTime
						}
						newVersionList.push(element)
                    }
                    typeof callback === 'function' && callback()
					dispatch(actionCreator(UPDATE_VERSION_LIST_SUCCESS, { newVersionList }))
                }else{
                    message.error(res.msg)
                    dispatch(actionCreator(UPDATE_VERSION_LIST_ERROR, { oldVersionList }))
                }
            })
        }
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(VersionNumber))
