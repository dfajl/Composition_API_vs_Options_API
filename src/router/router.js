import Vue from 'vue';
import Router from 'vue-router'; // это импорт модуля Router из папки node_modules

Vue.use(Router); // буквально говорю, чтобы Vue юзал роутер

let router = new Router({
    routes: [
        /*  {
            path: '/',
            name: 'contacts',
            component: vContactList, //говорю, что по корневому пути будет лежать компонент vContactList
        }, */
    ],
});

export default router;
