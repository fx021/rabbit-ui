import i18n from "@/lang"; // Internationalization

export function generateId() {
    return Number(Math.random().toString().substr(3, 4) + Date.now()).toString(36)
}
export function formatFileSize(size, showB) {
    let num = size * 1
    let multi = 0
    while (num >= 1024) {
        num /= 1024
        multi++
        if (multi == 3) break
    }
    if (multi == 0 && !showB) {
        return num + ''
    }
    if (parseInt(num) != num) {
        num = num.toFixed(2)
    }
    return num + ['b', 'K', 'M', 'G'][multi]
}

export function parseFileSize(paramVal, def) {
    if (paramVal == '' || paramVal == undefined) {
        return def
    } else {
        let fileSize = paramVal + ''
        if (/^[1-9]\d*kb?$/i.test(fileSize)) {
            return parseInt(fileSize) * 1024
        } else if (/^[1-9]\d*mb?$/i.test(fileSize)) {
            return parseInt(fileSize) * 1024 * 1024
        } else if (/^[1-9]\d*gb?$/i.test(fileSize)) {
            return parseInt(fileSize) * 1024 * 1024 * 1024
        } else if (/^[1-9]\d*b?$/i.test(fileSize)) {
            return parseInt(fileSize)
        }
    }
    return false
}

export function safeParseInt(val, def) {
    let num = parseInt(val)
    if (isNaN(num)) {
        return def
    }
    return num
}
export function safeString(str, def) {
    if (str) {
        if (typeof str != 'string') {
            return str
        }
        let res = str.trim()
        if (!res) {
            return def
        }
        if ('null' === res) {
            return null
        }
        return res
    }
    return def
}
export function sysArgs() {
    return [{ value: 'LOGIN_USER', label: i18n.t('loginUser') }, { value: 'LOGIN_NAME', label: i18n.t('loginName') }, { value: 'LOGIN_DEPT', label: i18n.t('loginDept') }, { value: 'LOGIN_ROLE', label: i18n.t('loginRole') }, { value: 'LOGIN_POST', label: i18n.t('loginPost') }, { value: 'LOGIN_ACCOUNT', label: i18n.t('loginAccount') }, { value: 'CURRENT_DATETIME', label: i18n.t('currentDateTime') }, { value: 'CURRENT_TIMESTAMPE', label: i18n.t('currentTimeStampe') }]
}

export function filterSystemArgs(paramList) {
    if (!paramList || !paramList.length) {
        return []
    }
    let args = sysArgs()
    return paramList.filter(it => {
        let str = it.value.toUpperCase()
        return !args.find(item => item.value === str)
    })
}

export function parseSQLParams(source, filter) {
    const regex = /#\{(.+?)\}/
    let result = regex.exec(source)
    let params = []
    const nullPat = /^null$/i
    while (result && result.length == 2) {
        let arg = result[1].trim()
        let dot = arg.indexOf(",")
        if (dot > 0 && dot < arg.length - 1) {
            let label = arg.substring(dot + 1)
            let ldot = label.indexOf(",")
            let def = ldot > 0 && ldot < label.length - 1 ? label.substring(ldot + 1).trim() : undefined
            if (def && nullPat.test(def)) {
                def = null
            }
            params.push({
                label: ldot > 0 ? label.substring(0, ldot).trim() : label.trim(),
                value: arg.substring(0, dot).trim(),
                defVal: def
            })
        } else {
            params.push({
                label: arg,
                value: arg
            })
        }
        let next = result.index + result[0].length
        if (next >= source.length) {
            break
        }
        source = source.substr(next)
        result = regex.exec(source)
    }
    if (filter) {
        return filterSystemArgs(params)
    }
    return params
}

export function parseStringArray(val) {
    if (!val) {
        return
    }
    if (typeof val === 'number') {
        return [val + '']
    } else if (typeof val !== 'string') {
        return val
    }
    let array = val.split(",")
    let result = []
    for (let i = 0; i < array.length; i++) {
        let item = safeString(array[i])
        if (item) {
            result.push(item)
        }
    }
    return result
}

