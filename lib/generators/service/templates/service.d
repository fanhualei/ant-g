import request from '@/utils/request';
import { <%=camelTableNameUF%>ListParams, <%=camelTableNameUF%>Item } from '<%=camelTableName%>.d';


export const default<%=camelTableNameUF%>Item:<%=camelTableNameUF%>Item = {
    <% for(let i=0;i<fields.length;i++){ %><%=fields[i].camelColumnName%>: <%-fields[i].defaultValue%>, // <%=fields[i].columnComment%>
    <% } %>
}

export async function query<%=camelTableNameUF%>ById(<%=pri%>: number) {
  return request(`<%=apiBasePath%>query<%=camelTableNameUF%>ById?<%=pri%>=${<%=pri%>}`);
}


export async function query<%=camelTableNameUF%>(params: <%=camelTableNameUF%>ListParams) {
  return request('<%=apiBasePath%>query<%=camelTableNameUF%>', {
    params,
  });
}


export async function deleteOne<%=camelTableNameUF%>(params: {<%=pri%>:number}) {
  return request('<%=apiBasePath%>deleteOne<%=camelTableNameUF%>', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deleteMany<%=camelTableNameUF%>(params: {<%=pri%>s:string}) {
  return request('<%=apiBasePath%>deleteMany<%=camelTableNameUF%>', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}


export async function update<%=camelTableNameUF%>(params: Partial<<%=camelTableNameUF%>Item>) {
  return request('<%=apiBasePath%>update<%=camelTableNameUF%>', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
