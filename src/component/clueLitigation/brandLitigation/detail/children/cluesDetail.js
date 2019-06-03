import React, { Component } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import PictureModal from '../../../../common/layout/modal/pictureModal';
import { Badge, Tooltip, Row, Col } from 'antd'
import FileList from '../../../thread/editThread/children/fileList'
class LawsuitDetail extends Component {
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
        let { suitCaseDetail, intl } = this.props;
        let { imgVisible, showImage } = this.state;
        return (
            <div>
                <div className='store'>
                    <Row>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="case.rapporteur" defaultMessage="报告人" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.userName : ''}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="case.report.time" defaultMessage="报告时间" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.gmtCreate : ''}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.clue.name" defaultMessage="线索名称" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.clueName : ''}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.brandName : ''}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>                        
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.clue.clue.source" defaultMessage="线索来源" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? intl.locale === 'zh' ? suitCaseDetail.lawyerClueInfoDO.clueTypeName :  suitCaseDetail.lawyerClueInfoDO.clueTypeNameEn : ''}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.tort.mode" defaultMessage="侵权方式" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.tortTypeName : ''}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.sales.platform" defaultMessage="销售平台" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.platformTypeName : ''}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="monitor.price" defaultMessage="价格" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.salesPrice : ''}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>                        
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.sales.volume" defaultMessage="销量" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.salesVolume : ''}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='row'>
                                <span className='lable'><FormattedMessage id="thread.sales.volume.value" defaultMessage="销售额" /> :</span>
                                <span className='row-info'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.salesAmountFormat : ''}</span>
                            </div>
                        </Col>
                    </Row>                    
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="monitor.storeName" defaultMessage="店铺名称" /> :</span>
                        <span className='row-info'>
                            <a href={suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.storeLink : ''} target='_blank' >{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.storeName : ''}</a>
                        </span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.shop.address" defaultMessage="店铺链接" /> :</span>
                        <span className='row-info'>
                            <a href={suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.storeLink : ''} target='_blank' >{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.storeLink : ''}</a>
                        </span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="clue.report.shop.link" defaultMessage="商品链接" /> :</span>
                        <div className='row-info'>
                            {
                                suitCaseDetail.lawyerClueInfoDO
                                    ? suitCaseDetail.lawyerClueInfoDO.prodUrl.split(',').map((item,index) => (
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
                                suitCaseDetail.lawyerClueInfoDO
                                    ? suitCaseDetail.lawyerClueInfoDO.prodPhoto.split(',').map((item,index) => (
                                        <img src={item} alt=""  key={index}
                                            onClick={() => this.onPreview(item)}
                                        />
                                    ))
                                    : ''
                            }
                        </span>
                    </div>
                    {
                        suitCaseDetail.lawyerClueInfoDO && suitCaseDetail.lawyerClueInfoDO.fileUrl ? 
                        <div className='row'>
                            <span className='lable'><FormattedMessage id="thread.clue.investigation.report" defaultMessage="调查报告" /> :</span>
                            <span className='row-info'><FileList fileList={suitCaseDetail.lawyerClueInfoDO.fileUrl} /></span>
                        </div>
                     : ''                        
                    }
                    {
                        suitCaseDetail.lawyerClueInfoDO && suitCaseDetail.lawyerClueInfoDO.reportDetail ?
                        <div className='row'>
                            <span className='lable'><FormattedMessage id="thread.clue.investigation.report.detail" defaultMessage="调查报告详情" /> :</span>
                            <span className='row-info enter'>{suitCaseDetail.lawyerClueInfoDO.reportDetail}</span>
                        </div>: ''
                    }
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="report.note" defaultMessage="备注" /> :</span>
                        <span className='row-info enter'>{suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.remark : ''}</span>
                    </div>
                </div>
                <div className='operators'>
                    {
                        suitCaseDetail.lawyerClueInfoDO && suitCaseDetail.lawyerClueInfoDO.lawyerClueSubjectDOList && suitCaseDetail.lawyerClueInfoDO.lawyerClueSubjectDOList.length > 0 ? (
                            <div className="subjectIdentify-title">
                                <span><FormattedMessage id="thread.main.body" defaultMessage="经营主体" /></span> 
                                <span className="subjectIdentify-type">
                                    ( <FormattedMessage id="ligiation.subject.type" defaultMessage="主体类型" /> ：
                                    {suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.subjectTypeName : ''} )
                                </span>
                            </div>
                        ):""
                    }
                    {
                        suitCaseDetail.lawyerClueInfoDO && suitCaseDetail.lawyerClueInfoDO.lawyerClueSubjectDOList
                            ? suitCaseDetail.lawyerClueInfoDO.lawyerClueSubjectDOList.map((item,index) => (
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
                                            suitCaseDetail.lawyerClueInfoDO ? suitCaseDetail.lawyerClueInfoDO.subjectType === 0 ? (
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
                                            ): suitCaseDetail.lawyerClueInfoDO.subjectType === 1? (
                                                <div className='row'>
                                                    <span className='lable'><FormattedMessage id="case.id.number" defaultMessage="身份证号" /> :</span>
                                                    <Tooltip placement="topLeft" title={ item.subjectIdentify }>
                                                        <span className='row-info beyond'>{item.subjectIdentify}</span>
                                                    </Tooltip>
                                                </div>
                                            ): suitCaseDetail.lawyerClueInfoDO.subjectType === 2? (
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
export default injectIntl(LawsuitDetail)
