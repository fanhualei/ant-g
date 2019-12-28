export interface <%=camelTableNameUF%>Item {
    <% for(let i=0;i<fields.length;i++){ %><%=fields[i].camelColumnName%><%=fields[i].isNullable?'?':''%>: <%=fields[i].jsType%>;<% if (fields[i].columnComment) { %> // <%=fields[i].columnComment%><% } %>
    <%_}%>
}

export interface Pagination {
    total: number;
    pageSize: number;
    current: number;
}

export interface <%=camelTableNameUF%>ListParams {
    // 这些跟业务有关系
    <% for(let i=0;i<fields.length;i++){ %><%=fields[i].camelColumnName%>: <%=fields[i].jsType%>;
<% } %>
    // 下面三个不用改，今后通用
    sorter: string;
    pageSize: number;
    currentPage: number;
}
