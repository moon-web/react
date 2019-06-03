import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Layout } from 'antd'
const { Footer } = Layout;


class BasicLayout extends Component {
    render() {
        return (
            <Footer>
                <div className="footer">
                    <div className="footer-item">
                        <div className="footer-title">
                            <FormattedMessage id="footer.customer.service.telephone.numbers" defaultMessage="客服电话" description="客服电话" />
                        </div>
                        <div className="footer-info">
                            0571-89717276 (<FormattedMessage id="footer.miss.zhang" defaultMessage="张女士" description="张女士" />)
                        </div>
                    </div>
                    <div className="footer-item">
                        <div className="footer-title">
                            <FormattedMessage id="footer.Mailbox.num" defaultMessage="邮箱" description="邮箱" />
                        </div>
                        <div className="footer-info">
                            info@ipcommune.com
                        </div>
                    </div>
                    <div className="footer-item">
                        <div className="footer-title">
                            <FormattedMessage id="footer.address" defaultMessage="地址" description="地址" />
                        </div>
                        <div className="footer-info">
                            <FormattedMessage id="footer.company.address" defaultMessage="浙江省杭州市余杭区五常街道文一西路998号1-1205室" description="浙江省杭州市余杭区五常街道文一西路998号1-1205室" />
                        </div>
                    </div>
                    <div className="footer-item">
                        <div className="footer-title">
                            <img src={require('../../../../assets/images/zhegongan.png')} alt="网警" />
                            <FormattedMessage id="footer.zhejiang" defaultMessage="浙江网安备号" description="浙江网安备号" />
                        </div>
                        <div className="footer-info">
                            <FormattedMessage id="footer.copyright" defaultMessage="Copyright©️2017版权所有ICP证: 浙ICP备17056416" description="Copyright©️2017版权所有ICP证: 浙ICP备17056416" />
                        </div>
                    </div>
                </div>
            </Footer>
        )
    }
}

export default injectIntl(BasicLayout)