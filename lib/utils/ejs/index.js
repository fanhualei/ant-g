

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
function ejsGetGridColumn(fieldName,fields) {
    const field = _getField(fieldName,fields);
    const {title} = field.item;
    const render = _getGridColumnRender(fieldName,field)
    return `
        title: '${title}',
        dataIndex: '${fieldName}',
        ${render}
    `;

}

function _getGridColumnRender(fieldName,field) {
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
function ejsGetAntImport(fieldNames,fields){
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
    const {title} = field.item;
    const detail = _getSearchFormItemDetail(fieldName,field)
    return `
       <FormItem label="${title}">
        {getFieldDecorator('${fieldName}')
          (${detail})
        }
       </FormItem>
    `;
}

function _getSearchFormItemDetail(fieldName,field) {
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
    return '<Input placeholder="请输入" allowClear/>';
}


/**
 * 编辑框的formItem输出
 * @param fieldName
 * @param fields
 * @returns {string}
 */
function ejsGetEditFormItem(fieldName,fields) {
    const field = _getField(fieldName, fields);
    const detail = _getEditFormItemDetail(fieldName,field);
    //显示一些长的备注信息
    let extra='';
    if(field.columnComment && field.columnComment.length>8){
        extra=`extra="${field.columnComment}"`;
    }
    return `
            <FormItem {...this.formLayout} key="${fieldName}"  label="${fieldName}" ${extra}>
                ${detail}
            </FormItem>
           `;
}


function _getEditFormItemDetail(fieldName,field) {
    if(!field){
        return `
                {form.getFieldDecorator('${fieldName}', {
                    initialValue: currentItem.${fieldName},
                })(<Input placeholder="请输入" />)}
           `;
    }
    const {camelColumnName,dataType,jsType} = field
    const rulesStr = _getFormRules(fieldName,field);
    if(jsType==="number"){
        return `{form.getFieldDecorator('${fieldName}', {
                initialValue: currentItem.${fieldName},
                ${rulesStr}
            })(<InputNumber style={{ width: '35%' }} />)}
           `;
    }
    if(dataType==="date"){
        return `{form.getFieldDecorator('${fieldName}', {
                initialValue: currentItem.${fieldName} ? moment(currentItem.${fieldName}) : null,
                ${rulesStr}
            })(<DatePicker style={{ width: '50%' }} placeholder="请输入" format="YYYY-MM-DD" />)}
           `;
    }
    if(dataType==="datetime"){
            return `{form.getFieldDecorator('${fieldName}', {
                initialValue: currentItem.${fieldName} ? moment(currentItem.${fieldName}) : null,
                ${rulesStr}
            })(<DatePicker style={{ width: '50%' }} placeholder="请输入" format="YYYY-MM-DD HH:mm:ss" showTime />)}
           `;
    }
    //得到文本框的最大长度
    let maxLength = '';
    if(field.characterMaxLength){
        maxLength = ` maxLength={${field.characterMaxLength}} `;
    }

    return `{form.getFieldDecorator('${fieldName}', {
                initialValue: currentItem.${fieldName},
                ${rulesStr}
            })(<Input placeholder="请输入" ${maxLength}/>)}
           `;
}

/**
 * 根据字段信息，给出from中的校验规则
 * @param fieldName
 * @param field
 * @returns {string}
 * @private
 */
function _getFormRules(fieldName,field){
    let ren=``;
    let rules =[];
    const {isNullable} = field;
    if(!isNullable){
        let requireRule={
            required: true,
            message: `请输入 ${fieldName}!`
        };
        rules.push(requireRule)
    }
    if(field.jsType==='string' && field.characterMaxLength){
        let maxRule={
            max: field.characterMaxLength,
            message: `${fieldName}最大长度为${field.characterMaxLength}!`
        };
        rules.push(maxRule)
    }

    if(rules.length>0){
        const rulesStr =JSON.stringify(rules);
        ren = ` rules: ${rulesStr} ,`;
    }
    return ren;
}



module.exports = ejs ={
    ifNumberField,
    ejsGetGridColumn,
    ejsGetMomentImport,
    ejsGetAntImport,
    ejsGetSearchFormItem,
    ejsGetEditFormItem
};
