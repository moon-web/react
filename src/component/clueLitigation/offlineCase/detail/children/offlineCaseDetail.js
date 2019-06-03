import React, { Component } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import PictureModal from '../../../../common/layout/modal/pictureModal';
import { Badge, Tooltip, Row, Col } from 'antd'
class OfflineCaseDetailItem extends Component {
    constructor(props){
        super(props)
        this.state={
            showImage: '',
            imgVisible: false
        }
    }

     //图片放大显示
     onPreview(item) {
        this.setState({
            showImage: item ? item.replace(/_/, '') :'',
            imgVisible: true
        })
    }

    render() {
        let { offlineCaseDetail, intl } = this.props;
        let { imgVisible, showImage } = this.state;
        return (
            <div>
                <div className='store'>
                    <Row>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="case.rapporteur" defaultMessage="报告人" /> :</span>
                                <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.userName : ''}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="case.report.time" defaultMessage="报告时间" /> :</span>
                                <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.gmtCreate : ''}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.clue.name" defaultMessage="线索名称" /> :</span>
                                <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.clueName : ''}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" /> :</span>
                                <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.brandName : ''}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.tort.mode" defaultMessage="侵权方式" /> :</span>
                                <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.tortTypeName : ''}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.sales.platform" defaultMessage="销售平台" /> :</span>
                                <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.platformTypeName : ''}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="monitor.price" defaultMessage="价格" /> :</span>
                                <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.salesPrice : ''}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.sales.volume" defaultMessage="销量" /> :</span>
                                <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.salesVolume : ''}</span>
                            </div>
                        </Col>
                    </Row>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.sales.volume.value" defaultMessage="销售额" /> :</span>
                        <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.salesAmountFormat : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="monitor.storeName" defaultMessage="店铺名称" /> :</span>
                        <span className='row-info'>
                            <a href={ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.storeLink : ''} target='_blank' >
                                { offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.storeName : ''}
                            </a>
                        </span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.shop.address" defaultMessage="店铺链接" /> :</span>
                        <span className='row-info'>
                            <a href={ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.storeLink : ''} 
                                target='_blank' >
                                { offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.storeLink : ''}
                            </a>
                        </span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="clue.report.shop.link" defaultMessage="商品链接" /> :</span>
                        <div className='row-info'>
                            {
                                offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO
                                    ? offlineCaseDetail.lawyerClueInfoDO.prodUrl.split(',').map((item,index) => (
                                        <p key={index}>
                                            <a href={item} target='_blank'> {item}</a>
                                        </p>
                                    ))
                                    : ''
                            }
                        </div>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.infringing.picture" defaultMessage="侵权图片" /> :</span>
                        <span className='row-info'>
                            {
                                offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO
                                    ? offlineCaseDetail.lawyerClueInfoDO.prodPhoto.split(',').map((item,index) => (
                                        <img src={item} alt=""  key={index}
                                            onClick={() => this.onPreview(item)}
                                        />
                                    ))
                                    : ''
                            }
                        </span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="report.note" defaultMessage="备注" /> :</span>
                        <span className='row-info'>{ offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.remark : ''}</span>
                    </div>
                </div>
                <div className='operators'>
                    {
                        offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO && offlineCaseDetail.lawyerClueInfoDO.lawyerClueSubjectDOList && offlineCaseDetail.lawyerClueInfoDO.lawyerClueSubjectDOList.length > 0 ? (
                            <div className="subjectIdentify-title">
                                <span><FormattedMessage id="thread.main.body" defaultMessage="经营主体" /></span> 
                                <span className="subjectIdentify-type">
                                    ( <FormattedMessage id="ligiation.subject.type" defaultMessage="主体类型" /> ：
                                    {offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.subjectTypeName : ''} )
                                </span>
                            </div>
                        ):""
                    }
                    {
                        offlineCaseDetail && offlineCaseDetail.lawyerClueInfoDO && offlineCaseDetail.lawyerClueInfoDO.lawyerClueSubjectDOList
                            ? offlineCaseDetail.lawyerClueInfoDO.lawyerClueSubjectDOList.map((item,index) => (
                                <div className='operators-detail subjectIdentify-detail' key={index}>
                                    <Badge count={index+1}  style={{ backgroundColor: '#668fff', margin:'6px 0px' }} overflowCount={999}/>
                                    <div className="cluedetail-type-children">
                                        <div className='row'>
                                            <span className='lable'><FormattedMessage id="thread.main.body" defaultMessage="经营主体" /> :</span>
                                            <Tooltip placement="topLeft" title={ intl.locale === 'zh'? item.subjectName :item.subjectNameEn}>
                                                <span className='row-info beyond'>{ intl.locale === 'zh'? item.subjectName :item.subjectNameEn}</span>
                                            </Tooltip>
                                        </div>
                                        <div className='row'>
                                            <span className='lable'><FormattedMessage id="thread.main.tag" defaultMessage="主体标签" /> :</span>
                                            <Tooltip placement="topLeft" title={ intl.locale === 'zh'? item.labelTypeName : item.labelTypeNameEn}>
                                                <span className='row-info beyond'>{ intl.locale === 'zh'? item.labelTypeName : item.labelTypeNameEn }</span>
                                            </Tooltip>
                                        </div>
                                        {
                                            offlineCaseDetail.lawyerClueInfoDO ? offlineCaseDetail.lawyerClueInfoDO.subjectType === 0 ? (
                                                <div>
                                                    <div className='row'>
                                                        <span className='lable'><FormattedMessage id="thread.main.identification" defaultMessage="主体标识" /> :</span>
                                                        <Tooltip placement="topLeft" title={ item.subjectIdentify }>
                                                            <span className='row-info beyond'>{item.subjectIdentify}</span>
                                                        </Tooltip>
                                                    </div>
                                                    <div className='row'>
                                                        <span className='lable'><FormattedMessage id="thread.legal.representative" defaultMessage="法定代表人" /> :</span>
                                                        <Tooltip placement="topLeft" title={ item.subjectLegal }>
                                                            <span className='row-info beyond'>{item.subjectLegal}</span>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            ): offlineCaseDetail.lawyerClueInfoDO.subjectType === 1? (
                                                <div className='row'>
                                                    <span className='lable'><FormattedMessage id="case.id.number" defaultMessage="身份证号" /> :</span>
                                                    <Tooltip placement="topLeft" title={ item.subjectIdentify }>
                                                        <span className='row-info beyond'>{item.subjectIdentify}</span>
                                                    </Tooltip>
                                                </div>
                                            ): offlineCaseDetail.lawyerClueInfoDO.subjectType === 2? (
                                                <div>
                                                    <div className='row'>
                                                        <span className='lable'><FormattedMessage id="thread.main.identification" defaultMessage="主体标识" /> :</span>
                                                        <Tooltip placement="topLeft" title={ item.subjectIdentify }>
                                                            <span className='row-info beyond'>{item.subjectIdentify}</span>
                                                        </Tooltip>
                                                    </div>
                                                    <div className='row'>
                                                        <span className='lable'><FormattedMessage id="thread.operator" defaultMessage="经营者" /> :</span>
                                                        <Tooltip placement="topLeft" title={ item.subjectLegal }>
                                                            <span className='row-info beyond'>{item.subjectLegal}</span>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            ):'':''
                                        }
                                        <div className='row'>
                                            <span className='lable'><FormattedMessage id="thread.main.area" defaultMessage="主体区域" /> :</span>
                                            <Tooltip placement="topLeft" title={ `${item.province} ${item.city} ${item.area}`}>
                                                <span className='row-info beyond'>{item.province} {item.city} {item.area}</span>
                                            </Tooltip>
                                        </div>
                                        <div className='row'>
                                            <span className='lable'><FormattedMessage id="thread.business.registration.address" defaultMessage="工商登记地址" /> :</span>
                                            <Tooltip placement="topLeft" title={ item.address }>
                                                <span className='row-info beyond'>{item.address}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            ))
                            : ''
                    }
                </div>
                <PictureModal 
                    visible={imgVisible}
                    onCancel={() => this.setState({ imgVisible: false, showImage:'' })}
                    showImg={showImage}
                />
            </div>
        )
    }
}
export default injectIntl(OfflineCaseDetailItem)
