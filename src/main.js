import Vue from 'vue'
import App from './App.vue'
import { Container, Button, Header, Main, Form, FormItem, Input, Alert } from 'element-ui';
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

new Vue({
  render: h => h(App),
}).$mount('#app')
