import React, { Component } from 'react'
import {Button, Select, Alert, Table, Row, Col, Form ,Input, DatePicker, message} from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import Content from '../../common/layout/content/index'
import '../index.css'
import { formatDateToMs ,getButtonPrem} from '../../../utils/util'
import moment from 'moment'
import InputNumber from '../../common/form/numberInput';
const Option = Select.Option
class InvestigationTask extends Component {
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
                80: '协商未通过',
                12: '调查协商中',
                13: '调查协商通过',
                14: '调查任务中',
                15: '调查中止',
                16: '调查任务完成',
                21: '执法任务待接受',
                22: '执法协商中',
                23: '执法协商通过',
                24: '执法任务中',
                25: '执法中止',
                26: '执法完结',
                31: '任务待接受',
                32: '调查加执法协商中',
                33: '调查加执法协商通过',
                34: '调查加执法任务中',
                35: '调查加执法中止',
                36: '调查加执法完结',
                17: '调查完结',
                97: '完结',
                91: '协商不通过',
                95: '中止',
                96: '完成'
            },
            dicEn: {
                80: 'Negotiation is not approved',
                12: 'Investigation and consultation',
                13: 'Investigation and consultation',
                14: 'Investigation mission',
                15: 'Investigation discontinuation',
                16: 'Completion of investigation mission',
                21: 'Enforcement task to be accepted',
                22: 'Law enforcement consultation',
                23: 'Negotiation through law enforcement',
                24: 'Law enforcement tasks',
                25: 'Suspension of law enforcement',
                26: 'Completion of law enforcement',
                31: 'Task to be accepted',
                32: 'Investigation and law enforcement consultation',
                33: 'Investigation, enforcement and negotiation',
                34: 'Investigation and enforcement tasks',
                35: 'Suspension of investigation and enforcement',
                36: 'Investigation and enforcement',
                17: 'Investigation and completion',
                97: 'End',
                91: 'Negotiation is not approved',
                95: '中止',
                96: '完成'
            },
            typeDic:{
                1: '刑事案件',
                2: '行政案件',
            },
            typeDicEn:{
                1: 'PSB Case',
                2: 'AIC Case',
            },
        }
        this.columns = []
    }

    //获取数据
    getData(oldList,pageNo) {
        let { search, pageSize } = this.state
        let { getInvestigationTask } = this.props
        let data = Object.assign({}, search);
        data.pageNo = pageNo
        data.pageSize = pageSize
        if(getInvestigationTask){
            getInvestigationTask(data,oldList)
        }
    }


    componentWillMount() {
        let { history, investigationTaskList,pageNo,search,pageSize} = this.props;
		if (!investigationTaskList.length || (investigationTaskList.length && history.action !== 'POP' && !history.location.query)) {
			this.getData([],1)
		}else{
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

    //搜索
    handleSearch() {
        let {search,startTime, endTime, name, type, status, mobile, userName} = this.state
        search={
            startTime:startTime,
            endTime:endTime,
            name:name,
            type:type === undefined ? '' : type,
            status:status === undefined ? '' : status,
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
        // 搜索时间
        let { startTimeMs, endTimeMs } = this.state;
        if ( type === 'startTime' ) {
            startTimeMs = formatDateToMs(dateStr);
        } else if ( type === 'endTime' ) {
            endTimeMs = formatDateToMs(dateStr)
        }
        if ( endTimeMs && (endTimeMs - startTimeMs < 0)) {
            let { intl } = this.props;
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range' }));
            return
        }
        if ( type === 'startTime' ) {
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

    //获取搜索框信息
    getInputValue(value,type) {
        this.setState({
            [type]:value
        })
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
            this.props.getDistributionData(data)
        })
    }

    //获取调查员信息modal分页器
    minPaginationdata(page,pageSize) {
        this.setState({
            minPageNo:page,
        },()=>{
            this.openDistributionModal()
        })
    }

    //任务中止-完成
    editOverCompensable(id,type) {
        let { pageNo } = this.props
        let data = {
            compensableId:id
        }
        if(type===1){
            if(this.props.getEditOverCompensable){
                this.props.getEditOverCompensable(data,()=>{
                    this.getData([],pageNo)
                })
            }
        }else{
            if(this.props.getStopCompensable){
                this.props.getStopCompensable(data,()=>{
                    this.getData([],pageNo)
                })
            }
        }
    }

    //渲染案件状态
    getCaseType(record) {
        let casetype = record.status ? parseInt(record.status/10,10) : ''
        if( casetype === 1 ){
            return(
                <span><FormattedMessage id="investigation.task" defaultMessage="调查任务" description="调查任务" /></span>
            )
        }else if( casetype === 2 ){
            return(
                <span><FormattedMessage id="investigation.law.task" defaultMessage="执法任务" description="执法任务" /></span>
            )
        }else{
            return(
                <span><FormattedMessage id="investigation.law.enforcement.mission" defaultMessage="调查+执法任务" description="调查+执法任务" /></span>
            )
        }
    }

    //渲染任务状态
    getTaskStatus(record) {
        let {intl} = this.props
        let status = intl.locale==='zh'?this.state.dic[record.status]:this.state.dicEn[record.status]
        if(record.isFinish ===1){
            if(status === '调查任务中'|| status === '执法任务中' || status==='调查加执法任务中'){
                return(
                    <div style={{color:'rgb(208,16,76)'}}>
                        <FormattedMessage id="investigation.task.application.for.acceptance" defaultMessage="申请验收" description="申请验收" />
                    </div>
                )
            }else{
                return(
                    <span>{status}</span>
                )
            }
        }else{
            return(
                <span>{status}</span>
            )
        }
    }

    //任务类型
    getCompensableType(record) {
        let {intl} = this.props
        return(
            <div>
                {record.compensableType?intl.locale==="zh"?record.compensableTypeName:record.compensableTypeNameEn:''}
            </div>
        )
    }

      //渲染操作
	renderOperation(record) {
        let {permissionList} = this.props
        let status = this.state.dic[record.status]
        if(status==="调查协商中" || status==="执法协商中" || status ==="调查加执法协商中"){
            return(
                <Link to={`/report/task/detail?id=${record.id}&type=2`} className='to-examine'>
                {
                    getButtonPrem(permissionList,'007002004')?
                        <FormattedMessage id="golbal.consult" defaultMessage="协商" description="协商" />
                    :''
                }
                </Link>  
            )
        }else if(status==="协商不通过" || status==="调查任务完成" || status === '调查加执法中止' || status === '调查中止'|| status === '调查完结' || status === '执法中止' || status === '协商未通过' || status === '执法完结' || status === '调查任务完成' || status === '调查加执法完结' || status==='完结' || status==='中止' || status==='完成'){
            return(
                <div> - </div>      
            )
        }else if(status ==="执法任务待接受" || status === "任务待接受"){
            return(
                getButtonPrem(permissionList,'007002002')?
                    <a onClick={()=>this.editOverCompensable(record.compensableId,2)}><FormattedMessage id="global.suspension" defaultMessage="中止" description="中止" /></a>
                :""
            )
        }else{
            return(
                <div>
                    <ul className='inverigation-operation-wrapper'>
                    {
                        getButtonPrem(permissionList,'007002002')?
                            <a className='text' onClick={()=>this.editOverCompensable(record.compensableId,2)}><FormattedMessage id="global.suspension" defaultMessage="中止" description="中止" /></a>
                        :''
                    }
                    {
                        getButtonPrem(permissionList,'007002003')?
                            <a className='text' onClick={()=>this.editOverCompensable(record.compensableId,1)}><FormattedMessage id="global.end" defaultMessage="完成" description="完成" /></a>
                        :''
                    }
                    </ul>
                </div>
            )
        }
    }
    
    // 创建table配置
    createColumns() {
        let {permissionList} = this.props
        const columns = [ 
			{
                title: <FormattedMessage id="investigation.task.name" defaultMessage="任务名称" />,
                dataIndex: 'compensableName',
                key:"compensableName",
                render:(text, record) => 
                <div>
                    {
                        getButtonPrem(permissionList,'007002005') ?
                            <Link to={`/report/task/detail?id=${record.id}&type=2`}>{text}</Link>:
                            <span style={{color:'#668fff'}}>{text}</span>
                    }
                </div>
            },
            {
                title: <FormattedMessage id="investigation.task.case.type" defaultMessage="案件类型"/>,
                key:"status",
                render: (text, record) => this.getCaseType(record),
            },
            {
                title: <FormattedMessage id="investigation.task.type" defaultMessage="任务类型"/>,
                key:"compensableType",
                render:(text,record)=> this.getCompensableType(record)
            },
            {
                title: <FormattedMessage id="investigation.task.Name.person" defaultMessage="任务人姓名"/>,
                key:"userName",
                render:(text,record)=><div>{record.userReal?record.userReal:record.userName}</div>
            },
            {
                title: <FormattedMessage id="users.user.cellphone.number" defaultMessage="手机号码"/>,
                dataIndex: 'mobile',
                key:"mobile",
            },
            {
                title: <FormattedMessage id="report.report.time" defaultMessage="举报时间"/>,
                key:"gmtCreate",
                dataIndex: "gmtCreate"
            },
            {
                title: <FormattedMessage id="investigation.task.status" defaultMessage="任务状态"/>,
                key:"statuss",
                render:(text,record)=> this.getTaskStatus(record)
            },
            {
                title: <FormattedMessage id="global.operate" defaultMessage="操作"/>,
                key:"operate",
                render: (text, record) => this.renderOperation(record),
            }]
        return columns;
    }

    render() {
        let { intl, investigationTaskList,isFetch, total,investigationType} = this.props;   
        let { name, type, startDate, endDate, status ,mobile, userName}= this.state 
        let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '', titleId: "router.investigator.report.management", title: '调查举报管理' },
			{ link: '', titleId: "router.report.task.management", title: '举报任务管理' },
        ];
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form investigation-report">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id:"investigation.task.cue.name", defaultMessage: "任务名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({id:"investigation.please.enter.task.cue.name",defaultMessage: '请输入任务名称'})} onChange={(e) => this.getInputValue(e.target.value.trim(),'name')} value={name}/>
                            </Form.Item>                    
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "investigation.task.type", defaultMessage: "任务类型" })}>
                                <Select
                                    placeholder={ intl.formatMessage({ id: "investigation.please.select.task.lead.type", defaultMessage: "请选择任务类型", description: "请选择线索类型" })}
                                    onChange={ value =>this.getInputValue(value,'type') }
                                    value={ type }
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        investigationType && investigationType.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.id} value={opt.dictVal}>
                                            {intl.locale==='zh'?opt.dictLabel:opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </Form.Item>
					    </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "investigation.task.status" , defaultMessage: "任务状态" })}>
                                <Select
                                    placeholder={ intl.formatMessage({ id: "investigation.please.select.task.lead.status", defaultMessage: "请选择任务状态", description: "请选择线索状态" })}
                                    onChange={ value => this.getInputValue(value,'status') }
                                    value={ status }
                                    dropdownMatchSelectWidth={true}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    <Option value="12,22,32">
                                        <FormattedMessage id="investigation.consultation" defaultMessage="协商中" description="协商中" />
                                    </Option>
                                    <Option value="12,13,14">
                                        <FormattedMessage id="investigation.investigation.mission" defaultMessage="调查任务中" description="调查任务中" />
                                    </Option>
                                    <Option value="22,23,24">
                                        <FormattedMessage id="investigation.law.enforcement.tasks" defaultMessage="执法任务中" description="执法任务中" />
                                    </Option>
                                    <Option value="32,33,34">
                                        <FormattedMessage id="investigation.investigation.and.enforcement.tasks" defaultMessage="调查加执法任务" description="调查加执法任务" />
                                    </Option>
                                    <Option value="16,26,36">
                                        <FormattedMessage id="global.finish" defaultMessage="已完成" description="已完成" />
                                    </Option>
                                    <Option value="15,25,35,80">
                                        <FormattedMessage id="investigation.mission abort" defaultMessage="任务中止" description="任务中止" />
                                    </Option>
                                    <Option value="17,97">
                                        <FormattedMessage id="investigation.completion.of.the.task" defaultMessage="任务完结" description="任务完结" />
                                    </Option>
                                    <Option value="80,91">
                                        <FormattedMessage id="global.volunteer.consult.no.pass" defaultMessage="协商不通过" description="协商不通过" />
                                    </Option>
                                </Select>
                            </Form.Item>
					    </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id:"investigation.task.name.of.informant", defaultMessage: "任务人名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({id:"investigation.please.enter.task.name.of.informant",defaultMessage: '请输入任务人名称'})} onChange={(e) => this.getInputValue(e.target.value.trim(),'userName')} value={userName}/>
                            </Form.Item>                    
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id:"investigation.task.cell.phone", defaultMessage: "任务人手机" })}>
                                <InputNumber
                                    onPressEnter={(e) => this.handleSearch()} 
                                    placeholder={intl.formatMessage({id:"investigation.please.enter.task.cell.phone",defaultMessage: '请输入任务人手机'})} 
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
                                <Button  onClick={() => this.reSetting()}>
                                    <FormattedMessage id="global.reset" defaultMessage="重置"/>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={investigationTaskList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey={record=>record.id} loading={isFetch} />
            </Content>
        )
    }
}
export default injectIntl(InvestigationTask)