import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Action, Dispatch } from 'redux';
import { connect } from 'dva';
import { Card } from 'antd';
import { ActivityListStateType } from './model';
import { PageHelp } from '@/components/Wk';
import DataTable from './dataTable';
import styles from './style.less';
import EditActivity from './edit'
import { ActivityItem, ActivityListParams } from '@/services/<%=camelTableName%>.d';
import { defaultActivityItem } from '@/services/<%=camelTableName%>Service';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchForm from './searchForm';

interface PageProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | '<%=camelTableNameUF%>List/fetch'
      | '<%=camelTableNameUF%>List/deleteOne'
      | '<%=camelTableNameUF%>List/deleteMany'
      | '<%=camelTableNameUF%>List/update'
      >
    >;
  loading: boolean;
  <%=camelTableNameUF%>List: <%=camelTableNameUF%>ListStateType;
}

interface PageState {
  formValues?: { [key: string]: string };
  modalVisible: boolean;
  currentItem: <%=camelTableNameUF%>Item;
}

const default<%=camelTableNameUF%>: <%=camelTableNameUF%>Item = {
  ...default<%=camelTableNameUF%>Item,
}

@connect(
  ({
     <%=camelTableNameUF%>List,
     loading,
   }: {
    <%=camelTableNameUF%>List: <%=camelTableNameUF%>ListStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    <%=camelTableNameUF%>List,
    loading: loading.models.<%=camelTableNameUF%>List,
  }),
)


class <%=camelTableNameUF%>ListPage extends Component <PageProps, PageState> {
  state: PageState = {
    modalVisible: false,
    currentItem: {
      ...default<%=camelTableNameUF%>,
    },
  }

  // 两个变量，保存from与table的查询参数
  refreshParam ={
    pageFromParams: {},
    pageTableParams: {},
  }

  /**
   * 第一次加载
   */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: '<%=camelTableNameUF%>List/fetch',
    });
  }

  /**
   * 刷新列表框
   */
  refreshData=() => {
    const { dispatch } = this.props;
    const { pageFromParams, pageTableParams } = this.refreshParam;
    const params: Partial<<%=camelTableNameUF%>ListParams> = {
      ...pageFromParams,
      ...pageTableParams,
    }
    dispatch({
      type: '<%=camelTableNameUF%>List/fetch',
      payload: params,
    });
  }

  /**
   * 回调函数-Table-刷新数据
   * @param params
   */
  handleTableRefresh=(params:Partial<<%=camelTableNameUF%>ListParams>) => {
    this.refreshParam.pageTableParams = params;
    this.refreshData();
  }

  /**
   * 获得检索条件
   * @param values
   */
  handleFormSearch = (values:{}) => {
    this.refreshParam.pageFromParams = values;
    this.refreshData();
  };

  /**
   * 回调函数-Table-删除一条记录
   * @param id
   */
  handleTableDelOne=(<%=primaryKey%>:number) => {
    const { dispatch } = this.props;
    dispatch({
      type: '<%=camelTableNameUF%>List/deleteOne',
      payload: { <%=primaryKey%> },
      callback: this.callbackChangeDb,
    });
  }

  /**
   * 回调函数-Table-删除多条记录
   * @param ids
   */
  handleTableDelMany=(<%=primaryKey%>s:string) => {
    const { dispatch } = this.props;
    dispatch({
      type: '<%=camelTableNameUF%>List/deleteMany',
      payload: { <%=primaryKey%>s },
      callback: this.callbackChangeDb,
    });
  }

  /**
   * 刷线数据
   * @param resultNum
   * @param message
   */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callbackChangeDb=(resultNum:number, errorMessage?:{}) => {
    if (resultNum && resultNum > 0) {
      this.refreshData();
    }
  }

  /**
   * 回调函数-Table-跳转到编辑框
   * @param id
   */
  handleTableGoEditPage=(id:number) => {
    let itemToSave:<%=camelTableNameUF%>Item;
    if (id > 0) {
      const { <%=camelTableNameUF%>List } = this.props
      const { list } = <%=camelTableNameUF%>List;
      // eslint-disable-next-line prefer-destructuring
      itemToSave = list.filter(item => item.<%=primaryKey%> === id)[0];
    } else {
      itemToSave = { ...default<%=camelTableNameUF%> };
    }

    this.setState({
      modalVisible: true,
      currentItem: { ...itemToSave },
    })
  }

  handleFromEdit=(clickClose:boolean, values?:Partial<<%=camelTableNameUF%>Item>, callbackFromEdit?:any) => {
    // 点击关闭按钮
    if (clickClose || clickClose === undefined) {
      this.setState({
        modalVisible: false,
      })
      return;
    }
    const newValues = {
      ...values,
    }
    const { dispatch } = this.props;
    // 保存信息
    dispatch({
      type: '<%=camelTableNameUF%>List/update',
      payload: newValues,
      callback: (resultNum:number, errorMessage?:{}) => {
        if (resultNum > 0) {
          this.setState({
            modalVisible: false,
          })
          this.refreshData();
        }
        if (callbackFromEdit) {
          callbackFromEdit(resultNum, errorMessage)
        }
      },
    });
  }


  render() {
    const { <%=camelTableNameUF%>List } = this.props
    const { modalVisible, currentItem } = this.state
    const <%=camelTableName%>List = <%=camelTableNameUF%>List.list
    // console.log(<%=camelTableName%>List)
    return (
      <PageHeaderWrapper>
        <Edit<%=camelTableNameUF%> modalVisible={modalVisible}
                      currentItem={currentItem}
                      handleFromEdit={this.handleFromEdit}
        />

        <PageHelp>系统初始化的类型不能删除<br/>帮助类型排序显示规则为排序小的在前，新增的在前</PageHelp>

        <div className={styles.tableList}>
          <Card bordered={false}>
            <SearchForm handleFormSearch={this.handleFormSearch}/>
            <DataTable <%=camelTableName%>List={<%=camelTableName%>List}
                       loading={false}
                       handleTableRefresh={this.handleTableRefresh}
                       handleTableDelOne={this.handleTableDelOne}
                       handleTableDelMany={this.handleTableDelMany}
                       handleTableGoEditPage={this.handleTableGoEditPage}
                       pagination={<%=camelTableNameUF%>List.pagination}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    )
  }
}
export default <%=camelTableNameUF%>ListPage;