export function applyListData(list, option) {
    if (list.length) {
        let rowKey = option.rowKey
        let columns = option.column || []
        if (!rowKey) {//一般不会走这里,保险起见
            let hide = null
            let show = null
            for (let col of columns) {
                if (col.required) {
                    rowKey = col.prop
                    break
                }
                if (col.hide) {
                    hide = hide || col.prop
                } else {
                    show = col.prop
                }
            }
            rowKey = rowKey || hide || show || ''
        }
        if (list[0][rowKey]) {
            return list
        }
        for (let item of list) {
            for (let col of columns) {
                if (item[col.prop] !== undefined) {
                    continue
                }
                let last = col.prop.lastIndexOf("#")
                if (last <= 0) {
                    continue
                }
                let key = col.prop.substring(last + 1)
                if (item[key] !== undefined) {
                    item[col.prop] = item[key]
                    delete item[key]
                }
            }
        }
    }
    return list
}

export function getListTypeAccept(paramVal) {
    if (paramVal == 'picture-img') {
        return [paramVal, 'image/png,image/jpeg']
    } else if (paramVal == 'picture' || paramVal == 'picture-card') {
        return [paramVal, 'image/*']
    } else if (paramVal == 'pdf') {
        return ['text', 'application/pdf']
    } else if (paramVal == 'doc') {
        return ['text', '.doc,.docx,.wps']
    } else if (paramVal == 'excel') {
        return ['text', '.xls,xlsx,.et']
    } else if (paramVal == 'ppt') {
        return ['text', '.ppt,.pptx,.dps']
    } else if (paramVal == 'docel') {
        return ['text', '.doc,.docx,.wps,.xls,xlsx,.et']
    } else if (paramVal == 'docext') {
        return ['text', '.doc,.docx,.wps,.xls,xlsx,.et,application/pdf']
    } else if (paramVal == 'office') {
        return ['text', '.doc,.docx,.wps,.xls,xlsx,.et,.ppt,.pptx,.dps,application/pdf']
    } else if (paramVal == 'zip') {
        return ['text', '.zip,.tar,.7z,.tgz,.tar.gz,.rar']
    }
    return [paramVal, '*']
}

export function parseExpression(expression, colList) {
    let itemPat = /\{[A-Z_]+}/
    let pattern = /[+\-*/()%\s]+/
    let input = expression
    let result = null
    let array = []
    const checkCol = (item) => {
        if (itemPat.test(item)) {
            let colName = item.substring(1, item.length - 1)
            let col = colList.find(it => it.colName == colName)
            if (col) {
                array.push({ label: colName, value: col.tableName ? `n#${col.tableName}#${colName}` : colName })
            } else {
                array.push({ label: colName, value: colName })
            }
        } else {
            array.push({ label: item })
        }
    }
    while ((result = pattern.exec(input))) {
        let text = result[0]
        let item = input.substring(0, result.index)
        checkCol(item)
        array.push({ label: text })
        input = input.substring(result.index + text.length)
    }
    input && checkCol(input)
    return array
}

export function formatSearchValue(mode, val) {
    if (mode == 7) {//不等于
        return `!!${val}`
    } else if (mode == 6) {//小于等于
        return `!1${val}`
    } else if (mode == 5) {//小于
        return `!2${val}`
    } else if (mode == 4) {//大于等于
        return `!3${val}`
    } else if (mode == 3) {//大于
        return `!4${val}`
    } else if (mode == 1) {//左匹配
        return `${val}%`
    } else if (mode == 0) {
        return `%${val}%`
    }
    return val
}


export function bindUserList(userList, actionData, bind, checkLabel) {
    actionData = actionData || []
    let showArray = []
    for (let i = 0; i < actionData.length; i++) {
        showArray.push('')
    }
    let form
    if (bind.getFormData) {
        form = bind.getFormData()
    } else if (bind.row) {
        form = bind.row
    } else {
        return
    }
    for (let item of userList) {
        for (let i = 0; i < actionData.length; i++) {
            let showItem = actionData[i]
            let value = item[showItem.value]
            if (value) {
                let show = showArray[i]
                if (show) {
                    show += ','
                }
                showArray[i] = show + value
            }
        }
    }
    for (let i = 0; i < actionData.length; i++) {
        let key = actionData[i].label
        if (!checkLabel || key.startsWith("{")) {
            bind.$set(form, key, showArray[i])
        }
    }
}