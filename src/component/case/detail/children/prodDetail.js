import React from 'react'
import { Card, Col, Input, Row, Button, Upload, message, Icon, Modal } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import PictureModal from '../../../common/layout/modal/pictureModal'
import Common from './common'
// formattedFileList, beforeUpload, uploadFileChange 方法均继承自Common组件
import Req from '../../../../api/req'
import '../index.css'
import { queryUrlParams , getButtonPrem } from '../../../../utils/util'
const xin = require('../../../../assets/images/xin.gif');
const zuan = require('../../../../assets/images/zuan.gif');
const guan = require('../../../../assets/images/guan.gif');
const hg = require('../../../../assets/images/huanguan.gif');
class ProdDetail extends Common {
    constructor(props) {
        super(props)
        this.state = {
            prodDetail: [],
            edit: false,
            fileList: [],
            prodName: '',
            visible: false,
            showImg: '',
            prodVisible: false,
            more: false
        }
    }

    componentWillMount() {
        let prodDetail = this.props.prodDetail;
        this.getDetail(prodDetail)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.prodDetail !== this.props.prodDetail) {
            let { prodDetail } = nextProps;
            this.getDetail(prodDetail)
        }
    }

    // 获取详情
    getDetail(prodDetail) {
        if (prodDetail) {
            prodDetail = JSON.stringify(prodDetail)
            prodDetail = JSON.parse(prodDetail)
            if (prodDetail) {
                this.setState({
                    prodDetail
                })
            }
        }
    }

    // 添加商品
    addItem() {
        let { prodDetail, fileList, prodUrl } = this.state;
        let result = {
            prodName: '',
            prodUrl,
            id: Date.now()
        };
        if (!result.prodUrl) {
            message.info('请输入商品信息')
        } else {
            for (let i = 0; i < fileList.length; i++) {
                const element = fileList[i];
                result.photoUrl = element.response.msgCode;
            }
            prodDetail.push(result)
            this.setState({
                prodDetail,
                prodUrl: '',
                fileList: []
            })
        }
    }

    // 删除商品
    deleteItem(key) {
        let { prodDetail } = this.state;
        let result = prodDetail.filter(item => item.id !== key)
        this.setState({
            prodDetail: result
        })
    }

    // 取消更改
    cancelChange() {
        let { prodDetail } = this.props;
        this.getDetail(prodDetail)
        this.setState({
            edit: false,
            fileList: []
        })
    }

    // 提交更改
    submitChange() {
        let { prodDetail } = this.state;
        let data = {
            json: prodDetail
        }
        this.props.updateProdDetail(data, () => {
            this.setState({
                edit: false
            })
        })
    }

    //商品详情展开
    GetdetailsOfProduct() {
        this.setState({
            prodVisible: true,
        });
        let id = queryUrlParams('id');
        let data = {
            id: id,
            userId: this.props.userInfo.userId
        }
        this.props.getProDetailsList(data)
    }

    // 渲染店铺等级
    renderStoreLevel(item) {
        let icon = '';
        if (item >= 4 && item <= 10) {
            icon = <span><img src={xin} alt="心" /></span>
        } else if (item >= 11 && item <= 40) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 41 && item <= 90) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 91 && item <= 150) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 151 && item <= 250) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 251 && item <= 500) {
            icon = <span><img src={zuan} alt="钻" /></span>
        } else if (item >= 501 && item <= 1000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 1001 && item <= 2000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 2001 && item <= 5000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 5001 && item <= 10000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 10001 && item <= 20000) {
            icon = <span><img src={guan} alt="皇冠" /></span>
        } else if (item >= 20001 && item <= 50000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 50001 && item <= 100000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 100001 && item <= 200000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 200001 && item <= 500000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 500001 && item <= 1000000) {
            icon = <span><img src={hg} alt="金冠" /></span>
        } else if (item >= 1000001 && item <= 2000000) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        } else if (item >= 2000001 && item <= 5000000) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        } else if (item >= 5000001 && item <= 10000000) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        } else if (item > 10000001) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        }
        return icon;
    }

    //商品信息刷新
    asyncAnticon() {
        let id = queryUrlParams('id');
        let data = {
            id: id,
            userId: this.props.userInfo.userId
        }
        this.props.getAsyncRefresh(data)
    }
    render() {
        let { intl, userInfo ,permissionList} = this.props;
        let { prodDetail, edit, fileList, prodUrl, visible, showImg, prodVisible, more } = this.state;
        return (
            <Card
                className="case-prod"
                title={intl.formatMessage({ id: "case.commodity.information", defaultMessage: "商品信息", description: "商品信息" })}
                extra={
                    !edit ? 
                        <div>
                            <a onClick={()=>this.asyncAnticon()}><Icon type="sync" className="sync" /></a>
                            {
                                getButtonPrem(permissionList,'003001006')?
                                    <a onClick={() => this.setState({ edit: true })}><FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" /></a>
                                :''
                            }
                        </div> 
                    : ''}
            >
                <div className="case-prod-list">
                    {
                        prodDetail && prodDetail.length
                            ? prodDetail.map((item, i) => {
                                if (edit) {
                                    return (
                                        <div className="case-prod-item" key={item.id}>
                                            <Row>
                                                <Col span={edit ? 9 : 14}>
                                                    <a className={ item.isDel === 2 ? "invalid" : "" } href={item.prodUrl ? item.prodUrl : ''} target="_blank" >{item.prodName ? item.prodName : item.prodUrl}</a>
                                                </Col>
                                                <Col span={5}>
                                                    {
                                                        item.photoUrl
                                                            ? <img src={item.photoUrl} alt="" style={{ width: "60px", height: '60px' }} onClick={() => this.setState({ visible: true, showImg: item.photoUrl ? item.photoUrl : '' })} />
                                                            : ''
                                                    }
                                                </Col>
                                                <Col span={5}>
                                                    <span className="case-prod-invalid ">
                                                        {
                                                            item.isDel === 2
                                                                ? <FormattedMessage id="case.invalid" defaultMessage="失效" description="失效" />
                                                                : ''
                                                        }
                                                    </span>
                                                </Col>
                                                <Col span={edit ? 5 : 0}>
                                                    {
                                                        edit
                                                            ? <a onClick={() => this.deleteItem(item.id)}><FormattedMessage id="global.delete" defaultMessage="删除" description="删除" /></a>
                                                            : ''
                                                    }
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                } else if (i < 5) {
                                    return (
                                        <div className="case-prod-item" key={item.id}>
                                            <Row>
                                                <Col span={edit ? 9 : 14}>
                                                    <a className={ item.isDel === 2 ? "invalid" : "" } href={item.prodUrl ? item.prodUrl : ''} target="_blank">{item.prodName ? item.prodName : item.prodUrl}</a>
                                                </Col>
                                                <Col span={5}>
                                                    {
                                                        item.photoUrl
                                                            ? <img src={item.photoUrl} alt="" style={{ width: "60px", height: '60px' }} onClick={() => this.setState({ visible: true, showImg: item.photoUrl ? item.photoUrl : '' })} />
                                                            : ''
                                                    }
                                                </Col>
                                                <Col span={5}>
                                                    <span className="case-prod-invalid">
                                                        {
                                                            item.isDel === 2
                                                                ? <FormattedMessage id="case.invalid" defaultMessage="失效" description="失效" />
                                                                : ''
                                                        }
                                                    </span>
                                                </Col>
                                                <Col span={edit ? 5 : 0}>
                                                    {
                                                        edit
                                                            ? <a onClick={() => this.deleteItem(item.id)}><FormattedMessage id="global.delete" defaultMessage="删除" description="删除" /></a>
                                                            : ''
                                                    }
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                }
                            })
                            : ''
                    }
                    {
                        edit
                            ? (
                                <Row className="new-item" type='flex'>
                                    <Col span={14}>
                                        <Input
                                            placeholder={intl.formatMessage({ id: "case.please.commodity.information", defaultMessage: "请输入商品信息", description: "请输入商品信息" })}
                                            value={prodUrl}
                                            onChange={e => this.setState({ prodUrl: e.target.value.trim() })}
                                        />
                                    </Col>
                                    <Col span={5}>
                                        <Upload
                                            fileList={fileList}
                                            withCredentials={true}
                                            listType="picture-card"
                                            name="file"
                                            action={Req.uploadImage}
                                            data={{ userId: userInfo.userId }}
                                            onPreview={file => this.setState({ visible: true, showImg: file.url || file.thumbUrl })}
                                            onChange={res => this.uploadFileChange(res, 'fileList')}
                                            beforeUpload={file => this.beforeUpload(file)}
                                        >
                                            {
                                                fileList.length >= 1 ? null : <a><Icon type='plus' /></a>
                                            }
                                        </Upload>
                                    </Col>
                                    <Col span={5}>
                                        <a onClick={() => this.addItem()}><FormattedMessage id="global.add.to" defaultMessage="添加" /></a>
                                    </Col>
                                </Row>
                            )
                            : ''
                    }
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
                    {
                        !edit && prodDetail.length
                            ? (
                                <div style={{ textAlign: 'right', lineHeight: '32px' }}>
                                    <a onClick={() => this.setState({ more: !more })}>
                                        {
                                            more
                                                ? <span><Icon type="up" theme="outlined" /><FormattedMessage id="case.take.up" defaultMessage="收起" /></span>
                                                : <span onClick={() => this.GetdetailsOfProduct()}><Icon type="down" theme="outlined" /><FormattedMessage id="case.open" defaultMessage="展开" /> </span>
                                        }
                                    </a>
                                </div>
                            )
                            : ''
                    }
                </div>
                <Modal
                    className="case-prod-detail-modal"
                    title={intl.formatMessage({ id: "case.product.details", defaultMessage: "商品详细信息" })}
                    onCancel={() => this.setState({ prodVisible: false, more: false })}
                    visible={prodVisible}
                    footer={false}
                >
                    <div className='prod-detail-list'>
                        {
                            this.props.getProDetails ? this.props.getProDetails.map((v, i) => (
                                <div key={i} className="clearfix" >
                                    <div className="prod-detail-item" >
                                        <p>
                                            <a href={v.prodUrl ? v.prodUrl : ''} target="_blank" className={v.isDel === 2 ? 'prod-detail-item-invalid' : ''} >{v.prodName ? v.prodName : v.prodUrl}</a>
                                            {v.isDel === 2 ? (<span className="prod-detail-item-invalid"><FormattedMessage id="case.invalid" defaultMessage="失效" /></span>) : ''}
                                        </p>
                                        <div>
                                            <span className="prod-detail-item-info"><FormattedMessage id="monitor.price" defaultMessage="价格" />：{v.prodDetail.price ? v.prodDetail.price : ''}</span>
                                            <span className="prod-detail-item-info"><FormattedMessage id="clue.report.brand.stock" defaultMessage="库存" />：{v.prodDetail.totalQuantity ? v.prodDetail.totalQuantity : ''}</span>
                                        </div>
                                        <div >
                                            <span className="prod-detail-item-info"><FormattedMessage id="monitor.thirty.days.sales" defaultMessage="30天销量" />：{v.prodDetail.salesValume ? v.prodDetail.salesValume : ''}</span>
                                            <span className="prod-detail-item-info"><FormattedMessage id="clue.report.brand.evaluate" defaultMessage="评价" />：{v.prodDetail.evaluate ? v.prodDetail.evaluate : ''}</span>
                                        </div>
                                        <div >
                                            <span className="prod-detail-item-info"><FormattedMessage id="monitor.seller.id" defaultMessage="卖家ID" />：{v.prodDetail.sellerNick ? v.prodDetail.sellerNick : ''}</span>
                                            <span className="prod-detail-item-info"><FormattedMessage id="monitor.storeName" defaultMessage="店铺名称" />：{v.prodDetail.storeName ? v.prodDetail.storeName : ''}</span>
                                        </div>
                                        <div>
                                            <span className="prod-detail-item-info"><FormattedMessage id="clue.report.shop.leave" defaultMessage="店铺等级" />：{this.renderStoreLevel(v.prodDetail.storeLevel ? v.prodDetail.storeLevel : '')}</span>
                                            <span className="prod-detail-item-info"><FormattedMessage id="clue.report.brand.information" defaultMessage="品牌信息" />：{v.prodDetail.brand ? v.prodDetail.brand : ''}</span>
                                        </div>
                                        <div>
                                            <span className="prod-detail-item-info"><FormattedMessage id="monitor.address" defaultMessage="发货地" />：{v.prodDetail.consignmentPlace ? v.prodDetail.consignmentPlace : ''}</span>
                                        </div>
                                    </div>
                                    {
                                        v.photoUrl
                                            ? (
                                                <div className="prod-detail-img-info">
                                                    <img src={v.photoUrl} alt="" onClick={() => { this.setState({ visible: true, showImg: v.photoUrl }) }} />
                                                </div>
                                            )
                                            : ''
                                    }

                                </div>
                            )) : ""
                        }
                    </div>
                </Modal>
                <PictureModal
                    visible={visible}
                    showImg={showImg}
                    onCancel={() => this.setState({ visible: false })}
                />
            </Card>
        )
    }
}


export default injectIntl(ProdDetail)