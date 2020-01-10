import React, { Component } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,<%-ejsGetSearchAntImport(listPage.searchFields,fields)%>
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import styles from '@/utils/Wk/searchForm.less';

const FormItem = Form.Item;


interface handleFormSearchType{
  (values:{}):void
}

export interface PageProps extends FormComponentProps{
  handleFormSearch:handleFormSearchType;
}


class SearchForm extends Component<PageProps> {
  /**
   * 重置查询条件，并重新查询
   */
  handleFormReset = () => {
    const { form, handleFormSearch } = this.props;
    form.resetFields();
    handleFormSearch({})
  };

  /**
   * 点击查询按钮
   * @param e
   */
  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, handleFormSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      handleFormSearch(values)
    });
  };


  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline">
          <% for(let j=0;j<=listPage.searchFields.length;j++){ %>
            <%if(j%3===0){%> <Row gutter={{ md: 8, lg: 24, xl: 48 }}> <%}%>
              <%if(j<listPage.searchFields.length){%>
                <Col md={8} sm={24}>
                  <FormItem label="<%=listPage.searchFields[j]%>">
                    {getFieldDecorator('<%=listPage.searchFields[j]%>')
                      (<%-ejsGetSearchFormItem(listPage.searchFields[j],fields)%>)
                    }
                  </FormItem>
                </Col>
              <%}else{%>
                <Col md={8} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                      重置
                    </Button>
                  </span>
                </Col>
              <%}%>
            <%if(j%3===2 || j===listPage.searchFields.length ){%> </Row> <%}%>
          <%}%>
        </Form>
      </div>
    )
  }
}

export default Form.create<PageProps>()(SearchForm);
