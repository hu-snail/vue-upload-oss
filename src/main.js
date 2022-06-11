import Vue from 'vue'
import App from './App.vue'
import { Container, Button, Header, Main, Form, FormItem, Input, Alert, Upload, Progress, Dialog, MessageBox, Message, Notification } from 'element-ui';
import './styles/index.css'

Vue.config.productionTip = false

Vue.component(Button.name, Button);
Vue.component(Header.name, Header);
Vue.component(Main.name, Main);
Vue.component(Container.name, Container);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Alert.name, Alert);
Vue.component(Upload.name, Upload);
Vue.component(Progress.name, Progress);
Vue.component(Dialog.name, Dialog);

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;

new Vue({
  render: h => h(App),
}).$mount('#app')


