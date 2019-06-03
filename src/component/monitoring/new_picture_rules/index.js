import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Col, Row, Input, Select, Upload, Icon, Button, message } from 'antd';
import './index.css';
import Contnet from '../../common/layout/content/index';
import PublicCheck from '../common/checkBox';
import MonitorTypeRadio from '../common/monitoringtyperadio';
import UploadList from '../../common/upload/index';
import FilterCondition from '../common/filterConditionItem'
import API from '../../../api/req';
import PictureModal from '../../common/layout/modal/pictureModal';
const Option = Select.Option;
class PictureRules extends Component {
    constructor() {
		super()
		this.state = {
			brand : undefined,//所属品牌
			checkedList : [1],
			plainOptions : [],
			type:1,
			officialImages:[],//图片list
			showImage: '',  // 当前modal显示图片
			visible:false,//新增图片modal状态
			monitorName:'',//规则名称
			existCondition:[],//过滤条件
			valuestatus:true,//所属类型状态回掉
			userId:"",
			filterListActiveObj: {filterRelation:undefined,filterType:undefined,filterVal:'',relationType:undefined},
			filterList: [],
			filterData: [],
			activeFilterData: [],
			filtersOut: [], //过滤条件之间的关系,
			activeFiltersOut: [],
			filtersOutActive: {nextFilter: '',prevFilter: '',relationType: undefined},
			flag:true
		}
		// 上传图片的配置
		this.uploadImageConfig = {
			//action: API.newRulrUploadImage,
			action: API.uploadImage,
			onChange: (file, fileList) => this.uploadChange(file, fileList),
			beforeUpload: (file, fileList) => this.checkFiles(file, fileList),
			name: "file",
			withCredentials: true,
			showUploadList: false
		}
	}
	
	componentWillMount() {
		let result =[];
		result = JSON.stringify(this.props.filterList)
		result = JSON.parse(result)
		this.setState({
			filterList: result
		})
	}
	
	componentWillReceiveProps(nextProps) {		
		if ( nextProps.filterList !== this.props.filterList) {
			let result =[];
			result = JSON.stringify(nextProps.filterList)
			result = JSON.parse(result)
			this.setState({
				filterList: result
			})
		}
	}

    //获取所属品牌
	getBrandInfo(value) {
		this.setState({
			brand:value
		})
	}
	  
	//所属类目回掉
	callBack(checkedList) {
		this.setState({
			checkedList
		})
	}

	//监控类型
	getMonitorTypeRadio(value) {
		this.setState({
			type:value
		})
    }
    
    // 上传图片
	uploadChange({ file, fileList }) {
		let newImges = fileList;
		if (this.uid) {
		  newImges = fileList.filter(item => {
			return item.uid !== this.uid;
		  })
		}
		this.setState({
			officialImages: newImges
		})
    }
    
    // 检验文件大小
    checkFiles(file) {
        if (file.size / 1024000 > 10) {
            this.uid = file.uid;
            message.warning('文件过大')
            return false
        } else {
            this.uid = null;
        }
    }

    // 整理/格式化图片对象
    formatImageData(file, clickType) {
        file.clickType = clickType;
        return file;
    }

    // 删除图片
    deleteShopItemImg(file) {
        let { officialImages } = this.state;
        if (file) {
            let result = officialImages.filter(item => {
                return item.uid !== file.uid
            })
            this.setState({ officialImages: result })
        }
	}
	
	//获取规则名称
	getMonitorName(e) {
		this.setState({
			monitorName:e.target.value.trim()
		})
	}

