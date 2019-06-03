import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Row, Col, Button, Alert, Tooltip, message, Badge } from 'antd'
import { getButtonPrem, queryUrlParams, getName, getFormatDate } from '../../../utils/util'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import DistributionModal from './children/distributionModal'
import SearchForm from './children/searchForm'
import CleanlinessCalculation from './children/cleanlinessCalculation'
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
import PictureModal from '../../common/layout/modal/pictureModal'

const xin = require('../../../assets/images/xin.gif');
const zuan = require('../../../assets/images/zuan.gif');
const guan = require('../../../assets/images/guan.gif');
const hg = require('../../../assets/images/huanguan.gif');

export default class CleanStatistics extends Component {
    constructor() {
        super()
        this.state = {
            visibleDistribution: false,
            crawlerId: '',
            pageSize: 10,
            searchData: {},
            editType:'',
            auditId:'',
            crawlerDetailId:'',
            visibleExcelExport: false,  // 自定义导出数据的弹窗控制
            autoTitleParam: [],  //  自定义数据
            autoPageNum: 100,  // 自定义数据量
            tbName: '品牌洁净度计算-'+getFormatDate('yyyy-MM-dd-hh:mm')
        }
    }

    componentWillMount() {
        let crawlerId = queryUrlParams('crawlerId');
        let crawlerDetailId = queryUrlParams('id');
        let { cleanStatisticsList, history, searchData } = this.props;
        if (!cleanStatisticsList.length || (cleanStatisticsList.length && history.action !== 'POP' && !history.location.query)) {
            this.setState({
                crawlerId,
                crawlerDetailId
            },()=>{
                this.getCleanStatisticsList([], 1)
                this.getBrandCleanAtaticsDetail()
            })
        }else{
            this.setState({
                crawlerId,
                searchData,
                crawlerDetailId
            })
        }
        if (this.props.getExportExcelTitle) {
            this.props.getExportExcelTitle({excelType: 13})
        }
    }

    //获取界面详情数据
    getBrandCleanAtaticsDetail() {
        let { queryBrandCrawleDetail } = this.props;
        let { crawlerDetailId } = this.state;
        if(queryBrandCrawleDetail){
            let data={
                crawlerDetailId
            }
            queryBrandCrawleDetail(data)
        }
    }

    //获取列表
    getCleanStatisticsList(oldList, pageNo) {
        let { getCleanStatisticsList } = this.props;
        let { searchData, pageSize, crawlerDetailId } = this.state;
        let data = Object.assign({}, searchData);
        data.crawlerDetailId = crawlerDetailId;
        data.pageNo = pageNo;
        data.pageSize = pageSize;
        if (getCleanStatisticsList) {
            getCleanStatisticsList(data, oldList)
            this.getCountCleanConfirm(crawlerDetailId)
        }
    }

    //获取待确认已确认count
    getCountCleanConfirm(crawlerDetailId){
        let { countCleanConfirm } = this.props;
        if(countCleanConfirm){
            let data={
                crawlerDetailId
            }
            countCleanConfirm(data)
        }
    }

    //搜索
    handleSearch(data) {
        this.setState({
            searchData: data
        }, () => {
            this.getCleanStatisticsList([], 1)
        })
    }

    //重置
    handleReset() {
        this.setState({
            searchData: {}
        }, () => {
            this.getCleanStatisticsList([], 1)
        })
    }

