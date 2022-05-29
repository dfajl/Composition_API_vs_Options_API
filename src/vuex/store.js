import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        // only for Composition APi
        appLoaded: false,

        users: [],
    },
    mutations: {
        SET_USERS_TO_STATE(state, data) {
            state.users = data;

            //Composition API
            state.appLoaded = true;
        },
    },
    actions: {
        FETCH_USERS({ commit }) {
            return axios.get('http://localhost:3000/users').then((result) => {
                commit('SET_USERS_TO_STATE', result.data);
            });
        },
        ADD_NEW_USER({}, user) {
            return fetch('http://localhost:3000/users', user);
        },

        // переписал с аксиоса на фетч, но все равно требуется перезагрузка страницы
        /* FETCH_USERS({ commit }) {
            return fetch('http://localhost:3000/users')
                .then((response) => response.json())
                .then((result) => commit('SET_USERS_TO_STATE', result));
        },
        ADD_NEW_USER({}, user) {
            return fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(user),
            });
        }, */
    },
    getters: {},
});

//export default store;
// так я экспортировал стор во втором вью. для вью 3 будет по-другому. но это я делаю в видео. потому что на момент записи не было ни мапэкшенов и т.д. и т.п.

//Composition API
export function useStore() {
    return store;
}
