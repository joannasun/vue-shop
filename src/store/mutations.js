import * as types from './mutation-types';
import {setLocalItem} from '../util/util';

const mutations = {
	//管理员
	[types.ADMIN_LOGOUT]: (state) => {
	    state.adminName = '';
	    localStorage.removeItem('adminToken','adminName');
	},
	[types.SET_ADMIN_NAME]:(state, name) => {
  		state.adminName = name;
  		setLocalItem('adminName',name);
  	},
	
	//客户
  [types.SET_CLIENT_NAME]:(state, name) => {
  		state.clientName = name;
  		setLocalItem('clientName',name);
  	},
	[types.CLIENT_LOGOUT]: (state) => {
	    state.clientName = '';
	    localStorage.removeItem('clientName');
	},
}

export default mutations;