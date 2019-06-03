import React, { Component } from 'react'
import { Form, Row, Col, Button, Input, Alert, Table, DatePicker, message, Select } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import '../common/index.css'
import { formatDateToMs, getButtonPrem, getName } from '../../../utils/util'
const Option = Select.Option;

export default class ReportApplication extends Component {
	constructor() {
		super()
		this.state = {
            pageSize: 10,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            status: undefined, 
            userName: '',
            taskName: '',
            taskType: undefined,
            searchData: {
                userName: '',
                taskName: '',
                taskType: '',
                status: '',
                startTime: '',
                endTime: ''
            },
        }     
	}
	componentWillMount() {
        this.getReportApplicationList([], 1)
    }

    // 获取数据
    getReportApplicationList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData);
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getReportApplicationList(data, oldList)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getReportApplicationList([], 1)
        })
    }
    // 搜索
    handleSearch() {
        let { searchData, userName, taskName, taskType, status, startTime, endTime } = this.state;
        searchData = {
            userName: userName,
            taskName: taskName,
            taskType: taskType === undefined ? '' : taskType,
            status: status === undefined ? '' : status,
            startTime: startTime,
            endTime: endTime
        }
        this.setState({
            searchData
        }, () => this.getReportApplicationList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            userName: '',
            taskName: '',
            taskType: '',
            status: '',
            startTime: '',
            endTime: ''
        }
        this.setState({
            pageSize: 10,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            status: undefined, 
            userName: '',
            taskName: '',
            taskType: undefined,
            searchData
        }, () => this.getReportApplicationList([], 1))
    }

    // 创建分页器配置项
    createPaginationOption() {
        let { pageNo, total } = this.props;
        let { pageSize } = this.state;
        return {
            current: pageNo,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onChange: (page, pageSize) => this.getReportApplicationList([], page),
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

    //渲染任务类型
    renderTaskType(text,record) {
        let { intl } = this.props
        return(<span>{intl.locale === 'zh' ? record.taskTypeName : record.taskTypeNameEn}</span>)
    }
    //渲染任务状态
    renderStatus(text,record) {
        let { intl } = this.props
        return(<span>{intl.locale === 'zh' ? record.statusName : record.statusNameEn}</span>)
    }
    //渲染操作
    renderOperation(text,record) {
        let { permissionList } = this.props
        if(record.status === 1) {
            return(
                getButtonPrem(permissionList, '009004002') ? 
                [
                    <a key='pass' onClick={() => this.examineList(record,'pass')}>
                        <FormattedMessage id="global.pass" defaultMessage="通过" description="通过" />
                    </a>,
                    <br key='br' />,
                    <a key='fail' onClick={() => this.examineList(record,'fail')}>
                        <FormattedMessage id="global.fail" defaultMessage="不通过" description="不通过" />
                    </a>
                ] : ''
            )
        }
    }
    

    // 创建table配置
    createColumns() {
        const columns = [{
            title: <FormattedMessage id="clue.report.task.applicant" defaultMessage="任务申请人" description="任务申请人" />,
            width: '17%',
            dataIndex: 'finalName',
        }, {
            title: <FormattedMessage id="clue.report.task.name" defaultMessage="任务名称" description="任务名称" />,
            dataIndex: 'taskName',
            width: '17%',
        }, {
            title: <FormattedMessage id="clue.report.task.type" defaultMessage="任务类型" description="任务类型" />,
            dataIndex: 'taskType',
            width: '17%',
            render: (text,record) => this.renderTaskType(text,record)
        }, {
            title: <FormattedMessage id="clue.report.brand.name" defaultMessage="所属品牌" description="所属品牌" />,
            dataIndex: 'brandName',
            width: '17'
        }, {
            title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
            dataIndex: 'status',
            width: '17%',
            render: (text,record) => this.renderStatus(text,record)
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            width: '15%',
            render: (text,record) => this.renderOperation(text,record)
        }];
        return columns;
    }
    //审核
    examineList(record,type) {
        let { toExamineData, userInfo, reportApplicationList, intl, reportTaskApplyStatus } = this.props
        let status = 0
        if(type === 'pass') {
            status = 2
        }else {
            status = 3
        }
        let statusData = getName(reportTaskApplyStatus, status)
        let data = {
            userId: userInfo.userId,
            id: record.id,
            status: status,
            statusName: statusData.dictLabel,
            statusNameEn: statusData.dictLabelEn
        }
        toExamineData(data,reportApplicationList,() => {
            message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
        })
    }
	render() {
        let { intl, isFetch, reportApplicationList, total, reportTaskApplyType, reportTaskApplyStatus } = this.props;
        let { taskType, status, userName, taskName } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.clues.task.management', title: '线索及任务管理' },
            { link: '', titleId: 'router.report.application.check', title: '举报任务申请管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "clue.report.task.applicant", defaultMessage: "任务申请人", description: "任务申请人" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "clue.report.please.task.applicant", defaultMessage: "请输入任务申请人", description: "请输入任务申请人" })} 
                                    onChange={e => this.setState({ userName: e.target.value.trim() })} value={userName}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "clue.report.task.name", defaultMessage: "任务名称", description: "任务名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "clue.report.please.task.name", defaultMessage: "请输入任务名称", description: "请输入任务名称" })} 
                                    onChange={e => this.setState({ taskName: e.target.value.trim() })} value={taskName}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "clue.report.task.type", defaultMessage: "任务类型", description: "任务类型" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "clue.report.choose.task.type", defaultMessage: "请选择任务类型", description: "请选择任务类型" })}
                                    value={taskType}
                                    onChange={value => this.setState({ taskType: value })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        reportTaskApplyType && reportTaskApplyType.filter(item => item.isDel === 0)
                                        .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                            {
                                                intl.locale === 'en'
                                                    ? opt.dictLabelEn
                                                    : opt.dictLabel
                                            }
                                        </Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>                                          
						<Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.status", defaultMessage: "状态", description: "状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    value={status}
                                    onChange={val => this.setState({ status: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        reportTaskApplyStatus && reportTaskApplyStatus.filter(item => item.isDel === 0)
                                        .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                            {
                                                intl.locale === 'en'
                                                    ? opt.dictLabelEn
                                                    : opt.dictLabel
                                            }
                                        </Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>                        
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} value={this.state.startDate} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} value={this.state.endDate} />
                            </Form.Item>
                        </Col>                         
                        <Col span={6}></Col>
                        <Col span={6}>
                            <div className="search-form-btns">
                                <Button type="primary" onClick={() => this.handleSearch()}>
                                    <FormattedMessage id="global.search" defaultMessage="搜索" description="搜索" />
                                </Button>
                                <Button onClick={() => this.handleReset()}>
                                    <FormattedMessage id="global.reset" defaultMessage="重置" description="重置" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={reportApplicationList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
            </Content>
        )
	}
}
