import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import BrandList from './index'
import { actionCreator,union } from '../../../utils/util'
import { GET_BRAND_LISTDATA_SUCCESS } from '../../../contants/brand/brandListTypes'
import { GET_BRAND_LIST_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'
import { message } from 'antd'
function mapStateToProps(state, props) {
    const userInfo = state.loginReducer.userInfo || {}
    const { oldbrandListData, newbrandListData,total, isFetch, pageNo, pageSize } = state.brandListRedicer
    const { permissionList=[],brandMerchant=[] ,reportType=[]} =state.commonReducer
    const brandListData = union(oldbrandListData, newbrandListData)
    // 属性 
    return {
		userInfo,
        brandListData,
        total,
        isFetch,
        pageNo,
        pageSize,
        brandMerchant,
        permissionList,
        reportType
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
        getBrandListdata: (data,oldbrandListData) => {  
            dispatch(actionCreator(GET_BRAND_LISTDATA_SUCCESS, { isFetch: true }))
            Api.getBrandList(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_BRAND_LISTDATA_SUCCESS, { oldbrandListData,newbrandListData: res.result, total: res.records, pageNo: data.pageNo, pageSize: data.pageSize, isFetch: false }))
                }
            })
        },
        //新增品牌
        addBrand: (data,callback) => {
            Api.createBrandInfo(data).then(res => {
                if(res.success) {
                    callback()
                    message.success("新增成功")
                    Api.brandList().then(res => {
                        if (res.success) {
                            dispatch(actionCreator(GET_BRAND_LIST_SUCCESS, { brandList: res.dataObject }))
                        }
                    })
                }else {
                    message.info("新增失败")
                }
            })
        }       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BrandList))
