import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import IPRHome from './index'
import { actionCreator } from '../../../utils/util'
import { GET_IPR_HOME_KEY_AREA_SUCCESS, GET_IPR_HOME_KEY_BRAND_SUCCESS, GET_IPR_HOME_KEY_CATEGORY_SUCCESS, GET_IPR_HOME_KEY_PLATFORM_SUCCESS, GET_IPR_HOME_KEY_TROTS_SUCCESS, GET_IPR_HOME_NETWORK_SUCCESS } from '../../../contants/home/homeTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { keyArea, keyBrand, keyCategory, keyPlatform, keyTrots, network } = state.homeReducer;
    const { userInfo } = state.loginReducer;
    return {
        keyArea,
        keyBrand,
        keyCategory,
        keyPlatform,
        keyTrots,
        network,
        userInfo
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getKeyArea: data => {
            Api.keyPointQueryRepordProdArea(data).then(res => {
                if(res.success && res.module.length) {
                    let result = res.module[0];
                    result.yRate = result.yRate * 100;
                    dispatch(actionCreator(GET_IPR_HOME_KEY_AREA_SUCCESS, {keyArea: result}))
                } else {
                    dispatch(actionCreator(GET_IPR_HOME_KEY_AREA_SUCCESS, {keyArea: {}}))
                }
            })
        },
        getKeyBrand: data => {
            Api.keyPointQueryBrand(data).then(res => {
                if(res.success && res.dataObject.length) {
                    let result = res.dataObject[0];
                    result.yRate = result.yRate * 100;
                    dispatch(actionCreator(GET_IPR_HOME_KEY_BRAND_SUCCESS, {keyBrand: result}))
                } else {
                    dispatch(actionCreator(GET_IPR_HOME_KEY_BRAND_SUCCESS, {keyBrand: {}}))
                }
            })
        },
        getKeyCategory: data => {
            Api.keyPointQueryProdCategory(data).then(res => {
                if(res.success && res.module.length) {
                    let result = res.module[0];
                    result.yRate = result.yRate * 100;
                    dispatch(actionCreator(GET_IPR_HOME_KEY_CATEGORY_SUCCESS, {keyCategory: result}))
                } else {
                    dispatch(actionCreator(GET_IPR_HOME_KEY_CATEGORY_SUCCESS, {keyCategory: {}}))
                }
            })
        },
        getKeyPlatform: data => {
            Api.keyPointQueryProdPlatform(data).then(res => {
                if(res.success && res.module.length) {
                    let result = res.module[0];
                    result.yRate = result.yRate * 100;
                    dispatch(actionCreator(GET_IPR_HOME_KEY_PLATFORM_SUCCESS, {keyPlatform: result}))
                } else {
                    dispatch(actionCreator(GET_IPR_HOME_KEY_PLATFORM_SUCCESS, {keyPlatform: {}}))
                }
            })
        },
        getKeyTrots: data => {
            Api.keyPointQueryProdTortsType(data).then(res => {
                if(res.success && res.module.length) {
                    let result = res.module[0];
                    result.yRate = result.yRate * 100;
                    dispatch(actionCreator(GET_IPR_HOME_KEY_TROTS_SUCCESS, {keyTrots: result}))
                } else {
                    dispatch(actionCreator(GET_IPR_HOME_KEY_TROTS_SUCCESS, {keyTrots: {}}))
                }
            })
        },
        getNetwork: data => {
            Api.queryReportMonitorLegalrights(data).then(res => {
                if(res.success && res.dataObject.length) {
                    dispatch(actionCreator(GET_IPR_HOME_NETWORK_SUCCESS, {network: res.dataObject[0]}))
                } else {
                    dispatch(actionCreator(GET_IPR_HOME_NETWORK_SUCCESS, {network: {}}))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(IPRHome))
