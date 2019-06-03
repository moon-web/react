import React, { Component } from 'react'
import { Modal, Form, Select, Input, Row, Col } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
import InputNumber from '../../../common/form/numberInput'
const FormItem = Form.Item;
const SelectOption = Select.Option;
const InputGroup = Input.Group;

class DistributionModal extends Component {
    constructor() {
        super()
        this.state = {
            volunteerId: undefined,
            allotNum: '',
            reason:''
        }
    }

    //确认提交
    handleOk() {
        let { volunteerId, allotNum, reason } = this.state;
        let { handleOk } = this.props;
        if (handleOk) {
            handleOk({ volunteerId, allotNum, reason })
        }
    }

    //取消分配
    handleCancel() {
        this.setState({
            volunteerId: undefined,
            allotNum: ''
        },()=>{
            let { handleCancel } = this.props;
            if (handleCancel) {
                handleCancel()
            }
        })
    }

    //查询志愿者
    serachVolunteer(value) {
        let { getVolunteerList, searchFetch } = this.props;
        if (!searchFetch && getVolunteerList) {
            getVolunteerList({ nameOrMobile: value })
        }
    }
    
    //赋值
    changeTaskAllocation(key, value) {
        if (key === 'allotNum') {
            const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
            if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                this.setState({
                    [key]: value
                })
            }
        } else {
            this.setState({
                [key]: value
            })
        }
    }

    render() {
        let { intl, visible, brandCleanVolunteerList, editType, barndCleanTotal } = this.props;
        let { volunteerId, allotNum, reason } = this.state;
        return (
            <Modal
                visible={visible}
                className='root monitor-result-modal'
                title={
                    editType === 'fail'
                        ? intl.formatMessage({ id: "monitor.commodity.audit", defaultMessage: "商品审核", description: "商品审核" })
                        : intl.formatMessage({ id: "monitor.task.allocation", defaultMessage: "任务分配", description: "任务分配" })
                }
                onOk={() => this.handleOk()}
                onCancel={() => this.handleCancel()}
            >
                <div className="search-form">
                    {
                        editType === 'fail'
                        ? (
                            <Row>
                                <Col span={20} offset={2}>
                                    <FormItem label={intl.formatMessage({ id: "monitor.fail.reason", defaultMessage: "不通过理由", description: "不通过理由" })} >
                                        <Input
                                            value={reason}
                                            onChange={e => this.changeTaskAllocation('reason', e.target.value.trim())}
                                            placeholder={intl.formatMessage({ id: "monitor.please.enter.fail.reason", defaultMessage: "请输入不通过理由", description: "请输入不通过理由" })}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                        ):(
                            <div className="search-form">
                                <FormItem label={intl.formatMessage({ id: "users.volunteer", defaultMessage: "志愿者", description: "志愿者" })} >
                                    <Select
                                        showSearch
                                        value={volunteerId}
                                        filterOption={false}
                                        notFoundContent={null}
                                        defaultActiveFirstOption={false}
                                        onSearch={value => this.serachVolunteer(value)}
                                        onChange={value => this.changeTaskAllocation('volunteerId', value)}
                                        placeholder={intl.formatMessage({ id: "monitor.please.choose.volunteer", defaultMessage: "请选择志愿者", description: "请选择志愿者" })}
                                    >
                                        {
                                            brandCleanVolunteerList && brandCleanVolunteerList.filter(item => item.isDelete === 0)
                                                .map(opt =>
                                                    <SelectOption value={opt.userId} className='search-opt' key={opt.userId}>
                                                        <div className='search-opt-wrap'>
                                                            <div className="opt-name">
                                                                {opt.name ? opt.userName : opt.mobile}
                                                            </div>
                                                            <div className="opt-pending">
                                                                <FormattedMessage id="global.pending" defaultMessage="待审核" description="待审核" />:
                                                                {opt.waitAuditCount}
                                                            </div>
                                                        </div>
                                                    </SelectOption>
                                                )
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem label={intl.formatMessage({ id: "monitor.allocation.numbers", defaultMessage: "分配数量", description: "分配数量" })} >
                                    <InputGroup compact>
                                        <InputNumber
                                            style={{ width: '50%' }}
                                            value={allotNum}
                                            onChange={value => this.changeTaskAllocation('allotNum', value)}
                                            placeholder={intl.formatMessage({ id: "monitor.please.enter.allocation.numbers", defaultMessage: "请输入分配数量", description: "请输入分配数量" })}
                                        />
                                        <Input style={{ width: '50%' }} disabled value={barndCleanTotal} />
                                    </InputGroup>
                                </FormItem>
                            </div>
                        )
                    }
                </div>
            </Modal>
        )
    }
}

export default injectIntl(DistributionModal)