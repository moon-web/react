import React, { Component } from 'react'
import { Row, Button, message } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import PictureModal from '../../../common/layout/modal/pictureModal'
import { getButtonPrem } from '../../../../utils/util'
import '../index.css'

class cleanlinessCalculation extends Component {
    constructor() {
        super()
        this.state = {
            fileList: [],
            showImg: '',
            visible: false,
            Cleanliness: 0,
            Num: 0
        }
    }

    componentDidMount() {
        let { queryBrandCleanDetail } = this.props;
        if (queryBrandCleanDetail) {
            this.setState({
                fileList: queryBrandCleanDetail && queryBrandCleanDetail.screenUrl && queryBrandCleanDetail.screenUrl.length ? this.formatUploadList(queryBrandCleanDetail.screenUrl) : []
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.queryBrandCleanDetail !== this.props.queryBrandCleanDetail) {
            let queryBrandCleanDetail = nextProps.queryBrandCleanDetail
            this.setState({
                fileList: queryBrandCleanDetail && queryBrandCleanDetail.screenUrl && queryBrandCleanDetail.screenUrl.length ? this.formatUploadList(queryBrandCleanDetail.screenUrl) : []
            })
        }
    }

    //格式化图片列表
    formatUploadList(str) {
        let temp = [];
        if (str !== '') {
            let result = str.split(',');
            if (result.length) {
                result = result.sort();
                for (let i = 0; i < result.length; i++) {
                    const element = result[i];
                    let obj = {
                        uid: Date.now() + i,
                        msgCode: element
                    }
                    temp.push(obj)
                }
            }
        }
        return temp;
    }

    //确定
    confirm() {
        let { cleanConfirm, crawlerDetailId } = this.props;
        if (cleanConfirm) {
            let data = {
                crawlerDetailId
            }
            cleanConfirm(data, ()=>{
                this.getBrandCleanAtaticsDetail()
                message.success('确认成功！')
            })
        }
    }

    //获取详情接口
    getBrandCleanAtaticsDetail() {
        let { queryBrandCrawleDetail, crawlerDetailId } = this.props;
        if (queryBrandCrawleDetail) {
            let data = {
                crawlerDetailId
            }
            queryBrandCrawleDetail(data)
        }
    }

    render() {
        let { fileList, showImg, visible } = this.state;
        let { intl, queryBrandCleanDetail, permissionList, tobeConfirmed } = this.props;
        return (
            <div className="search-form cleanlinss-caluculation">
                <div className="brand-edit-wrapper">
                    <div className="brand-edit-box">
                        <div className="edit-info-title">
                            <FormattedMessage id="brand.cleanliness.calculation" defaultMessage="品牌洁净度计算" description="品牌洁净度计算" />
                        </div>
                        <Row>
                            <div className="cleanliness-settlement-info">
                                <ul className="cleanliness-settlement-content">
                                    <li>
                                        <span className="label"><FormattedMessage id="global.platform" defaultMessage="平台" description="平台" /> :</span>
                                        <span className="input-content">{queryBrandCleanDetail && queryBrandCleanDetail.vBrandCrawlerDO ? intl.locale === 'zh' ? queryBrandCleanDetail.vBrandCrawlerDO.platformTypeName : queryBrandCleanDetail.vBrandCrawlerDO.platformTypeNameEn : ''}</span>
                                    </li>
                                    <li>
                                        <span className="label"><FormattedMessage id="home.brand" defaultMessage="品牌" description="品牌" /> :</span>
                                        <span className="input-content">{queryBrandCleanDetail && queryBrandCleanDetail.vBrandCrawlerDO ? queryBrandCleanDetail.vBrandCrawlerDO.brandName : ''}</span>
                                    </li>
                                </ul>
                                <ul className="cleanliness-settlement-content">
                                    <span className="label" style={{ marginRight: 10}}>
                                        <FormattedMessage id="brand.cleanliness.conditions" defaultMessage="洁净度条件" description="洁净度条件" /> :
                                    </span>
                                    <li>
                                        <span className="label"><FormattedMessage id="monitor.keyword" defaultMessage="关键字" description="关键字" /> :</span>
                                        <span className="input-content">{queryBrandCleanDetail && queryBrandCleanDetail.vBrandCrawlerDO ? queryBrandCleanDetail.vBrandCrawlerDO.keyword : ''}</span>
                                    </li>
                                    {
                                        queryBrandCleanDetail && queryBrandCleanDetail.vBrandCrawlerDO
                                            ? queryBrandCleanDetail.vBrandCrawlerDO.minPriceFormat
                                                ? (
                                                    <li>
                                                        <span className="label"><FormattedMessage id="global.crawler.filter.type.price" defaultMessage="价格" description="价格" /> :</span>
                                                        <span className="input-content">{queryBrandCleanDetail.vBrandCrawlerDO.minPriceFormat}</span> - <span className="input-content">{queryBrandCleanDetail.vBrandCrawlerDO.maxPriceFormat}</span>
                                                    </li>
                                                )
                                                : ''
                                            : ''
                                    }
                                    {
                                        queryBrandCleanDetail && queryBrandCleanDetail.vBrandCrawlerDO ? queryBrandCleanDetail.vBrandCrawlerDO.consignmentPlace ? (
                                            <li>
                                                <span className="label"><FormattedMessage id="global.crawler.filter.type.place.of.delivery" defaultMessage="发货地" description="发货地" /> :</span>
                                                <span className="input-content">{queryBrandCleanDetail && queryBrandCleanDetail.vBrandCrawlerDO ? queryBrandCleanDetail.vBrandCrawlerDO.consignmentPlace : ''}</span>
                                            </li>
                                        ) : '' : ''
                                    }
                                    {
                                        queryBrandCleanDetail && queryBrandCleanDetail.vBrandCrawlerDO ? queryBrandCleanDetail.vBrandCrawlerDO.maxPage ? (
                                            <li>
                                                <span className="label"><FormattedMessage id="monitor.query.range" defaultMessage="查询范围" description="查询范围" /> :</span>
                                                <span className="input-content">
                                                    <FormattedMessage id='brand.first.pages' defaultMessage={`前${10}页`} values={{ count: <b>{queryBrandCleanDetail ? queryBrandCleanDetail.vBrandCrawlerDO.maxPage : ''}</b> }} />
                                                </span>
                                            </li>
                                        ) : '' : ''
                                    }
                                    <li>
                                        <span className="label"><FormattedMessage id="monitor.sort.type" defaultMessage="排序类型" description="排序类型" /> :</span>
                                        <span className="input-content">{queryBrandCleanDetail && queryBrandCleanDetail.vBrandCrawlerDO && queryBrandCleanDetail.vBrandCrawlerDO ? intl.locale === 'zh' ? queryBrandCleanDetail.vBrandCrawlerDO.sortConditionName : queryBrandCleanDetail.vBrandCrawlerDO.sortConditionNameEn : ''}</span>
                                    </li>
                                </ul>
                                <ul className="cleanliness-settlement-content">
                                    <li>
                                        <span className="label"><FormattedMessage id="brand.monitoring.time" defaultMessage="监控时间" description="监控时间" /> :</span>
                                        <span className="input-content">{queryBrandCleanDetail && queryBrandCleanDetail.gmtCreate ? queryBrandCleanDetail.gmtCreate : ''}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="cleanliness-settlement-btn">
                                <div className="cleanliness">
                                    {
                                        queryBrandCleanDetail
                                            ? queryBrandCleanDetail.status === 1
                                                ? <FormattedMessage id='brand.data.pull.in' defaultMessage='数据拉取中...' />
                                                :  queryBrandCleanDetail.status === 2 && tobeConfirmed !== 0 
                                                    ? <FormattedMessage id='brand.data.in.processing' defaultMessage='处理中...' />
                                                    : queryBrandCleanDetail.status === 3 
                                                    ? <span className="cleanliness-num">
                                                        {queryBrandCleanDetail.cleanPercent}
                                                    </span> : ''
                                            : ''
                                    }
                                    {
                                        getButtonPrem(permissionList, '0020050010')
                                            ? <div>
                                                {
                                                    queryBrandCleanDetail && queryBrandCleanDetail.status === 2 && tobeConfirmed === 0 ? (
                                                        <Button type="primary" className="cleanliness-submit" onClick={() => this.confirm()}>
                                                            <FormattedMessage id="golbal.confirm" defaultMessage="确认" description="确认" />
                                                        </Button>
                                                    ) : ''
                                                }
                                            </div>
                                            : ''
                                    }
                                </div>
                            </div>
                        </Row>
                    </div>
                    <div className="brand-edit-box">
                        <div className="edit-info-title">
                            <FormattedMessage id="clue.online.page.screenshot" defaultMessage="页面截图" description="页面截图" />
                            <span style={{ fontSize: '10px', marginLeft: '4px' }}>
                                (
                                    <FormattedMessage id='brand.a.total.of.data' defaultMessage={`共（${10}）张`} values={{ count: <b>{fileList && fileList.length ? fileList.length : 0}</b> }} />
                                )
                            </span>
                        </div>
                        <ul className="fileList-wrapper">
                            {
                                fileList && fileList.length ? fileList.map((itme, key) => (
                                    <li key={itme.uid} className="fileList-img" onClick={(file) => this.setState({ visible: true, showImg: itme.msgCode.replace(/_/, '') })}>
                                        <img src={itme.msgCode} alt="" />
                                    </li>
                                )) : <FormattedMessage id="brand.no.page.screenshots.yet" defaultMessage="暂无页面截图" description="暂无页面截图" />
                            }
                        </ul>
                    </div>
                </div>
                <PictureModal
                    showImg={showImg}
                    visible={visible}
                    onCancel={() => this.setState({ visible: false, showImg: '' })}
                    pictureModalwidth={'80%'}
                />
            </div>
        )
    }
}

export default injectIntl(cleanlinessCalculation)