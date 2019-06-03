import React, { Component } from 'react'
import { Icon } from 'antd'

export default class FileListComponent extends Component {
    render() {
        let { fileList } = this.props;
        return (
            <div className='ant-upload-list ant-upload-list-text'>
                {
                    fileList && fileList.length
                        ? fileList.map((item, index) => (
                            <div className='ant-upload-list-item ant-upload-list-item-done' key={item.uid ? item.uid : index}>
                                <div className="ant-upload-list-item-info">
                                    <span>
                                        <Icon type='paper-clip' />
                                        <a 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="ant-upload-list-item-name" 
                                            href={item.response ? item.response.dataObject : item.url ? item.url : ''} 
                                            title={item.name}
                                        >
                                            {item.name}
                                        </a>
                                    </span>
                                </div>
                            </div>
                        ))
                        : ''
                }
            </div>
        )
    }
}
