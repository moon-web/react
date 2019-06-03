import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl'
import Editor from 'wangeditor'
import Req from '../../../api/req'
import { message } from 'antd'
import './index.css'
class EditorHtml extends Component {
	constructor() {
		super()
		this.editor = null;
		this.loading = null;
		this.state = {

		}
	}
	componentDidMount() {
		let { name, menus, colors, onChange, uploadSuccess } = this.props
		if (name) {
			//wangeditor
			const elem = this.refs[name]
			this.editor = new Editor(elem)
			//颜色
			this.editor.customConfig.colors = colors || [
				'#000000',
				'#eeece0',
				'#1c487f',
				'#4d80bf',
				'#c24f4a',
				'#8baa4a',
				'#7b5ba1',
				'#46acc8',
				'#f9963b',
				'#ffffff'
			]
			this.editor.customConfig.menus = menus || [
				'head',  // 标题
				'bold',  // 粗体
				'fontSize',  // 字号
				'fontName',  // 字体
				'italic',  // 斜体
				'underline',  // 下划线
				'strikeThrough',  // 删除线
				'foreColor',  // 文字颜色
				'backColor',  // 背景颜色
				'link',  // 插入链接
				'list',  // 列表
				'justify',  // 对齐方式
				'quote',  // 引用
				'emoticon',  // 表情
				'image',  // 插入图片
				'table',  // 表格
				'video',  // 插入视频
				'code',  // 插入代码
				'undo',  // 撤销
				'redo'  // 重复
			]
			// 隐藏“网络图片”tab
			this.editor.customConfig.showLinkImg = false

			this.editor.customConfig.uploadImgServer = Req.uploadImage;

			//限制图片上传名称
			this.editor.customConfig.uploadFileName = 'file';
			// 上传携带Cookie
			this.editor.customConfig.withCredentials = true;

			this.editor.customConfig.uploadImgTimeout = 20000;
			// 使用 onchange 函数监听内容的变化，并实时更新到 state 中
			this.editor.customConfig.onchange = html => {
				// 	this.setState({
				// 		editorContent: html,
				// 	})
				if (onChange) {
					onChange(html)
				}
			}

			this.editor.customConfig.uploadImgHooks = {
				before: function (xhr, editor, files) {
					// 图片上传之前触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
					
					// 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
					// return {
					//     prevent: true,
					//     msg: '放弃上传'
					// }
					this.loading = message.loading('上传中...', 0);
				},
				success: function (xhr, editor, result) {
					// uploadSuccess 仅作为获取上传成功的图片链接
					this.loading()
					message.info('上传成功')
					if (uploadSuccess) {
						uploadSuccess(result)
					}
					// 图片上传并返回结果，图片插入成功之后触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
				},
				fail: function (xhr, editor, result) {
					// 图片上传并返回结果，但图片插入错误时触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
					this.loading()
					message.info('上传失败')
				},
				error: function (xhr, editor) {
					// 图片上传出错时触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
					this.loading()
					message.info('上传失败')
				},
				timeout: function (xhr, editor) {
					// 图片上传超时时触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
					this.loading()
					message.info('上传超时')
				},
				customInsert: function (insertImg, result, editor) {
					// 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
					// insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

					// 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
					if (result.success) {
						let url = result.msgCode;
						insertImg(url)
						// result 必须是一个 JSON 格式字符串！！！否则报错
					} else {
						message.info(result.msg)
					}
				}
			};
			this.editor.create()
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.clear) {
			let intl = nextProps.intl;
			this.editor.txt.html(`<p>${intl.formatMessage({id: "global.please.pull.the.picture.in.or.paste.the.screenshot.to.upload", defaultMessage: "请拖入图片上传或截图粘贴图片上传"})}</p><p><br/></p><p><br/></p><br/>`)
		}
	}
	render() {
		let { name } = this.props
		return (
			<div ref={name}>
				<p><FormattedMessage id="global.please.pull.the.picture.in.or.paste.the.screenshot.to.upload" defaultMessage="请拖入图片上传或截图粘贴图片上传"/></p>
				<p><br/></p><p><br/></p><br/>
			</div>
		)
	}
}

export default injectIntl(EditorHtml)