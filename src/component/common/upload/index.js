import React, { Component } from 'react'
import { Icon, Progress } from 'antd'

class UploadImgList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    deleteImg(item) {
        this.props.deleteImg && this.props.deleteImg(item)
    }

    render() {
        let { fileList, close } = this.props;
        return (
            <div className="ant-upload-list ant-upload-list-picture">
                {
                    fileList.length !== 0 && fileList.map(item => (
                        <div
                            key={item.uid}
                            className={
                                'ant-upload-list-item ant-upload-animate-enter ant-upload-animate-enter-active' + (
                                    item.status === 'uploading'
                                        ? ' ant-upload-list-item-uploading'
                                        : item.status === 'done'
                                            ? ' ant-upload-list-item-done'
                                            : item.status === 'error'
                                                ? ' ant-upload-list-item-error'
                                                : ''
                                )
                            }
                        >
                            <div className="ant-upload-list-item-info">
                                <span>
                                    <a className="ant-upload-list-item-thumbnail" onClick={() => this.props.onPreview && this.props.onPreview(item)}>
                                        {
                                            /^image/.test(item.type)
                                                ? item.status === 'uploading' || item.status === 'error'
                                                    ? <Icon type="file" className="ant-upload-list-item-icon" />
                                                    : <img src={item.response.dataObject} alt={item.name} />
                                                : <Icon type="file" className="ant-upload-list-item-icon" />
                                        }
                                    </a>
                                    <span className="ant-upload-list-item-name" title={item.name}>{item.name}</span>
                                </span>
                            </div>
                            {
                                close ? '' : <Icon type="close" onClick={() => this.props.deleteImg && this.props.deleteImg(item)} />
                            }
                            {
                                item.status === 'uploading'
                                    ? (
                                        <div className="ant-upload-list-item-progress">
                                            <Progress percent={item.percent} strokeWidth={2} showInfo={false} />
                                        </div>
                                    )
                                    : ''
                            }
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default UploadImgList
