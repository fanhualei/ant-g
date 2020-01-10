

function ifNumberField(fieldName,fields) {
    for(let i=0; i< fields.length ;i=i+1){
        const {camelColumnName,dataType,jsType} = fields[i]
        if(camelColumnName===fieldName && jsType==="number"){
            return true;
        }
    }
    return false;
}

function _getField(fieldName,fields) {
    for(let i=0; i< fields.length ;i=i+1){
        const {camelColumnName} = fields[i]
        if(camelColumnName===fieldName){
            return fields[i];
        }
    }
    return undefined;
}

/**
 * 判断是否要import moment
 * @param fieldNames
 * @param fields
 * @returns {string}
 */
function ejsGetMomentImport(fieldNames,fields) {
    for(let i=0; i< fieldNames.length ;i=i+1){
        const field = _getField(fieldNames[i],fields)
        const {dataType} = field
        if(dataType==="date" || dataType==="datetime"){
            return `import moment from 'moment';`;
        }
    }
    return '';
}


/**
 * 根据字段类型，返回这个字段在表格中显示的格式
 * @param fieldName
 * @param fields
 */
function ejsGetGridRender(fieldName,fields) {
    const field = _getField(fieldName,fields);
    if(!field){
        return '';
    }
    const {camelColumnName,dataType,jsType} = field
    if(jsType==="number"){
        return `align: 'right',`;
    }
    if(dataType==="date"){
        return `render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,`;
    }
    if(dataType==="datetime"){
        return `render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,`;
    }
    return '';
}

/**
 * 得到查询框组件，要导入的ant 组件。
 * @param fieldName
 * @param fields
 */
function ejsGetSearchAntImport(fieldNames,fields){
    console.log(fieldNames)
    let hashMap={};
    for(let i=0; i< fieldNames.length ;i=i+1){
        const field = _getField(fieldNames[i],fields)
        const {dataType,jsType} = field
        if(dataType==="date" || dataType==="datetime"){
            hashMap['DatePicker']=1;
        }
        if(jsType==="number"){
            hashMap['InputNumber']=1;
        }
    }

    const keys= Object.keys(hashMap);
    console.log(keys)
    return keys.join(',');
}

/**
 * 表格查询条件的显示
 * @param fieldName
 * @param fields
 * @returns {string}
 */
function ejsGetSearchFormItem(fieldName,fields) {
    const field = _getField(fieldName,fields);
    if(!field){
        return `<Input placeholder="请输入" allowClear />)`;
    }
    const {camelColumnName,dataType,jsType} = field
    if(jsType==="number"){
        return `<InputNumber style={{ width: '100%' }} allowClear />`;
    }
    if(dataType==="date"){
        return `<DatePicker style={{ width: '100%' }} placeholder="请输入" allowClear />`;
    }
    if(dataType==="datetime"){
        return `<DatePicker style={{ width: '100%' }} placeholder="请输入" allowClear />`;
    }
    return '<Input placeholder="请输入" allowClear />';
}


module.exports = ejs ={
    ifNumberField,
    ejsGetGridRender,
    ejsGetMomentImport,
    ejsGetSearchAntImport,
    ejsGetSearchFormItem
}
