import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  query<%=camelTableNameUF%>,
  deleteMany<%=camelTableNameUF%>,
  deleteOne<%=camelTableNameUF%>,
  update<%=camelTableNameUF%>,
} from '@/services/<%=camelTableName%>Service';

import { <%=camelTableNameUF%>Item, Pagination } from '@/services/<%=camelTableName%>.d';

export interface <%=camelTableNameUF%>ListStateType {
  list: <%=camelTableNameUF%>Item[];
  pagination?: Partial<Pagination>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: <%=camelTableNameUF%>ListStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: <%=camelTableNameUF%>ListStateType;
  effects: {
    fetch: Effect;
    deleteOne: Effect;
    deleteMany: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<<%=camelTableNameUF%>ListStateType>;
  };
}

const ListModel: ModelType = {
  namespace: '<%=camelTableNameUF%>List',
  state: {
    list: [],
    pagination: {},
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(query<%=camelTableNameUF%>, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    * deleteMany({ payload, callback }, { call, put }) {
      const response = yield call(deleteMany<%=camelTableNameUF%>, payload);
      if (callback) callback(response);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    * deleteOne({ payload, callback }, { call, put }) {
      const response = yield call(deleteOne<%=camelTableNameUF%>, payload);
      if (callback) callback(response);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    * update({ payload, callback }, { call, put }) {
      const response = yield call(update<%=camelTableNameUF%>, payload);
      if (response.status && response.status !== 200) {
        if (callback) callback(0, { ...response });
        return;
      }
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default ListModel;
