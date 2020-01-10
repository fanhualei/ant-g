

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


module.exports = ejs ={
    ifNumberField,
    ejsGetGridRender,
    ejsGetMomentImport,
}
