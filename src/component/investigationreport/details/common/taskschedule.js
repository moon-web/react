import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Col, Row ,Radio} from 'antd';
import '../../index.css'
import PictureModal from '../../../common/layout/modal/pictureModal'
const RadioGroup = Radio.Group;
class TaskSchedule extends Component {
    constructor() {
        super()
        this.state = {
            visible:false,
            showImage:'',
        }
    }

    //调查环节--嫌疑人信息
    setSuspectInformation(data) {
        let suspectInfo=[]
        data.map((v,i)=>
            suspectInfo.push(
                <Row key={i}>
                    <Col span={24} className="info-flex">
                        <div className="investigation-details-suspectWrapper">
                            <div className="investigation-detail-suspect">
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="users.user.investigator" defaultMessage="调查员" description="调查员" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.nickName ? v.nickName : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.time.of.investigation" defaultMessage="调查时间" description="调查时间" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.time ? v.time.split(' ')[0] : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.full.name" defaultMessage="姓名" description="姓名" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.CriminalName ? v.CriminalName : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.phone" defaultMessage="电话" description="电话" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.CriminalPhone ? v.CriminalPhone : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.place.of.residence" defaultMessage="居住地" description="居住地" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.CriminalAddress ? v.CriminalAddress : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="case.note" defaultMessage="备注" description="备注" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        {v.CriminalNote ? v.CriminalNote : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.picutre" defaultMessage="图片" description="图片" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        {
                                            v.imgSrc ? v.imgSrc.split(',').map((v,i)=>(
                                                <div className="merchandise-photos" key={i}>
                                                    <div className="imgDescrible-wrapper">
                                                        <img src={v} alt="" className="" onClick={()=>this.setState({showImage:v?v.replace('/_','/'):'',visible:true})}/>
                                                    </div>
                                                </div>
                                            )):""
                                        }
                                    </div>
                                </Col>
                            </div>
                        </div>
                    </Col>
                </Row>
            ))
        return suspectInfo
    }

