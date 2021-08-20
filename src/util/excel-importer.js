export default function (file, columns, dicMap) {
    return new Promise((resolve, reject) => {
        if (!window.XLSX) {
            reject('no  window.XLSX')
            return
        }
        const reader = new FileReader()
        let empty = 0
        const getHeaderRow = sheet => {
            const headers = []
            const range = window.XLSX.utils.decode_range(sheet['!ref'])
            let C
            const R = range.s.r
            for (C = range.s.c; C <= range.e.c; ++C) {
                let cell = sheet[window.XLSX.utils.encode_cell({ c: C, r: R })]
                let hdr
                if (cell && cell.t) {
                    hdr = window.XLSX.utils.format_cell(cell)
                } else {
                    hdr = '__EMPTY' + (empty == 0 ? '' : ('_' + empty))
                    empty++
                }
                headers.push(hdr)
            }
            return headers
        }
        reader.onload = e => {
            let data = new Uint8Array(e.target.result);
            let workbook = window.XLSX.read(data, { type: 'array' })
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            let headers = getHeaderRow(worksheet)
            let results = window.XLSX.utils.sheet_to_json(worksheet)
            if (!columns) {
                resolve({ headers, results, empty })
            } else {
                let labels = headers
                if (headers.length && empty > 0) {//第一行可能是标题
                    let remove = results.splice(0, 1)
                    labels = Object.values(remove[0])
                }
                const dataArr = []
                const props = {}
                const selectMap = {}
                const defProps = { label: 'label', value: 'value' }
                let missing = 0
                for (let i = 0; i < labels.length; i++) {
                    let label = labels[i]
                    let column = columns.find(it => it.label == label)
                    // console.log("find column", label, column)
                    if (column) {
                        props[headers[i]] = column.prop || headers[i]
                        if (dicMap && dicMap[column.prop]) {
                            selectMap[headers[i]] = { data: dicMap[column.prop], props: column.props || defProps }
                        } else if (column.dicData && column.dicData.length) {
                            selectMap[headers[i]] = { data: column.dicData, props: column.props || defProps }
                        }
                    } else {
                        props[headers[i]] = headers[i]
                        missing++
                    }
                }
                for (let i = 0; i < results.length; i++) {
                    let res = results[i]
                    let row = {}
                    for (let key in res) {
                        let val = res[key]
                        let select = selectMap[key]
                        if (select) {
                            let dicData = select.data
                            for (let dic of dicData) {
                                if (dic[select.props.label] == val) {
                                    val = dic[select.props.value] || val
                                    break
                                }
                            }
                        }
                        row[props[key]] = val
                    }
                    for (let column of columns) {
                        if (column.valueExp && column.valueExp.type == 1) {
                            if (!row[column.prop]) {
                                row[column.prop] = '【预】'
                            }
                        }
                    }
                    dataArr.push(row)
                }
                resolve({ data: dataArr, missing: missing })
            }
        }
        reader.onerror = err => reject(err)
        reader.readAsArrayBuffer(file)
    })
}