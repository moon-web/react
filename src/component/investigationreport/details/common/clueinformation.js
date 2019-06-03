import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Col, Row, Radio ,Tooltip} from 'antd';
import '../../index.css'
import PictureModal from '../../../common/layout/modal/pictureModal'
const RadioGroup = Radio.Group;
class ClueInformation extends Component {
    constructor() {
        super()
        this.state = {
            visible:false,
            showImage:'',
        }
    }
      
    //嫌疑人信息
    getSuspect(data) {
        let suspectData=[]
        data.map((item, key) =>
            suspectData.push(
                <div className="investigation-detail-suspect" key={key}>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.suspect.name" defaultMessage="嫌疑人姓名" description="嫌疑人姓名" /> :
                        </p>
                        <div className="input-wrap text">
                            { item.suspectName ? item.suspectName : '' }
                        </div>
                    </Col>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.suspect.phone" defaultMessage="嫌疑人手机" description="嫌疑人手机" /> :
                        </p>
                        <div className="input-wrap text">
                            { item.suspectPhone ? item.suspectPhone : '' }
                        </div>
                    </Col>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.suspect.wechart" defaultMessage="嫌疑人微信" description="嫌疑人微信" /> :
                        </p>
                        <div className="input-wrap text">
                            { item.suspectWeixin ? item.suspectWeixin : '' }
                        </div>
                    </Col>
                </div>
        ))
        return suspectData
    }

    //案件地址
    getCaseAddress(investigationDetail) {
        let {typeDic} =this.props
        return(
            <Col span={11} offset={1}>
                <Row>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.case.address" defaultMessage="案件地址" description="案件地址" /> :
                        </p>
                        <div className="input-wrap text">
                            { investigationDetail ? investigationDetail.address : '' }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="case.factory.address" defaultMessage="工厂地址" description="工厂地址" /> :
                        </p>
                        <div className="input-wrap text">
                            { investigationDetail ? investigationDetail.factoryAddress : '' }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="case.warehouse.address" defaultMessage="仓库地址" description="仓库地址" /> :
                        </p>
                        <div className="input-wrap text">
                            { investigationDetail ? investigationDetail.warehouseAddress : '' }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.business.address" defaultMessage="经营点地址" description="经营点地址" /> :
                        </p>
                        <div className="input-wrap text">
                            { investigationDetail ? investigationDetail.storeAddress : '' }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="info-flex">
                        <p className="info-label text">
                            <FormattedMessage id="investigation.detail.nature.of.the.case" defaultMessage="案件性质" description="案件性质" /> :
                        </p>
                        <div className="input-wrap text">
                            { investigationDetail ? typeDic[investigationDetail.type] : '' }
                        </div>
                    </Col>
                </Row>
            </Col>
        )
    }

    //淘宝店铺
    getTmallShop(data) {
        let shopName=[];
        data.map((item,key)=>
            shopName.push(
                <Col span={24} className="info-flex" key={key} style={{marginBottom:'10px'}}>
                    <div className="input-wrap text">
                        <a href={item.shopName} target='_blank' className="investigation-shopname">{item.shopName?item.shopName:''}</a>
                    </div>
                </Col>
            ))
        return shopName
    }

