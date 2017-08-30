const sideList = [
  {
    name: '工作平台',
    children: [
      {
        name: '我的任务',
        expand: false,
        icon: 'all',
        children: [
          {
            name: '首页',
            routerName: 'home',
          },
          {
            name: '待办箱',
            routerName: '404s',
          },
          {
            name: '历史箱',
            routerName: '404s',
          },
        ],
      },
      {
        name: '系统管理',
        expand: false,
        icon: 'set',
        children: [
          {
            name: '消息提醒',
            routerName: '401s',
          },
          {
            name: '修改密码',
            routerName: 'password',
          },
          {
            name: '用户管理',
            routerName: '404s',
          },
          {
            name: '流程监控',
            routerName: '404s',
          },
          {
            name: '流程定义',
            routerName: '404s',
          },
          {
            name: '表单定义',
            routerName: '404s',
          },
          {
            name: '编号规则',
            routerName: '404s',
          },
          {
            name: '资源类别维护',
            routerName: '404s',
          },
          {
            name: '资源维护',
            routerName: '404s',
          },
          {
            name: '委托设置',
            routerName: '404s',
          },
        ],
      },
    ],
  },
  {
    name: '人事系统',
    children: [
      {
        name: '我的任务',
        expand: false,
        icon: 'box',
        children: [
          {
            name: '待办箱',
            routerName: '404s',
          },
          {
            name: '历史箱',
            routerName: '404s',
          },
        ],
      },
      {
        name: '考勤管理',
        expand: false,
        icon: 'survey',
        children: [
          {
            name: '考勤查询',
            routerName: 'attendanceList',
          },
          {
            name: '请假申请',
            routerName: 'leaveList',
          },
          {
            name: '外出申请',
            routerName: 'outList',
          },
          {
            name: '调休申请',
            routerName: 'offList',
          },
          {
            name: '补打卡申请',
            routerName: 'reAttendanceList',
          },
          {
            name: '销假申请',
            routerName: 'backLeaveList',
          },
          {
            name: '排班设置',
            routerName: 'scheduleList',
          },
          {
            name: '批量请假',
            routerName: 'multiLeaveList',
          },
          {
            name: '办事处考勤',
            routerName: '404s',
          },
        ],
      },
      {
        name: '人事管理',
        expand: false,
        icon: 'bussinessman',
        children: [
          {
            name: '人员电子档案',
            routerName: '404s',
          },
          {
            name: '待入职人员',
            routerName: '404s',
          },
          {
            name: '人员账户',
            routerName: '404s',
          },
          {
            name: '实习生',
            routerName: '404s',
          },
          {
            name: '在职员工',
            routerName: '404s',
          },
          {
            name: '离职员工',
            routerName: '404s',
          },
          {
            name: '工资单',
            routerName: '404s',
          },
        ],
      },
      {
        name: '招聘管理',
        expand: false,
        icon: 'trust',
        children: [
          {
            name: '人才库',
            routerName: '404s',
          },
          {
            name: '招聘需求申请',
            routerName: '404s',
          },
          {
            name: '招聘计划',
            routerName: '404s',
          },
          {
            name: '招聘需求申请变更',
            routerName: '404s',
          },
          {
            name: '内部推荐',
            routerName: '404s',
          },
          {
            name: '简历筛选',
            routerName: '404s',
          },
          {
            name: '面试安排',
            routerName: '404s',
          },
          {
            name: '面试评价',
            routerName: '404s',
          },
          {
            name: '发送offer',
            routerName: '404s',
          },
          {
            name: '面试日程安排',
            routerName: '404s',
          },
          {
            name: '90天跟踪管理',
            routerName: '404s',
          },
        ],
      },
      {
        name: '数据统计',
        expand: false,
        icon: 'training',
        children: [
          {
            name: '出勤统计',
            routerName: '404s',
          },
          {
            name: '考勤统计',
            routerName: '404s',
          },
        ],
      },
      {
        name: '系统维护',
        expand: false,
        icon: 'electrical',
        children: [
          {
            name: '考勤模板',
            routerName: '404s',
          },
          {
            name: '年假维护',
            routerName: '404s',
          },
          {
            name: '调休维护',
            routerName: '404s',
          },
          {
            name: '节假日维护',
            routerName: '404s',
          },
          {
            name: '工号维护',
            routerName: '404s',
          },
        ],
      },
    ],
  },
  {
    name: '财务系统',
    children: [
      {
        name: '我的任务',
        expand: false,
        icon: 'box',
        children: [
          {
            name: '待办箱',
            routerName: '401s',
          },
          {
            name: '历史箱',
            routerName: '404s',
          },
        ],
      },
      {
        name: '数据统计',
        expand: false,
        icon: 'training',
        children: [
          {
            name: '综合查询',
            routerName: '404s',
          },
        ],
      },
      {
        name: '预算管理',
        expand: false,
        icon: 'Calculator',
        children: [
          {
            name: '预算编制',
            routerName: '404s',
          },
          {
            name: '预算编制变更',
            routerName: '404s',
          },
          {
            name: '预算控制',
            routerName: '404s',
          },
          {
            name: '预算控制变更',
            routerName: '404s',
          },
          {
            name: '预算编制查询',
            routerName: '404s',
          },
          {
            name: '预算控制查询',
            routerName: '404s',
          },
        ],
      },
      {
        name: '采购管理',
        expand: false,
        icon: 'trust',
        children: [
          {
            name: '采购申请',
            routerName: '404s',
          },
          {
            name: '采购发货',
            routerName: '404s',
          },
        ],
      },
      {
        name: '费用管理',
        expand: false,
        icon: 'trade',
        children: [
          {
            name: '费用申请',
            routerName: '404s',
          },
          {
            name: '差旅申请',
            routerName: '404s',
          },
          {
            name: '探亲报销',
            routerName: '404s',
          },
        ],
      },
      {
        name: '基础数据维护',
        expand: false,
        icon: 'training',
        children: [
          {
            name: '业务类型',
            routerName: '404s',
          },
          {
            name: '会计科目',
            routerName: '404s',
          },
          {
            name: '对外科目',
            routerName: '404s',
          },
          {
            name: '区域维护',
            routerName: '404s',
          },
          {
            name: '客户维护',
            routerName: '404s',
          },
          {
            name: '员工银行卡维护',
            routerName: '404s',
          },
          {
            name: '授权额度维护',
            routerName: '404s',
          },
          {
            name: '预算部门设置',
            routerName: '404s',
          },
          {
            name: '付款审批设置',
            routerName: '404s',
          },
          {
            name: '预算填写人',
            routerName: '404s',
          },
          {
            name: '采购标准商品库维护',
            routerName: '404s',
          },
        ],
      },
    ],
  },
  {
    name: '招聘系统',
    children: [
      {
        name: '我的任务',
        expand: false,
        icon: 'box',
        children: [
          {
            name: '待办箱',
            routerName: '401s',
          },
          {
            name: '历史箱',
            routerName: '404s',
          },
        ],
      },
    ],
  },
]

export default sideList