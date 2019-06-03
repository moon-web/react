import React, { Component } from 'react'
import { Col, Row, Upload ,message, Icon} from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import Req from '../../../api/req'
import '../common/index.css'
import { getButtonPrem } from '../../../utils/util'
const Dragger = Upload.Dragger;
export default class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {       
            fileList:[]
        }
    }

    //onchange
    addCaseReport(info,key) {
        let fileList = info.fileList;
        fileList = fileList.map((file) => {
            if(file.response) {
                file.url = file.response.dataObject
            }
            return file
        });
        fileList = fileList.filter(item => {
            return item.uid !== this.uid
        });
        this.setState({
            [key]:fileList
        })
        
        if (info.file.status === 'done') {
            if(info.file.response && info.file.response.success){
                message.success(`${info.file.name} 文件上传成功`);
            }else{
                message.error(`${info.file.response.msg}`);
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    }

    //判断文件上传大小
    beforeUpload(file,fileList) {
        if((file.size / 1024 / 1024)>10){
            message.info('上传文件过大');
            this.uid = file.uid;
            return false;
        }
    }

    render() {
        let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '', titleId: 'router.system.management', title: '系统管理' },
			{ link: '', titleId: 'router.upload.file', title: '上传附件' }
        ]
        let { fileList } = this.state
        let { userInfo, permissionList } = this.props
        return (
            <Content breadcrumbData={breadcrumbData} className="uploadfile">
                {
                    getButtonPrem(permissionList, '010004001') ? 
                    <Dragger 
                        name='file'
                        multiple = {true}
                        withCredentials={true}
                        action= {Req.uploadFile}
                        onChange={obj => this.addCaseReport(obj,'fileList')}
                        beforeUpload={(file, fileList) => this.beforeUpload(file, fileList)}
                        fileList={fileList}
                        data={{userId:userInfo.userId}}
                        className="upload-load-file"
                        showUploadList={false}
                    >
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">
                            <FormattedMessage id="upload.click.upload" defaultMessage="单击或拖动文件到该区域上载"/>
                        </p>
                        <p className="ant-upload-hint">
                            <FormattedMessage id="upload.support.bulk.upload" defaultMessage="支持单个或批量上传"/>
                        </p>
                    </Dragger> : ''
                }                
                <Row>
                    <Col span={20} offset={1}>
                        {
                            fileList?fileList.map((v,i)=>(
                                <Row key={i}>
                                    <div className="upload-list-text">
                                        <Col style={{marginRight:'10px'}}>
                                            {v.name?v.name:''}
                                        </Col>
                                        <Col>
                                            {v.response?v.response.dataObject:''}
                                        </Col>
                                    </div>
                                </Row>
                            )):""
                        }
                    </Col>
                </Row>
			</Content>
        )
    }
}
