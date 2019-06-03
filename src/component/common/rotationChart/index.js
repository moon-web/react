import React, { Component } from 'react'
import { Carousel } from 'antd'
import { FormattedMessage } from 'react-intl'
import './index.css'
class RotaionChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            autoplay: true
          };
        let imgUrl = this.props.imgUrl;
        return (
            <div>
               <Carousel {...settings}>
                    {
                        imgUrl && imgUrl.length?
                            imgUrl.map((v,i)=>(
                                <img src={v} alt="" key={i} style={{width:'auto'}}/>
                            )):<div><FormattedMessage id="global.no.data" defaultMessage="暂无历史数据" description="暂无历史数据" /></div>
                    }
                </Carousel>
            </div>
        )
    }
}

export default RotaionChart
