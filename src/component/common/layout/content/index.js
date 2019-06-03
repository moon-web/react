import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Breadcrumb } from 'antd'

export default class Content extends Component {
  render() {
    let { breadcrumbData: data, children, className } = this.props;
    return (
      <div className={className ? "container " + className : "container"}>
        {
          data
            ? (
              <div className="breadcrumb-wrap">
                <div className="breadcrumb-info">
                  <Breadcrumb>
                    {
                      data.map((item, index) => {
                        if (item.link) {
                          return (
                            <Breadcrumb.Item key={index}>
                              <Link to={{ pathname: item.link, query: item.query ? item.query : '' }} >
                                <FormattedMessage
                                  id={item.titleId}
                                  defaultMessage={item.title}
                                />
                              </Link>
                            </Breadcrumb.Item>
                          )
                        } else {
                          return (
                            <Breadcrumb.Item key={index}>
                              <FormattedMessage
                                id={item.titleId}
                                defaultMessage={item.title}
                              />
                            </Breadcrumb.Item>
                          )
                        }
                      })
                    }
                  </Breadcrumb>
                </div>
              </div>
            )
            : ''
        }
        <div className="content">
          {children}
        </div>
      </div>
    )
  }
}