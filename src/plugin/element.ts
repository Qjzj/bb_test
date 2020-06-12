import Vue from 'vue'
import {
  Button,
  Select,
  DatePicker,
  Input,
  Form,
  FormItem,
  Message,
} from 'element-ui'

Vue.component('ElButton', Button);
Vue.component('ElSelect', Select);
Vue.component('ElDatePicker', DatePicker);
Vue.component('ElInput', Input);
Vue.component('ElForm', Form);
Vue.component('ElFormItem', FormItem);

Vue.prototype.$message = Message;