	//提交图片监控信息
	submitPictureMonitoring() {
		let conditionList=[], {monitorName, brand, checkedList, type, officialImages,filterData,filtersOut} = this.state
		let str = "",tfsid='';
        if (officialImages && officialImages.length > 0) {
			if(officialImages[0].response){
				str = officialImages[0].response.msgCode
				tfsid = officialImages[0].response.msg
			}
		}

		//过滤条件信息
		let tempFiltersOut = []
		if(filterData.length > 0 ){
			for(let i = 0; i < filterData.length; i ++){
				if(filterData[i].children){
					for(let j = 0;j< filterData[i].children.length; j ++){
						if(j === 0){
							filterData[i].children[0].relationType = ''
						}						
						if(filterData[i].dictVal === 2) {
							filterData[i].children[j].filterVal = filterData[i].children[j].filterVal.replace('-',',')
						}
						conditionList.push(filterData[i].children[j])	
					}		
				}	
			}
		}

		if(monitorName==="" || monitorName===undefined){
			message.info('请输入监控名称')
			return 
		}else if(brand==="" || brand===undefined){
			message.info('请选择所属品牌')
			return 
		}else if(checkedList.toString()===""){
			message.info('请选择所属类目')
			return 
		}else if(str===''){
			message.info('请上传图片')
			return 
		}else if(filtersOut) {
			if(filtersOut.length > 0){
				for(let i = 0; i < filtersOut.length-1; i ++){
					tempFiltersOut.push(filtersOut[i])
					if(filtersOut[i].relationType === '' || filtersOut[i].relationType === undefined){
						message.info('请选择条件之间的关系')
						return 
					}
				}
			}
			if(filterData.length > 0 ){
				for(let i = 0; i < filterData.length; i ++){
					if(filterData[i].children){
								
					}else {
						message.info(`请添加${filterData[i].dictLabel}信息`)
						return
					}
				}
			}
		}

		let data={
			monitorName:monitorName,//监控名称
			ownedBrand:brand,//所属品牌
			categoryId:checkedList.toString(),//所属类目
			monitorType:type,//监控类型
			imageUrl:str,
			filtersOut: tempFiltersOut,
			filters: conditionList,
			currentUserId:this.props.userInfo.userId,
			tfsid:tfsid
		}

		if(this.state.flag){
			this.props.createpicturerules(data, ()=>{
				this.setState({flag:false})
			})
		}
	}

	//取消新增
	cancel() {
		this.props.history.goBack()
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}

	//添加单个条件
	addFilter(item,key) {
		let { filterData, filterListActiveObj } = this.state
		if(item.children && item.children.length >= 1){
			if((filterData[key].relationType === '' || filterData[key].relationType === undefined)) {
				message.info('请选择与或条件关系')
				return
			}
		}

		if(filterData[key].filterRelation === '' || filterData[key].filterRelation === undefined) {
			message.info('请包含条件关系')
			return
		}

		if (filterData[key].filterVal === '' || filterData[key].filterVal === undefined) {
			message.info('请填写限制条件')
			return
		}

		if(filterData[key].dictVal===2 && filterData[key].filterVal && !(/^\d+-\d+$/.test(filterData[key].filterVal))){
			message.info('请补全信息')
			return
		}
		
		filterData[key].relationType = undefined //与或条件
		filterData[key].filterRelation = undefined //包含条件
		filterData[key].filterVal = ''
		filterListActiveObj.filterType = item.dictVal
		for(let i = 0; i< filterData.length; i++){
			if(item.dictVal === filterData[i].dictVal){
				if(filterData[i].children) {
					filterData[i].children.push(filterListActiveObj)
				}else {
					filterData[i].children = []
					filterData[i].children.push(filterListActiveObj)
				}
			}
		}
		this.setState({
			filterData,
			filterListActiveObj: {filterRelation:undefined,filterType:undefined,filterVal:'',relationType:undefined}
		})
		
	}

	//条件选择
	conditionSelectionOnchange(value,type,key,item) {
		let { filterData, filtersOut } = this.state
		let filtersOutActive = {
			prevFilter: filterData[key-1].dictVal,
			nextFilter: filterData[key].dictVal,
			relationType: value
		}
		filtersOut[key-1] = filtersOutActive
		this.setState({
			filtersOut
		})
	}

	//选择
	conditionOnchange(value,type,key) {
		let { filterListActiveObj, filterData} = this.state
		filterListActiveObj[type] = value
		filterData[key][type] = value
		this.setState({
			filterListActiveObj,
			filterData
		})
	}

	//添加条件内容
	conditionInputOnchange(e, type, key, entryType) {
		let { filterListActiveObj, filterData } = this.state
		if (entryType === 'minPrice') {
			if (filterData[key][type] && filterData[key][type].indexOf('-') !== -1) {
				filterListActiveObj[type] = filterListActiveObj[type].replace(/^(\d+|\d*)-/, e.target.value + '-');
				filterData[key][type] = filterData[key][type].replace(/^(\d+|\d*)-/, e.target.value + '-');
			} else {
				filterListActiveObj[type] = e.target.value + '-'
				filterData[key][type] = e.target.value + '-'
			}
		} else if (entryType === 'maxPrice') {
			if (filterData[key][type] && filterData[key][type].indexOf('-') !== -1) {
				filterListActiveObj[type] = filterListActiveObj[type].replace(/-(\d+|\d*)$/, '-' + e.target.value);
				filterData[key][type] = filterData[key][type].replace(/-(\d+|\d*)$/, '-' + e.target.value);
			} else {
				filterListActiveObj[type] = '-' + e.target.value
				filterData[key][type] = '-' + e.target.value
			}
		} else if (entryType === 'time') {
			filterListActiveObj[type] = e;
			filterData[key][type] = e;
		} else {
			filterListActiveObj[type] = e.target.value
			filterData[key][type] = e.target.value
		}
		this.setState({
			filterListActiveObj,
			filterData
		})
	}

