import React, { Component } from 'react'
import Content from '../../common/layout/content/index'
import { Row, Col, Button, Form, Select, Input, DatePicker, message, Alert, Table, Upload, Icon } from 'antd'
import { FormattedMessage } from 'react-intl'
import { formatDateToMs, getButtonPrem, getName, getFormatDate } from '../../../utils/util'
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
import Req from '../../../api/req'
const Option = Select.Option
class CaseList extends Component {
	constructor() {
		super()
		this.state = {
			pageSize: 10,
			startTimeMs: '',
			endTimeMs: '',
			startDate: null,
			endDate: null,
			caseNo: '',//案件编号
			caseSource: undefined,//案件来源
			followBy: '',//跟进人
			tortsType: undefined,//侵权类型
			brandId: undefined,//侵权品牌
			caseAddr: '',//所在地
			caseSchedule: undefined,//案件状态
			suitStatus: undefined,//投诉状态
			warnStatus: undefined,//警告信状态
			gmtCreateStart: '',//开始时间
			gmtCreateEnd: '',//结束时间
			searchData: {
				caseNo: '',//案件编号
				caseSource: '',//案件来源
				followBy: '',//跟进人
				tortsType: '',//侵权类型
				brandId: '',//侵权品牌
				caseAddr: '',//所在地
				caseSchedule: '',//案件状态
				suitStatus: '',//投诉状态
				warnStatus: '',//警告信状态
				gmtCreateStart: '',//开始时间
				gmtCreateEnd: ''
			},
			visibleExcelExport: false,  // 自定义导出数据的弹窗控制
			autoTitleParam: [],  //  自定义数据
			autoPageNum: 100,  // 自定义数据量
			tbName: '案件管理-'+ getFormatDate('yyyy-MM-dd-hh:mm')
		}
	}
	componentWillMount() {
		let { history, caseList } = this.props;
		if (!caseList.length || (caseList.length && history.action !== 'POP' && !history.location.query)) {
			this.getCaseList([], 1)
		}
		if (this.props.getExportExcelTitle) {
            this.props.getExportExcelTitle({excelType: 2})
        }
	}
	// 获取数据
	getCaseList(oldList, pageNo) {
		let { searchData, pageSize } = this.state;
		let data = Object.assign({}, searchData)
		data.pageSize = pageSize;
		data.pageNo = pageNo;
		this.props.caseManagement(data, oldList)
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
			message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range' }));
			return
		}
		if (type === 'startTime') {
			this.setState({
				startTimeMs,
				gmtCreateStart: dateStr,
				startDate: date
			})
		} else {
			this.setState({
				endTimeMs,
				gmtCreateEnd: dateStr,
				endDate: date
			})
		}
	}
	// 搜索
	handleSearch() {
		let { caseNo, caseSource, followBy, tortsType, brandId, caseAddr, caseSchedule, suitStatus, warnStatus, searchData, gmtCreateStart, gmtCreateEnd } = this.state
		searchData = {
			caseNo: caseNo,//案件编号
			caseSource: caseSource === undefined ? '' : caseSource,//案件来源
			followBy: followBy,//跟进人
			tortsType: tortsType === undefined ? '' : tortsType,//侵权类型
			brandId: brandId === undefined ? '' : brandId,//侵权品牌
			caseAddr: caseAddr,//所在地
			caseSchedule: caseSchedule === undefined ? '' : caseSchedule,//案件状态
			suitStatus: suitStatus === undefined ? '' : suitStatus,//投诉状态
			warnStatus: warnStatus === undefined ? '' : warnStatus,//警告信状态
			gmtCreateStart: gmtCreateStart,//开始时间
			gmtCreateEnd: gmtCreateEnd
		}
		this.setState({
			searchData
		}, () => this.getCaseList([], 1))
	}
	//重置
	handleReset() {
		let searchData = {
			caseNo: '',//案件编号
			caseSource: '',//案件来源
			followBy: '',//跟进人
			tortsType: '',//侵权类型
			brandId: '',//侵权品牌
			caseAddr: '',//所在地
			caseSchedule: '',//案件状态
			suitStatus: '',//投诉状态
			warnStatus: '',//警告信状态
			gmtCreateStart: '',//开始时间
			gmtCreateEnd: ''
		}
		this.setState({
			startTimeMs: '',
			endTimeMs: '',
			startDate: null,
			endDate: null,
			caseNo: '',//案件编号
			caseSource: undefined,//案件来源
			followBy: '',//跟进人
			tortsType: undefined,//侵权类型
			brandId: undefined,//侵权品牌
			caseAddr: '',//所在地
			caseSchedule: undefined,//案件状态
			suitStatus: undefined,//投诉状态
			warnStatus: undefined,//警告信状态
			gmtCreateStart: '',//开始时间
			gmtCreateEnd: '',//结束时间
			searchData
		}, () => {
			this.getCaseList([], 1)
		})
	}
	// 改变分页大小
	changePageSize(current, size) {
		this.setState({
			pageSize: size
		}, () => {
			this.getCaseList([], 1)
		})
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
			onChange: (page, pageSize) => this.getCaseList([], page),
			onShowSizeChange: (current, size) => this.changePageSize(current, size)
		}
	}
	// 渲染案件状态
	renderState(record) {
		let { intl } = this.props
		return (
			<div className="table-info">
				{
					record.caseFollowBy ?
						<p className="table-item">
							<span>
								<FormattedMessage id="case.case" defaultMessage="案件" />：
								{
									intl.locale === 'zh' ? record.caseScheduleName : record.caseScheduleNameEn
								}
								({record.caseFollowBy ? record.caseFollowBy : ''})
							</span>
						</p>
						: ''
				}
				{
					record.suitFollowBy ?
						<p className="table-item">
							<span><FormattedMessage id="case.litigation" defaultMessage="诉讼" />：
							{
									intl.locale === 'zh' ? record.suitStatusName : record.suitStatusNameEn
								}
								({record.suitFollowBy ? record.suitFollowBy : ''})
							</span>
						</p>
						: ''
				}
				{
					record.warnFollowBy ?
						<p className="table-item">
							<span><FormattedMessage id="case.warning.letter" defaultMessage="警告信" />：
							{
									intl.locale === 'zh' ? record.warnStatusName : record.warnStatusNameEn
								}
								({record.warnFollowBy ? record.warnFollowBy : ''})</span>
						</p>
						: ''
				}
			</div>
		)
	}
	//渲染操作
	renderOperation(record) {
		let { history, permissionList } = this.props
		return (
			<div>
				{
					getButtonPrem(permissionList, '003001005') ?
						<div className="table-info table-operate" onClick={() => history.push(`/case/detail?id=${record.id}`)}>
							<FormattedMessage id="router.case.management" defaultMessage="管理案件" description="管理案件" />
						</div> :
						<span style={{ color: '#668fff' }}>
							<FormattedMessage id="router.case.management" defaultMessage="管理案件" description="管理案件" />
						</span>
				}
			</div>
		)
	}
	// 创建table配置
	createColumns() {
		let { intl } = this.props
		const columns = [{
			title: <FormattedMessage id="case.number" defaultMessage="案件编号" description="案件编号" />,
			dataIndex: 'caseNo',
			key: 'caseNo',
			width: '15%',
		}, {
			title: <FormattedMessage id="case.source" defaultMessage="案件来源" description="案件来源" />,
			dataIndex: 'caseSourceName',
			key: 'caseSourceName',
			width: '10%',
			render: (text, item) => intl.locale === 'zh' ? text : item.caseSourceNameEn
		}, {
			title: <FormattedMessage id="case.platform" defaultMessage="来源平台" description="来源平台" />,
			dataIndex: 'platformTypeName',
			key: 'platformTypeName',
			width: '10%',
			render: (text, item) => intl.locale === 'zh' ? text : item.platformTypeNameEn
		}, {
			title: <FormattedMessage id="case.time" defaultMessage="报告时间" description="报告时间" />,
			dataIndex: 'gmtCreate',
			key: 'gmtCreate',
			width: '10%',
		}, {
			title: <FormattedMessage id="case.tort" defaultMessage="侵权类型" description="侵权类型" />,
			dataIndex: 'tortsTypeName',
			key: 'tortsTypeName',
			width: '10%',
			render: (text, item) => intl.locale === 'zh' ? text : item.tortsTypeNameEn
		}, {
			title: <FormattedMessage id="case.brand" defaultMessage="侵权品牌" description="侵权品牌" />,
			dataIndex: 'brandName',
			key: 'brandName',
			width: '10%',
		}, {
			title: <FormattedMessage id="case.address" defaultMessage="所在地" description="所在地" />,
			dataIndex: 'caseAddr',
			key: 'caseAddr',
			width: '10%',
		}, {
			title: <FormattedMessage id="case.state" defaultMessage="案件状态" description="案件状态" />,
			dataIndex: 'suitStatusName',
			key: 'suitStatusName',
			width: '15%',
			render: (text, record) => this.renderState(record)
		}, {
			title: <FormattedMessage id="global.operate" defaultMessage="操作" />,
			width: '10%',
			render: (text, record) => this.renderOperation(record)
		}];
		return columns;
	}

	// 显示自定义导出弹窗
	showExportExcelModal() {
		let result = localStorage.getItem('excelImport');
		let { exportExcelTitle } = this.props;
		if (result) {
			result = JSON.parse(result);
			if (!result.case) {
				let autoTitleParam = [];
				for (let i = 0; i < exportExcelTitle.length; i++) {
					const element = exportExcelTitle[i];
					if (element.excelType === 2) {
						autoTitleParam.push(element.num)
					}
				}
				this.setState({
					autoTitleParam,
					visibleExcelExport: true
				})
			} else {
				this.setState({
					autoTitleParam: result.case,
					visibleExcelExport: true
				})
			}
		} else if (!result) {
			let autoTitleParam = [];
			for (let i = 0; i < exportExcelTitle.length; i++) {
				const element = exportExcelTitle[i];
				if (element.excelType === 2) {
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
		result.case = data.autoTitleParam;
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
		let { searchData, autoTitleParam, autoPageNum, tbName } = this.state;
		let { saveExcelData, listTypeTortSource, listTypeTort, brandList, typeListCase, typeListComplaint, typeListWran } = this.props;
		let queryParamStr = [];
		if (searchData.caseNo) {
			queryParamStr.push(`案件编号:${searchData.caseNo}`)
		}
		if (searchData.caseSource) {
			let caseSource = getName(listTypeTortSource, searchData.caseSource);
			queryParamStr.push(`案件来源:${caseSource.dictLabel}`)
		}
		if (searchData.followBy) {
			queryParamStr.push(`跟进人:${searchData.followBy}`)
		}
		if (searchData.tortsType) {
			let tortsType = getName(listTypeTort, searchData.tortsType);
			queryParamStr.push(`侵权类型:${tortsType.dictLabel}`)
		}
		if (searchData.brandId) {
			let brandId = getName(brandList, searchData.brandId, 'brand');
			queryParamStr.push(`侵权品牌:${brandId.name}`)
		}
		if (searchData.caseAddr) {
			queryParamStr.push(`所在地:${searchData.caseAddr}`)
		}
		if (searchData.caseSchedule) {
			let caseSchedule = getName(typeListCase, searchData.caseSchedule);
			queryParamStr.push(`案件状态:${caseSchedule.dictLabel}`)
		}
		if (searchData.suitStatus) {
			let suitStatus = getName(typeListComplaint, searchData.suitStatus);
			queryParamStr.push(`投诉状态:${suitStatus.dictLabel}`)
		}
		if (searchData.warnStatus) {
			let warnStatus = getName(typeListWran, searchData.warnStatus);
			queryParamStr.push(`警告信状态:${warnStatus.dictLabel}`)
		}
		if (searchData.gmtCreateStart) {
			queryParamStr.push(`开始时间:${searchData.gmtCreateStart}`)
		}
		if (searchData.gmtCreateEnd) {
			queryParamStr.push(`结束时间:${searchData.gmtCreateEnd}`)
		}
		let data = {
			type: 1,
			excelType: 2,
			queryParam: JSON.stringify(searchData),
			queryParamStr: queryParamStr.toString(),
			autoTitleParam: autoTitleParam.toString(),
			autoPageNum,
			tbName
		}
		saveExcelData(data)
	}

	// 导入
	importExcel({ file }) {
		if (file.status === 'done' && file.response.success) {
			let data = {
				type: 0,
				excelType: 2,
				excelUrl: file.response.dataObject,
				excelName: file.name
			};
			this.props.saveExcelData(data)
			// message.info(file.response.msg)
			this.getCaseList([], 1)
		} else if (file.status === 'done' && !file.response.success) {
			message.info(file.response.msg)
		} else if (file.status === 'error') {
			message.info('导入失败，请稍后再试。')
		}
	}

	render() {
		let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '', titleId: 'router.case.management', title: '案件管理' }
		]
		let { permissionList, userInfo, intl, history, brandList, listTypeTort, typeListComplaint, listTypeTortSource, typeListCase, typeListWran, caseList, total, isFetch, exportExcelTitle } = this.props
		let { caseNo, caseSource, followBy, tortsType, brandId, caseAddr, caseSchedule, suitStatus, warnStatus, startDate, endDate, visibleExcelExport, autoTitleParam, tbName } = this.state
		return (
			<Content breadcrumbData={breadcrumbData}>
				<div className="search-form">
					<Row>
						<Col span={6}>
							<Form.Item label={intl.formatMessage({ id: "case.number", defaultMessage: "案件编号", description: "案件编号" })}>
								<Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "case.please.number", defaultMessage: "请输入案件编号", description: "请输入案件编号" })} onChange={e => this.setState({ caseNo: e.target.value.trim() })} value={caseNo} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label={intl.formatMessage({ id: "case.source", defaultMessage: "案件来源", description: "案件来源" })}>
								<Select
									showSearch
									value={caseSource}
									dropdownMatchSelectWidth={true}
									onChange={value => this.setState({ caseSource: value })}
									placeholder={intl.formatMessage({ id: "case.please.source", defaultMessage: "请选择案件来源", description: "请选择案件来源" })}
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
									{
										listTypeTortSource && listTypeTortSource.filter(item => item.isDel === 0)
											.map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label={intl.formatMessage({ id: "case.person", defaultMessage: "跟进人", description: "跟进人" })}>
								<Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "case.please.person", defaultMessage: "请输入跟进人", description: "请输入跟进人" })} onChange={e => this.setState({ followBy: e.target.value.trim() })} value={followBy} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label={intl.formatMessage({ id: "case.tort", defaultMessage: "侵权类型", description: "侵权类型" })}>
								<Select
									showSearch
									value={tortsType}
									dropdownMatchSelectWidth={true}
									onChange={value => this.setState({ tortsType: value })}
									placeholder={intl.formatMessage({ id: "case.please.tort", defaultMessage: "请选择侵权类型", description: "请选择侵权类型" })}
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
									{
										listTypeTort && listTypeTort.filter(item => item.isDel === 0)
											.map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							<Form.Item label={intl.formatMessage({ id: "case.brand", defaultMessage: "侵权品牌", description: "侵权品牌" })}>
								<Select
									showSearch
									value={brandId}
									dropdownMatchSelectWidth={true}
									onChange={value => this.setState({ brandId: value })}
									placeholder={intl.formatMessage({ id: "complaint.choose.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
									{
										brandList && brandList.filter(item => item.isDelete === 0)
											.map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label={intl.formatMessage({ id: "case.address", defaultMessage: "所在地", description: "所在地" })}>
								<Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "case.please.address", defaultMessage: "请输入所在地", description: "请输入所在地" })} onChange={e => this.setState({ caseAddr: e.target.value.trim() })} value={caseAddr} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label={intl.formatMessage({ id: "case.state", defaultMessage: "案件状态", description: "案件状态" })}>
								<Select
									showSearch
									value={caseSchedule}
									dropdownMatchSelectWidth={true}
									onChange={value => this.setState({ caseSchedule: value })}
									placeholder={intl.formatMessage({ id: "case.please.state", defaultMessage: "请选择案件状态", description: "请选择案件状态" })}
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
									{
										typeListCase && typeListCase.filter(item => item.isDel === 0)
											.map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label={intl.formatMessage({ id: "case.complaint", defaultMessage: "投诉状态", description: "投诉状态" })}>
								<Select
									showSearch
									value={suitStatus}
									dropdownMatchSelectWidth={true}
									onChange={value => this.setState({ suitStatus: value })}
									placeholder={intl.formatMessage({ id: "case.please.complaint", defaultMessage: "请选择投诉状态", description: "请选择投诉状态" })}
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
									{
										typeListComplaint && typeListComplaint.filter(item => item.isDel === 0)
											.map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							<Form.Item label={intl.formatMessage({ id: "case.letter", defaultMessage: "警告信状态", description: "警告信状态" })}>
								<Select
									showSearch
									value={warnStatus}
									dropdownMatchSelectWidth={true}
									onChange={value => this.setState({ warnStatus: value })}
									placeholder={intl.formatMessage({ id: "case.please.letter", defaultMessage: "请选择警告信状态", description: "请选择警告信状态" })}
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
									{
										typeListWran && typeListWran.filter(item => item.isDel === 0)
											.map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
									}
								</Select>
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
									<FormattedMessage id="global.search" defaultMessage="搜索" description="搜索" />
								</Button>
								<Button onClick={() => this.handleReset()}>
									<FormattedMessage id="global.reset" defaultMessage="重置" description="重置" />
								</Button>
							</div>
						</Col>
					</Row>
				</div>
				<Row className="operation-btns">
					<Col span={24}>
						{
							getButtonPrem(permissionList, '003001002') ?
								<Button type='primary' onClick={() => history.push('/case/new')}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
								: ''
						}
						{
							getButtonPrem(permissionList, '003001003') ?
								<Upload
									action={Req.uploadFile}
									withCredentials={true}
									showUploadList={false}
									onChange={(file) => this.importExcel(file)}
								>
									<Button className='upload-inport-style'><FormattedMessage id="global.import" defaultMessage="导入" description="导入" /></Button>
								</Upload> : ''
						}
						{
							getButtonPrem(permissionList, '003001004')
								? <Button onClick={() => this.showExportExcelModal()}>
									<FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
								</Button>
								: ''
						}
						{
							getButtonPrem(permissionList, '003001003') ?
								<a style={{ marginLeft: '15px', color: '#668fff' }} download="案件管理导入模板" href={Req.downloadExcelTemplate + `?num=7`}>
									<FormattedMessage id="global.download.import.template" defaultMessage="下载导入模板" description="下载导入模板" />
								</a>
								: ''
						}
					</Col>
				</Row>
				<Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
				<Table dataSource={caseList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
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
			</Content>
		)
	}
}
export default CaseList