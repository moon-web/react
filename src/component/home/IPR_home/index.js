//主页
import React, { Component } from 'react';
import { Card, Tooltip } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import Content from '../../common/layout/content/index'
// 饼图
import PieChart from './children/pieChart'
import './index.css'

class IPRHome extends Component {
    componentWillMount() {
        let { userInfo, getKeyArea, getKeyBrand, getKeyCategory, getKeyPlatform, getKeyTrots, getNetwork } = this.props;
        let data = { userId: userInfo.userId };
        getKeyArea(data)
        getKeyBrand(data)
        getKeyCategory(data)
        getKeyPlatform(data)
        getKeyTrots(data)
        getNetwork(data)
    }

    // 点击跳转
    handleClick() {
        this.props.history.push('/kanban')
    }

    //渲染dom
    render() {
        let { intl, keyArea, keyBrand, keyCategory, keyPlatform, keyTrots, network } = this.props;
        return (
            <Content className="ipr-home" id='index'>
                <div className='container-index'>
                    <Card title={intl.formatMessage({ id: "home.online.monitoring.management", defaultMessage: "网络管理", description: "网络管理" })}>
                        <div className='content' onClick={() => this.handleClick()}>
                            <div className='top'>
                                <div className="top_item">
                                    <div className="top_item_text">
                                        <div className="top_icon">

                                        </div>
                                        <div className="top_text">
                                            <FormattedMessage id="home.monitored.platforms" defaultMessage="监控平台(个)" description="监控平台(个)" />
                                        </div>
                                    </div>
                                    {
                                        network.mPlatformNum ? network.mPlatformNum.length > 12 ? (
                                            <Tooltip placement="topLeft" title={network.mPlatformNum}>
                                                <div className="top_item_num">
                                                {network.mPlatformNum}
                                                </div>
                                            </Tooltip>
                                        ):
                                        (
                                            <div className="top_item_num">
                                                {network.mPlatformNum}
                                            </div>
                                        ):''
                                    }
                                </div>
                                <div className="top_item">
                                    <div className="top_item_text">
                                        <div className="top_icon">

                                        </div>
                                        <div className="top_text">
                                            <FormattedMessage id="home.monitored.stores" defaultMessage="监控店铺(个)" description="监控店铺(个)" />
                                        </div>
                                    </div>
                                    {
                                        network.mStoreNum ? network.mStoreNum.length > 12 ? (
                                            <Tooltip placement="topLeft" title={network.mStoreNum}>
                                                <div className="top_item_num">
                                                {network.mStoreNum}
                                                </div>
                                            </Tooltip>
                                        ):
                                        (
                                            <div className="top_item_num">
                                                {network.mStoreNum}
                                            </div>
                                        ):''
                                    }
                                </div>
                                <div className="top_item">
                                    <div className="top_item_text">
                                        <div className="top_icon">

                                        </div>
                                        <div className="top_text">
                                            <FormattedMessage id="home.complaints.total.take.down.notices.submission" defaultMessage="投诉商品(个)" description="投诉商品(个)" />
                                        </div>
                                    </div>
                                    {
                                        network.lTotalNum ? network.lTotalNum.length > 12 ? (
                                            <Tooltip placement="topLeft" title={network.lTotalNum}>
                                                <div className="top_item_num">
                                                {network.lTotalNum}
                                                </div>
                                            </Tooltip>
                                        ):
                                        (
                                            <div className="top_item_num">
                                                {network.lTotalNum}
                                            </div>
                                        ):''
                                    }
                                </div>
                                <div className="top_item">
                                    <div className="top_item_text">
                                        <div className="top_icon">

                                        </div>
                                        <div className="top_text">
                                            <FormattedMessage id="home.complaints.deletion.rate" defaultMessage="删除率" description="删除率" />
                                        </div>
                                    </div>
                                    {
                                        network.lAccuracyRateStr ? network.lAccuracyRateStr.length > 12 ? (
                                            <Tooltip placement="topLeft" title={network.lAccuracyRateStr}>
                                                <div className="top_item_num">
                                                {network.lAccuracyRateStr}
                                                </div>
                                            </Tooltip>
                                        ):
                                        (
                                            <div className="top_item_num">
                                                {network.lAccuracyRateStr}
                                            </div>
                                        ):''
                                    }
                                </div>
                                <div className="top_item">
                                    <div className="top_item_text">
                                        <div className="top_icon">

                                        </div>
                                        <div className="top_text">
                                            <FormattedMessage id="home.total.goods.value" defaultMessage="停止侵害(元)" description="停止侵害(元)" />
                                        </div>
                                    </div>
                                    {
                                        network.stopEncroachValue ? network.stopEncroachValue.length > 12 ? (
                                            <Tooltip placement="topLeft" title={network.stopEncroachValue}>
                                                <div className="top_item_num">
                                                    ￥{network.stopEncroachValue}
                                                </div>
                                            </Tooltip>
                                        ):
                                        (
                                            <div className="top_item_num">
                                            ￥{network.stopEncroachValue}
                                            </div>
                                        ):''
                                    }
                                </div>
                            </div>
                            <div className='bottom'>
                                <div className='bottom_item border-right'>
                                    <div className='item_title'>
                                        <span>
                                            <FormattedMessage id="home.key.brands" defaultMessage="重点品牌" description="重点品牌" />
                                        </span>
                                    </div>
                                    <div className='item_bottom'>
                                        <div className='item_desc'>
                                            <div className='item_name'>
                                                <span>{intl.locale === 'zh' ? keyBrand.xAxis : keyBrand.xAxisEn}</span>
                                            </div>
                                            <div className='item_ratio'>
                                                <span>{keyBrand.yPercent}</span>
                                            </div>
                                        </div>
                                        <PieChart value={keyBrand.yRate} name={intl.locale === 'zh' ? keyBrand.xAxis : keyBrand.xAxisEn} title='brand' />
                                    </div>
                                </div>
                                <div className='bottom_item border-right'>
                                    <div className='item_title'>
                                        <span>
                                            <FormattedMessage id="home.key.platforms" defaultMessage="重点平台" description="重点平台" />
                                        </span>
                                    </div>
                                    <div className='item_bottom'>
                                        <div className='item_desc'>
                                            <div className='item_name'>
                                                <span>{intl.locale === 'zh' ? keyPlatform.xAxis : keyPlatform.xAxisEn}</span>
                                            </div>
                                            <div className='item_ratio'>
                                                <span>{keyPlatform.yPercent}</span>
                                            </div>
                                        </div>
                                        <PieChart value={keyPlatform.yRate} name={intl.locale === 'zh' ? keyPlatform.xAxis : keyPlatform.xAxisEn} title='platform' />
                                    </div>
                                </div>
                                <div className='bottom_item border-right'>
                                    <div className='item_title'>
                                        <span>
                                            <FormattedMessage id="home.key.provinces" defaultMessage="重点省份" description="重点省份" />
                                        </span>
                                    </div>
                                    <div className='item_bottom'>
                                        <div className='item_desc'>
                                            <div className='item_name'>
                                                <span>{intl.locale === 'zh' ? keyArea.xAxis : keyArea.xAxisEn}</span>
                                            </div>
                                            <div className='item_ratio'>
                                                <span>{keyArea.yPercent}</span>
                                            </div>
                                        </div>
                                        <PieChart value={keyArea.yRate} name={intl.locale === 'zh' ? keyArea.xAxis : keyArea.xAxisEn} title='area' />
                                    </div>
                                </div>
                                <div className='bottom_item border-right'>
                                    <div className='item_title'>
                                        <span>
                                            <FormattedMessage id="home.key.category" defaultMessage="重点类目" description="重点类目" />
                                        </span>
                                    </div>
                                    <div className='item_bottom'>
                                        <div className='item_desc'>
                                            <div className='item_name'>
                                                <span>{intl.locale === 'zh' ? keyCategory.xAxis : keyCategory.xAxisEn}</span>
                                            </div>
                                            <div className='item_ratio'>
                                                <span>{keyCategory.yPercent}</span>
                                            </div>
                                        </div>
                                        <PieChart value={keyCategory.yRate} name={intl.locale === 'zh' ? keyCategory.xAxis : keyCategory.xAxisEn} title='category' />
                                    </div>
                                </div>
                                <div className='bottom_item border-right'>
                                    <div className='item_title'>
                                        <span>
                                            <FormattedMessage id="home.key.type" defaultMessage="重点类型" description="重点类型" />
                                        </span>
                                    </div>
                                    <div className='item_bottom'>
                                        <div className='item_desc'>
                                            <div className='item_name'>
                                                <span>{intl.locale === 'zh' ? keyTrots.xAxis : keyTrots.xAxisEn}</span>
                                            </div>
                                            <div className='item_ratio'>
                                                <span>{keyTrots.yPercent}</span>
                                            </div>
                                        </div>
                                        <PieChart value={keyTrots.yRate} name={intl.locale === 'zh' ? keyTrots.xAxis : keyTrots.xAxisEn} title='torts' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="no-data" title={intl.formatMessage({ id: "router.case.management", defaultMessage: "案件管理", description: "案件管理" })}>
                        <div className='content'>
                            <div className='modal'>
                                <div className="modal-content">
                                    <div className="msg">
                                        <FormattedMessage id="home.the.function.is.not.available.yet.please.look.forward.to.it" defaultMessage="功能暂未开放，敬请期待！" description="功能暂未开放，敬请期待！" />
                                    </div>
                                    <div className="bkg">
                                        <img src={require('../../../assets/images/pic6.png')} alt="暂未开放" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="no-data" title={intl.formatMessage({ id: "home.litigation.management", defaultMessage: "诉讼管理", description: "诉讼管理" })}>
                        <div className='content'>
                            <div className='modal'>
                                <div className="modal-content">
                                    <div className="msg">
                                        <FormattedMessage id="home.the.function.is.not.available.yet.please.look.forward.to.it" defaultMessage="功能暂未开放，敬请期待！" description="功能暂未开放，敬请期待！" />
                                    </div>
                                    <div className="bkg">
                                        <img src={require('../../../assets/images/pic6.png')} alt="暂未开放" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="no-data" title={intl.formatMessage({ id: "home.licensees.information.management", defaultMessage: "经销商举报管理", description: "经销商举报管理" })}>
                        <div className='content'>
                            <div className='modal'>
                                <div className="modal-content">
                                    <div className="msg">
                                        <FormattedMessage id="home.the.function.is.not.available.yet.please.look.forward.to.it" defaultMessage="功能暂未开放，敬请期待！" description="功能暂未开放，敬请期待！" />
                                    </div>
                                    <div className="bkg">
                                        <img src={require('../../../assets/images/pic6.png')} alt="暂未开放" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="no-data" title={intl.formatMessage({ id: "home.online.sales.data", defaultMessage: "全网销售分布数据", description: "全网销售分布数据" })}>
                        <div className='content'>
                            <div className='modal'>
                                <div className="modal-content">
                                    <div className="msg">
                                        <FormattedMessage id="home.the.function.is.not.available.yet.please.look.forward.to.it" defaultMessage="功能暂未开放，敬请期待！" description="功能暂未开放，敬请期待！" />
                                    </div>
                                    <div className="bkg">
                                        <img src={require('../../../assets/images/pic6.png')} alt="暂未开放" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Content>
        )
    }
}
export default injectIntl(IPRHome);