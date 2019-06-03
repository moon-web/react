import React, { Component } from 'react'
import { FormattedMessage,injectIntl } from 'react-intl'
import { Row, Col, Form, Modal, Input ,Upload , Icon,message} from 'antd';
import Req from '../../../../api/req'
import UploadList from '../../../common/upload';
import PictureModal from '../../../common/layout/modal/pictureModal'
class AddCommodityInformationModal extends Component{
    constructor() {
        super()
        this.state={
            showImage:'',
            visible:false,
            activeObj:{
                commodityinformationinfo:'',
                officialImages:[],
            },
            originData:{}

        }
        // 上传图片的配置
		this.uploadImageConfig = {
			action: Req.uploadImage,
			onChange: (file, fileList) => this.uploadChange(file, fileList),
			beforeUpload: (file, fileList) => this.checkFiles(file, fileList),
			name: "file",
			withCredentials: true,
            showUploadList: false,
		}
    }

    componentWillReceiveProps(nextProps) {
		if (nextProps.activeObj !== this.props.activeObj) {
			let data = Object.assign({}, nextProps.activeObj);
			this.setState({
				activeObj: data,
				originData: nextProps.activeObj
			})
		}
	}

    //取消商品信息新增modal
    handleCancel() {
       if(this.props.handleCancel){
            this.setState({
                activeObj: Object.assign({}, this.state.originData),
                visible:false,
            })
           this.props.handleCancel()
       }
    }

    //提交商品信息
    commodityInformationSubmit() {
        let activeObj = this.state.activeObj;
        let imgurl=''
        if(activeObj.officialImages[0]){
            if(activeObj.officialImages[0].response){
                imgurl=activeObj.officialImages[0].response.msgCode
            }else{
                imgurl=''
            }
        }
        activeObj.imgurl=imgurl;
        this.setState({
            activeObj
        })
        if(this.props.commodityInformationSubmit){
            this.props.commodityInformationSubmit(activeObj)
        }
    }

    // 整理/格式化图片对象
    formatImageData(file, clickType) {
        file.clickType = clickType;
        return file;
    }

    // 上传图片
	uploadChange({ file, fileList }) {
		let newImges = fileList;
		if (this.uid) {
		  newImges = fileList.filter(item => {
			return item.uid !== this.uid;
		  })
        }
        let { activeObj } = this.state
        activeObj.officialImages=newImges
		this.setState({
			activeObj
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

    // 删除图片
    deleteShopItemImg(file) {
        let { officialImages } = this.state.activeObj;
        if (file) {
            let result = officialImages.filter(item => {
                return item.uid !== file.uid
            })
            let { activeObj } = this.state
            activeObj.officialImages=result
            this.setState({ activeObj })
        }
    }
    
    //获取商品信息inutValue
    getcommodityinformationinfo(e) {
        let info=e.target.value.trim()
        let { activeObj } = this.state
        activeObj.commodityinformationinfo=info
        this.setState({ activeObj })
    }


    render(){
        let { intl, commodityInformationStatus} = this.props
        let { visible, showImage} = this.state
        let {officialImages ,commodityinformationinfo} = this.state.activeObj
        return(
            <Modal
                title={commodityInformationStatus==='add'?
                    intl.formatMessage({id:"case.new.product.information",defaultMessage:"新增商品信息"}):
                    intl.formatMessage({id:"case.edit.product.information",defaultMessage:"编辑商品信息"})
                }
                visible={this.props.visible}
                onOk={()=>this.commodityInformationSubmit()}
                onCancel={()=>this.handleCancel()}
                className="root"
                >
                <div className="search-form" >
                    <Row>
                        <Col span={20}>
                            <Form.Item  label={intl.formatMessage({id:"case.commodity.information",defaultMessage:"商品信息"})}>
                                <Input placeholder={intl.formatMessage({id:"case.please.commodity.information",defaultMessage:"请输入商品信息"})}   onChange={(e)=>this.getcommodityinformationinfo(e)} value={commodityinformationinfo}/>
                            </Form.Item>
                        </Col>
                        <Col span={20} style={{marginTop:'15px'}}>

                            <Form.Item  label={intl.formatMessage({id:"case.upload.img",defaultMessage:"上传图片"})}>

                                <Upload {...this.uploadImageConfig} fileList={officialImages} data={(file) => this.formatImageData(file, 'officialImages')}>
									{
										officialImages.length >= 1 ? null : (
											<a className="pictureUpload"><Icon type="upload"  className="iconUpload"/><FormattedMessage id="global.upload" defaultMessage="上传"/></a>
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
                </div>
                <PictureModal 
					visible={visible}
					onCancel={() => this.setState({ visible: false })}
					showImg={showImage}
				/>
        </Modal>
        )
    }
}
export default injectIntl(AddCommodityInformationModal)