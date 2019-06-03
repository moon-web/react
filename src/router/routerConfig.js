const rouer = [
    //首页1 home
    {path:'/',key:'101',openKey:'1'},
    {path:'/index',key:'101',openKey:'1'},
    {path:'/kanban',key:'102',openKey:'1'},

    //用户管理2  user
    {path:'/users/volunteer',key:'201',openKey:'2'},
    {path:'/users/investigator',key:'202',openKey:'2'},
    {path:'/users/investigatorApply',key:'203',openKey:'2'},

    //品牌管理3  inbox
    {path:'/brand/list',key:'301',openKey:'3'},
    {path:'/brand/delivery',key:'302',openKey:'3'},

    //案件管理4  switcher
    {path:'/case/list',key:'401',openKey:''},
    {path:'/case/detail',key:'401',openKey:''},
    {path:'/case/new',key:'401',openKey:''},

    //志愿者举报管理5 exception
    {path:'/volunteer/report/List',key:'501',openKey:'5'},
    {path:'/volunteer/report/task',key:'502',openKey:'5'},
    {path:'/volunteer/report/screen',key:'110405',openKey:'5'},
    

    //数据监测管理6  paper-clip
    {path:'/monitor/rule',key:'601',openKey:'6'},
    {path:'/monitor/result',key:'602',openKey:'6'},
    
    //投诉管理7  filter
    {path:'/complaint/online',key:'701',openKey:'7'},
    {path:'/complaint/wechat',key:'702',openKey:'7'},
    {path:'/complaint/video',key:'703',openKey:'7'},

    //调查举报管理8  book
    {path:'/report/clue',key:'801',openKey:'8'},
    {path:'/report/task',key:'802',openKey:'8'},
    {path:'/report/reward',key:'803',openKey:'8'},

    //鉴定管理9  printer
    {path:'/appraisal/list',key:'901',openKey:''},
    {path:'/appraisal/detail',key:'901',openKey:''},

    //线索及任务管理10  laptop
    {path:'/clue/line',key:'1001',openKey:'10'},
    {path:'/clue/offline',key:'1002',openKey:'10'},
    {path:'/clue/task',key:'1003',openKey:'10'},
    {path:'/clue/new/task',key:'1003',openKey:'10'},
    {path:'/clue/apply/task',key:'1004',openKey:'10'},
    {path:'/clue/report/line',key:'1005',openKey:'10'},
    {path:'/clue/report/offline',key:'1006',openKey:'10'},

    //系统管理11 setting
    {path:'/system/users',key:'1101',openKey:'11'},
    {path:'/system/white',key:'1102',openKey:'11'},
    {path:'/system/resource',key:'1103',openKey:'11'},
    {path:'/system/uploadfile',key:'110204',openKey:'11'},
    {path:'/system/role',key:'110281',openKey:'11'},
    {path:'/system/dictonary',key:'110294',openKey:'11'},
    {path:'/system/category',key:'110295',openKey:'11'},
    {path:'/system/versionNumber',key:"110392",openKey:'11'},
    {path:'/system/excel',key:"110393",openKey:'11'},
    {path:'/system/oplogs',key:"110375",openKey:'11'},
    {path:'/system/menu',key:"110330",openKey:'11'},

    // 线索专案管理
    {path:'/thread/index',key:'110457',openKey:'110456'},
    {path:'/thread/brand/list',key:'110482',openKey:'110456'},
    //诉讼案件管理
    {path:'/thread/litigation/list',key:'110459',openKey:'110456'},
    {path:'/offlinecaselist/list',key:'110505',openKey:'110456'},
    {path:'/offlinecaselist/brand/toexamine',key:'110506',openKey:'110456'},
]
export default rouer