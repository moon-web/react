import React, { Component } from 'react'
import {  Table, Row, Col, Form, Input, Upload, Icon, message, Button } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
import Req from '../../../../../api/req'
import '../index.css'
const { TextArea } = Input;
class Findings extends Component {
    constructor() {
        super()
        this.state={
            fileList:[],
            investigationSituation:''
        };
        this.uploadConfig = {
            action: Req.uploadFile,
            beforeUpload: file => this.beforeUpload(file),
            name: "file",
            withCredentials: true
        }
    }

    // 上传文件前检测文件大小
    beforeUpload(file) {
        if ((file.size / 1024 / 1024) >= 10) {
            message.info('上传文件过大');
            this.uid = file.uid;
            return false;
        }
    }

    // 上传文件
    uploadChange({ fileList }, key) {
        let newImges = fileList;
        if (this.uid) {
            newImges = fileList.filter(item => {
                return item.uid !== this.uid;
            })
        }
        for (let i = 0; i < newImges.length; i++) {
            const element = newImges[i];
            if (element.status === 'done') {
                element.url = element.response.dataObject;
            } 
        }
        this.changeState(key, newImges)
    }
    
    //赋值
    changeState(key, value) {
        this.setState({
            [key]: value
        })
    }

    //取消
    cancelSubimt() {
        this.setState({ 
            investigationSituation: '', 
            fileList: [] 
        })
    }

    // 上传文件转为字符串
    uploadListToString(data) {
        let result = [];
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                if (element.response && element.response.success) {
                    result.push(element.response.dataObject)
                }
            }
        }
        return result.toString()
    }

    //保存
    onOkSubmit() {
        let { fileList, investigationSituation } = this.state;
        let { addOfflineReportResult, queryLawyerCaseReport, cid } = this.props;
        if((investigationSituation === '' || investigationSituation=== undefined) && (fileList && fileList.length === 0 )){
            message.info('请完善提交信息')
            return
        }
        let data={
            infoId: cid,
            reportDetail: investigationSituation,
            fileUrlArray: fileList
        }
        if(addOfflineReportResult){
            addOfflineReportResult(data, ()=>{
                this.setState({
                    investigationSituation:'',
                    fileList:[]
                })
                if(queryLawyerCaseReport){
                    queryLawyerCaseReport({infoId: cid})
                }
            })
        }
    }

    createColumns() {
        const columns = [{
            title: <FormattedMessage id="offline.case.investigation.report" defaultMessage="调查情况" />,
            dataIndex: 'reportDetail',
            key: 'reportDetail',
        },{
            title: <FormattedMessage id="case.enclosure" defaultMessage="附件" />,
            dataIndex: 'suitBackReason',
            key: 'suitBackReason',
            render: (text, record) => {
                return(
                    <ul className="offline-enclosure">
                        {
                            record.fileUrl && record.fileUrl.length ? 
                                record.fileUrl.map((item,key)=>(
                                        <li key={key}>
                                            <a href={item.url}>{item.name}</a>
                                        </li>
                                    )):''
                        }
                    </ul>
                )
            }
        },{
            title: <FormattedMessage id="offline.case.gmtcreate" defaultMessage="提交时间" />,
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',            
            width: '20%'
        }]
        return columns
    }

    rowClassName(record, index) {
        const className = index%2 ===0 ? 'table-even' : ''
        return className
    }

    render() {
        let { offlineCaseReport, intl, brandAudit, offlineCaseDetail } = this.props;
        let { fileList, investigationSituation } = this.state;
        return (
            <div className='findings search-form logs'>
                {
                    offlineCaseDetail ? 
                    ( (!brandAudit || brandAudit !== 'audit') && ( offlineCaseDetail.status === 0 ) ) ? (
                        <div className="findings-form">
                            <Row>
                                <Col>
                                    <Form.Item label={intl.formatMessage({ id: "offline.case.investigation.report", defaultMessage: "调查情况", description: "调查情况" })}>
                                        <TextArea 
                                            rows={3} 
                                            onChange={e => this.changeState('investigationSituation', e.target.value)}
                                            value={investigationSituation}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="fileStr">
                                <Col span={16}>
                                    <Form.Item label={intl.formatMessage({ id: "offline.case.upload", defaultMessage: "上传附件", description: "上传附件" })}>
                                        <Upload
                                            fileList={fileList}
                                            {...this.uploadConfig}
                                            onChange={file => this.uploadChange(file, 'fileList')}
                                        >
                                            <a><Icon type='upload' /><FormattedMessage id="offline.case.upload" defaultMessage="上传附件" /></a>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className='submit-btns'>
                                <Button type='primary' onClick={() => this.onOkSubmit()} ><FormattedMessage id="global.save" defaultMessage="保存" /></Button>
                                <Button onClick={() => this.cancelSubimt()}>
                                    <FormattedMessage id="global.cancel" defaultMessage="取消" />
                                </Button>
                            </div>
                        </div>
                    ) :'' :''
                }
                <Table 
                    dataSource={offlineCaseReport}
                    bordered={false}
                    pagination={false}
                    // showHeader={false}
                    rowKey="id"
                    columns={this.createColumns()}
                    rowClassName={(record, index) => this.rowClassName(record, index)}
                />
            </div>
        )
    }
}

export default injectIntl(Findings)
