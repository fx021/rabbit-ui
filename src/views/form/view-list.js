const readonly = { placeholder: '是否只读', key: 'readonly', emptyVal: false, dicData: [{ label: '只读', value: true }, { label: '可读写', value: false }] }
const clearable = { placeholder: '可清空', key: 'clearable', emptyVal: true, dicData: [{ label: '可清空', value: true }, { label: '不可清空', value: false }] }
const maxlength = { placeholder: '最大长度', key: 'maxlength', valType: 'integer' }
const selectLimit = { placeholder: '可选数量', key: 'limit', emptyVal: 1, valType: 'integer', dicData: [{ label: '单选', value: 1 }, { label: '多选', value: 0 }] }
export default () => {
    return [{
        label: '普通文本',
        type: 'input',
        params: [
            { placeholder: '前缀', key: 'prepend' },
            { placeholder: '后缀', key: 'append' },
            maxlength,
            clearable,
            readonly
        ]
    }, {
        label: '多行文本',
        type: 'textarea',
        params: [
            { placeholder: '最小行', key: 'minRows', valType: 'integer' },
            { placeholder: '最大行', key: 'maxRows', valType: 'integer' },
            maxlength,
            clearable,
            readonly
        ]
    }, {
        label: '密码框',
        type: 'password',
        params: [
            { placeholder: '前缀', key: 'prepend' },
            { placeholder: '后缀', key: 'append' },
            maxlength,
            { placeholder: '显示密码', key: 'showPassword', emptyVal: true, dicData: [{ label: '有显示图标', value: true }, { label: '无显示图标', value: false }] },
            readonly
        ]
    }, {
        label: '计数器',
        type: 'number',
        params: [
            { placeholder: '最小值', key: 'minRows', emptyVal: 0, valType: 'integer' },
            { placeholder: '最大值', key: 'maxRows', valType: 'integer' },
            { placeholder: '步长', emptyVal: 1, key: 'step', valType: 'integer' },
            { placeholder: '数值精度', emptyVal: 0, key: 'precision', valType: 'integer' },
            { placeholder: '控制器位置', key: 'controlsPosition', dicData: [{ label: '左右控制', value: '' }, { label: '右边控制', value: 'right' }, { label: '无控制器', value: 'none' }], emptyVal: 'right', extra: { controls: true } }
        ]
    }, {
        label: '单选框',
        type: 'radio',
        params: [
            { placeholder: '字典父id', key: 'dictId', valType: 'dic', required: true },
            { placeholder: '按钮样式', key: 'button', emptyVal: false, dicData: [{ label: '按钮', value: true }, { label: '非按钮', value: false }] },
            { placeholder: '有边框', key: 'border', emptyVal: false, dicData: [{ label: '有边框', value: true }, { label: '无边框', value: false }] },
            // { placeholder: '可清空', key: 'clearable', emptyVal: false, dicData: [{ label: '可清空', value: true }, { label: '不可清空', value: false }] }
        ]
    }, {
        label: '复选框',
        type: 'checkbox',
        params: [
            { placeholder: '字典父id', key: 'dictId', valType: 'dic', required: true },
            { placeholder: '按钮样式', key: 'button', emptyVal: false, dicData: [{ label: '按钮', value: true }, { label: '非按钮', value: false }] },
            { placeholder: '有边框', key: 'border', emptyVal: false, dicData: [{ label: '有边框', value: true }, { label: '无边框', value: false }] }
        ]
    }, {
        label: '下拉框',
        type: 'select',
        params: [
            { placeholder: '字典父id', key: 'dictId', valType: 'dic', required: true },
            { placeholder: '是否多选', emptyVal: false, valType: 'bool', key: 'multiple', dicData: [{ label: '单选', value: false }, { label: '多选', value: true }] },
            { placeholder: '折叠显示', emptyVal: true, valType: 'bool', key: 'tags', dicData: [{ label: '折叠显示', value: true }, { label: '不折叠', value: false }] }
            // { placeholder: '可创新值', key: 'allowCreate', emptyVal: false, dicData: [{ label: '可创新值', value: true }, { label: '不可创新值', value: false }] }
        ]
    }, {
        label: '级联选择',
        type: 'cascader',
        params: [
            { placeholder: '字典父id', key: 'dictId', valType: 'dic', required: true },
            { placeholder: '是否多选', emptyVal: false, valType: 'bool', key: 'multiple', dicData: [{ label: '单选', value: false }, { label: '多选', value: true }] },
            { placeholder: '可选父级', emptyVal: false, valType: 'bool', key: 'checkStrictly', dicData: [{ label: '可选父级', value: true }, { label: '不可选父级', value: false }] },
            { placeholder: '显示完整路径', emptyVal: true, valType: 'bool', key: 'showAllLevels', dicData: [{ label: '显示完整路径', value: true }, { label: '不显示完整路径', value: false }] },
            { placeholder: '折叠显示', emptyVal: true, valType: 'bool', key: 'tags', dicData: [{ label: '折叠显示', value: true }, { label: '不折叠', value: false }] }
        ]
    },/* {
        label: '静态图',
        type: 'image',
        params: [
            { placeholder: '图片链接', key: 'images' },
            { placeholder: '轮播间隔', value: '1', key: 'limit', valType: 'integer' },
            { placeholder: '自动轮播', key: 'fileSize', valType: 'fileSize' },
        ]
    }, */{
        label: '日期',
        type: 'date',
        params: [
            { placeholder: '显示格式', key: 'format', emptyVal: 'yyyy-MM-dd', dicData: [{ label: "yyyy-MM-dd", value: "yyyy-MM-dd" }, { label: "yyyyMMdd", value: "yyyyMMdd" }, { label: "yyyy/MM/dd", value: "yyyy/MM/dd" }] },
            { placeholder: '保存格式', emptyVal: 'yyyy-MM-dd', key: 'valueFormat', dicData: [{ label: "yyyy-MM-dd", value: "yyyy-MM-dd" }] }
        ]
    }, {
        label: '时间',
        type: 'time',
        params: [
            { placeholder: '显示格式', key: 'format', emptyVal: 'HH:mm:ss', dicData: [{ label: "HH:mm:ss", value: "HH:mm:ss" }, { label: "A hh:mm:ss", value: "A hh:mm:ss" }] },
            { placeholder: '保存格式', emptyVal: 'HH:mm:ss', key: 'valueFormat', dicData: [{ label: "HH:mm:ss", value: "HH:mm:ss" }] }
        ]
    }, {
        label: '日期时间',
        type: 'datetime',
        params: [
            { placeholder: '显示格式', key: 'format', emptyVal: 'yyyy-MM-dd HH:mm:ss', dicData: [{ label: "yyyy-MM-dd HH:mm:ss", value: "yyyy-MM-dd HH:mm:ss" }, { label: "yyyyMMddHHmmss", value: "yyyyMMddHHmmss" }, { label: "yyyy/MM/dd HH:mm:ss", value: "yyyy/MM/dd HH:mm:ss" }] },
            { placeholder: '保存格式', emptyVal: 'yyyy-MM-dd HH:mm:ss', key: 'valueFormat', dicData: [{ label: "yyyy-MM-dd HH:mm:ss", value: "yyyy-MM-dd HH:mm:ss" }] },
            { placeholder: '默认时间', key: 'defaultTime', emptyVal: '08:00:00' }
        ]
    }, {
        label: '日期范围',
        type: 'daterange',
        valType: 'array',
        params: [
            { placeholder: '显示格式', key: 'format', emptyVal: 'yyyy-MM-dd', dicData: [{ label: "yyyy-MM-dd", value: "yyyy-MM-dd" }, { label: "yyyyMMdd", value: "yyyyMMdd" }, { label: "yyyy/MM/dd", value: "yyyy/MM/dd" }] },
            { placeholder: '保存格式', emptyVal: 'yyyy-MM-dd', key: 'valueFormat', dicData: [{ label: "yyyy-MM-dd", value: "yyyy-MM-dd" }] }
        ]
    }, {
        label: '时间范围',
        type: 'timerange',
        valType: 'array',
        params: [
            { placeholder: '显示格式', key: 'format', emptyVal: 'HH:mm:ss', dicData: [{ label: "HH:mm:ss", value: "HH:mm:ss" }, { label: "A hh:mm:ss", value: "A hh:mm:ss" }] },
            { placeholder: '保存格式', emptyVal: 'HH:mm:ss', key: 'valueFormat', dicData: [{ label: "HH:mm:ss", value: "HH:mm:ss" }] }
        ]
    }, {
        label: '日期时间范围',
        type: 'datetimerange',
        valType: 'array',
        params: [
            { placeholder: '显示格式', key: 'format', emptyVal: 'yyyy-MM-dd HH:mm:ss', dicData: [{ label: "yyyy-MM-dd HH:mm:ss", value: "yyyy-MM-dd HH:mm:ss" }, { label: "yyyyMMddHHmmss", value: "yyyyMMddHHmmss" }, { label: "yyyy/MM/dd HH:mm:ss", value: "yyyy/MM/dd HH:mm:ss" }] },
            { placeholder: '保存格式', emptyVal: 'yyyy-MM-dd HH:mm:ss', key: 'valueFormat', dicData: [{ label: "yyyy-MM-dd HH:mm:ss", value: "yyyy-MM-dd HH:mm:ss" }] },
            { placeholder: '默认时间', key: 'defaultTime', emptyVal: '00:00:00,23:59:59', valType: 'array' }
        ]
    }, {
        label: '弹出框',
        type: 'popData',
        component: 'popData',
        params: [
            { placeholder: '弹出框', key: 'popId', required: true },
            selectLimit,
            { placeholder: '匹配', key: 'step', emptyVal: 1, valType: 'integer', dicData: [{ label: '左匹配输入', value: 1 }, { label: '全匹配输入', value: 3 }, { label: '模糊匹配', value: 2 }, { label: '禁止输入', value: 0 }] }
        ]
    }, {
        label: '上传',
        type: 'upload',
        params: [
            { placeholder: '可选数量', key: 'limit', valType: 'integer', emptyVal: '1' },
            { placeholder: '文件大小 6M', key: 'fileSize', valType: 'fileSize' },
            { placeholder: '文件列表类型', key: 'listType', emptyVal: 'text', dicData: [{ label: '附件', value: 'text' }, { label: '照片墙', value: 'picture-card' }, { label: '头像', value: 'picture-img' }, { label: '缩略图', value: 'picture' }, { label: 'pdf文档', value: 'pdf' }, { label: 'doc文档', value: 'doc' }, { label: 'excel文档', value: 'excel' }, { label: 'ppt文档', value: 'ppt' }, { label: 'doc和excel', value: 'docel' }, { label: 'doc,excel和pdf', value: 'docext' }, { label: 'doc,excel,ppt和pdf', value: 'office' }, { label: '压缩文档', value: 'zip' }] },
            { placeholder: '是否可拖拽', key: 'drag', emptyVal: false, dicData: [{ label: '可拖拽', value: true }, { label: '不可拖拽', value: false }] },
            { placeholder: '水印文字', key: 'watermark', valType: 'canvas' },
        ]
    }, {
        label: '下载',
        type: 'download',
        component: 'download',
        params: [
            { placeholder: '附件', key: 'actionData', required: true },
            { placeholder: '附属说明', key: 'action' },
            { placeholder: '说明位置', key: 'step', emptyVal: 0, valType: 'integer', dicData: [{ label: '右边说明', value: 0 }, { label: '下边说明', value: 1 }, { label: '左边说明', value: 2 }, { label: 'hover说明', value: 3 }] },
        ]
    }, {
        label: '选人',
        type: 'userSelect',
        component: 'userSelect',
        params: [
            { placeholder: '附属信息', key: 'actionData' },
            selectLimit,
            readonly
        ]
    }, {
        label: '选部门',
        type: 'deptSelect',
        component: 'deptSelect',
        params: [
            selectLimit,
            readonly
        ]
    }, {
        label: '选角色',
        type: 'roleSelect',
        component: 'roleSelect',
        params: [
            selectLimit,
            readonly
        ]
    }, {
        label: '选岗位',
        type: 'postSelect',
        component: 'postSelect',
        params: [
            selectLimit,
            readonly
        ]
    }, {
        label: '省市区',
        type: 'areaSelect',
        component: 'areaSelect',
        params: [
            selectLimit,
            { placeholder: '可选范围', key: 'cascaderIndex', emptyVal: 2, dicData: [{ label: '选择区', value: 2 }, { label: '选择市', value: 1 }, { label: '选择省', value: 0 }] },
            { placeholder: '折叠显示', emptyVal: true, valType: 'bool', key: 'tags', dicData: [{ label: '折叠显示', value: true }, { label: '不折叠', value: false }] },
            readonly
        ]
    }, {
        label: '表达式',
        type: 'rowExpression',
        component: 'rowExpression',
        params: [{ placeholder: '表达式', key: 'action' }, { placeholder: '前缀', key: 'prepend' }, { placeholder: '后缀', key: 'append' }, { placeholder: '非数字', key: 'controls', valType: 'bool', emptyVal: true, dicData: [{ label: '过滤非数字', value: true }, { label: '允许非数字', value: false }] },
        { placeholder: '精度', key: 'precision', emptyVal: 2, valType: 'integer' }]
    }, {
        label: 'id回显',
        type: 'idShow',
        component: 'idShow',
        params: [{ placeholder: '回显类型', key: 'viewMode', emptyVal: 1 }, { placeholder: '前缀', key: 'prepend' }, { placeholder: '后缀', key: 'append' }]
    }, {
        label: '开关',
        type: 'switch',
        params: [
            { placeholder: '选中文字', key: 'activeText' },
            { placeholder: '不选中文字', key: 'inactiveText' },
            { placeholder: '选中值 1', key: 'activeValue', emptyVal: 1 },
            { placeholder: '不选中值 0', key: 'inactiveValue', emptyVal: 0 }
        ]
    }, {
        label: '评价',
        type: 'rate',
        params: [
            { placeholder: '最大星数', key: 'max', emptyVal: 5, valType: 'integer' },
            { placeholder: '显示文字', key: 'showText', emptyVal: false, valType: 'bool', dicData: [{ label: '显示文字', value: true }, { label: '隐藏文字', value: false }] },
            { placeholder: '文字1,文字2', key: 'texts', valType: 'array' }
        ]
    }, {
        label: '滑块', type: 'slider',
        params: [
            { placeholder: '最小值', key: 'min', valType: 'integer' },
            { placeholder: '最大值', emptyVal: '10', key: 'max', valType: 'integer' },
            { placeholder: '步长', emptyVal: 1, key: 'step', valType: 'integer' },
            { placeholder: '显示节点', key: 'showStops', emptyVal: false, valType: 'bool', dicData: [{ label: '显示节点', value: true }, { label: '隐藏节点', value: false }] },
            { placeholder: '输入框', key: 'showInput', emptyVal: false, valType: 'bool', dicData: [{ label: '有输入框', value: true }, { label: '无输入框', value: false }] }
        ]
    }, {
        label: '周',
        type: 'week',
        params: [
            { placeholder: '显示格式', key: 'format', emptyVal: 'yyyy 第 WW 周' },
            { placeholder: '保存格式', emptyVal: 'yyyyWW', key: 'valueFormat', dicData: [{ label: "yyyyWW", value: "yyyyWW" }] }
        ]
    }, {
        label: '年',
        type: 'year',
        params: [
            { placeholder: '显示格式', key: 'format', emptyVal: 'yyyy年' },
            { placeholder: '保存格式', emptyVal: 'yyyy', key: 'valueFormat', dicData: [{ label: "yyyy", value: "yyyy" }] }
        ]
    }, {
        label: '月',
        type: 'month',
        params: [
            { placeholder: '显示格式', key: 'format', emptyVal: 'MM月' },
            { placeholder: '保存格式', emptyVal: 'MM', key: 'valueFormat', dicData: [{ label: "MM", value: "MM" }] }
        ]
    }, {
        label: '日历',
        type: 'elCalendar',
        component: 'elCalendar',
        params: [
            { placeholder: '周起始日', key: 'firstDayOfWeek', emptyVal: 1, valType: 'integer', dicData: [{ label: '周日起始', value: 7 }, { label: '周一起始', value: 1 }] }
            // { placeholder: '默认月份', key: 'value', valType: 'integer' }
        ]
    }, {
        label: '富文本',
        type: 'ueditor',
        params: []
    }]
}