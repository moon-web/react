// 公共英文
import MSGS from './locals/zh.json';
// 组件内英文
// import MSGS1 from './M/zh.json'
import LoginMsg from './component/user/login/local/zh.json'
import VolunteerManagementMsg from  './component/user/local/zh.json';
import ReportMsg from './component/volunteerReport/local/zh.json'
import BrandMsg from './component/brand/local/zh.json'
import MonitorMsg from './component/monitoring/local/zh.json'
import HomeMsg from './component/home/local/zh.json'
import RouterMsg from './router/local/zh.json'
import ComplainMsg from './component/complaint/local/zh.json'
import CaseMsg from './component/case/local/zh.json'
import FooterMsg from './component/common/layout/locale/zh.json'
import SystemMsg from './component/system/local/zh.json'
import ClueMsg from './component/clue/local/zh.json'
import AppraisalMsg from './component/appraisal/local/zh.json'
import investigationreportMsg from './component/investigationreport/locale/zh.json'
import ThreadMsg from './component/clueLitigation/thread/local/zh.json'
import LitigationMsg from './component/clueLitigation/litigation/local/zh.json'
import OfflineCaseMsg from './component/clueLitigation/offlineCase/locale/zh.json'
// 后台返回中英文
import BackMsg from './backLocal/zh.json'

const messages = {
  ...MSGS,
  // ...MSGS1
  ...LoginMsg,
  ...BrandMsg,
  ...VolunteerManagementMsg,
  ...ReportMsg,
  ...MonitorMsg,
  ...HomeMsg,
  ...RouterMsg,
  ...ComplainMsg,
  ...CaseMsg,
  ...BackMsg,
  ...FooterMsg,
  ...SystemMsg,
  ...ClueMsg,
  ...FooterMsg,
  ...investigationreportMsg,
  ...AppraisalMsg,
  ...ThreadMsg,
  ...LitigationMsg,
  ...OfflineCaseMsg
}

export default messages;