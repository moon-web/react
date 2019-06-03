import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { LocaleProvider } from 'antd';
import { addLocaleData, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'

//引入组件
//后台管理界面
import Authorized from './router/authorized/connect'
import BasicLayout from './component/common/layout/basicLayout'
import Login from './component/user/login/connect'

// 引入国际化语言
import antdZhCN from 'antd/lib/locale-provider/zh_CN';
import zh_CN from './zh_CN'
import en_US from './en_US'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'intl';
import 'intl/locale-data/jsonp/en'
import './assets/css/admin.css'
import store from './store/index'

moment.locale('en');
addLocaleData([...en, ...zh])

const langMap = {
    'zh': zh_CN,
    'en': en_US
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            locale: 'zh',
            antdLocale: antdZhCN
        }
    }

    componentWillMount() {
        let language = localStorage.getItem('lan');
        let antdLocale = null, locale = 'en';
        if (language === 'zh' || !language) {
            antdLocale = antdZhCN;
            locale = 'zh';
            moment.locale('zh-cn');
        }
        this.setState({
            locale,
            antdLocale
        })
    }

    changeLocale(value) {
        const localeValue = value;
        if (localeValue === 'en') {
            this.setState({
                antdLocale: null,
                locale: 'en'
            })
            moment.locale('en');
        } else {
            this.setState({
                antdLocale: antdZhCN,
                locale: 'zh'
            })
            moment.locale('zh-cn');
        }
    }


    render() {
        let { antdLocale, locale } = this.state;
        return (
            <LocaleProvider locale={antdLocale}>
                <IntlProvider locale={locale} messages={langMap[locale]}>
                    <Provider store={store}>
                        <BrowserRouter>
                            <Switch>
                                <Route path="/login" render={props => <Login changeLocale={(e) => this.changeLocale(e)} {...props} />} />
                                <Authorized path="/" 
                                    changeLocale={e => this.changeLocale(e)} 
                                    component={BasicLayout} 
                                />
                            </Switch>
                        </BrowserRouter>
                    </Provider>
                </IntlProvider>
            </LocaleProvider>
        );
    }
}

export default App;
