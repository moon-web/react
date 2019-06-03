import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Col, Row, Table, Input, Button, Alert ,message, Select, DatePicker, Divider, Modal, Badge } from 'antd'
import { FormattedMessage ,injectIntl} from 'react-intl'
import Content from '../../../common/layout/content/index'
import { getButtonPrem, formatDateToMs } from '../../../../utils/util'
import RotaionChart from '../../../common/rotationChart/index';
import moment from 'moment';
import '../index.css'
const Option = Select.Option
message.config({
    top: 100,
});
class Thread extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            brandId: undefined,
            status: undefined,
            platformType: undefined,
            clueNo: '',
            clueName: '',
            storeNameLike: '',
            prodUrlLike: '',
            startTimeMs:'',
            startTime: '',
            startDate: null,
            endTimeMs:'',
            endTime: '',
            endDate: null,
            searchData: {
                brandId: '',
                status: '',
                platformType: '',
                clueNo: '',
                clueName: '',
                storeNameLike: '',
                prodUrlLike: '',
                gmtStart : '',
                gmtEnd : '',
            },
            showModalVisible:false,
            showModalImg:[]
        }
    }

    componentDidMount() {
        let { threadList, history } = this.props;
        if (!threadList.length || (threadList.length && history.action !== 'POP' && !history.location.query)) {
			this.getThreadList([], 1)
		}else {
            let { searchData } = this.props
            let data = Object.assign({}, searchData)
            let { brandId, status, platformType, clueNo, clueName, storeNameLike, prodUrlLike , gmtStart, gmtEnd } = this.props.searchData
            this.setState({
                searchData: data,
                brandId : brandId ? brandId : undefined,
                status :  status ? status : undefined,
                platformType : platformType ? platformType : undefined,
                clueNo,
                clueName,
                storeNameLike,
                prodUrlLike,
                startTime: gmtStart,
                endTime: gmtEnd,
                startDate: gmtStart ? moment(gmtStart, "YYYY-MM-DD") : null,
                endDate: gmtEnd ? moment(gmtEnd, "YYYY-MM-DD") : null,
            })
        } 
    }

    //获取数据
    getThreadList(oldThreadListData, pageNo) {
        let { searchData, pageSize } = this.state
        let { getThreadListData } = this.props
        let data = Object.assign({}, searchData);
        data.pageNo = pageNo
        data.pageSize = pageSize
        getThreadListData(data,oldThreadListData)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getThreadList([], 1)
        })
    }

    // 搜索
    handleSearch() {
        let { brandId, status, platformType, clueNo, clueName, storeNameLike, prodUrlLike, startTime, endTime } = this.state;
        let searchData = {
            brandId : brandId ? brandId : '',
            status : status === undefined ? '' : status,
            platformType : platformType ? platformType : '',
            clueNo,
            clueName,
            storeNameLike,
            prodUrlLike,
            gmtStart: startTime ? startTime : '',
            gmtEnd: endTime ? endTime : ''
        }
        this.setState({
            searchData
        }, () => this.getThreadList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
			brandId : '',
            status : '',
            platformType : '',
            clueNo : '',
            clueName : '',
            storeNameLike : '',
            prodUrlLike : '',
            gmtStart : '',
            gmtEnd : '',
        }
        this.setState({
            brandId: undefined,
            status: undefined,
            platformType: undefined,
            clueNo:'',
            clueName: '',
            storeNameLike : '',
            prodUrlLike : '',
            startTime : '',
            endTime : '',
            searchData,
            startTimeMs:'',
            startDate: null,
            endTimeMs:'',
            endDate: null,
            pageSize: 10,
            pageNo: 1,
        }, () => this.getThreadList([], 1))
    }

    // 创建分页器配置项
    createPaginationOption() {
        let { pageNo, total } = this.props
        let { pageSize } = this.state
        return {
            current: pageNo,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onChange: (page, pageSize) => this.getThreadList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 选择日期
    changeDatePicker(date, dateStr, type) {
        let { startTimeMs, endTimeMs } = this.state;
        if (type === 'startTime') {
            startTimeMs = formatDateToMs(dateStr);
        } else if (type === 'endTime') {
            endTimeMs = formatDateToMs(dateStr)
        }
        if (endTimeMs && (endTimeMs - startTimeMs < 0)) {
            let { intl } = this.props;
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range', defaultMessage: "请选择有效的时间范围", description: "请选择有效的时间范围" }));
            return
        }
        if (type === 'startTime') {
            this.setState({
                startTimeMs,
                startTime: dateStr,
                startDate: date
            })
        } else {
            this.setState({
                endTimeMs,
                endTime: dateStr,
                endDate: date
            })
        }
    }

    //赋值
    handleChange(value, key) {
        this.setState({
            [key]: value
        })
    }

    //操作
    renderOperate(record,type) {
        let { permissionList } = this.props;
        //运营审核
        if((record.status === 0 || record.status === 6) && getButtonPrem(permissionList, '018001001')){
            return(
                <Link to={`/thread/edit?id=${record.id}`}>
                    <FormattedMessage id="global.audit" defaultMessage="审核" description="审核" />
                </Link> 
            )
        }else{
            return(
                <Link to={`/thread/edit?id=${record.id}`}>
                    <FormattedMessage id="ligiation.look" defaultMessage="查看详情" description="查看详情" />
                </Link> 
            )
        }
    }

    //线索归类
    renderClassification(record) {
        let { intl } = this.props
        return(
            <div>
                <span className="thread-suit-line">
                    { record.suitFlag === 1 ? intl.locale === 'zh' ? record.suitFlagName : record.suitFlagNameEn : ''}
                </span>
                <span className="thread-suit-line">
                    {  record.caseType ? intl.locale === 'zh' ? record.caseTypeName : record.caseTypeNameEn : ''}
                </span>
            </div>
        )
    }
    //渲染线索价值
    renderValue(record) {
        return (  
            <div className="table-info">
                <div className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="thread.sales.volume" defaultMessage="销量"/>: {record.salesVolume}
                    </span>
                </div>
                <div className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="thread.sales.volume.value" defaultMessage="销售额"/>: {record.salesAmountFormat}
                    </span>
                </div>
            </div>
        )
    }
    //渲染观察目标
    renderTarget(record) {
        return (  
            <div className="table-info">
                <div className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="thread.target.sales.volume" defaultMessage="目标销量" description="目标销量" />: {record.targetVolume || 0}
                    </span>
                </div>
                <div className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="thread.clue.current.sales.volume" defaultMessage="当前销量" description="当前销量" />: {record.observeVolume}
                    </span>
                </div>
            </div>
        )
    }
    //状态渲染
    renderStatus(item) {
        let { intl } = this.props
        return (  
            <div className="status-badge">
                {
                    intl.locale === 'zh' ?
                    <div>
                        {
                            item.status === 6 ?
                            item.targetVolume > item.observeVolume ? 
                                <Badge status="warning" /> : 
                                <Badge status="success" />
                            : ''
                        }
                        {item.statusName}
                    </div>  : 
                    <div>
                        {
                            item.status === 6 ?
                            item.targetVolume > item.observeVolume ? 
                                <Badge status="warning" /> : 
                                <Badge status="success" />
                            : ''
                        }
                        {item.statusNameEn}
                    </div>
                }
                {
                    item.status === 1 && item.sendReason ? <p style={{marginBottom:'0px'}}>( {item.sendReason} ) </p> : ''
                }
            </div>
        )
    }    
    

    // 创建table配置
    createColumns() {
        let columns = [
                {
                    title: <FormattedMessage id="thread.clue.number" defaultMessage="线索编号" />,
                    key: 'clueNo',
                    dataIndex: 'clueNo'
                },
                {
                    title: <FormattedMessage id="thread.clue.name" defaultMessage="线索名称" />,
                    dataIndex: 'clueName',
                    key: 'clueName',
                },
                {
                    title: <FormattedMessage id="case.rapporteur" defaultMessage="报告人" />,
                    dataIndex: 'userName',
                    key:'userName',
                },
                {
                    title: <FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" />,
                    dataIndex: 'brandName',
                    key:'brandName',
                },
                {
                    title: <FormattedMessage id="thread.reporting.time" defaultMessage="报告时间" />,
                    dataIndex: 'gmtCreate',
                    key: 'gmtCreate',
                },
                {
                    title: <FormattedMessage id="thread.clue.value" defaultMessage="线索价值" />,
                    dataIndex: 'salesAmount',
                    key:'salesAmount',
                    render: (text, record) => this.renderValue(record)
                },
                {
                    title: <FormattedMessage id="thread.clue.bservation.target" defaultMessage="观察目标" />,
                    render: (text, record) => this.renderTarget(record)
                },
                {
                    title: <FormattedMessage id="investigation.lead.status" defaultMessage="线索状态"/>,
                    key:'status',
                    render: (text, record) => this.renderStatus(record)
                },
                {
                    title: <FormattedMessage id="thread.clues.classification" defaultMessage="线索分类"/>,
                    render: (text,record) => this.renderClassification(record)
                },
                {
                    title: <FormattedMessage id="global.operate" defaultMessage="操作" />,
                    render: (text, record) => this.renderOperate(record,'')
                }]
        return columns;
    }

    //渲染额外的部分内容
    renderExpanded(record) {
        let { intl } = this.props;
        let prodPhoto = record.prodPhoto && record.prodPhoto.length ? record.prodPhoto.split(',') : []
        return(
            <ul className="expanded-ul">
                <li className="expanded-info">
                    {
                        record.clueType ? 
                        <div className='expanded-row'>
                            <span className="label"><FormattedMessage id="thread.clue.clue.source" defaultMessage="线索来源"/>:</span>     
                            <span>{ intl.locale === 'zh' ? record.clueTypeName : record.clueTypeNameEn}</span>      
                        </div> : ''
                    }                    
                    <div className='expanded-row'>
                        <span className="label"><FormattedMessage id="thread.tort.mode" defaultMessage="侵权方式"/>:</span>     
                        <span>{ intl.locale === 'zh' ? record.tortTypeName : record.tortTypeNameEn}</span>      
                    </div>
                    <div className='expanded-row'>
                        <span className="label"><FormattedMessage id="thread.sales.platform" defaultMessage="销售平台"/>:</span>     
                        <span>{ intl.locale === 'zh' ? record.platformTypeName : record.platformTypeNameEn}</span>      
                    </div>
                    {
                        record.storeName ? (
                            <div className='expanded-row'>
                                <span className="label"><FormattedMessage id="monitor.storeName" defaultMessage="店铺名称"/>:</span>     
                                <span>
                                    <div  className="item-link">
                                        <a href={ record.storeLink ? record.storeLink : '' } target="_blank">{ record.storeName ? record.storeName : '' }</a>
                                    </div>
                                </span>      
                            </div> 
                        ):''
                    }
                    <div className='expanded-row'>
                        <span className="label"><FormattedMessage id="thread.shop.address" defaultMessage="店铺链接"/>:</span>     
                        <span>
                            <div  className="item-link">
                                <a href={ record.storeLink ? record.storeLink : '' } target="_blank">{ record.storeLink ? record.storeLink : '' }</a>
                            </div>
                        </span>      
                    </div>
                    {
                        record.salesPrice ? (
                            <div className='expanded-row'>
                                <span className="label"><FormattedMessage id="monitor.price" defaultMessage="价格"/>:</span>     
                                <span>{ record.salesPrice ? record.salesPrice : '' }</span>      
                            </div>
                        ):''
                    }
                    {/* {
                        record.salesVolume ? (
                            <div className='expanded-row'>
                                <span className="label"><FormattedMessage id="thread.sales.volume" defaultMessage="销量"/>:</span>     
                                <span>{ record.salesVolume ? record.salesVolume : '' }</span>      
                            </div>
                        ):''
                    }
                    {
                        record.salesAmountFormat ? (
                            <div className='expanded-row'>
                                <span className="label"><FormattedMessage id="thread.sales.volume.value" defaultMessage="销售额"/>:</span>     
                                <span>{ record.salesAmountFormat ? record.salesAmountFormat : '' }</span>      
                            </div>
                        ):''
                    } */}
                    <div className='expanded-row'>
                        <span className="label"><FormattedMessage id="clue.report.shop.link" defaultMessage="商品链接"/>:</span>     
                        <span>
                            {
                                record.prodUrl ? 
                                    record.prodUrl.split(',').map((item,key)=>(
                                        <div key={key} className="item-link">
                                            <a href={item} target="_blank">{item}</a>
                                        </div>
                                    )):""
                            }
                        </span>      
                    </div>
                    {
                        record.remark ? (
                            <div className='expanded-row'>
                                <span className="label"><FormattedMessage id="clue.report.note" defaultMessage="备注"/>:</span>     
                                <span>{ record.remark ? record.remark : '' }</span>      
                            </div>
                        ):''
                    }
                </li>
                <li className="expanded-info-img">
                    <div className="expanded-img-wrapper">
                        <img src={prodPhoto && prodPhoto.length ? prodPhoto[0] : ''} alt="" 
                            onClick={()=>this.openImgageUrl(prodPhoto)}
                        />
                        {
                            prodPhoto && prodPhoto.length<=0?'':(
                                <p style={{width:'100%'}}>
                                    <FormattedMessage 
                                        id ='global.img.data' 
                                        defaultMessage={ `图片共（${prodPhoto && prodPhoto.length ? prodPhoto.length : 0}）条数据`} 
                                        values={{count: <b>{prodPhoto && prodPhoto.length ? prodPhoto.length : 0}</b>}}/>
                                </p>
                            )
                        }
                    </div>
                </li>
            </ul>
        )
    }

    //打开图片modal
    openImgageUrl(img) {
        let imgArr = []
        if(img && img.length){
            for(let i=0;i<img.length;i++){
                imgArr.push(img[i].replace('/_','/'))
            }
        }
        this.setState({
            showModalImg:imgArr,
            showModalVisible:true
        })
    }

    //关闭图片
    handleCancelImg() {
        this.setState({
            showModalVisible: false,
            showModalImg: []
        })
    }

    render() {
        let { intl, isFetch, total, lawyerBrand, threadList, threadStatus, platfromList } = this.props
        let { brandId, clueName, status, platformType, clueNo, startDate, endDate, storeNameLike, prodUrlLike, showModalVisible,
            showModalImg } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },            
            { link: '', titleId: 'router.thread.litigation.management', title: '线索诉讼案件管理'},
            { link: '', titleId: 'router.thread.management', title: '线索管理' },
        ]
        return (
            <Content breadcrumbData={breadcrumbData} className="thread-contnet">
                <div className="search-form thread">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'thread.clue.number', defaultMessage: "线索编号" })}>
                                <Input 
                                    placeholder={intl.formatMessage({id: 'thread.please.enter.the.clue.number',defaultMessage: '请输入线索编号'})} 
                                    onChange={(e) => this.handleChange(e.target.value.trim(), 'clueNo')} 
                                    value={clueNo} 
                                    onPressEnter={(e) => this.handleSearch()}
                                />
                            </Form.Item>                    
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'thread.clue.name', defaultMessage: "线索名称" })}>
                                <Input 
                                    placeholder={intl.formatMessage({id: 'thread.plaese.enter.a.clue.name',defaultMessage: '请输入线索名称'})} 
                                    onChange={(e) => this.handleChange(e.target.value.trim(), 'clueName')} 
                                    value={clueName} 
                                    onPressEnter={(e) => this.handleSearch()}/>
                            </Form.Item>                    
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "thread.starting.time.of.report", defaultMessage: "报告开始时间", description: "报告开始时间" })}>
                                <DatePicker 
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} 
                                    value={startDate} 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "thread.report.deadline", defaultMessage: "报告截止时间", description: "报告截止时间" })}>
                                <DatePicker 
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} 
                                    value={endDate} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "monitor.picture.rule.choose.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    value={brandId}
                                    onChange={(value) => this.handleChange(value, 'brandId')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        lawyerBrand && lawyerBrand.filter(item => item.isDelete === 0)
                                            .map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "thread.sales.platform", defaultMessage: "销售平台", description: "销售平台" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "thread.please.choose.the.sales.platform", defaultMessage: "请选择销售平台", description: "请选择所属品牌" })}
                                    value={platformType}
                                    onChange={(value) => this.handleChange(value, 'platformType')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        platfromList && platfromList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{opt.dictLabel}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "thread.clue.status", defaultMessage: "线索状态", description: "线索状态" })}>
                                <Select
                                    value={status}
                                    dropdownMatchSelectWidth={false}
                                    onChange={(value) => this.handleChange(value, 'status')}
                                    placeholder={intl.formatMessage({ id: "thread.please.select.the.clue.status", defaultMessage: "请选择线索状态", description: "请选择状态" })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        threadStatus && threadStatus.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'monitor.storeName', defaultMessage: "店铺名称" })}>
                                <Input 
                                    placeholder={intl.formatMessage({id: 'monitor.input.storeName',defaultMessage: '请输入店铺地址'})} 
                                    onChange={(e) => this.handleChange(e.target.value.trim(), 'storeNameLike')} 
                                    value={storeNameLike} 
                                    onPressEnter={(e) => this.handleSearch()}/>
                            </Form.Item>                    
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'clue.report.shop.link', defaultMessage: "商品链接" })}>
                                <Input 
                                    placeholder={intl.formatMessage({id: 'global.please.enter.prod.url',defaultMessage: '请输入商品链接'})} 
                                    onChange={(e) => this.handleChange(e.target.value.trim(), 'prodUrlLike')} 
                                    value={prodUrlLike} 
                                    onPressEnter={(e) => this.handleSearch()}/>
                            </Form.Item>                    
                        </Col>
                        <Col span={6} offset={12}>
                            <div className="search-form-btns">
                                <Button type="primary" onClick={() => this.handleSearch()}>
                                    <FormattedMessage id="global.search" defaultMessage="搜索"/>
                                </Button>
                                <Button onClick={() => this.handleReset()}>
                                    <FormattedMessage id="global.reset" defaultMessage="重置"/>
                                </Button>
                            </div>						
                        </Col>
                    </Row>
                </div>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                {
                    threadList && threadList.length 
                        ? <Table 
                                dataSource={threadList} 
                                columns={this.createColumns()} 
                                pagination={this.createPaginationOption()} 
                                rowKey='id' loading={isFetch} 
                                expandedRowRender={record => this.renderExpanded(record)}
                                defaultExpandAllRows
                            />
                        : <div className="thread-empty">
                            <Table 
                                dataSource={threadList} 
                                columns={this.createColumns()} 
                                pagination={this.createPaginationOption()}
                                rowKey='id' loading={isFetch} 
                            />
                        </div>
                }
                <Modal
                    title={intl.formatMessage({ id: "global.picture.details", defaultMessage: "图片详情", description: "图片详情" })}
                    visible={showModalVisible}
                    onCancel={() => this.handleCancelImg()}
                    footer={false}
                    >
                    <RotaionChart
                        imgUrl={showModalImg}
                    />
                </Modal>              
            </Content>
        )
    }
}
export default injectIntl(Thread)
   