    //调查环节--地址信息
    setAddressInformation(data) {
        let addressInfo = []
        data.map((v,i)=>
            addressInfo.push(
                <Row key={i}>
                {
                    v?v.type===1?(
                        <Col span={24} className="info-flex">
                        <div className="investigation-details-suspectWrapper">
                            <div className="investigation-detail-suspect">
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="users.user.investigator" defaultMessage="调查员" description="调查员" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.nickName ? v.nickName : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.time.of.investigation" defaultMessage="调查时间" description="调查时间" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.time ? v.time.split(' ')[0] : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.place.of.operation" defaultMessage="经营地点" description="经营地点" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.Jaddress ? v.Jaddress : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.quantity.of.goods" defaultMessage="货物数量" description="货物数量" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.Jnum ? v.Jnum : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="case.note" defaultMessage="备注" description="备注" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.Jnote ? v.Jnote : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.picutre" defaultMessage="图片" description="图片" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        {
                                            v.operatePic ? v.operatePic.split(',').map((v,i)=>(
                                                <div className="merchandise-photos" key={i}>
                                                    <div className="imgDescrible-wrapper">
                                                        <img src={v} alt="" className="" onClick={()=>this.setState({showImage:v?v.replace('/_','/'):'',visible:true})}/>
                                                    </div>
                                                </div>
                                            )):""
                                        }
                                    </div>
                                </Col>
                            </div>
                        </div>
                    </Col>
                    ):'':''
                }
                {
                    v?v.type===2?(
                        <Col span={24} className="info-flex">
                        <div className="investigation-details-suspectWrapper">
                            <div className="investigation-detail-suspect">
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="users.user.investigator" defaultMessage="调查员" description="调查员" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.nickName ? v.nickName : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.time.of.investigation" defaultMessage="调查时间" description="调查时间" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.time ? v.time.split(' ')[0] : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.warehouse.address" defaultMessage="仓库地址" description="仓库地址" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.Caddress ? v.Caddress : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.warehouse.num" defaultMessage="仓库货物数量" description="仓库获取数量" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.Cnum ? v.Cnum : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="case.note" defaultMessage="备注" description="备注" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.Cnote ? v.Cnote : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.picutre" defaultMessage="图片" description="图片" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        {
                                            v.warehousePic ? v.warehousePic.split(',').map((v,i)=>(
                                                <div className="merchandise-photos" key={i}>
                                                    <div className="imgDescrible-wrapper">
                                                        <img src={v} alt="" className="" onClick={()=>this.setState({showImage:v?v.replace('/_','/'):'',visible:true})}/>
                                                    </div>
                                                </div>
                                            )):""
                                        }
                                    </div>
                                </Col>
                            </div>
                        </div>
                    </Col>
                    ):'':''
                }
                {
                    v?v.type===3?(
                        <Col span={24} className="info-flex">
                        <div className="investigation-details-suspectWrapper">
                            <div className="investigation-detail-suspect">
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="users.user.investigator" defaultMessage="调查员" description="调查员" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.nickName ? v.nickName : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.time.of.investigation" defaultMessage="调查时间" description="调查时间" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.time ? v.time.split(' ')[0] : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.factory.address" defaultMessage="工厂地址" description="工厂地址" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.Gaddress ? v.Gaddress : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.factory.production" defaultMessage="工厂生产情况" description="工厂生产情况" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        <RadioGroup value={ v.switchBtag === false ? 1 : 2 }>
                                            <Radio value={1}>
                                                <FormattedMessage id="investigation.detail.to.be.confirmed" defaultMessage="待确认" />
                                            </Radio>
                                            <Radio value={2}>
                                                <FormattedMessage id="investigation.detail.confirmed" defaultMessage="已确认" />
                                            </Radio>
                                        </RadioGroup>
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="case.note" defaultMessage="备注" description="备注" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { v.Gnote ? v.Gnote : ''}
                                    </div>
                                </Col>
                                <Col span={24} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.picutre" defaultMessage="图片" description="图片" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        {
                                            v.GPic ? v.GPic.split(',').map((v,i)=>(
                                                <div className="merchandise-photos" key={i}>
                                                    <div className="imgDescrible-wrapper">
                                                        <img src={v} alt="" className="" onClick={()=>this.setState({showImage:v?v.replace('/_','/'):'',visible:true})}/>
                                                    </div>
                                                </div>
                                            )):""
                                        }
                                    </div>
                                </Col>
                            </div>
                        </div>
                    </Col>
                    ):'':''
                }
                    
                </Row>
            ))
            return addressInfo
    }

    //执法环节信息
    getLawEnforcementLink(data) {
        return(
            <div>
                <Row>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.law.enforcement.communication" defaultMessage="执法沟通" description="执法沟通" /> :
                        </p>
                        <div className="investigation-details-suspectWrapper">
                            { data ? data.communication : ''}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.law.enforcement.resources" defaultMessage="执法资源情况" description="执法资源情况" /> :
                        </p>
                        <div className="investigation-details-suspectWrapper">
                            { data ? data.resource : ''}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.report.a.case" defaultMessage="报案" description="报案" /> :
                        </p>
                        <div className="input-wrap text">
                            <RadioGroup value={ data ? data.isPolice :''}>
                                <Radio value={1}><FormattedMessage id="investigation.detail.report.case" defaultMessage="已报案" description="已报案" /></Radio>
                                <Radio value={''}><FormattedMessage id="investigation.detail.not.report" defaultMessage="未报案" description="未报案" /></Radio>
                            </RadioGroup>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.strike.time" defaultMessage="打击时间" description="打击时间" /> :
                        </p>
                        <div className="investigation-details-suspectWrapper">
                            { data ? data.hitTime.split(' ')[0] : ''}
                        </div>
                    </Col>
                </Row> 
                <Row>
                    <Col span={24} className="info-flex flex-wrap-style" >
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.notice.of.filing" defaultMessage="立案通知书" description="立案通知书" /> :
                        </p>
                        <div className="investigation-details-suspectWrapper flex-name">
                            <a href={ data ? data.notice : ''} className="investigation-shopname">{ data ? data.notice : ''}</a>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="info-flex flex-wrap-style" >
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.action.report" defaultMessage="行动报告" description="行动报告" /> :
                        </p>
                        <div className="investigation-details-suspectWrapper flex-name">
                            <a href={ data ? data.move : ''}  className="investigation-shopname">{ data ? data.move : ''}</a>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="info-flex flex-wrap-style">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.law.enforcement.documents" defaultMessage="执法文书" description="执法文书" /> :
                        </p>
                        <div className="investigation-details-suspectWrapper flex-name">
                            <a href={ data ? data.law : ''}  className="investigation-shopname">{ data ? data.law : ''}</a>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

    render() {
        let { investigationDetail } = this.props
        let { visible, showImage } =this.state
        return (
            <div className="investigation-detail">
                <Row>
                    <Col span={11}>
                        <Row>
                            <h3 className="title-info">
                                <FormattedMessage id="investigation.detail.investigation.link" defaultMessage="调查环节" description="调查环节" />
                            </h3>
                        </Row>
                        <Row>
                            <Col span={24} className="info-flex" style={{alignItems:'flex-start'}}>
                                <p className="info-label text info-detail-title">
                                    <FormattedMessage id="investigation.detail.criminal.suspect" defaultMessage="嫌疑人" description="嫌疑人" /> :
                                </p>
                                <div className="investigation-details-suspectWrapper">
                                    { this.setSuspectInformation( investigationDetail ? investigationDetail.b2bCompensableDetailDO ? investigationDetail.b2bCompensableDetailDO.suspectJson==="" || investigationDetail.b2bCompensableDetailDO.suspectJson===undefined ?[]:JSON.parse(investigationDetail.b2bCompensableDetailDO.suspectJson):[] : [] ) }
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="info-flex" style={{alignItems:'flex-start'}}>
                                <p className="info-label text info-detail-title">
                                <FormattedMessage id="investigation.detail.address.information" defaultMessage="地址信息" description="地址信息" /> :
                                </p>
                                <div className="investigation-details-suspectWrapper">
                                    { this.setAddressInformation( investigationDetail ? investigationDetail.b2bCompensableDetailDO ? investigationDetail.b2bCompensableDetailDO.addressJson==="" || investigationDetail.b2bCompensableDetailDO.addressJson===undefined ?[]:JSON.parse(investigationDetail.b2bCompensableDetailDO.addressJson):[] : [] ) }
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={11} offset={1}>
                        <Row>
                            <h3 className="title-info">
                                <FormattedMessage id="investigation.detail.law.enforcement.link" defaultMessage="执法环节" description="执法环节" />
                            </h3>
                        </Row>
                        {
                            this.getLawEnforcementLink(investigationDetail?investigationDetail.b2bCompensableDetailDO:'')
                        }
                    </Col>
                </Row>
                <PictureModal
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    showImg={showImage}
                />  
            </div>
        )
    }
}
export default injectIntl(TaskSchedule)