import Vue from 'vue';
import App from './App.vue';
import store from './vuex/store.js';
import router from './router/router.js';
import 'material-design-icons-iconfont';
import './assets/styles/style.scss';
import VueCompositionApi from '@vue/composition-api';

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);

new Vue({
    render: (h) => h(App),
    store,
    router,
}).$mount('#app');
