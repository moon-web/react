// 公共英文
import MSGS from './locals/en.json';
// 组件内英文
// import MSGS1 from './M/en.json'
import LoginMsg from './component/user/login/local/en.json'
import VolunteerManagementMsg from  './component/user/local/en.json'
import ReportMsg from './component/volunteerReport/local/en.json'
import BrandMsg from './component/brand/local/en.json'
import MonitorMsg from './component/monitoring/local/en.json'
import HomeMsg from './component/home/local/en.json'
import RouterMsg from './router/local/en.json'
import ComplainMsg from './component/complaint/local/en.json'
import CaseMsg from './component/case/local/en.json'
import FooterMsg from './component/common/layout/locale/en.json'
import SystemMsg from './component/system/local/en.json'
import ClueMsg from './component/clue/local/en.json'
import investigationreportMsg from './component/investigationreport/locale/en.json'
import AppraisalMsg from './component/appraisal/local/en.json'
import ThreadMsg from './component/clueLitigation/thread/local/en.json'
import LitigationMsg from './component/clueLitigation/litigation/local/en.json'
import OfflineCaseMsg from './component/clueLitigation/offlineCase/locale/en.json'
// 后台返回中英文
import BackMsg from './backLocal/en.json'

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