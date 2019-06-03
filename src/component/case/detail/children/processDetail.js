import React, { Component } from 'react'
import { Card, Col, Input, Row, Button } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import { getButtonPrem} from '../../../../utils/util'
class ProcessDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            processDetail: {},
            edit: false
        }
    }


    componentWillMount() {
        let processDetail = this.props.processDetail;
        this.getDetail(processDetail)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.processDetail !== this.props.processDetail) {
            let { processDetail } = nextProps;
            this.getDetail(processDetail)
        }
    }

    // 获取详情
    getDetail(processDetail) {
        if (processDetail) {
            this.setState({
                processDetail: Object.assign({}, processDetail)
            })
        }
    }

    // 修改
    changeProcessDetail(value, key) {
        let { processDetail } = this.state;
        processDetail[key] = value;
        this.setState({
            processDetail
        })
    }

    // 取消更改
    cancelChange() {
        let { processDetail } = this.props;
        this.getDetail(processDetail)
        this.setState({
            edit: false
        })
    }

    // 提交更改
    submitChange() {
        let { processDetail } = this.state;
        this.props.updateProcessDetail(processDetail, () => {
            this.setState({
                edit: false
            })
        })
    }

    render() {
        let { intl,permissionList } = this.props;
        let { processDetail, edit } = this.state;
        return (
            <Card 
                extra={ !edit ? getButtonPrem(permissionList,'003001006')?<a onClick={() => this.setState({edit: true})}><FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" /></a> : '':''}
                className="case-detail-process" 
                title={intl.formatMessage({ id: "case.process.info", defaultMessage: "案件过程相关信息", description: "案件过程相关信息" })}
            >
                <Row>
                    <Col span={12} className="case-detail-flex">
                        <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                            <FormattedMessage id="case.investigation.company" defaultMessage="调查公司(调查人)" description="调查公司(调查人)" />:
                        </p>
                        <div className="case-detail-input-wrap">
                            <Input 
                                disabled={!edit}
                                value={processDetail ? processDetail.investigatePerson : ''} 
                                onChange={e=> this.changeProcessDetail(e.target.value.trim(), 'investigatePerson')}
                            />
                        </div>
                    </Col>
                    <Col span={12} className="case-detail-flex">
                        <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                            <FormattedMessage id="case.law.enforcement.agency" defaultMessage="执法机关" description="执法机关" />:
                        </p>
                        <div className="case-detail-input-wrap">
                            <Input 
                                disabled={!edit}
                                value={processDetail ? processDetail.lawEnforcementAgency : ''} 
                                onChange={e=> this.changeProcessDetail(e.target.value.trim(), 'lawEnforcementAgency')}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} className="case-detail-flex">
                        <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                            <FormattedMessage id="case.information.law.enforcement.officers" defaultMessage="执法人员相关信息" description="执法人员相关信息" />:
                        </p>
                        <div className="case-detail-input-wrap">
                            <Input 
                                disabled={!edit}
                                value={processDetail ? processDetail.lawEnforcementPerson : ''} 
                                onChange={e=> this.changeProcessDetail(e.target.value.trim(), 'lawEnforcementPerson')}
                            />
                        </div>
                    </Col>
                    <Col span={12} className="case-detail-flex">
                        <p className={edit ? "case-detail-label" : "case-detail-label text"}>
                            <FormattedMessage id="case.other.external.stakeholders" defaultMessage="其他外部关联人员" description="其他外部关联人员" />:
                        </p>
                        <div className="case-detail-input-wrap">
                            <Input 
                                disabled={!edit}
                                value={processDetail ? processDetail.otherPerson : ''} 
                                onChange={e=> this.changeProcessDetail(e.target.value.trim(), 'otherPerson')}
                            />
                        </div>
                    </Col>
                </Row>
                {
                    edit
                        ? (
                            <div className="btns">
                                <Button onClick={() => this.submitChange()} type='primary'><FormattedMessage id="global.determine" defaultMessage="确定" /></Button>
                                <Button onClick={() => this.cancelChange()}><FormattedMessage id="global.cancel" defaultMessage="取消" /></Button>
                            </div>
                        )
                        : ''
                }

            </Card>
        )
    }
}


export default injectIntl(ProcessDetail)