import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Form, Row, Col, Button, message, Input, Modal, Alert, Tooltip, Radio, Checkbox, Tabs, Pagination } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import PictureModal from '../../common/layout/modal/pictureModal'
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
import SearchForm from '../common/searchForm'
import { getButtonPrem, getName, queryUrlParams, getFormatDate } from '../../../utils/util'
import './index.css'
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

class ReportList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allAuditStatus: 6,//批量审核状态
			selectedRowKeys: [],
			allData: '',  // 是否选中全部
			chooseCount: 0,
			picIdList: [], //盗图，
			tradeIdList: [],//商标
			excludePicIdList: [],  // 选择全部数据的过滤ID
			excludeTradeIdList: [],  // 选择全部数据的过滤ID
			shopPageSize: 10,  // 查询分页大小
			storePageSize: 10,  // 查询分页大小
			visible: false,  // 弹窗显示状态
			visibleImg: false,
			auditReason: '',  // 审核理由
			rejectReason: '',//驳回理由
			editItem: '',  // 当前审核操作对象
			showImg: '',  // 当前显示的图片
			searchData: {
				// 默认查询参数
				auditStatus: 0, // 状态  默认待审核
				gmtCreateStart: '',//开始时间
				gmtCreateEnd: '',//结束时间
			},
			indeterminate: false,
			total: 0,
			visibleExcelExport: false,  // 自定义导出数据的弹窗控制
			autoTitleParam: [],  //  自定义数据
			autoPageNum: 100,  // 自定义数据量
			tbName: '志愿者举报管理-' + getFormatDate('yyyy-MM-dd-hh:mm'),
			tabActiveKey: 'shop'
		}
	}

	componentWillMount() {
		let endTime = getFormatDate('yyyy-MM-dd hh:mm:ss');
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let startTime = '';
		if ((month === 5 || month === 7 || month === 10 || month === 12) && day === 31) {
			day = 30
		} else if (month === 3 && year % 4 === 0 && day > 29) {
			day = 29
		} else if (month === 3 && year % 4 !== 0 && day > 28) {
			day = 28
		}
		if (month === 1) {
			year = year - 1;
			month = 12;
		} else {
			month = month - 1;
		}
		//startTime = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0'+ minutes : minutes}:${seconds < 10 ? '0'+seconds: seconds}`
		startTime = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} 00:00:00`
		let searchData = this.state.searchData;
		searchData.gmtCreateStart = startTime;
		searchData.gmtCreateEnd = endTime;
		let { reportList, history } = this.props
		if (!reportList.length || (reportList.length && history.action !== 'POP' && !history.location.query)) {
			let { tabActiveKey } = this.state;
			if (history.location.search) {
				let brandId = queryUrlParams('brandId');
				let userNameLikeOrMobile = queryUrlParams('userName');
				let startTime = queryUrlParams('startTime')
				let endTime = queryUrlParams('endTime')
				let reportCountStatus = queryUrlParams('reportCountStatus')
				let data = {
					brandId: brandId ? JSON.parse(brandId) : '',
					reportCountStatus: reportCountStatus ? Number(reportCountStatus) : '',
					gmtCreateStart: startTime,
					gmtCreateEnd: endTime,
					userNameLikeOrMobile: userNameLikeOrMobile ? userNameLikeOrMobile : ''
				}
				this.setState({
					searchData: data
				}, () => {
					if (tabActiveKey === 'shop') {
						this.getReportList([], 1)
					} else {
						this.getStorePage([], 1)
					}
					this.getReportReasonQueryList(brandId)
					this.getTrademarkQueryList(brandId)
				})
			} else {
				if (tabActiveKey === 'shop') {
					this.getReportList([], 1)
				} else {
					this.getStorePage([], 1)
				}
				this.getReportReasonQueryList()
				this.getTrademarkQueryList()
			}
		} else {
			let { searchData } = this.props
			this.setState({
				searchData: searchData
			})
		}
		if (this.props.getExportExcelTitle) {
			this.props.getExportExcelTitle({ excelType: 3 })
		}
	}

	componentWillReceiveProps(nextProps) {
		let { selectedRowKeys, allData, excludePicIdList, excludeTradeIdList } = this.state;
		if (nextProps.reportList !== this.props.reportList && allData === 'all') {
			for (let i = 0; i < nextProps.reportList.length; i++) {
				const element = nextProps.reportList[i];
				if (selectedRowKeys.indexOf(element.id) === -1 && element.auditStatus === 0 && excludePicIdList.indexOf(element.id) === -1 && excludeTradeIdList.indexOf(element.id) === -1) {
					selectedRowKeys.push(element.id)
				}
			}
			this.setState({ selectedRowKeys })
		}
	}

	// 查询参数
	queryData(pageNo) {
		let { searchData, shopPageSize, storePageSize, tabActiveKey } = this.state;
		let pageSize = 10;
		if (tabActiveKey === 'shop') {
			pageSize = shopPageSize;
		} else {
			pageSize = storePageSize;
		}
		// 请求后台
		let data = Object.assign({}, searchData)
		if (searchData.queryUrl) {
			data.queryUrl = encodeURIComponent(searchData.queryUrl);
		}
		//data.noReportSource = 2;
		data.pageNo = pageNo;
        data.pageSize = pageSize;
		return data;
	}

	// 获取举报列表
	getReportList(oldReportList, pageNo) {
		let data = this.queryData(pageNo);
		let { getReportList, isFetch } = this.props;
		if (!isFetch) {
			getReportList(oldReportList, data)
		}
	}

	// 获取店铺列表
	getStorePage(oldReportStoreList, pageNo) {
		let data = this.queryData(pageNo);
		let { isFetch, getStorePage } = this.props;
		if (!isFetch) {
			getStorePage(oldReportStoreList, data)
		}
	}

	// 获取查询参数--举报理由
	getReportReasonQueryList(brandId, reportReasonId) {
		// let { brandId, reportReasonId } = this.state;
		let data = {
			brandId: brandId === undefined ? '' : brandId,
			vrLabelLike: reportReasonId === undefined ? '' : reportReasonId
		};
		if (this.props.getReportReasonQueryList) {
			this.props.getReportReasonQueryList(data)
		}
	}

	// 获取查询参数--商标
	getTrademarkQueryList(brandId, trademarkId) {
		// let { brandId, trademarkId } = this.state;
		let data = {
			brandId: brandId === undefined ? '' : brandId,
			vrLabelLike: trademarkId === undefined ? '' : trademarkId
		};
		if (this.props.getReportReasonQueryList) {
			this.props.getTrademarkQueryList(data)
		}
	}

	// 全选按钮操作
	selectAll(e) {
        /**
         * 首先判断全选框的选中状态
         * 如果是选中状态则将选中的元素都添加到选中数组
         * 否则将所有的数据置空
         */
		let checked = e.target.checked,
			allData = '',
			total = 0,
			selectedRowKeys = [],
			chooseCount = 0;
		if (checked) {
			allData = 'all';
			if (selectedRowKeys.indexOf('all') === -1) {
				selectedRowKeys.push('all')
			}
			let { reportList, getVolunteerRepoerCount } = this.props;
			let { searchData } = this.state;
			// 请求后台
			let data = Object.assign({}, searchData);
			if (getVolunteerRepoerCount) {
				getVolunteerRepoerCount(data, (res) => {
					this.setState({
						chooseCount: res.dataObject,
						total: res.dataObject
					})
				})
			}
			for (let i = 0; i < reportList.length; i++) {
				const element = reportList[i];
				if (selectedRowKeys.indexOf(element.id) === -1 && element.auditStatus === 0) {
					selectedRowKeys.push(element.id);
				}
			}
		} else {
			if (selectedRowKeys.indexOf('all') !== -1) {
				selectedRowKeys.splice(selectedRowKeys.indexOf('all'), 1)
			}
			chooseCount = 0;
		}
		this.setState({
			selectedRowKeys,
			excludePicIdList: [],
			excludeTradeIdList: [],
			picIdList: [],
			tradeIdList: [],
			allData,
			chooseCount,
			total,
			indeterminate: false
		})
	}

	// 选择单项
	selectItem(e, record) {
        /**
         * 首选判断是否是全选状态下
         * 其次判断当前是否选中状态
         * 再次判断当前选择的数据类型
         * 然后根据当前选择的数据类型做对应的增删操作
         */
		let checked = e.target.checked, { allData, selectedRowKeys, excludePicIdList, excludeTradeIdList, picIdList, tradeIdList, chooseCount, total, indeterminate } = this.state;
		if (allData === 'all') {
			if (checked) {
				chooseCount += 1;
				if (record.reportType === 1) {
					excludePicIdList.splice(excludePicIdList.indexOf(record.id), 1)
				} else {
					excludeTradeIdList.splice(excludeTradeIdList.indexOf(record.id), 1)
				}
				if (selectedRowKeys.indexOf(record.id) === -1) {
					selectedRowKeys.push(record.id)
				}
			} else {
				chooseCount -= 1;
				if (record.reportType === 1) {
					if (excludePicIdList.indexOf(record.id) === -1) {
						excludePicIdList.push(record.id)
					}
				} else {
					if (excludeTradeIdList.indexOf(record.id) === -1) {
						excludeTradeIdList.push(record.id)
					}
				}
				selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
			}
		} else {
			allData = 'item'
			if (checked) {
				chooseCount += 1;
				if (record.reportType === 1) {
					if (picIdList.indexOf(record.id) === -1) {
						picIdList.push(record.id)
					}
				} else {
					if (tradeIdList.indexOf(record.id) === -1) {
						tradeIdList.push(record.id)
					}
				}
				if (selectedRowKeys.indexOf(record.id) === -1) {
					selectedRowKeys.push(record.id)
				}
				excludePicIdList.splice(excludePicIdList.indexOf(record.id), 1)
				excludeTradeIdList.splice(excludeTradeIdList.indexOf(record.id), 1)
			} else {
				chooseCount -= 1;
				picIdList.splice(picIdList.indexOf(record.id), 1)
				tradeIdList.splice(tradeIdList.indexOf(record.id), 1)
				selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
			}
		}
		if (total === chooseCount && total !== 0) {
			if (selectedRowKeys.indexOf('all') === -1) {
				selectedRowKeys.push('all')
			}
			indeterminate = false;
		} else if (chooseCount !== 0) {
			if (selectedRowKeys.indexOf('all') !== -1) {
				selectedRowKeys.splice(selectedRowKeys.indexOf('all'), 1)
			}
			indeterminate = true;
		} else if (chooseCount === 0) {
			if (selectedRowKeys.indexOf('all') !== -1) {
				selectedRowKeys.splice(selectedRowKeys.indexOf('all'), 1)
			}
			indeterminate = false;
		}
		this.setState({
			picIdList,
			tradeIdList,
			excludePicIdList,
			excludeTradeIdList,
			selectedRowKeys,
			allData,
			chooseCount,
			indeterminate
		})
	}

	// 搜索
	handleSearch(data) {
		this.setState({
			searchData: data,
			allData: '',
			picIdList: [],
			tradeIdList: [],
			chooseCount: 0,
			excludePicIdList: [],
			excludeTradeIdList: [],
			selectedRowKeys: [],
			indeterminate: false
		}, () => {
			this.getReportList([], 1)
			this.getStorePage([], 1)
		})
	}

	// 重置
	handleReset() {
		this.setState({
			selectedRowKeys: [],
			allData: '',
			picIdList: [],
			tradeIdList: [],
			chooseCount: 0,
			excludePicIdList: [],
			excludeTradeIdList: [],
			auditReason: '',
			rejectReason: '',
			searchData: {},
			indeterminate: false
		}, () => {
			this.getReportList([], 1)
			this.getStorePage([], 1)
			this.getReportReasonQueryList()
			this.getTrademarkQueryList()
		})
	}

	// 显示自定义导出弹窗
	showExportExcelModal() {
		let result = localStorage.getItem('excelImport');
		let { exportExcelTitle } = this.props;
		if (result) {
			result = JSON.parse(result);
			if (!result.volunteerReport) {
				let autoTitleParam = [];
				for (let i = 0; i < exportExcelTitle.length; i++) {
					const element = exportExcelTitle[i];
					if (element.excelType === 3) {
						autoTitleParam.push(element.num)
					}
				}
				this.setState({
					autoTitleParam,
					visibleExcelExport: true
				})
			} else {
				this.setState({
					autoTitleParam: result.volunteerReport,
					visibleExcelExport: true
				})
			}
		} else if (!result) {
			let autoTitleParam = [];
			for (let i = 0; i < exportExcelTitle.length; i++) {
				const element = exportExcelTitle[i];
				if (element.excelType === 3) {
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
		result.volunteerReport = data.autoTitleParam;
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
		let {
			saveExcelData, reportType: reportTypeList, brandList, platfromList,
			reportConfirmationStatus, reportResourceType, prodList, reportReasonQueryList, tardemarkQueryList,
			volunteerReportStatisticStatus
		} = this.props;
		let queryParamStr = [];
		if (searchData.userNameLikeOrMobile) {
			queryParamStr.push(`举报人:${searchData.userNameLikeOrMobile}`)
		}
		if (searchData.reportType) {
			let reportType = getName(reportTypeList, searchData.reportType);
			queryParamStr.push(`举报类型:${reportType.dictLabel}`)
		}
		if (searchData.brandId) {
			let brandId = getName(brandList, searchData.brandId, 'brand');
			queryParamStr.push(`所属品牌:${brandId.name}`)
		}
		if (searchData.platformType) {
			let platformType = getName(platfromList, searchData.platformType);
			queryParamStr.push(`平台:${platformType.dictLabel}`)
		}
		if (searchData.reportSourceType) {
			let reportSourceType = getName(reportResourceType, searchData.reportSourceType);
			queryParamStr.push(`举报来源:${reportSourceType.dictLabel}`)
		}
		if (searchData.reportReasonId) {
			let reportReason = getName(reportReasonQueryList, searchData.reportReasonId, 'reportReason');
			queryParamStr.push(`举报理由:${reportReason.vrLabel}`)
		}
		if (searchData.trademarkId) {
			let trademark = getName(tardemarkQueryList, searchData.trademarkId, 'trademark');
			queryParamStr.push(`商标:${trademark.vrLabel}`)
		}
		if (searchData.prodTypeId) {
			let prodType = getName(prodList, searchData.prodTypeId, 'prod');
			queryParamStr.push(`商品类别:${prodType.name}`)
		}
		if (searchData.auditStatus || searchData.auditStatus === 0) {
			let auditStatus = getName(reportConfirmationStatus, searchData.auditStatus);
			queryParamStr.push(`举报状态:${auditStatus.dictLabel}`)
		}
		if (searchData.gmtCreateStart) {
			queryParamStr.push(`开始时间:${searchData.gmtCreateStart}`)
		}
		if (searchData.gmtCreateEnd) {
			queryParamStr.push(`结束时间:${searchData.gmtCreateEnd}`)
		}
		if (searchData.queryUrl) {
			queryParamStr.push(`商品链接:${searchData.queryUrl}`)
		}
		if (searchData.storeName) {
			queryParamStr.push(`店铺名称:${searchData.storeName}`)
		}
		if (searchData.reportCountStatus) {
			let reportCountStatus = getName(volunteerReportStatisticStatus, searchData.reportCountStatus);
			queryParamStr.push(`统计状态:${reportCountStatus.dictLabel}`)
		}
		if (searchData.remarkLikeRight) {
			queryParamStr.push(`备注:${searchData.remarkLikeRight}`)
		}
		let result = Object.assign({}, searchData);
		if (searchData.queryUrl) {
			result.queryUrl = encodeURIComponent(searchData.queryUrl);
		}
		// let data = {
		// 	type: 1,
		// 	excelType: 3,
		// 	queryParam: JSON.stringify(result),
		// 	queryParamStr: queryParamStr.toString(),
		// 	autoTitleParam: autoTitleParam.toString(),
		// 	autoPageNum,
		// 	tbName
        // }
        let exportData = {
            //queryParam: JSON.stringify(result),
			queryParamStr: queryParamStr.toString(),
			autoTitleParam: autoTitleParam.toString(),
			autoPageNum,
			excelName: tbName
        }
        exportData = Object.assign(exportData,searchData)
		saveExcelData(exportData)
	}

	// 批量审核操作弹窗
	handleOperation() {
		let { chooseCount } = this.state
		let { intl } = this.props
		if (chooseCount > 0) {
			this.setState({
				visible: true,
				auditReason: '',
				rejectReason: ''
			})
		} else {
			message.info(intl.formatMessage({ id: 'brand.please.excuse.info', defaultMessage: '请选择待审核信息', description: '请选择待审核信息' }))
		}
	}

	// 批量审核不通过取消
	handleCancel() {
		this.setState({
			auditReason: '',
			rejectReason: '',
            visible: false,
            allAuditStatus: 6
		})
	}

	// 批量审核不通过确认
	handleOk() {
		let { allAuditStatus, picIdList, tradeIdList, auditReason, rejectReason, allData, excludePicIdList, excludeTradeIdList, selectedRowKeys, chooseCount, searchData, tabActiveKey } = this.state
		let { updateVolunteerReportByIdList, reportConfirmationStatus, reportList, shopPageNo, storePageNo } = this.props
		let pageNo = shopPageNo;
		if (tabActiveKey === 'shop') {
			pageNo = shopPageNo;
		} else {
			pageNo = storePageNo;
		}
		let data = {
			userNameLikeOrMobile: searchData.userNameLikeOrMobile ? searchData.userNameLikeOrMobile : '',
			brandId: searchData.brandId ? searchData.brandId : '',
			reportType: searchData.reportType ? searchData.reportType : '',
			platformType: searchData.platformType ? searchData.platformType : '',
			gmtCreateStart: searchData.gmtCreateStart ? searchData.gmtCreateStart : '',
			gmtCreateEnd: searchData.gmtCreateEnd ? searchData.gmtCreateEnd : '',
			queryUrl: searchData.queryUrl ? searchData.queryUrl : '',
			reportSourceType: searchData.reportSourceType ? searchData.reportSourceType : '',
			prodTypeId: searchData.prodTypeId ? searchData.prodTypeId : '',
			reportReasonId: searchData.reportReasonId ? searchData.reportReasonId : '',
			trademarkId: searchData.trademarkId ? searchData.trademarkId : '',
			storeName: searchData.storeName ? searchData.storeName : '',
			remarkLikeRight: searchData.remarkLikeRight ? searchData.remarkLikeRight : '',
			reportCountStatus: searchData.reportCountStatus ? searchData.reportCountStatus : '',
			//noReportSource: 2,
			selectedRowKeys,
			chooseCount,
			SendTime: getFormatDate('yyyy-MM-dd hh:mm:ss'),
			auditCount: chooseCount
		}
		auditReason = auditReason.replace(/^\s+|\s+$/g, "");
		if (allAuditStatus === 2 && auditReason === '') {
			message.info("不通过理由")
			return false
		}
		//rejectReason = rejectReason.replace(/^\s+|\s+$/g, "");
		if (allAuditStatus === 9 && auditReason === '') {
			message.info("驳回理由")
			return false
		}
		data.auditReason = auditReason;
		//data.rejectReason = rejectReason;
		data.auditStatusAfter = allAuditStatus;
		if (data.auditStatusAfter) {
			let auditStatus = getName(reportConfirmationStatus, allAuditStatus, 'suitStatus');
			data.auditStatusName = auditStatus.dictLabel;
			data.auditStatusNameEn = auditStatus.dictLabelEn;
		}
		if (allData === 'all') {
			data.excludePicIdList = excludePicIdList.toString();
			data.excludeTradeIdList = excludeTradeIdList.toString();
		} else {
			data.picIdList = picIdList.toString();
			data.tradeIdList = tradeIdList.toString();
		}
		updateVolunteerReportByIdList(data, reportList, (reload) => {
			this.setState({
				visible: false,
				picIdList: [],
				tradeIdList: [],
				auditReason: '',
				rejectReason: '',
				allData: '',
				excludePicIdList: [],
				excludeTradeIdList: [],
				selectedRowKeys: [],
				allAuditStatus: 6,
				chooseCount: 0,
				total: 0,
				indeterminate: false
			})
			if (reload) {
				let { tabActiveKey } = this.state;
				if (tabActiveKey === 'shop') {
					this.getReportList([], pageNo)
				} else {
					this.getStorePage([], pageNo)
				}
			}
		})
	}

	// 排序筛选
	changeSortOrder(pagination, filters, sorter) {
		let { searchData } = this.state;
		if (sorter.order === 'ascend') {
			if (sorter.columnKey === "whatAuditNum") {
				searchData.orderParam = 1;
				searchData.orderType = 2;
			} else if (sorter.columnKey === "vSuccNum") {
				searchData.orderParam = 2;
				searchData.orderType = 2;
			} else if (sorter.columnKey === "noSuccNum") {
				searchData.orderParam = 3;
				searchData.orderType = 2;
			}
		} else {
			if (sorter.columnKey === "whatAuditNum") {
                searchData.orderParam = 1;
                searchData.orderType = 1;
			} else if (sorter.columnKey === "vSuccNum") {
                searchData.orderParam = 2;
                searchData.orderType = 1;
			} else if (sorter.columnKey === "noSuccNum") {
                searchData.orderParam = 3;
                searchData.orderType = 1;
			}
		}
		this.setState({
			searchData: searchData
		}, () => {
			this.getStorePage([], 1)
		})
	}

	// tab切换时
	changePageTab(key) {
		this.setState({
			tabActiveKey: key
		}, () => {
			if (key === 'shop') {
				let { shopPageNo = 1 } = this.props;
				this.getReportList([], shopPageNo)
			} else {
				let { storePageNo = 1 } = this.props;
				this.getStorePage([], storePageNo)
			}
		})
	}

	// 页码改变时获取
	pageChange(pageNo) {
		let { tabActiveKey } = this.state;
		if (tabActiveKey === 'shop') {
			this.getReportList([], pageNo)
		} else {
			// 请求店铺列表
			this.getStorePage([], pageNo)
		}
	}

	// 设置页码大小
	setPageSize(pageSize) {
		let { tabActiveKey } = this.state;
		if (tabActiveKey === 'shop') {
			this.setState({
				shopPageSize: pageSize
			}, () => {
				this.getReportList([], 1)
			})
		} else {
			// 请求店铺列表
			this.setState({
				storePageSize: pageSize
			}, () => {
				this.getStorePage([], 1)
			})
		}
	}

	// 设置分页器
	renderPagination(pageNo, pageSize, total) {
		return (
			<Pagination
				showSizeChanger
				showQuickJumper
				total={total}
				current={pageNo}
				pageSize={pageSize}
				onChange={page => this.pageChange(page)}
				onShowSizeChange={(page, size) => this.setPageSize(size)}
			/>
		);
	}

	renderReportItem(data, item) {
		let { intl } = this.props
		return (
			<div className="tabel-info">
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="report.reporter" defaultMessage="举报人" description="举报人" />:
              		</span>
					<span>{item.userName}</span>
				</div>
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="global.platform" defaultMessage="平台" description="平台" />:
              		</span>
					<span>{intl.locale === 'zh' ? item.platformTypeName : item.platformTypeNameEn}</span>
				</div>
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="report.place.shop" defaultMessage="所在店铺" description="所在店铺" />:
              		</span>
					<span className="item-info-span item-link">
						<a href={item.storeUrl} title={item.storeUrl} target="_blank">{item.storeName}</a>
					</span>
				</div>
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="report.prod.name" defaultMessage="商品名称" description="商品名称" />:
              		</span>
					<span className="item-info-span item-link">
						<a href={item.prodUrl} title={item.prodName} target="_blank">{item.prodName}</a>
					</span>
				</div>
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="monitor.brand.information" defaultMessage="品牌信息" description="品牌信息" />:
          			</span>
					<span className="item-info-span">
						<span>{item.brandInfo}</span>
					</span>
				</div>
				{
					data === 1
						? (
							<div className="tabel-info-item">
								<span className="item-label-span">
									<FormattedMessage id="report.category" defaultMessage="商品类目" description="商品类目" />:
              					</span>
								<span className="item-info-span">
									{
										intl.locale === 'zh'
											? <Tooltip title={item.prodTypeName}>{item.prodTypeName.slice(0, 15)}...</Tooltip>
											: <Tooltip title={item.prodTypeNameEn}>{item.prodTypeNameEn.slice(0, 15)}...</Tooltip>
									}
								</span>
							</div>
						)
						: <div>
							{

								item.reportType === 3 ? '' :
									<div className="tabel-info-item" key="1">
										<span className="item-label-span">
											<FormattedMessage id="report.position.of.trademark" defaultMessage="商标出现位置" description="商标出现位置" />:
									</span>
										<span>{item.siteToAppearName}</span>
									</div>
							}
							<div className="tabel-info-item" key="2">
								<span className="item-label-span">
									<FormattedMessage id="report.report.reason" defaultMessage="举报理由" description="举报理由" />:
              					</span>
								<span>{item.reportReason}</span>
							</div>
						</div>
				}
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="report.source.type" defaultMessage="来源类型" description="来源类型" />:
          			</span>
					<span>{intl.locale === 'zh' ? item.reportSourceName : item.reportSourceNameEn}</span>
				</div>
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="report.report.time" defaultMessage="举报时间" description="举报时间" />:
          			</span>
					<span>{item.gmtCreateStr}</span>
				</div>
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="global.audit.time" defaultMessage="审核时间" description="审核时间" />:
          			</span>
					<span>{item.reportMgrAuditTime}</span>
				</div>
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="global.push.the.time" defaultMessage="推送时间" description="推送时间" />:
          			</span>
					<span>{item.filterSendTime}</span>
				</div>
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="global.brand.side.confirms.time" defaultMessage="品牌方确认时间" description="品牌方确认时间" />:
          			</span>
					<span>{item.gmtConfirm}</span>
				</div>
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="case.note" defaultMessage="备注" description="备注" />:
          			</span>
					<span>
						{item.remark}
					</span>
				</div>
				{
					data === 1
						? (
							<div className="tabel-info-item tabel-img-wrap">
								<span className="item-label-span">
									<FormattedMessage id="report.commodity.screenshots" defaultMessage="商品截图" description="商品截图" />:
              					</span>
								<div className="tabel-img-info">
									{
										item.prodPhoto
											? item.prodPhoto.split(",").map(img => {
												return (
													<div className="tabel-img-item" onClick={() => this.setState({ visibleImg: true, showImg: img ? img.replace('/_', '/') : '' })} key={img}>
														<img className="tabel-img" src={img} alt="商品截图" />
													</div>
												)
											})
											: ''
									}
								</div>
							</div>
						)
						: (
							<div className="tabel-info-item tabel-img-wrap">
								<span className="item-label-span">
									<FormattedMessage id="report.screenshot.of.reasons.for.reporting" defaultMessage="举报理由截图" description="举报理由截图" />:
              					</span>
								<div className="tabel-img-info">
									{
										item.reportReasonPhoto
											? item.reportReasonPhoto.split(",").map(img => {
												return (
													<div className="tabel-img-item" onClick={() => this.setState({ visibleImg: true, showImg: img ? img.replace('/_', '/') : '' })} key={img}>
														<img className="tabel-img" src={img} alt="商品截图" />
													</div>
												)
											})
											: ''
									}
								</div>
							</div>
						)
				}
			</div>
		)
	}

	renderShopItem(data, item) {
		let { intl } = this.props
		return (
			<div className="tabel-info">
				<div className="tabel-info-item">
					<span className="item-label-span">
						<FormattedMessage id="report.subordinate.to.the.brand" defaultMessage="所属品牌" description="所属品牌" />:
          			</span>
					<span className="item-info-span">
						<span>{item.brandName}</span>
					</span>
				</div>
				{
					data === 1
						? <div>
							<div className="tabel-info-item" key="1">
								<span className="item-label-span">
									<FormattedMessage id="report.official.website" defaultMessage="官方网址" description="官方网址" />:
              					</span>
								<span className="item-info-span item-link">
									<a href={item.refChannelUrl} target="_blank">{item.refChannelName ? item.refChannelName : item.refChannelUrl}</a>
								</span>
							</div>
							<div className="tabel-info-item" key="2">
								<span className="item-label-span">
									<FormattedMessage id="report.links.to.official.merchandise.or.images" defaultMessage="官方商品／图片链接" description="官方商品／图片链接" />:
              					</span>
								<span className="item-info-span item-link">
									<a href={item.officialProdUrl} title={item.officialProdUrl} target="_blank">{item.officialProdUrl}</a>
								</span>
							</div>
							<div className="tabel-info-item tabel-img-wrap" key="3">
								<span className="item-label-span">
									<FormattedMessage id="report.official.merchandise.or.picture.screenshots" defaultMessage="官方商品／图片截图" description="官方商品／图片截图" />:
              					</span>
								<div className="tabel-img-info">
									{
										item.officialProdPhoto ?
											item.officialProdPhoto.split(",").map(img => {
												return (
													<div className="tabel-img-item" onClick={() => this.setState({ visibleImg: true, showImg: img ? img.replace('/_', '/') : '' })} key={img}>
														<img className="tabel-img" src={img} alt="商品截图" />
													</div>
												)
											})
											: ''
									}
								</div>
							</div>
						</div>
						: ''
				}
				{
					data === 2
						? <div>
							<div className="tabel-info-item" key="1">
								<span className="item-label-span">
									<FormattedMessage id="report.category" defaultMessage="商品类目" description="商品类目" />:
              					</span>
								<span className="item-info-span">
									<span>
										{
											item.prodTypeId !== -99
												? intl.locale === 'zh'
													? <Tooltip title={item.prodTypeName}>{item.prodTypeName.slice(0, 15)}...</Tooltip>
													: <Tooltip title={item.prodTypeNameEn}>{item.prodTypeNameEn.slice(0, 15)}...</Tooltip>
												: ''
										}
									</span>
								</span>
							</div>
							<div className="tabel-info-item tabel-img-wrap" key="2">
								<span className="item-label-span">
									<FormattedMessage id="report.trademark" defaultMessage="商标" description="商标" />:
              					</span>
								<div className="tabel-img-info">
									{
										item.refChannelUrl
											? (
												<div className="tabel-img-item" onClick={() => this.setState({ visibleImg: true, showImg: item.refChannelUrl ? item.refChannelUrl.replace('/_', '/') : '' })}>
													<img className="tabel-img" src={item.refChannelUrl} alt="商标" />
												</div>
											)
											: <span>{item.refChannelName}</span>
									}
								</div>
							</div>
						</div>
						: ''
				}
				{
					data === 3
						? <div>
							<div className="tabel-info-item" key="1">
								<span className="item-label-span">
									<FormattedMessage id="report.category" defaultMessage="商品类目" description="商品类目" />:
              					</span>
								<span className="item-info-span">
									<span>
										{
											item.prodTypeId !== -99
												? intl.locale === 'zh'
													? <Tooltip title={item.prodTypeName}>{item.prodTypeName.slice(0, 15)}...</Tooltip>
													: <Tooltip title={item.prodTypeNameEn}>{item.prodTypeNameEn.slice(0, 15)}...</Tooltip>
												: ''
										}
									</span>
								</span>
							</div>
							<div className="tabel-info-item tabel-img-wrap">
								<span className="item-label-span">
									<FormattedMessage id="monitor.image.of.infringement" defaultMessage="侵权形象" description="侵权形象" />:
               					 </span>
								<div className="tabel-img-info">
									{
										item.refChannelUrl
											? <a href={item.refChannelUrl} target='_blank'>{item.refChannelName}</a>
											: <span>{item.refChannelName}</span>
									}
								</div>
							</div>
						</div>
						: ''
				}
			</div>
		)
	}


	renderAudit(text, item) {
		let { intl } = this.props
		return (
			<div>
				<p className="reason">
					<span style={{ color: 'red' }}>
						{intl.locale === 'zh' ? item.whiteTypeName : item.whiteTypeNameEn}
					</span>
				</p>
				<span>{intl.locale === 'zh' ? item.auditStatusName : item.auditStatusNameEn}</span>
				<br />
				{
					text === 3 || text === 4 || text === 5 ? (
						<p className="">
							<span>{item.confirmReason ? `(${item.confirmReason})` : ''}</span>
						</p>
					) : text === 9 ? (
						<p className="">
							<span>{item.rejectReason ? `(${item.rejectReason})` : ''}</span>
						</p>) : (
								<p className="">
									<span>{item.auditReason ? `(${item.auditReason})` : ''}</span>
								</p>
							)
				}
			</div>
		)
	}

	createShopTableOption() {
		let { intl, permissionList } = this.props;
		let { indeterminate } = this.state;
		const columns = [
			{
				title: <Checkbox value='all' indeterminate={indeterminate} onChange={e => this.selectAll(e)} />,
				width: '5%',
				dataIndex: 'id',
				key: 'checkbox',
				render: (text, item) => <Checkbox value={text} disabled={item.auditStatus !== 0} onChange={e => this.selectItem(e, item)} />
			}, {
				title: <FormattedMessage id="report.reporting.information" defaultMessage="举报信息" description="举报信息" />,
				dataIndex: 'reportType',
				key: 'id',
				width: '35%',
				render: (report, item) => this.renderReportItem(report, item)
			}, {
				title: <FormattedMessage id="report.the.official.information" defaultMessage="官方信息" description="官方信息" />,
				dataIndex: 'reportType',
				key: 'gmtAudit',
				width: '35%',
				render: (shop, item) => this.renderShopItem(shop, item)
			}, {
				title: <FormattedMessage id="report.report.type" defaultMessage="举报类型" description="举报类型" />,
				dataIndex: 'reportType',
				key: 'reportType',
				width: '10%',
				render: (text, item) => (
					intl.locale === 'en'
						? item.reportTypeNameEn
						: item.reportTypeName
				)
			}, {
				title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
				dataIndex: 'auditStatus',
				key: 'auditStatus',
				width: '10%',
				render: (text, item) => this.renderAudit(text, item)
			}, {
				title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
				dataIndex: 'auditStatus',
				key: 'operation',
				width: '10%',
				render: (text, item) => {
					return (
						getButtonPrem(permissionList, '004001002') && text === 0
							? <Link to={`/volunteer/report/audit?id=${item.id}&reportType=${item.reportType}&source=all`}>
								<FormattedMessage id="global.audit" defaultMessage="审核" description="审核" />
							</Link>
							: ''
					)
				}
			}
		];
		return columns;
	}

	createStoreTableOption() {
		let { intl } = this.props;
		let { searchData } = this.state;
		const columns = [
			{
				title: <FormattedMessage id="global.platform" defaultMessage="平台" description="平台" />,
				dataIndex: 'platformType',
				key: 'platformType',
				render: (text, item) => (
					intl.locale === 'en'
						? item.platformTypeNameEn
						: item.platformTypeName
				)
			}, {
				title: <FormattedMessage id="global.crawler.filter.type.store.name" defaultMessage="店铺名称" description="店铺名称" />,
				dataIndex: 'storeName',
				key: 'storeName',
				render: (text, item) => item.storeUrl ? <a href={item.storeUrl} title={text} target='_blank'>{text}</a> : text
			}, {
				title: <FormattedMessage id="users.pendingReview" defaultMessage="待审核量" description="待审核量" />,
				dataIndex: 'whatAuditNum',
				key: 'whatAuditNum',
				sorter: true,
				render: (text, item) => (
					text > 0
						? <Link
							to={
								`/volunteer/reportBase/list
								?userName=${searchData.userNameLikeOrMobile ? searchData.userNameLikeOrMobile : ''}
								&reportType=${searchData.reportType ? searchData.reportType : ''}
								&brandId=${searchData.brandId ? searchData.brandId : ''}
								&queryUrl=${searchData.queryUrl ? searchData.queryUrl : ''}
								&reportSourceType=${searchData.reportSourceType ? searchData.reportSourceType : ''}
								&prodTypeId=${searchData.prodTypeId ? searchData.prodTypeId : ''}
								&gmtCreateStart=${searchData.gmtCreateStart ? searchData.gmtCreateStart : ''}
								&gmtCreateEnd=${searchData.gmtCreateEnd ? searchData.gmtCreateEnd : ''}
								&reportReasonId=${searchData.reportReasonId ? searchData.reportReasonId : ''}
								&trademarkId=${searchData.trademarkId ? searchData.trademarkId : ''}
								&platformType=${item.platformType}
								&storeName=${encodeURIComponent(item.storeName)}
								&remark=${searchData.remark ? searchData.remark : ''}
								&reportCountStatus=3`
							}
							target='_blank'
						>
							{text}
						</Link>
						: text
				)
			}, {
				title: <FormattedMessage id="users.accurateQuantity" defaultMessage="成立量" description="成立量" />,
				dataIndex: 'vSuccNum',
				key: 'vSuccNum',
				sorter: true,
				render: (text, item) => (
					text > 0
						? <Link
							to={
								`/volunteer/reportBase/list
								?userName=${searchData.userNameLikeOrMobile ? searchData.userNameLikeOrMobile : ''}
								&reportType=${searchData.reportType ? searchData.reportType : ''}
								&brandId=${searchData.brandId ? searchData.brandId : ''}
								&queryUrl=${searchData.queryUrl ? searchData.queryUrl : ''}
								&reportSourceType=${searchData.reportSourceType ? searchData.reportSourceType : ''}
								&prodTypeId=${searchData.prodTypeId ? searchData.prodTypeId : ''}
								&gmtCreateStart=${searchData.gmtCreateStart ? searchData.gmtCreateStart : ''}
								&gmtCreateEnd=${searchData.gmtCreateEnd ? searchData.gmtCreateEnd : ''}
								&reportReasonId=${searchData.reportReasonId ? searchData.reportReasonId : ''}
								&trademarkId=${searchData.trademarkId ? searchData.trademarkId : ''}
								&platformType=${item.platformType}
								&storeName=${encodeURIComponent(item.storeName)}
								&remark=${searchData.remark ? searchData.remark : ''}
								&reportCountStatus=1`
							}
							target='_blank'
						>
							{text}
						</Link>
						: text
				)
			}, {
				title: <FormattedMessage id="users.invalidQuantity" defaultMessage="不成立量" description="不成立量" />,
				dataIndex: 'noSuccNum',
				key: 'noSuccNum',
				sorter: true,
				render: (text, item) => (
					text > 0
						? <Link
							to={
								`/volunteer/reportBase/list
								?userName=${searchData.userNameLikeOrMobile ? searchData.userNameLikeOrMobile : ''}
								&reportType=${searchData.reportType ? searchData.reportType : ''}
								&brandId=${searchData.brandId ? searchData.brandId : ''}
								&queryUrl=${searchData.queryUrl ? searchData.queryUrl : ''}
								&reportSourceType=${searchData.reportSourceType ? searchData.reportSourceType : ''}
								&prodTypeId=${searchData.prodTypeId ? searchData.prodTypeId : ''}
								&gmtCreateStart=${searchData.gmtCreateStart ? searchData.gmtCreateStart : ''}
								&gmtCreateEnd=${searchData.gmtCreateEnd ? searchData.gmtCreateEnd : ''}
								&reportReasonId=${searchData.reportReasonId ? searchData.reportReasonId : ''}
								&trademarkId=${searchData.trademarkId ? searchData.trademarkId : ''}
								&platformType=${item.platformType}
								&storeName=${encodeURIComponent(item.storeName)}
								&remark=${searchData.remark ? searchData.remark : ''}
								&reportCountStatus=2`
							}
							target='_blank'
						>
							{text}
						</Link>
						: text
				)
			}
		]
		return columns;
	}

	render() {
		let {
			showImg, visible, visibleImg, auditReason, chooseCount,
			selectedRowKeys, visibleExcelExport, autoTitleParam, tbName, tabActiveKey,
			searchData, shopPageSize, storePageSize
		} = this.state;
		let {
			reportList, isFetch, intl, permissionList, exportExcelTitle, reportStoreList,
			shopPageNo, shopTotal, storePageNo, storeTotal
		} = this.props;
		let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '', titleId: 'router.volunteer.report.management', title: '志愿者举报管理' }
		]
		return (
			<Content breadcrumbData={breadcrumbData}>
				<div className="report-list" id="report-list">
					<SearchForm
						{...this.props}
						searchData={searchData}
						handleOperation={() => this.handleOperation()}
						showExportExcelModal={() => this.showExportExcelModal()}
						handleSearch={data => this.handleSearch(data)}
						handleReset={() => this.handleReset()}
						getReportReasonQueryList={(brandId, reportReasonId) => this.getReportReasonQueryList(brandId, reportReasonId)}
						getTrademarkQueryList={(brandId, trademarkId) => this.getTrademarkQueryList(brandId, trademarkId)}
					/>
					<Alert
						message={intl.formatMessage({ id: "brand.a.total.of.data.in.the.interface", defaultMessage: `界面共（${shopTotal === undefined ? '0' : shopTotal}）条数据，已选择 (${{ chooseCount: chooseCount }}) 条数据`, description: `界面共（100）条数据` }, { count: shopTotal, chooseCount: chooseCount })}
						type="info"
						showIcon
						className="Alert_info"
					/>
					<Tabs
						defaultActiveKey='shop'
						activeKey={tabActiveKey}
						onChange={activeKey => this.changePageTab(activeKey)}
					>
						<TabPane tab='商品' key='shop'>
							<CheckboxGroup value={selectedRowKeys} style={{ width: '100%' }}>
								<Table
									className="report-tabel"
									dataSource={reportList}
									columns={this.createShopTableOption()}
									rowKey='id'
									loading={isFetch}
									pagination={false}
								/>
								{this.renderPagination(shopPageNo, shopPageSize, shopTotal)}
							</CheckboxGroup>
						</TabPane>
						{
							getButtonPrem(permissionList, '004001007') ?
								<TabPane tab='店铺' key='store'>
									<Table
										className="report-tabel"
										dataSource={reportStoreList}
										columns={this.createStoreTableOption()}
										rowKey='storeName'
										loading={isFetch}
										pagination={false}
										onChange={(pagination, filters, sorter) => this.changeSortOrder(pagination, filters, sorter)}
									/>
									{this.renderPagination(storePageNo, storePageSize, storeTotal)}
								</TabPane> : ''
						}
					</Tabs>
				</div>
				<Modal
					title={intl.formatMessage({ id: "report.report.audit", defaultMessage: "举报审核", description: "举报审核" })}
					visible={visible}
					width="600px"
					onOk={() => this.handleOk()}
					onCancel={() => this.handleCancel()}
					className="root"
				>
					<div className="search-form">
						<Row>
							<Col span={20}>
								<Form.Item label={intl.formatMessage({ id: "report.report.audit", defaultMessage: "举报审核", description: "举报审核" })}>
									<RadioGroup onChange={(e) => this.setState({ allAuditStatus: e.target.value })} value={this.state.allAuditStatus}>
										<Radio value={6}>审核通过</Radio>
										<Radio value={2}>审核不通过</Radio>
										<Radio value={9}>驳回</Radio>
									</RadioGroup>
								</Form.Item>
							</Col>
						</Row>
						{
							this.state.allAuditStatus === 2 ?
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: "report.refuse.to.reason", defaultMessage: "拒绝理由", description: "拒绝理由" })}>
											<Input placeholder={intl.formatMessage({ id: "report.please.enter.refuse.to.reason", defaultMessage: "请输入拒绝理由", description: "请输入拒绝理由" })} value={auditReason} onChange={e => this.setState({ auditReason: e.target.value.trim() })} />
										</Form.Item>
									</Col>
								</Row>
								: ''
						}
						{
							this.state.allAuditStatus === 9 ?
								<Row>
									<Col span={20}>
										<Form.Item label={intl.formatMessage({ id: 'report.reject.to.reason', defaultMessage: "驳回理由", description: "驳回理由" })}>
											<Input placeholder={intl.formatMessage({ id: "report.please.enter.reject.to.reason", defaultMessage: "请输入驳回理由", description: "请输入驳回理由" })} value={auditReason} onChange={e => this.setState({ auditReason: e.target.value.trim() })} />
										</Form.Item>
									</Col>
								</Row>
								: ''
						}
					</div>
				</Modal>
				<PictureModal
					onCancel={() => this.setState({ visibleImg: false })}
					visible={visibleImg}
					showImg={showImg}
				/>
				<ExcelExportModal
					onCancel={() => this.setState({ visibleExcelExport: false, autoTitleParam: [] })}
					onOk={data => this.confirmExcel(data)}
					visible={visibleExcelExport}
					data={exportExcelTitle}
					checkedData={autoTitleParam}
					title={intl.formatMessage({ id: "global.export", defaultMessage: "导出", description: "导出" })}
					total={shopTotal}
					tbName={tbName}
				/>
			</Content>

		)
	}
}

export default ReportList