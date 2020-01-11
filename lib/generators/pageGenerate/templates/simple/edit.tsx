import {
  Form,
  Input,
  Modal,
  Alert,<%-ejsGetAntImport(editPage.editFields,fields)%>
} from 'antd';
<%-ejsGetMomentImport(editPage.editFields,fields)%>
import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';
import { <%=camelTableNameUF%>Item } from '@/services/<%=camelTableName%>.d';

const FormItem = Form.Item;

interface Edit<%=camelTableNameUF%>Props extends FormComponentProps {
  modalVisible: boolean;
  currentItem: <%=camelTableNameUF%>Item;
  handleFromEdit: (clickClose:boolean, values?:{}, callback?:any) => void;
}
interface PageState {
  isError:boolean;
}

class Edit<%=camelTableNameUF%> extends Component<Edit<%=camelTableNameUF%>Props, PageState> {
  constructor(props: Readonly<Edit<%=camelTableNameUF%>Props>) {
    super(props);
    this.state = {
      isError: false,
    }
  }

  /**
   * 保存后的回调函数
   * @param resultNum
   * @param errorMessage
   */
  callbackFromEdit = (resultNum: number, errorMessage?: {}) => {
    if (resultNum <= 0) {
      console.log(errorMessage)
      this.setState({
        isError: true,
      })
    } else {
      this.setState({
        isError: false,
      })
    }
  }

  /**
   * 点击确定按钮
   */
  okHandle = () => {
    const { form, handleFromEdit, currentItem } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleFromEdit(false, { ...currentItem, ...fieldsValue }, this.callbackFromEdit);
    });
  };

  /**
   * 根据id得到页面的title,新增或者编辑
   */
  getTitle = (id:number): string => {
    let title: string = '编辑<%=camelTableNameUF%>';
    if (!id && id === 0) {
      title = '新增<%=camelTableNameUF%>';
    }
    return title;
  }

  handleClose=() => {
    const { handleFromEdit } = this.props;
    handleFromEdit(true);
    this.setState({
      isError: false,
    })
  }

  /**
   * 显示错误信息
   */
  showError() {
    const { isError } = this.state
    if (isError) {
      return (
        <Alert message="保存错误，请联系管理员" type="error" style={{ marginBottom: 16 }} closable/>
      )
    }
    return ''
  }

  render() {
    const { form, modalVisible, currentItem } = this.props;
    return (
      <Modal
        title={this.getTitle(currentItem.<%=primaryKey%>)}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={this.handleClose}
        destroyOnClose
      >
        {this.showError()}
        <% for(let j=0;j<editPage.editFields.length;j++){ %>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="<%=editPage.editFields[j]%>">
            <%-ejsGetEditFormItem(editPage.editFields[j],fields)%>
          </FormItem>
        <%}%>
      </Modal>
    );
  }
}

export default Form.create<Edit<%=camelTableNameUF%>Props>()(Edit<%=camelTableNameUF%>);