    //批量分配
    distributionTask(data) {
        let { intl, distributeBrandClean, pageNo, barndCleanTotal, updateDistributionStatus, cleanStatisticsList, brandCleanlinessStatus } = this.props;
        let { crawlerDetailId, auditId, editType} = this.state;
        if(editType === 'fail'){
            if(!data.reason){
                message.info('请输入不侵权理由')
                return
            }
            let parameter={
                detailStatus: 5,
                id: auditId,
                isTort: 0,
                remark: data.reason
            }
            let detailStatus = getName(brandCleanlinessStatus, parameter.detailStatus)
            parameter.detailStatusName = detailStatus.dictLabel;
            parameter.detailStatusNameEn = detailStatus.dictLabelEn;
            if(updateDistributionStatus){
                updateDistributionStatus(parameter,cleanStatisticsList,()=>{
                    this.setState({
                        auditId:''
                    },()=>{
                        this.closeDistribution()
                        this.getCountCleanConfirm(crawlerDetailId)
                        this.getBrandCleanAtaticsDetail()
                    })
                })
            }
        }else{
            // 分配
            if(barndCleanTotal === 0){
                message.info('暂无数据可分配!')
                return
            }
            if (!data.volunteerId) {
                message.info(intl.formatMessage({ id: "monitor.please.choose.volunteer", defaultMessage: "请选择志愿者", description: "请选择志愿者" }))
                return
            }
            if (!data.allotNum) {
                message.info(intl.formatMessage({ id: "brand.please.task.num", defaultMessage: "请输入分配任务数量", description: "请输入分配任务数量" }))
                return
            }
            if (data.allotNum > barndCleanTotal) {
                message.info(intl.formatMessage({ id: "brand.assignable.should.be.small", defaultMessage: "分配任务数量不能大于可分配数量", description: "分配任务数量不能大于可分配数量" }))
                return
            }
            let parameter = {
                volunteerId: data.volunteerId,
                allotNum: data.allotNum,
                crawlerDetailId,
                detailStatus: 2,
            }
            let detailStatus = getName(brandCleanlinessStatus, parameter.detailStatus)
            parameter.detailStatusName = detailStatus.dictLabel;
            parameter.detailStatusNameEn = detailStatus.dictLabelEn;
            if(distributeBrandClean) {
                distributeBrandClean(parameter,()=>{
                    this.closeDistribution()
                    this.getCleanStatisticsList([], pageNo)
                })
            }
        }
    }

    //关闭分配弹窗
    closeDistribution() {
        this.setState({
            visibleDistribution: false,
            editType:'',
            auditId:''
        })
    }

    //打开分配modal
    OpenDisribution() {
        this.setState({
            editType:'disribtion',
            visibleDistribution: true,
        },()=>{
            let { queryBrandCleanPendingCount, getVolunteerList } = this.props;
            let { crawlerDetailId } = this.state;
            let data={
                crawlerDetailId
            }
            if(queryBrandCleanPendingCount){
                queryBrandCleanPendingCount(data)
            }
            if(getVolunteerList){
                getVolunteerList()
            }
        })
    }

