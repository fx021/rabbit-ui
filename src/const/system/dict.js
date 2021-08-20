export const optionParent = {
  tip: false,
  height: 'auto',
  calcHeight: 100,
  searchShow: true,
  searchMenuSpan: 10,
  border: true,
  index: true,
  selection: true,
  viewBtn: true,
  menuWidth: 250,
  dialogWidth: 880,
  dialogClickModal: false,
  column: [
    {
      label: "字典编号",
      prop: "code",
      search: true,
      span: 24,
      rules: [
        {
          required: true,
          message: "请输入字典编号",
          trigger: "blur"
        }
      ]
    },
    {
      label: "字典名称",
      prop: "dictValue",
      search: true,
      align: "center",
      rules: [
        {
          required: true,
          message: "请输入字典名称",
          trigger: "blur"
        }
      ]
    },
    {
      label: "字典排序",
      prop: "sort",
      type: "number",
      align: "right",
      width: 80,
      hide: true,
      rules: [
        {
          required: true,
          message: "请输入字典排序",
          trigger: "blur"
        }
      ]
    },
    {
      label: "封存",
      prop: "isSealed",
      type: "switch",
      align: "center",
      width: 80,
      dicData: [
        {
          label: "否",
          value: 0
        },
        {
          label: "是",
          value: 1
        }
      ],
      value: 0,
      slot: true,
      rules: [
        {
          required: true,
          message: "请选择封存",
          trigger: "blur"
        }
      ]
    },
    {
      label: "字典备注",
      prop: "remark",
      hide: true
    },
    {
      label: "关联字典",
      prop: "cascadedId",
      formslot: true,
      hide: true,
    },
    {
      label: "关联字典",
      prop: "casName",
      editDisplay: false,
      viewDisplay: false,
      addDisplay: false,
    }
  ]
};

export const optionChild = {
  tip: false,
  height: 'auto',
  calcHeight: 80,
  searchShow: true,
  searchMenuSpan: 10,
  tree: true,
  border: true,
  index: true,
  selection: true,
  viewBtn: true,
  menuWidth: 220,
  dialogWidth: 880,
  dialogClickModal: false,
  column: [
    {
      label: "字典编号",
      prop: "code",
      addDisabled: true,
      editDisabled: true,
      search: true,
      rules: [
        {
          required: true,
          message: "请输入字典编号",
          trigger: "blur"
        }
      ]
    },
    {
      label: "字典名称",
      prop: "dictValue",
      search: true,
      align: "center",
      rules: [
        {
          required: true,
          message: "请输入字典名称",
          trigger: "blur"
        }
      ]
    },
    {
      label: "上级字典",
      prop: "parentId",
      type: "tree",
      dicData: [],
      hide: true,
      props: {
        label: "title"
      },
      addDisabled: true,
      editDisabled: true,
      rules: [
        {
          required: false,
          message: "请选择上级字典",
          trigger: "click"
        }
      ]
    },
    {
      label: "字典键值",
      prop: "dictKey",
      rules: [
        {
          required: true,
          message: "请输入字典键值",
          trigger: "blur"
        }
      ]
    },
    {
      label: "字典排序",
      prop: "sort",
      type: "number",
      align: "right",
      hide: true,
      rules: [
        {
          required: true,
          message: "请输入字典排序",
          trigger: "blur"
        }
      ]
    },
    {
      label: "封存",
      prop: "isSealed",
      type: "switch",
      align: "center",
      width: 80,
      dicData: [
        {
          label: "否",
          value: 0
        },
        {
          label: "是",
          value: 1
        }
      ],
      value: 0,
      slot: true,
      rules: [
        {
          required: true,
          message: "请选择封存",
          trigger: "blur"
        }
      ]
    },
    {
      label: "字典备注",
      prop: "remark",
      hide: true
    }
  ]
};
