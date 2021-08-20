export default function () {
    return {
        model: {//与配置保持一致
            prop: 'value',
            event: 'change'
        },
        props: {
            limit: {//可选数量
                type: Number,
                default: 0
            },
            step: {
                type: Number,
                default: 0
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            required: {//可为空
                type: Boolean,
                default: false
            },
            showText: {//显示按钮的文字
                type: Boolean,
                default: true
            },
            prop: String,
            size: {
                type: String,
                default: () => 'small'
            },
            event: Object,//暂时用不到,接收column设置
            value: {
                type: [Number, String, Array],
                default: () => ''
            }
        },
        beforeDestroy() {
            if (this._defaultSelectTimer) {
                clearTimeout(this._defaultSelectTimer)
                this._defaultSelectTimer = null
            }
        },
        methods: {
            onSelectionChange() {//选择变更
                this.hasChange = true
            },
            clearSelected() {//清空
                this.$refs.table.clearSelection()
                this._defSelection = null
                if (!this.required) {
                    this.onConfirm()
                }
            },
            onRowDblClick(row) {//双击
                // console.log("onRowDblClick")
                if (this.limit == 1) {
                    this.$refs.table.clearSelection()
                    this.$refs.table.toggleRowSelection(row)
                    setTimeout(() => {
                        this.onConfirm()
                    }, 300);
                } else if (this.limit == 0 || this.$refs.table.selection.length < this.limit) {
                    this.$refs.table.toggleRowSelection(row)
                }
            },
            onAllSelect(selection) {//选择数量控制
                if (this.limit != 0 && selection.length >= this.limit) {
                    this.$refs.table.toggleAllSelection()
                }
            },
            checkPageSelected() {//默认选择赋值,分页的
                if (this._defSelection) {//分页有存储
                    let selection = this._defSelection
                    this._defSelection = null;
                    this.$refs.table.store.states.selection = selection
                    let data = this.listData
                    if (!data || data.length == 0 || selection.length == 0) {
                        return
                    }
                    for (let item of data) {
                        let index = selection.findIndex(it => it.id == item.id)
                        if (index >= 0) {
                            selection.splice(index, 1, item)
                        }
                    }
                }
            },
            checkDataSelected(data) {//默认选择赋值
                let selection = this.tableState.selection
                if (this._defSelection) {
                    if (selection.length == 0 || this.limit == 1) {
                        selection = this._defSelection
                        this.tableState.selection = selection
                    } else {
                        this._defSelection.forEach(item => {
                            if (!selection.find(it => it.id == item.id)) {
                                selection.push(item)
                            }
                        })
                    }
                    this._defSelection = null;
                }
                if (!data || data.length == 0 || selection.length == 0) {
                    return
                }
                for (let item of data) {
                    let index = selection.findIndex(it => it.id == item.id)
                    if (index >= 0) {
                        selection.splice(index, 1, item)
                    }
                }
            },
            onRowSelect(selection, row) {//可选数量控制
                // console.log("onRowSelect", selection, row)
                if (this.limit != 0 && selection.length > this.limit) {
                    let other = selection.find(it => it != row)
                    other && this.$refs.table.toggleRowSelection(other, false)
                }
            },
            onDialogClosed() {//重置检查
                if (this.hasChange && this.lastSelection.length) {
                    this._defSelection = this.deepClone(this.lastSelection)
                    if (this.tableState) {
                        this.checkDataSelected(this.listData)
                    } else {
                        this.checkPageSelected()
                    }
                    this.hasChange = false
                }
            },
        },
        watch: {
            value: {
                handler(val) {
                    if (this._updateValue) {
                        this._updateValue = false
                        return
                    }
                    if (this._defSelection) {
                        this._defSelection = null
                    }
                    if (!val) {
                        this.inputTxt = ''
                        if (this.$refs.table && this.$refs.table.selection.length) {
                            this.$refs.table.clearSelection()
                        }
                        this.lastSelection = []
                        this.hasChange = false
                    } else {
                        if (this.$refs.table && this.$refs.table.selection.length) {
                            let selection = this.$refs.table.selection
                            let result = ''
                            for (let item of selection) {
                                if (result != '') {
                                    result += ','
                                }
                                result += item.id
                            }
                            if (selection.length == 1 && typeof val === 'number') {
                                result = parseInt(result)
                            }
                            if (val == result) {
                                return
                            }
                        }
                        this.lastSelection = []
                        this.hasChange = false
                        let ids = val
                        if (typeof val === 'number') {
                            this._selectForNumber = true
                        } else if (Array.isArray(val)) {
                            ids = val.join(",")
                        }
                        this.getDefaultSelectList(ids)
                    }
                },
                immediate: true
            }
        }
    }
}