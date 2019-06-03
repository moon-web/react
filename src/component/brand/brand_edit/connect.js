import { connect } from 'react-redux'
import BrandEdit from './index'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import Api from '../../../api/index'
import { actionCreator } from '../../../utils/util'
import { GET_BRAND_EDIT_DETAIL_SUCCESS } from '../../../contants/brand/brandListTypes'
function mapStateToProps(state, props) {
	const { brandMerchant, reportType, platfromList, prodList } = state.commonReducer;
	const { brandEditDetail } = state.brandEditReducer;
    const { newbrandListData } = state.brandListRedicer
	return {
		brandMerchant,
		reportType,
		platfromList,
		prodList,
		brandEditDetail,
		newbrandListData
	}
}
function mapDispatchToProps(dispatch, props) {
	return{
		
        //编辑按钮获取详情
        brandListEditDetail: (data) => {
            Api.brandListEditDetail(data).then(res => {
                if(res.success) {
					dispatch(actionCreator(GET_BRAND_EDIT_DETAIL_SUCCESS, { brandEditDetail: res.dataObject })) 
                } else {
					message.info(res.msg)
                }
            })
        },
        brandListEdit: (data) => {
			Api.brandListEdit(data).then(res => {
				if (res.success) {
                    props.history.goBack()
                }else {
                    message.info(res.msg)
                }
			})
		}
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(BrandEdit))