	//删除单个条件
	delFilterCondition(v,i,key) {
		let { filterData } = this.state
		let data = filterData[key].children
		if(data.length > 0) {
			data = data.filter(item => {
				return item.filterVal !== v.filterVal
			})
			filterData[key].children = data
			this.setState({
				filterData
			})
		}
	}

	//上移下移
	moveUpDown(item,key,type) {
		let { filterData, filtersOut } = this.state	
		if(type === 'down'){
			filterData[key] = [filterData[key+1],filterData[key+1] = filterData[key]][0] 
			if(key === 0 || key === filtersOut.length-1){
				filtersOut[key].prevFilter = filterData[key].dictVal
				filtersOut[key].nextFilter = filterData[key+1].dictVal
				filtersOut[key+1].prevFilter = filterData[key+1].dictVal
			}else {
				filtersOut[key-1].nextFilter = filterData[key].dictVal
				filtersOut[key].prevFilter = filterData[key].dictVal
				filtersOut[key].nextFilter = filterData[key+1].dictVal
				filtersOut[key+1].prevFilter = filterData[key+1].dictVal
			}
			this.setState({
				filterData,
				filtersOut
			})
		}else {
			filterData[key-1] = [filterData[key],filterData[key] = filterData[key-1]][0] 
			if(key === 1){
				filtersOut[key-1].prevFilter = filterData[key-1].dictVal
				filtersOut[key-1].nextFilter = filterData[key].dictVal
				filtersOut[key].prevFilter = filterData[key].dictVal
			}else if(key === filtersOut.length-1) {
				filtersOut[key-2].nextFilter = filterData[key-1].dictVal
				filtersOut[key-1].prevFilter = filterData[key-1].dictVal
				filtersOut[key-1].nextFilter = filterData[key].dictVal
				filtersOut[key].prevFilter = filterData[key].dictVal
			}else {
				filtersOut[key-2].nextFilter = filterData[key-1].dictVal
				filtersOut[key-1].prevFilter = filterData[key-1].dictVal
				filtersOut[key-1].nextFilter = filterData[key].dictVal
				filtersOut[key].prevFilter = filterData[key].dictVal
			}
			this.setState({
				filterData,
				filtersOut
			})
		}
	}

	//过滤条件tab
	tabClick(item, key) {
		let { filterData, filterList, filtersOut } = this.state
		filterList[key].active = !filterList[key].active
		let filtersOutActive = {
			prevFilter: '',
			nextFilter: '',
			relationType: ''
		}
		let isExist = false;
		let activeId = null;
		if (item.active === true) {
			filtersOut.push(filtersOutActive)
			let activeItem = {}
			for(let key in item){   
				if(key !== 'children'){
					activeItem[key] = item[key]
				}  
			} 
			filterData.push(activeItem)
		}else{
			for (let i in filtersOut) {
				if (filtersOut[i].prevFilter === item.dictVal || filtersOut[i].nextFilter === item.dictVal) {
					isExist = true
					activeId = i
				}
			}
			if (isExist) {
				if (filtersOut[activeId - 1]) {
					filtersOut[activeId - 1] = filtersOutActive
				}
				if (filtersOut[activeId + 1]) {
					filtersOut[activeId + 1] = filtersOutActive
				}
				filtersOut.splice(activeId, 1).join(',')
			} else {
				filtersOut.pop()
			}
			for(let i in filterData){
				if(filterData[i].dictVal === item.dictVal){					
					filterData.splice(i,1).join(',')
				}
			}
		}
		this.setState({
			filterData,
			filterList,
			filtersOut
		})
	}

