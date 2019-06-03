import React, { Component } from 'react'
import Contnet from '../../common/layout/content/index'
import { Row, Col, Form, Select, Input, DatePicker, message, Button, Checkbox, Upload, Icon } from 'antd'
import Editor from 'wangeditor'
import { FormattedMessage } from 'react-intl'
import { formatDateToMs } from '../../../utils/util'
import '../common/index.css'
import req from '../../../api/req';
import UploadList from '../../common/upload/index';
import PictureModal from '../../common/layout/modal/pictureModal';
const Option = Select.Option
export default class ReleaseTask extends Component {
	constructor() {
		super()
		this.requireEditor = null;
		this.specificationEditor = null;
		this.state = {
			startTime: '',
			startTimeMs: '',
			startDate: null,
			endTime: '',
			endTimeMs: '',
			endDate: null,
			type: undefined,//任务类型
			name: '',//任务名称
			brandId: undefined,//品牌id
			require: '',//任务要求
			introduction: '',//任务结束
			addData: {
				type: '',//任务类型
				name: '',//任务名称
				brandId: '',//品牌id
				status: 2,//任务状态
				startTime: '',
				endTime: '',
				require: '',//任务要求
				introduction: ''//任务结束
			},
			userTypeLimits:[],//任务查看权限
			fileList:[],//上传文件主图
			visible:false,
			showImage:''
		}
		// 上传图片的配置
		this.uploadImageConfig = {
			//action: API.newRulrUploadImage,
			action: req.uploadImage,
			onChange: (file, fileList) => this.uploadChange(file, fileList),
			beforeUpload: (file, fileList) => this.checkFiles(file, fileList),
			name: "file",
			withCredentials: true,
			showUploadList: false
		}
	}

	componentDidMount() {
		this.requireEditor = this.createEditor(this.refs.require, { uploadImgServer: req.uploadImage })
		this.specificationEditor = this.createEditor(this.refs.specification, { uploadImgServer: req.uploadImage })
		this.requireEditor.create();
		this.specificationEditor.create();
	}

