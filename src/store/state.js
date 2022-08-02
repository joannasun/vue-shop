import {getLocalItem} from '../util/util';
const state = {
  //后台管理
  adminName:getLocalItem('adminName')?getLocalItem('adminName'):'',

  //客户商城
  clientName:getLocalItem('clientName')?getLocalItem('clientName'):'',

}

export default state;