    render(){
        let { officialImages, visible, checkedList, brand, monitorName,filterData ,filterList,filtersOut} = this.state
		let { intl, brandList ,typeList} = this.props
		let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '', titleId: 'router.data.monitoring', title: '数据监测管理' },
            { link: '/monitor/rule', titleId: 'router.monitoring.rlue.management', title: '监控规则管理' },
			{ link: '', titleId: 'router.new.picture.rlue', title: '新增图片监控' }
		]

        return(
            <Contnet breadcrumbData={breadcrumbData} className="new-monitoring-rules-wrapper">
                <div className="search-form new-monitoring-rules-box">
					<Row>
						<Col span={16} className='monitoringName'>
							<Form.Item label={intl.formatMessage({id:"monitor.picture.rule.name",defaultMessage:"规则名称"})}>
								<Input placeholder={intl.formatMessage({id:"monitor.please.input.the.rule.name",defaultMessage:"请输入规则名称"})} onChange={(e)=>this.getMonitorName(e)} value={monitorName}/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8} className='monitoringName'>
							<Form.Item label={intl.formatMessage({id:"monitor.picture.rule.brand",defaultMessage:'所属品牌'})}>
								<Select 
									placeholder={intl.formatMessage({id:"monitor.please.input.picture.rule.brand",defaultMessage:'请选择所属品牌'})}
									onChange={(value)=>this.getBrandInfo(value)}
									value={brand}
									showSearch
									optionFilterProp="children"
									filterOption={(input, option) => option.props.value === '' ? false :  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
										brandList.filter(item => item.isDelete === 0)
											.map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
                        <Col span={24}>
                            <Form.Item label={intl.formatMessage({id:"monitor.picture.rule.subordinate.category",defaultMessage:"所属类目"})}>
								<PublicCheck 
									checkedList={checkedList}
									plainOptions={typeList}
									callBack={(checkedList)=>this.callBack(checkedList)}
								/>
                            </Form.Item>
                        </Col>
					</Row>
					<Row>
                        <Col span={24}>
                            <Form.Item label={intl.formatMessage({id:"monitor.picture.rule.monitoring.mode",defaultMessage:"监控类型"})}>
								<MonitorTypeRadio getMonitorTypeRadio={(value)=>this.getMonitorTypeRadio(value)} value={this.state.type}/>
                            </Form.Item>
                        </Col>
					</Row>
					<Row>
                        <Col span={8}>
                            <Form.Item label={intl.formatMessage({id:"monitor.picture.rule.sample.picture",defaultMessage:"样本图片"})}>
                                <Upload {...this.uploadImageConfig} fileList={officialImages} data={(file) => this.formatImageData(file, 'officialImages')}>
									{
										officialImages.length >= 1 ? null : (
											<a className="pictureUpload"><Icon type="upload"  className="iconUpload"/><FormattedMessage id="global.upload" defaultMessage="上传图片"/></a>
										)
									}
                                </Upload>
                                <UploadList 
                                    deleteImg={(file) => this.deleteShopItemImg(file)}
                                    onPreview={(file) =>this.setState({ visible: true, showImage: file.response.dataObject })} 
                                    fileList={officialImages}
                                    />
                            </Form.Item>
                        </Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({id:"monitor.condition.add.rule",defaultMessage:"过滤条件"})}>
								<div className="tab-contain">
									<div className="tab-box">
									{
											filterList.map((item,key) => (
												<span key={key} className={item.active ? 'tab-item-active' : 'tab-item'} onClick={() => this.tabClick(item,key)}>
													<FormattedMessage id={`monitor.${item.dictLabelEn}`} defaultMessage={item.dictLabel} />
										
												</span>
											))
										}
									</div>
									<div className="tab-box-list">
										<FilterCondition 
											filterData={filterData} 
											addFilter={(item,key) => this.addFilter(item,key)}
											conditionSelectionOnchange={(value,type,key,item) => this.conditionSelectionOnchange(value,type,key,item)}
											conditionOnchange={(value,type,key) => this.conditionOnchange(value,type,key)}
											conditionInputOnchange={(e, type, key, entryType) => this.conditionInputOnchange(e, type, key, entryType)}
											delFilterCondition={(v,i,key) => this.delFilterCondition(v,i,key)}
											moveUpDown={(item,key,type) => this.moveUpDown(item,key,type)}
											filtersOut={filtersOut}
										/>	
									</div>
								</div>															
							</Form.Item>
						</Col>
                    </Row>								
					<div className="btns">
						<Button type='primary' onClick={() => this.submitPictureMonitoring()}>
							<FormattedMessage id="global.determine" defaultMessage="确定" description="确定" />
						</Button>
						<Button onClick={() => this.cancel()} >
							<FormattedMessage id="global.cancel" defaultMessage="取消" description="取消" />
						</Button>
					</div>
					<PictureModal 
						visible={visible}
						onCancel={() => this.setState({ visible: false })}
						showImg={this.state.showImage}
					/>
                </div>
            </Contnet>
        )
    }
}
export default injectIntl(PictureRules)