    //改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getCleanStatisticsList([], 1)  
        })
    }

    //取消分配
    cancelDistribution(id) {
        let { cancellationDistribution, cleanStatisticsList, brandCleanlinessStatus} = this.props;
        let data = {
            id: id,
            detailStatus: 1,
        }
        let detailStatus = getName(brandCleanlinessStatus, data.detailStatus)
        data.detailStatusName = detailStatus.dictLabel
        data.detailStatusNameEn = detailStatus.dictLabelEn
        if(cancellationDistribution){
            cancellationDistribution(data, cleanStatisticsList)
        }
    }

    //未侵权
    noInfringement(id,editType) {
        this.setState({
            editType: editType,
            visibleDistribution: true,
            auditId: id
        })
    } 

    //操作
    renderOpearte(text, item) {
        let { permissionList, queryBrandCleanDetail } = this.props;
        let { crawlerId, crawlerDetailId } = this.state;
        //点击确认按钮后不能现在操作按钮
        if(queryBrandCleanDetail && queryBrandCleanDetail.status !== 3){
            if(item.tortFlag === 1 && getButtonPrem(permissionList, '0020050013')) {
                return(
                    <div>
                        <Link to={`/brand/clean/audit?crawlerId=${crawlerId}&crawlerDetailId=${crawlerDetailId}&resultId=${item.id}&brandId=${item.brandId}&platformTypeId=${item.platformType}&prodUrl=${encodeURIComponent(item.prodUrl)}`}>
                            <FormattedMessage id="brand.cleanStatis.tort" defaultMessage="侵权" description="侵权" />
                        </Link>
                        <br />
                        <a onClick={() => this.noInfringement(item.id, 'fail')}>
                            <FormattedMessage id="brand.cleanStatis.no.tort" defaultMessage="未侵权" description="未侵权" />
                        </a>
                    </div>
                )
            }if(item.allotFlag === 2 && getButtonPrem(permissionList, '0020050012')){
                return(
                    <div>
                        <a onClick={() => this.cancelDistribution(item.id)}>
                            <FormattedMessage id="monitor.cancel.distribution" defaultMessage="取消分配" description="取消分配" />
                        </a>
                    </div>
                )
            }else if(item.tortFlag === 3 && getButtonPrem(permissionList, '0020050013')){
                return(
                    <div>
                        <Link to={`/brand/clean/audit?crawlerId=${crawlerId}&crawlerDetailId=${crawlerDetailId}&resultId=${item.id}&brandId=${item.brandId}&platformTypeId=${item.platformType}&prodUrl=${encodeURIComponent(item.prodUrl)}`}>
                            <FormattedMessage id="brand.cleanStatis.tort" defaultMessage="侵权" description="侵权" />
                        </Link>
                    </div>
                )
            }else if(item.tortFlag === 4 && getButtonPrem(permissionList, '0020050013')){
                return(
                    <div>
                        <a onClick={() => this.noInfringement(item.id, 'fail')}>
                            <FormattedMessage id="brand.cleanStatis.no.tort" defaultMessage="未侵权" description="未侵权" />
                        </a>
                    </div>
                )
            }
        }
    }

    //状态
    renderStatus(text, item) {
        let { intl } = this.props;
        // Badge 状态
        // 绿色：未侵权 5
        // 红色：侵权 4
        // 黄色：待审核  1
        // 蓝色：中间状态
        return(
            <div className="clean-liness-detailStatus">
                {
                    item.reportStatusSync === -4
                        ? <p className="clean-liness-remark clean-liness-white"><FormattedMessage id="brand.cleanstatic.licensed" defaultMessage="白名单" description="白名单" /></p>
                        : ''
                }
                <Badge 
                    status={ item.detailStatus === 1 ? 'warning' : item.detailStatus === 4 ? 'error' : item.detailStatus === 5 ? 'success' : 'processing' } 
                    text={ intl.locale === 'en' ? item.detailStatusNameEn : item.detailStatusName }
                />
                {
					item.detailStatus === 5 ? (
						<p className="clean-liness-remark">
                            <span>{item.remark ? `(${item.remark})` : ''}</span>
                        </p>
					) : ''
				}
            </div>  
        )
    }
    
    //商品信息
    renderInformation(text, item) {
        if(item){
            return(
                <div className="table-info">
                    <p className="table-item">
                        <span className="table-item-span table-item-span table-item-w100">
                            {
                                item.title
                                    ? <a href={item.url} target='_blank'>{item.title}</a>
                                    : <a href={item.url} target='_blank'>{item.url}</a>
                            }
                        </span>
                    </p>
                    <p className="table-item">
                        <span className="table-item-span table-item-w50">
                            <FormattedMessage id="monitor.price" defaultMessage="价格" description="价格" />: {item.price}
                        </span>
                        <span className="table-item-span table-item-w50">
                            <FormattedMessage id="monitor.inventory" defaultMessage="库存" description="库存" />: {item.totalQuantity}
                        </span>
                    </p>
                    <p className="table-item">
                        <span className="table-item-span table-item-w50">
                            <FormattedMessage id="monitor.thirty.days.sales" defaultMessage="30天销量" description="30天销量" />: {item.salesVolume}
                        </span>
                        <span className="table-item-span table-item-w50">
                            <FormattedMessage id="monitor.evaluation" defaultMessage="评价" description="评价" />: {item.evaluate}
                        </span>
                    </p>
                    <p className="table-item">
                        <span className="table-item-span table-item-w50">
                            <FormattedMessage id="monitor.seller.id" defaultMessage="卖家ID" description="卖家ID" />: {item.sellerNick}
                        </span>
                        <span className="table-item-span table-item-w50">
                            <FormattedMessage id="monitor.storeName" defaultMessage="店铺名称" description="店铺名称" />: {item.storeName}
                        </span>
                    </p>
                    <p className="table-item">
                        <span className="table-item-span table-item-w50">
                            <FormattedMessage id="monitor.store.grade" defaultMessage="店铺等级" description="店铺等级" />: {this.renderStoreLevel(item.storeLevel)}
                        </span>
                        <span className="table-item-span table-item-w50">
                            <FormattedMessage id="monitor.brand.information" defaultMessage="品牌信息" description="品牌信息" />: {item.brand}
                        </span>
                    </p>
                    <p className="table-item">
                        <span className="table-item-span table-item-w50">
                            <FormattedMessage id="monitor.address" defaultMessage="发货地" description="发货地" />: {item.consignmentPlace}
                        </span>
                    </p>                      
                    <div className="table-item tabel-img-wrap">
                            <span className="item-label-span">
                                <FormattedMessage id="monitor.master.plan" defaultMessage="商品主图" description="商品主图" />: 
                            </span>
                            <div className="tabel-img-info">
                                {
                                    item.picUrl ? item.picUrl.split(',').map((img,key) => (
                                        <span className="tabel-img-item" onClick={() => this.setState({ visibleImg: true, showImg: img ? img.replace('/_', '/') : '' })}>
                                            <img className="tabel-img" src={img} alt="商品主图"/>
                                        </span>                                            
                                    )) : ''
                                }
                            </div>
                        </div>
                </div>
            )
        }
    }

    //侵权信息
    renderTortInfomation(text, item) {
        let { intl } = this.props;
        return(
            <div className="table-info">
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="monitor.tort.brand" defaultMessage="侵权品牌" description="侵权品牌" />: {item.brandName}
                    </span>
                </p>
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="monitor.tort.type" defaultMessage="侵权类型" description="侵权类型" />:
                        {
                            intl.locale === 'en'
                                ? item.reportTypeNameEn
                                : item.reportTypeName
                        }
                    </span>
                </p>
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <span className="table-lable">
                            <FormattedMessage id="monitor.product.classification" defaultMessage="产品分类" description="产品分类" />:
                        </span>
                        <span className="table-tip">
                            <Tooltip placement="topLeft" title={intl.locale === 'en' ? item.prodCategoryNameEn : item.prodCategoryName} >
                                {
                                    intl.locale === 'en'
                                        ? item.prodCategoryNameEn
                                        : item.prodCategoryName
                                }
                            </Tooltip>
                        </span>
                    </span>
                </p>
            </div>
        )
    }

    //渲染店铺等级
    renderStoreLevel(item) {
        let icon = '';
        if (item >= 4 && item <= 10) {
            icon = <span><img src={xin} alt="心" /></span>
        } else if (item >= 11 && item <= 40) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 41 && item <= 90) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 91 && item <= 150) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 151 && item <= 250) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 251 && item <= 500) {
            icon = <span><img src={zuan} alt="钻" /></span>
        } else if (item >= 501 && item <= 1000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 1001 && item <= 2000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 2001 && item <= 5000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 5001 && item <= 10000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 10001 && item <= 20000) {
            icon = <span><img src={guan} alt="皇冠" /></span>
        } else if (item >= 20001 && item <= 50000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 50001 && item <= 100000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 100001 && item <= 200000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 200001 && item <= 500000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 500001 && item <= 1000000) {
            icon = <span><img src={hg} alt="金冠" /></span>
        } else if (item >= 1000001 && item <= 2000000) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        } else if (item >= 2000001 && item <= 5000000) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        } else if (item >= 5000001 && item <= 10000000) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        } else if (item > 10000001) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        }
        return icon;
    }

    //创建table配置
    createColumns() {
        const columns = [
            {
                title: <FormattedMessage id="monitor.commodity.information" defaultMessage="商品信息" description="商品信息" />,
                key: 'monitorName',
                width: '35%',
                render: (text, item) => this.renderInformation(text, item.writeBackProductInfoDO ? item.writeBackProductInfoDO : '')
            }, {
                title: <FormattedMessage id="monitor.tort.information" defaultMessage="侵权信息" description="侵权信息" />,
                key: 'brand',
                width: '15%',
                render: (text, item) => this.renderTortInfomation(text, item)
            }, {
                title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
                dataIndex: 'detailStatusName',
                key: 'detailStatusName',
                width: '14%',
                render: (text, item) => this.renderStatus(text, item)
            }, {
                title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
                dataIndex: 'detailStatusName',
                key: 'id',
                width: '14%',
                render: (text, item) => this.renderOpearte(text, item)
            }
        ];
        return columns;
    }

    //创建分页器配置项
    createPaginationOption() {
        let { pageNo, total } = this.props;
        let { pageSize } = this.state;
        return {
            current: pageNo,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onChange: (page, pageSize) => this.getCleanStatisticsList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 显示自定义导出弹窗
    showExportExcelModal() {
        let result = localStorage.getItem('excelImport');
        let { exportExcelTitle } = this.props;
        if (result) {
            result = JSON.parse(result);
            if (!result.brandStatistic) {
                let autoTitleParam = [];
                for (let i = 0; i < exportExcelTitle.length; i++) {
                    const element = exportExcelTitle[i];
                    if (element.excelType === 13) {
                        autoTitleParam.push(element.num)
                    }
                }
                this.setState({
                    autoTitleParam,
                    visibleExcelExport: true
                })
            } else {
                this.setState({
                    autoTitleParam: result.brandStatistic,
                    visibleExcelExport: true
                })
            }
        } else if (!result) {
            let autoTitleParam = [];
            for (let i = 0; i < exportExcelTitle.length; i++) {
                const element = exportExcelTitle[i];
                if (element.excelType === 13) {
                    autoTitleParam.push(element.num)
                }
            }
            this.setState({
                autoTitleParam,
                visibleExcelExport: true
            })
        }
    }

    // 确认导出
    confirmExcel(data) {
        let result = localStorage.getItem('excelImport');
        if (!result) {
            result = {}
        } else {
            result = JSON.parse(result);
        }
        result.brandStatistic = data.autoTitleParam;
        localStorage.setItem('excelImport', JSON.stringify(result))
        this.setState({
            autoTitleParam: data.autoTitleParam,
            autoPageNum: data.autoPageNum,
            tbName: data.tbName,
            visibleExcelExport: false
        }, () => {
            this.exportExcel()
        })
    }

    // 导出
    exportExcel() {
        let { autoTitleParam, autoPageNum, tbName } = this.state;
        let { brandCleanlinessStatus } = this.props;
        let { saveExcelData, searchData } = this.props;
        let queryParamStr = [];
        if (searchData.detailStatus) {
            let detailStatus = getName(brandCleanlinessStatus, searchData.detailStatus)
            queryParamStr.push(`状态:${detailStatus.dictLabel}`)
        }
        if (searchData.crawlerDetailId) {
            queryParamStr.push(`品牌洁净度ID:${searchData.crawlerDetailId}`)
        }
        let result = Object.assign({}, searchData);
        let data = {
            type: 1,
            excelType: 13,
            queryParam: JSON.stringify(result),
            queryParamStr: queryParamStr.toString(),
            autoTitleParam: autoTitleParam.toString(),
            autoPageNum,
            tbName
        }
        saveExcelData(data)
    }

    render() {
        let { searchData, intl, isFetch, total, cleanStatisticsList, permissionList, brandCleanlinessStatus, brandCleanVolunteerList,
             getVolunteerList, barndCleanTotal, searchFetch, cleanConfirm, confirmed, tobeConfirmed, tortNum, queryBrandCleanDetail, 
             queryBrandCrawleDetail, exportExcelTitle} = this.props;
        let { visibleDistribution, editType, crawlerId, crawlerDetailId, visibleExcelExport, autoTitleParam, tbName, visibleImg, showImg } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '/brand/list', titleId: 'router.brands.management', title: '品牌管理' },
            { link: '/brand/cleanliness', titleId: 'router.brands.brand.cleanliness', title: '品牌洁净度' },
            { link: '', titleId: 'router.brand.clean.statistics', title: '洁净度统计' },
        ];
        return (
            <Content className="monitor-result" breadcrumbData={breadcrumbData}>
                <CleanlinessCalculation
                    cleanConfirm={cleanConfirm}
                    crawlerId={crawlerId}
                    crawlerDetailId={crawlerDetailId}
                    queryBrandCleanDetail={queryBrandCleanDetail}
                    tobeConfirmed={tobeConfirmed}
                    permissionList={permissionList}
                    queryBrandCrawleDetail={queryBrandCrawleDetail}
                />
                <SearchForm
                    handleSearch={data => this.handleSearch(data)}
                    handleReset={() => this.handleReset()}
                    brandCleanlinessStatus = { brandCleanlinessStatus }
                    searchData={searchData}
                />
                <Row className="operation-btns">
                    {
                        getButtonPrem(permissionList, '0020050011')
                            ? <Button
                                type="primary"
                                onClick={() => this.OpenDisribution()}
                            >
                                <FormattedMessage
                                    id="global.distribution"
                                    defaultMessage="分配"
                                    description="分配"
                                />
                            </Button>
                            : ''
                    }
                    {
                        getButtonPrem(permissionList, '0020050014')
                            ? <Button onClick={() => this.showExportExcelModal()}>
                                <FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
                            </Button>
                            : ''
                    }
                </Row>
                <Alert
                    showIcon
                    type="info"
                    className="Alert_info"
                    message={ 
                        intl.formatMessage({ 
                            id:"brand.a.total.of.data.in.cleanstatisitics", 
                            defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据  <br/> 已确认${confirmed === undefined ? '0' : confirmed}条(侵权${tortNum === undefined ? '0' : tortNum}),待确认${tobeConfirmed === undefined ? '0' : tobeConfirmed}条 `},
                            { count: total, Confirmed: confirmed ?confirmed : 0 , tobeConfirmed : tobeConfirmed ? tobeConfirmed : 0 , tortNum: tortNum ? tortNum : 0 })
                        }
                />
                <Table
                    rowKey="id"
                    loading={isFetch}
                    dataSource={cleanStatisticsList}
                    columns={this.createColumns()}
                    pagination={this.createPaginationOption()}
                />
                {
                    visibleDistribution? (
                        <DistributionModal
                            visible={visibleDistribution}
                            handleOk={data => this.distributionTask(data)}
                            handleCancel={() => this.closeDistribution()}
                            brandCleanVolunteerList={brandCleanVolunteerList}
                            getVolunteerList={getVolunteerList}
                            barndCleanTotal = {barndCleanTotal}
                            searchFetch={searchFetch}
                            editType={editType}
                        />
                    ):''
                }
                <ExcelExportModal
                    onCancel={() => this.setState({ visibleExcelExport: false, autoTitleParam: [] })}
                    onOk={data => this.confirmExcel(data)}
                    visible={visibleExcelExport}
                    data={exportExcelTitle}
                    checkedData={autoTitleParam}
                    title={intl.formatMessage({ id: "global.export", defaultMessage: "导出", description: "导出" })}
                    total={total}
                    tbName={tbName}
                />
                <PictureModal
                    onCancel={() => this.setState({ visibleImg: false })}
                    visible={visibleImg}
                    showImg={showImg}
                />                
            </Content>
        )
    }
}