	createEditor(element, options) {
		let editor = new Editor(element);
		// 隐藏“网络图片”tab
		editor.customConfig.showLinkImg = false
		// 关闭粘贴样式的过滤
		editor.customConfig.pasteFilterStyle = false
		// 忽略粘贴内容中的图片
		editor.customConfig.pasteIgnoreImg = true
		// 将图片大小限制为 20M
		editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024
		if (options && options.uploadImgServer) {
			// 自定义上传参数
			editor.customConfig.uploadImgParams = {
				// 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
				// 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
				// data: '123456'
			}
			// withCredentials（跨域传递 cookie）
			editor.customConfig.withCredentials = true
			// 将 timeout 时间改为 3s
			editor.customConfig.uploadImgTimeout = 20000
			// 自定义 fileName
			editor.customConfig.uploadFileName = 'file'
			// 上传图片到服务器 在参数中传进来
			// editor.customConfig.uploadImgServer = req.uploadImage
			editor.customConfig.uploadImgHooks = {
				before: function (xhr, editor, files) {
					// 图片上传之前触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

					// 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
					// return {
					//     prevent: true,
					//     msg: '放弃上传'
					// }
				},
				success: function (xhr, editor, result) {
					// 图片上传并返回结果，图片插入成功之后触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
				},
				fail: function (xhr, editor, result) {
					// 图片上传并返回结果，但图片插入错误时触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
				},
				error: function (xhr, editor) {
					// 图片上传出错时触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
				},
				timeout: function (xhr, editor) {
					// 图片上传超时时触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
				},

				// 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
				// （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
				customInsert: function (insertImg, result, editor) {
					// 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
					// insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

					// 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
					var url = result.dataObject.replace(/^http:/, 'https:');
					insertImg(url)
					// result 必须是一个 JSON 格式字符串！！！否则报错
				}
			}
		} else {
			// 使用 base64 保存图片
			editor.customConfig.uploadImgShowBase64 = true
		}
		// 如果有自定义配置  则按自定义配置  没有则按默认配置
		if (options) {
			editor.customConfig = Object.assign(editor.customConfig, options)
		}
		return editor;
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

	//edit onChange事件
	onChangeEdit(type, html) {
		this.setState({
			[type]: html,
		})
	}

	//获取用户权限
	checkChange(checkedValues) {
		this.setState({
			userTypeLimits:checkedValues
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
			fileList: newImges
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
        let { fileList } = this.state;
        if (file) {
            let result = fileList.filter(item => {
                return item.uid !== file.uid
            })
            this.setState({ fileList: result })
        }
	}

	//确定发布任务
	addReportTask() {
		let { isFetch, addReleaseTask, userInfo, intl } = this.props
		let { type, brandId, name, startTime, endTime, addData, userTypeLimits, fileList } = this.state
		let require = this.requireEditor.txt.html(), 
			introduction = this.specificationEditor.txt.html(),
			str = '';
		if (fileList && fileList.length > 0) {
			if(fileList[0].response){
				str = fileList[0].response.msgCode
			}
		}
		if (name === '' || name === undefined) {
			message.warning(intl.formatMessage({ id: 'clue.report.please.task.name', defaultMessage: "请输入任务名称", description: "请输入任务名称" }));
			return
		}
		if (type === '' || type === undefined) {
			message.warning(intl.formatMessage({ id: 'clue.report.choose.task.type', defaultMessage: "请选择任务类型", description: "请选择任务类型" }));
			return
		}
		if (brandId === '' || brandId === undefined) {
			message.warning(intl.formatMessage({ id: 'clue.report.choose.brand.name', defaultMessage: "请选择所属品牌", description: "请选择所属品牌" }));
			return
		}
		if (startTime === '' || startTime === undefined) {
			message.warning(intl.formatMessage({ id: 'clue.report.choose.start.time', defaultMessage: "请选择开始时间", description: "请选择开始时间" }));
			return
		}
		if (endTime === '' || endTime === undefined) {
			message.warning(intl.formatMessage({ id: 'clue.report.choose.end.time', defaultMessage: "请选择结束时间", description: "请选择结束时间" }));
			return
		}
		if (require === '' || require === undefined) {
			message.warning(intl.formatMessage({ id: 'clue.report.please.task.require', defaultMessage: "请输入任务要求", description: "请输入任务要求" }));
			return
		}
		if (introduction === '' || introduction === undefined) {
			message.warning(intl.formatMessage({ id: 'clue.report.please.task.introduction', defaultMessage: "请输入任务介绍", description: "请输入任务介绍" }));
			return
		}
		addData = {
			type: type,//任务类型
			name: name,//任务名称
			brandId: brandId,//品牌id
			//status: 2,//任务状态
			startTime: startTime,
			endTime: endTime,
			require: require,//任务要求
			introduction: introduction,//任务结束
			userTypeLimits:userTypeLimits.toString(),//用户类型权限
			mainPics:str,//上传主图
		}
		addData.userId = userInfo.userId
		if (isFetch || isFetch === undefined) {
			addReleaseTask(addData)
		}
	}
	//取消
	cancel() {
		this.props.history.goBack()
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}
	render() {
		let { intl, brandList, reportTaskType } = this.props
		let { type, brandId, name, fileList,visible } = this.state
		let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '', titleId: 'router.clues.task.management', title: '线索及任务管理' },
			{ link: '/clue/task', titleId: 'router.report.task.management', title: '举报任务管理', query: { goBack: true } },
			{ link: '', titleId: 'clue.report.task.release.task', title: '发布任务' }
		]
		return (
			<Contnet breadcrumbData={breadcrumbData} className="clue-add-task-wrapper">
				<div className="search-form clue-add-task">
					<Row>
						<Col span={16}>
							<Form.Item label={intl.formatMessage({ id: "clue.report.task.name", defaultMessage: "任务名称" })}>
								<Input placeholder={intl.formatMessage({ id: "clue.report.please.task.name", defaultMessage: "请输入任务名称", description: "请输入任务名称" })}
									onChange={e => this.setState({ name: e.target.value.trim() })} value={name} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "clue.report.task.type", defaultMessage: "任务类型", description: "任务类型" })}>
								<Select
									placeholder={intl.formatMessage({ id: "clue.report.choose.task.type", defaultMessage: "请选择任务类型", description: "请选择任务类型" })}
									value={type}
									onChange={value => this.setState({ type: value })}
									showSearch
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
										reportTaskType && reportTaskType.filter(item => item.isDel === 0)
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
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "clue.report.brand.name", defaultMessage: "所属品牌", description: "所属品牌" })}>
								<Select
									placeholder={intl.formatMessage({ id: "clue.report.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
									value={brandId}
									onChange={value => this.setState({ brandId: value })}
									showSearch
									filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{
										brandList && brandList.filter(item => item.isDelete === 0)
											.map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
									}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
								<DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} value={this.state.startDate} showTime format="YYYY-MM-DD HH:mm:ss" />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
								<DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} value={this.state.endDate} showTime format="YYYY-MM-DD HH:mm:ss" />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={18}>
							<Form.Item label={intl.formatMessage({ id: "clue.report.user.privileges", defaultMessage: "任务查看权限", description: "任务查看权限" })}>
								<Checkbox.Group style={{ width: '100%' }} onChange={(checkedValues)=>this.checkChange(checkedValues)}>
									<Checkbox value="1,4,5"  style={{marginRight:'10px',marginLeft:'0px'}}><FormattedMessage id="clue.report.ordinary.users" defaultMessage="普通用户" description="普通用户" /></Checkbox>
									<Checkbox value="3"  style={{marginRight:'10px',marginLeft:'0px'}}><FormattedMessage id="clue.report.voluntary.remittance.users" defaultMessage="志愿汇用户" description="志愿汇用户" /></Checkbox>
								</Checkbox.Group>
							</Form.Item>
						</Col>
					</Row>
					<Row>
                        <Col span={8}>
                            <Form.Item label={intl.formatMessage({id:"clue.upload.task.master.map",defaultMessage:"上传任务主图"})}>
                                <Upload {...this.uploadImageConfig} fileList={fileList} data={(file) => this.formatImageData(file, 'officialImages')}>
									{
										fileList.length >= 1 ? null : (
											<a className="pictureUpload"><Icon type="upload"  className="iconUpload"/><FormattedMessage id="global.upload" defaultMessage="上传图片"/></a>
										)
									}
                                </Upload>
                                <UploadList 
                                    deleteImg={(file) => this.deleteShopItemImg(file)}
                                    onPreview={(file) =>this.setState({ visible: true, showImage: file.response.dataObject })} 
                                    fileList={fileList}
                                    />
                            </Form.Item>
                        </Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "clue.report.task.require", defaultMessage: "任务要求", description: "任务要求" })}>
								<div className="editor" ref='require'>
								</div>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "clue.report.task.introduction", defaultMessage: "任务介绍", description: "任务介绍" })}>
								<div className="editor" ref='specification'></div>
							</Form.Item>
						</Col>
					</Row>

					<div className="btns">
						<Button type='primary' onClick={() => this.addReportTask()}>
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