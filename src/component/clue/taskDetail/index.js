import React, { Component } from 'react';
import {  FormattedMessage, injectIntl } from 'react-intl';
import { Form } from 'antd';
import Contnet from '../../common/layout/content/index';
import { queryUrlParams } from '../../../utils/util';
import PictureModal from '../../common/layout/modal/pictureModal'
class TaskDeatils extends Component {
    constructor() {
        super()
        this.state = {
            visible:false,
            showImage:''
        }
    }

    componentDidMount() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        let { history,getReportTaskDetail } = this.props;
        if (history.location.search) {
            let id = queryUrlParams('id');
            if(getReportTaskDetail){
                let data={
                    id,
                }
                getReportTaskDetail(data)
            }
        }
    }

    //获取大图
    getBigImg(img) {
        this.setState({
            visible:true,
            showImage:img
        })
    }

    render() {
        let { intl, reportTaskDetailsList } = this.props;
        let { visible } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '/clue/task',  query: { goback: true }, titleId: 'router.clues.task.management', title: '线索及任务管理' },
            { link: '', titleId: 'router.report.task.details', title: '任务详情' }
        ];
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 9 },
            },
        };
        //任务权限数据处理
        let privilegesTitle= [];
        if(reportTaskDetailsList){
            if(intl.locale === 'en'){
                if(reportTaskDetailsList.userTypeLimits.indexOf('1') !== -1 ){
                    privilegesTitle.push('Ordinary users')
                }
                if(reportTaskDetailsList.userTypeLimits.indexOf('3') !== -1 ){
                    privilegesTitle.push('Volunteer Users')
                }
            }else{
                if(reportTaskDetailsList.userTypeLimits.indexOf('1') !== -1 ){
                    privilegesTitle.push('普通用户')
                }
                if(reportTaskDetailsList.userTypeLimits.indexOf('3') !== -1 ){
                    privilegesTitle.push('志愿汇用户')
                }
            }
        }
        return (
            <Contnet breadcrumbData={breadcrumbData}>
                <div className="tasl-details">
                    <Form.Item label={intl.formatMessage({ id: "clue.report.task.name", defaultMessage: "任务名称" })} {...formItemLayout}>
                        { reportTaskDetailsList ? reportTaskDetailsList.name : ''}
                    </Form.Item>
                    <Form.Item label={intl.formatMessage({ id: "clue.report.task.type", defaultMessage: "任务类型", description: "任务类型" })} {...formItemLayout}>
                        { 
                            reportTaskDetailsList ? 
                                intl.locale === 'zh' ? 
                                    reportTaskDetailsList.typeName : 
                                    reportTaskDetailsList.typeNameEn 
                                : ''
                        }
                    </Form.Item>
                    <Form.Item label={intl.formatMessage({ id: "clue.report.brand.name", defaultMessage: "所属品牌", description: "所属品牌" })} {...formItemLayout}>
                        { reportTaskDetailsList ? reportTaskDetailsList.brandName : ''}
                    </Form.Item>
                    <Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })} {...formItemLayout}>
                        { reportTaskDetailsList ? reportTaskDetailsList.startTime : ''}
                    </Form.Item>
                    <Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })} {...formItemLayout}>
                        { reportTaskDetailsList ? reportTaskDetailsList.endTime : ''}
                    </Form.Item>
                    <Form.Item label={intl.formatMessage({ id: "clue.report.user.privileges", defaultMessage: "任务查看权限", description: "任务查看权限" })} {...formItemLayout}>
                        { 
                            reportTaskDetailsList ? 
                                privilegesTitle && privilegesTitle.length ? privilegesTitle.toString():<FormattedMessage id="clue.report.all.users" defaultMessage="所有用户" description="所有用户" />
                                : ''
                        }
                    </Form.Item>
                    <Form.Item label={intl.formatMessage({ id: "clue.report.img", defaultMessage: "任务主图", description: "任务主图" })} {...formItemLayout}>
                        { 
                            reportTaskDetailsList ? 
                                <img src={reportTaskDetailsList.mainPics?reportTaskDetailsList.mainPics.replace('/_','/'):''} alt="" style={{width:'345px'}} onClick={()=>this.getBigImg(reportTaskDetailsList.mainPics?reportTaskDetailsList.mainPics.replace('/_','/'):'')}/>
                                :''
                        }
                    </Form.Item>
                    <Form.Item label={intl.formatMessage({ id: "clue.report.task.require", defaultMessage: "任务要求", description: "任务要求" })} {...formItemLayout}>
                        {
                            reportTaskDetailsList ?
                                <div dangerouslySetInnerHTML={{__html: reportTaskDetailsList.require1}}></div>
                            :''
                        }
                    </Form.Item>
                    <Form.Item label={intl.formatMessage({ id: "clue.report.task.introduction", defaultMessage: "任务介绍", description: "任务介绍" })} {...formItemLayout}>
                        {
                            reportTaskDetailsList ?
                                <div dangerouslySetInnerHTML={{__html: reportTaskDetailsList.introduction}}></div>
                            :''
                        }
                    </Form.Item>
                </div>
                <PictureModal
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    showImg={this.state.showImage}
                />
            </Contnet>
        )
    }
}
export default injectIntl(TaskDeatils)