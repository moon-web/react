import React, { Component } from 'react'
import {Button, Select, Alert, Table, Row, Col, Form ,Input, DatePicker, message, Modal} from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import Content from '../../common/layout/content/index'
import '../index.css'
import { formatDateToMs ,getButtonPrem} from '../../../utils/util'
import Distribution from '../common/distribution'
import moment from 'moment'
import InputNumber from '../../common/form/numberInput';
const Option = Select.Option

class InvestigationReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageNo:1,
            pageSize:10,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            name:'',
            type:undefined,
            status:undefined,
            mobile:'',
            userName:'',
            search:{
                startTime:'',
                endTime:"",
                name:'',
                type:'',
                status:'',
                mobile:'',
                userName:''
            },
            dic: {
                0: '待审核',
                80: '审核通过待调查',
                90: '审核不通过',
                12: '任务中',
                13: '任务中',
                14: '任务中',
                15: '审核通过待调查',
                16: '调查完成待执法',
                21: '任务中',
                22: '任务中',
                23: '任务中',
                24: '任务中',
                25: '调查完成待执法',
                26: '执法完成',
                31: '任务中',
                32: '任务中',
                33: '任务中',
                34: '任务中',
                35: '审核通过待调查',
                36: '调查加执法完成',
                17: '完结',
                97: '完结',
            },
            dicEn: {
                0: 'Pending',
                80: 'Audited through investigation',
                90: 'No pass',
                12: 'In the task',
                13: 'In the task',
                14: 'In the task',
                15: 'Audited through investigation',
                16: 'Investigation completed until law enforcement',
                21: 'In the task',
                22: 'In the task',
                23: 'In the task',
                24: 'In the task',
                25: 'Investigation completed until law enforcement',
                26: 'Completion of law enforcement',
                31: 'In the task',
                32: 'In the task',
                33: 'In the task',
                34: 'In the task',
                35: 'Audited through investigation',
                36: 'Investigation completed until law enforcement',
                17: 'Finish',
                97: 'Finish',
            },
            typeDic:{
                1: '刑事案件',
                2: '行政案件',
            },
            typeDicEn:{
                1: 'PSB Case',
                2: 'AIC Case',
            },
            visible:false,
            // 分配modal
            distribution:{
                investigationTime: '',
                investigationDate: null,//调查响应时间
                investigationLawTime: '',
                investigationLawDate: null,//调查+执法响应时间
                investigationMoney:'',//调查奖励
                investigationLawMoney:'',//调查+执法奖励
                lawTime:'',//执法时间
                lawDate:null,
                lawMoney:'',//执法奖励
                name:'',//调查员
                userId:''
            },
            searchVisible:false,
            minPageNo:1,
            distributionId:null,//分配操作id
            distributionType:null,//分配操作类型  1.调查+执法  2.执法

        }
    }

    //获取数据
    getData(oldList,pageNo) {
        let { search, pageSize } = this.state
        let { getInvestigationReport } = this.props
        let data = Object.assign({}, search);
        data.pageNo = pageNo
        data.pageSize = pageSize
        if(getInvestigationReport){
            getInvestigationReport(oldList,data)
        }
    }


    componentWillMount() {
        let { history, investigationReportList,search,pageSize,pageNo} = this.props;
		if (!investigationReportList.length || (investigationReportList.length && history.action !== 'POP' && !history.location.query)) {
            this.getData([],1)
        }else{
            if(search){
                this.setState({
                    search,
                    startTime: search.startTime || '',
                    endTime: search.endTime || '',
                    startDate: search.startTime ? moment(search.startTime, "YYYY-MM-DD") : null,
                    endDate: search.endTime ? moment(search.endTime, "YYYY-MM-DD") : null,
                    name:search.name || '',
                    type:search.type || '',
                    status:search.status || '',
                    mobile:search.mobile || '',
                    userName:search.userName || '',
                    pageSize,
                },()=>{
                    this.getData([],pageNo)
                })
            }
        }
    }

    //搜索
    handleSearch() {
        let {search,startTime, endTime, name, type, status, mobile, userName} = this.state
        search={
            startTime:startTime,
            endTime:endTime,
            name:name,
            type:type || '',
            status:status || '',
            mobile:mobile,
            userName:userName
        }
        this.setState({
            search
        },()=>{
            this.getData([],1)
        })
    }

    //重置
    reSetting() {
        let search={
            startTime:'',
            endTime:'',
            name:'',
            type:'',
            status:'',
            mobile:'',
            userName:''
        }
        this.setState({
            search,
            startTime:'',
            endTime:'',
            name:'',
            type:undefined,
            status:undefined,
            mobile:'',
            userName:'',
            startTimeMs: '',
            startDate: null,
            endTimeMs: '',
            endDate: null,
            pageSize:10,
            pageNo:1,
        },() => {
            this.getData([],1)
        })
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getData([],1)
        })
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
            onChange: (page, pageSize) => this.getData([],page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 选择日期
    changeDatePicker(date, dateStr, type, key) {
        // // 搜索时间
        let { startTimeMs, endTimeMs} = this.state
        if (type === 'startTime') {
            startTimeMs = formatDateToMs(dateStr);
        } else if (type === 'endTime') {
            endTimeMs = formatDateToMs(dateStr)
        }
        if (endTimeMs && (endTimeMs - startTimeMs < 0)) {
            let { intl } = this.props;
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range' }));
            return
        }
        if (type === 'startTime') {
            this.setState({
                startTimeMs,
                startTime: dateStr,
                startDate: date
            })
        } else if (type === 'endTime') {
            this.setState({
                endTimeMs,
                endTime: dateStr,
                endDate: date
            }) 
        }

        //分配modal调查函数
        if(key){
            if (type === 'investigationTime' || type === 'investigationLawTime' || type==="lawTime") {
                let { distribution } = this.state
                distribution[type]=dateStr;
                distribution[key]=date;
                this.setState({
                    distribution
                })
            }
        }
    }

    //获取搜索框信息
    getInputValue(value,type) {
        if(type ==='investigationMoney' || type==='investigationLawMoney' || type==="lawMoney"){
            let { distribution } = this.state;
            distribution[type] = value;
            this.setState({
                distribution
            })
        }else{
            this.setState({
                [type]:value
            })
        }
    }

    //获取调查员信息 modal信息
    openDistributionModal(id,type) {
        let { minPageNo } = this.state
        this.setState({
            visible:true,
            distributionId:id,
            distributionType:type
        },()=>{
            let data={
                pageSize:10,
                pageNo:minPageNo
            }
            if(this.props.getDistributionData){
                this.props.getDistributionData(data)
            }
        })
    }

    //获取调查员信息modal分页器
    minPaginationdata(page,pageSize) {
        let { distributionId, distributionType } =this.state
        this.setState({
            minPageNo:page,
        },()=>{
            this.openDistributionModal(distributionId,distributionType)
        })
    }

    //完结
    finishTask(id,status) {
        let {pageNo,investigationReportList} = this.props
        let data = {
            compensableId:id,
            status:status
        }
        if(this.props.getFinishOperate){
            this.props.getFinishOperate(data,investigationReportList,()=>{
                this.getData([],pageNo)
            })
        }
    }

    //提交分配信息
    submitDistributionInfo() {
        let { distribution, distributionType, distributionId} = this.state
        let { investigationReportList, intl } = this.props
        if(distribution.userId==="" || distribution.userId=== undefined){
            message.warning(intl.formatMessage({ id: 'investigation.please.select.investigators', defaultMessage: "请选择调查员", description: "请选择调查员" }));
            return
        }
        let data={}
        data.compensableId = distributionId;
        data.b2bUserId = distribution.userId;
        if(distributionType ===1 ){
            if(distribution.investigationMoney === "" || distribution.investigationMoney === undefined){
                message.warning(intl.formatMessage({ id: 'investigation.please.enter.awards', defaultMessage: "请输入调查奖励", description: "请输入调查奖励" }));
                return
            }
            if(distribution.investigationTime === "" || distribution.investigationTime === undefined ){
                message.warning(intl.formatMessage({ id: 'investigation.please.select.the.survey.response.time', defaultMessage: "请选择调查响应时间", description: "请选择调查响应时间" }));
                return
            }
            if(distribution.investigationLawMoney === "" || distribution.investigationLawMoney === undefined){
                message.warning(intl.formatMessage({ id: 'investigation.Please.enter.the.amount.of.investigation.enforcement.award', defaultMessage: "请输入调查+执法奖励金额", description: "请输入调查+执法奖励金额" }));
                return
            }
            if(distribution.investigationLawTime==="" || distribution.investigationLawTime===undefined){
                message.warning(intl.formatMessage({ id: 'investigation.please.select.the.survey.enforcement.time', defaultMessage: "请选择调查+执法响应时间", description: "请选择调查+执法响应时间" }));
                return
            }
            data.researchMoney = distribution.investigationMoney
            data.researchTime = distribution.investigationTime
            data.money = distribution.investigationLawMoney
            data.allTime = distribution.investigationLawTime
        }else{
            if(distribution.lawMoney === "" || distribution.lawMoney === undefined){
                message.warning(intl.formatMessage({ id: 'investigation.please.enter.the.amount.enforcement.award', defaultMessage: "请输入执法奖励金额", description: "请输入执法奖励金额" }));
                return
            }
            if(distribution.lawTime === "" || distribution.lawTime === undefined){
                message.warning(intl.formatMessage({ id: 'investigation.please.choose.the.response.time', defaultMessage: "请选择执法响应时间", description: "请选择执法响应时间" }));
                return
            }
            data.lawTime = distribution.lawTime
            data.lawMoney = distribution.lawMoney
        }
        if(this.props.geteditInvestigationAllot){
            this.props.geteditInvestigationAllot(data,investigationReportList,()=>{
                this.cancelOperation()
                this.getData([],this.state.pageNo)
            })
        }
    }

    //获取调查员用户
    selectUserInfo(value) {
        let { distribution } = this.state
        distribution.name=value.userName
        distribution.userId = value.userId
        this.setState({
            distribution,
            searchVisible:false
        })
    }

    //搜索调查员
    showSearchlist() {
        this.setState({
            searchVisible:true
        },()=>{
            this.searchByName()
        })
    }

    //搜索distribution调查员信息
    searchByName(value) {
        let data={
            userName:value || '',
            pageSize:10,
            pageNo:1
        }
        this.props.getDistributionData(data)
    }

    //取消分配操作
    cancelOperation() {
        this.setState({
            visible:false,
            distribution:{
                investigationTime: '',
                investigationDate: null,//调查响应时间
                investigationLawTime: '',
                investigationLawDate: null,//调查+执法响应时间
                investigationMoney:'',//调查奖励
                investigationLawMoney:'',//调查+执法奖励
                lawTime:'',//执法时间
                lawDate:null,
                lawMoney:'',//执法奖励
                name:'',//调查员
            },
            distributionId:null,//分配操作id
            distributionType:null//分配操作类型  1.调查+执法  2.执法
        })
    }

    //取消搜索值
    onSelectCancel() {
        this.setState({
            searchVisible:false
        })
    }

    //线索状态
    getCompentableStatus(record) {
        let {intl} = this.props
        return(
            <div>
                { intl.locale==='zh'?this.state.dic[record.status] :this.state.dicEn[record.status]}
            </div>
        )
    }
    
    //线索类型
    renderType(record) {
        let {intl} = this.props
        return(
            <div>
                {record.typeName?intl.locale==="zh"?record.typeName:record.typeEn:''}
            </div>
        )
    }

    //渲染操作
	renderOperation(record) {
        let { permissionList } = this.props
		if( record.status === 0 ){
            // 待审核
            return(
                <Link to={`/report/clue/detail?id=${record.id}&type=1`} className='to-examine'>
                {
                    getButtonPrem(permissionList,'007001002')?
                        <FormattedMessage id="global.audit" defaultMessage="审核" description="审核" />
                    :
                    ''
                }
                </Link>
            )
        }else if(record.status === 80 || record.status === 15 || record.status === 35){
            // 审核通过待调查
            return(
                <div className='inverigation-operation-wrapper'>
                {
                   getButtonPrem(permissionList,'007001003')? 
                        <a className='text' onClick={()=>this.openDistributionModal(record.id,1)}><FormattedMessage id="global.distribution" defaultMessage="分配" description="分配" /></a>
                   :''
                }
                {
                    getButtonPrem(permissionList,'007001004')? 
                        <a className='text' onClick={()=>this.finishTask(record.id,35)}><FormattedMessage id="global.end" defaultMessage="完结" description="完结" /></a>
                    :''
                } 
                </div>
            )
        }else if(record.status === 16 || record.status === 25){
            //调查完成待执法
            return(
                <div className='inverigation-operation-wrapper'>
                {
                    getButtonPrem(permissionList,'007001003')? 
                        <a className='text' onClick={()=>this.openDistributionModal(record.id,2)}><FormattedMessage id="global.distribution" defaultMessage="分配" description="分配" /></a>
                    :''
                }
                {
                    getButtonPrem(permissionList,'007001004')? 
                        <a className='text' onClick={()=>this.finishTask(record.id,17)}><FormattedMessage id="global.end" defaultMessage="完结" description="完结" /></a>
                    :''
                }
                </div>
            )
        }else{
            //完结  任务中  调查执法完成
            return(
                <div> - </div>
            )
        }
    }

    // 创建table配置
    createColumns() {
        let { permissionList } = this.props
        const columns = [ 
			{
                title: <FormattedMessage id="investigation.name.of.reporting.clues" defaultMessage="举报线索名称" />,
                dataIndex: 'name',
                key:"name",
                render:(text, record) => 
                <div>
                    {
                        getButtonPrem(permissionList,'007001005')?
                            <Link to={`/report/clue/detail?id=${record.id}&type=1`}>{text}</Link>
                            :<span style={{color:'#668fff'}}>{text}</span>
                    }
                </div>
            },
            {
                title: <FormattedMessage id="investigation.lead.type" defaultMessage="线索类型"/>,
                key:"type",
                render:(text,record)=> this.renderType(record)
            },
            {
                title: <FormattedMessage id="investigation.name.of.informant" defaultMessage="举报人名称"/>,
                key:"userReal",
                render:(text,record)=><div>{record.userReal?record.userReal:record.userName}</div>
            },
            {
                title: <FormattedMessage id="users.user.cellphone.number" defaultMessage="手机号码"/>,
                dataIndex: 'userMobile',
                key:"userMobile",
            },
            {
                title: <FormattedMessage id="report.report.time" defaultMessage="举报时间"/>,
                key:"gmtCreate",
                dataIndex: "gmtCreate"
            },
            {
                title: <FormattedMessage id="investigation.lead.status" defaultMessage="线索状态"/>,
                key:"status",
                render:(text,record)=> this.getCompentableStatus(record)
            },
            {
                title: <FormattedMessage id="global.operate" defaultMessage="操作"/>,
                key:"operate",
                render: (text, record) => this.renderOperation(record),
            }]
        return columns;
    }

    render() {
        let { intl, investigationReportList, isFetch, total, getDistributionList, minTotal, investigationType} = this.props;   
        let { name, type, startDate, endDate, status ,mobile, userName, visible, distribution , searchVisible,distributionType,minPageNo}= this.state 
        let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '', titleId: "router.investigator.report.management", title: '调查举报管理' },
			{ link: '', titleId: "router.tip.off.clue.management", title: '举报线索管理' },
        ];
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form investigation-report">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id:"investigation.cue.name", defaultMessage: "线索名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({id:"investigation.please.enter.cue.name",defaultMessage: '请输入线索名称'})} onChange={(e) => this.getInputValue(e.target.value.trim(),'name')} value={name}/>
                            </Form.Item>                    
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "investigation.lead.type", defaultMessage: "线索类型" })}>
                                <Select
                                    placeholder={ intl.formatMessage({ id: "investigation.please.select.lead.type", defaultMessage: "请选择线索类型", description: "请选择线索类型" })}
                                    onChange={ value =>this.getInputValue(value,'type') }
                                    value={ type }
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        investigationType && investigationType.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.id} value={opt.dictVal}>{ intl.locale==='zh'? opt.dictLabel : opt.dictLabelEn }</Option>)
                                    }
                                </Select>
                            </Form.Item>
					    </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "investigation.lead.status", defaultMessage: "线索状态" })}>
                                <Select
                                    placeholder={ intl.formatMessage({ id: "investigation.please.select.lead.status", defaultMessage: "请选择线索状态", description: "请选择线索状态" })}
                                    onChange={ value => this.getInputValue(value,'status') }
                                    value={ status }
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    <Option value="0"><FormattedMessage id="global.pending" defaultMessage="待审核" description="待审核" /></Option>
                                    <Option value="80,15,16,25,35"><FormattedMessage id="global.case.status.to.be.distributed" defaultMessage="待分配" description="待分配" /></Option>
                                    <Option value="12,13,14,21,22,23,24,31,32,33,34"><FormattedMessage id="global.in.the.task" defaultMessage="任务中" description="任务中" /></Option>
                                    <Option value="26,36,17,97"><FormattedMessage id="global.finish" defaultMessage="已完成" description="已完成" /></Option>
                                    <Option value="90"><FormattedMessage id="global.volunteer.audit.type.no.pass" defaultMessage="审核不通过" description="审核不通过" /></Option>
                                </Select>
                            </Form.Item>
					    </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id:"investigation.name.of.informant", defaultMessage: "举报人名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({id:"investigation.please.enter.name.of.informant",defaultMessage: '请输入举报人名称'})} onChange={(e) => this.getInputValue(e.target.value.trim(),'userName')} value={userName}/>
                            </Form.Item>                    
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id:"investigation.cell.phone", defaultMessage: "举报人手机" })}>
                                <InputNumber 
                                    onPressEnter={(e) => this.handleSearch()} 
                                    placeholder={intl.formatMessage({id:"investigation.please.enter.cell.phone",defaultMessage: '请输入举报人手机'})} 
                                    onChange={value => this.getInputValue(value.trim(),'mobile')} 
                                    value={mobile}
                                />
                            </Form.Item>                    
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} value={startDate} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} value={endDate} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <div className="search-form-btns">
                                <Button type="primary" onClick={() => this.handleSearch()}>
                                    <FormattedMessage id="global.search" defaultMessage="搜索"/>
                                </Button>
                                <Button onClick={() => this.reSetting()}>
                                    <FormattedMessage id="global.reset" defaultMessage="重置"/>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={investigationReportList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey='id' loading={isFetch} />
                <Modal
                    visible={visible}
                    onCancel={() => this.cancelOperation()}
                    onOk={()=>this.submitDistributionInfo()}
					className="root"
                    >
                        <Distribution
                            distribution={ distribution }
                            getInputValue={ (value,type)=>this.getInputValue(value,type) }
                            changeDatePicker={ (date, dateStr, type, key)=>this.changeDatePicker(date, dateStr, type, key) }
                            getDistributionList={ getDistributionList }
                            searchVisible={ searchVisible }
                            selectUserInfo={ (value) => this.selectUserInfo( value ) }
                            showSearchlist={ () => this.showSearchlist() }
                            minTotal={ minTotal }
                            minPaginationdata={ (pageNo,pageSize) => this.minPaginationdata(pageNo,pageSize) }
                            searchByName={ (value) => this.searchByName(value) }
                            distributionType={ distributionType }
                            onSelectCancel={() => this.onSelectCancel()}
                            minPageNo={minPageNo}
                        />
                </Modal> 
            </Content>
        )
    }
}
export default injectIntl(InvestigationReport)