    render() {
        let { visible, showImage } = this.state
        let { investigationDetail } = this.props
        return (
            <div className="investigation-detail">
                <Row>
                    <Col span={11}>
                        <Row>
                            <Col span={24} className="info-flex">
                                <p className="info-label text">
                                    <FormattedMessage id="investigation.detail.criminal.suspect" defaultMessage="嫌疑人" description="嫌疑人" /> :
                                </p>
                                <div className="input-wrap text">
                                    { this.getSuspect(investigationDetail?investigationDetail.suspect==="" || investigationDetail.suspect === undefined?[]:JSON.parse(investigationDetail.suspect):[]) }
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="info-flex">
                                <p className="info-label text ">
                                    <FormattedMessage id="investigation.detail.taobao.shop" defaultMessage="淘宝店铺" description="淘宝店铺" /> :
                                </p>
                                <div className="input-wrap text">
                                    {this.getTmallShop( investigationDetail?investigationDetail.taobao==="" || investigationDetail.taobao === undefined?[]:JSON.parse(investigationDetail.taobao):[] )}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="info-flex">
                                <p className="info-label text">
                                    <FormattedMessage id="investigation.detail.estimated.quantity.of.commodities" defaultMessage="预计商品数量" description="预计商品数量" /> :
                                </p>
                                <div className="input-wrap text">
                                    { investigationDetail ? investigationDetail.num : 0 }件
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="info-flex">
                                <p className="info-label text">
                                    <FormattedMessage id="investigation.detail.estimated.commodity.amount" defaultMessage="预计商品金额" description="预计商品金额" /> :
                                </p>
                                <div className="input-wrap text">
                                    { investigationDetail ? investigationDetail.money : 0}元
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="info-flex">
                                <p className="info-label text">
                                    <FormattedMessage id="investigation.detail.have.resources" defaultMessage="拥有资源" description="拥有资源" /> :
                                </p>
                                <div className="input-wrap text">
                                    <div style={{ width: '100%', display: 'flex' }}>
                                        <Col span={24} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.detail.resources" defaultMessage="调查资源" description="调查资源" />
                                            </p>
                                            <div className="input-wrap text">
                                                <RadioGroup value={ investigationDetail ? investigationDetail.investigate :''}>
                                                    <Radio value='1'><FormattedMessage id="investigation.detail.has" defaultMessage="有" description="有" /></Radio>
                                                    <Radio value='2'><FormattedMessage id="investigation.detail.nothing" defaultMessage="无" description="无" /></Radio>
                                                </RadioGroup>
                                            </div>
                                        </Col>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex' }}>
                                        <Col span={24} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.detail.lawresources" defaultMessage="执法资源" description="执法资源" />
                                            </p>
                                            <div className="input-wrap text">
                                                <RadioGroup value={ investigationDetail ? investigationDetail.law:'' }>
                                                    <Radio value='1'><FormattedMessage id="investigation.detail.public.security" defaultMessage="公安" description="公安" /></Radio>
                                                    <Radio value='2'><FormattedMessage id="investigation.detail.business.circles" defaultMessage="工商" description="工商" /></Radio>
                                                    <Radio value='3'><FormattedMessage id="investigation.detail.quality.testing" defaultMessage="质检" description="质检" /></Radio>
                                                </RadioGroup>
                                            </div>
                                        </Col>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="info-flex">
                                <p className="info-label text">
                                    <FormattedMessage id="investigation.detail.note" defaultMessage="备注" description="备注" /> :
                                </p>
                                <div className="input-wrap text">
                                    { investigationDetail ? investigationDetail.note : '' }
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    { this.getCaseAddress(investigationDetail?investigationDetail:'') }   
                    <Col span={24} className="info-flex">
                        <p className="info-label text info-detail-title">
                            <FormattedMessage id="investigation.detail.infringing.merchandise.photos" defaultMessage="侵权商品照片" description="侵权商品照片" /> :
                        </p>
                        <div className="input-wrap text investigation-img">
                            {
                                investigationDetail ? investigationDetail.mainPics ==="" || investigationDetail.mainPics ===undefined ?'': JSON.parse(investigationDetail.mainPics).map((v,i)=>(
                                    <div className="merchandise-photos" key={i}>
                                        <div className="imgDescrible-wrapper">
                                            <img src={v.msgCode} alt="" className="" onClick={()=>this.setState({showImage:v.msgCode?v.msgCode.replace('/_','/'):'',visible:true})}/>
                                            {v.imgDescrible ?
                                                <div className="img-tips">
                                                    <Tooltip placement="bottom"
                                                        title={v.imgDescrible}>
                                                        <div className="tip-name">{v.imgDescrible} ></div>
                                                    </Tooltip>
                                                </div> : ''
                                            }
                                        </div>
                                        <span>{v.address}</span> 
                                    </div>
                                )):""
                            }
                        </div>
                    </Col>    
                    <PictureModal
                        visible={visible}
                        onCancel={() => this.setState({ visible: false })}
                        showImg={showImage}
                    />    
                </Row>
            </div>
        )
    }
}
export default injectIntl(ClueInformation)