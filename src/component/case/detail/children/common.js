import React, { Component } from 'react'
import { message } from 'antd'

export default class Common extends Component {
    // 整理文件格式
    formattedFileList(fileList, type) {
        if (fileList.length) {
            for (let i = 0; i < fileList.length; i++) {
                const element = fileList[i];
                element.fileType = type;
                element.fileName = element.name;
                if (/^rc/.test(element.uid)) {
                    element.fileUrl = element.response.dataObject
                    element.url = element.response.dataObject
                } else {
                    element.fileUrl = element.url
                    element.url = element.url
                }
            }
        }
        return fileList;
    }

    // 上传文件前检测文件大小
    beforeUpload(file) {
        if ((file.size / 1024 / 1024) > 10) {
            message.info('上传文件过大');
            this.uid = file.uid;
            return false;
        }
    }

    // 上传文件
    uploadFileChange({ file, fileList }, key) {
        if((file.status === 'done' && !file.response.success) || file.status === 'error' ) {
            message.info("文件上传失败，请稍后再试")
            return
        } 
        for (let i = 0; i < fileList.length; i++) {
            const element = fileList[i];
            if (file.uid === element.uid) {
                if (file.status === 'done' && file.response.success) {
                    element.url = file.response.dataObject;
                }
            }
        }
        let newFileList = fileList.filter(item => {
            return item.uid !== this.uid
        })
        this.setState({
            [key]: newFileList
        })
    }

    // 获取对应的name
    getName(arr, key, type, language) {
        if (arr.length && key) {
            if (type === 'platform' || type === 'torts' || type === 'caseType' || type === 'warnStatus' || type === 'suitStatus') {
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element.dictVal === key) {
                        if(language === 'zh') {
                            return element.dictLabel
                        } else {
                            return element.dictLabelEn
                        }
                    }
                }
            } else if (type === 'brand' || type==='prod') {
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element.id === key) {
                        return element.name
                    }
                }
            }
        }
        return '';
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}