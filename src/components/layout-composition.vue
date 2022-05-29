<template>
    <div class="layout">
        <div class="filters">
            <h2>FILTERS</h2>
            <div class="inputs">
                <div class="input_wrapper">
                    <p>Filter by name</p>
                    <select
                        class="filters__select"
                        v-model="filter.name"
                        @change="applyFilters('name', filter.name)"
                    >
                        <option v-for="option in nameOptions" :key="option">
                            {{ option }}
                        </option>
                    </select>
                </div>
                <div class="input_wrapper">
                    <p>Filter by age</p>
                    <select
                        class="filters__select"
                        v-model="filter.age"
                        @change="applyFilters('age', filter.age)"
                    >
                        <option v-for="option in ageOptions" :key="option">
                            {{ option }}
                        </option>
                    </select>
                </div>
                <div class="input_wrapper">
                    <p>Filter by grade</p>
                    <select
                        class="filters__select"
                        v-model="filter.grade"
                        @change="applyFilters('grade', filter.grade)"
                    >
                        <option v-for="option in gradeOptions" :key="option">
                            {{ option }}
                        </option>
                    </select>
                </div>
                <div class="input_wrapper">
                    <p>Filter by language</p>
                    <select
                        class="filters__select"
                        v-model="filter.language"
                        @change="applyFilters('language', filter.language)"
                    >
                        <option v-for="option in languageOptions" :key="option">
                            {{ option }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="list">
            <h2>DATA LIST</h2>

            <div class="headers">
                <div class="headers__item">Name</div>
                <div class="headers__item">Age</div>
                <div class="headers__item">Job</div>
                <div class="headers__item">Grade</div>
                <div class="headers__item">Language</div>
            </div>
            <v-User
                v-for="user in localState.filteredUsers"
                :key="user.name"
                :user_data="user"
            />
            <div class="add_user">
                <input
                    type="text"
                    v-model="newUser.name"
                    placeholder="User's name"
                />
                <input
                    type="text"
                    v-model="newUser.age"
                    placeholder="User's age"
                />
                <input
                    type="text"
                    v-model="newUser.job"
                    placeholder="User's job"
                />
                <input
                    type="text"
                    v-model="newUser.grade"
                    placeholder="User's grade"
                />
                <input
                    type="text"
                    v-model="newUser.language"
                    placeholder="User's language"
                />
                <button @click="addUser">Add new user</button>
            </div>
        </div>
    </div>
</template>

<script>
import vUser from './v-User';

import { onMounted, reactive, watch, computed } from '@vue/composition-api';
// хуки жизненного цикла, вотчеры, вычисляемые свойства ... по умолчанию не поддерживаются сетапом. поэтому их надо импортить сюда

import { useStore } from '../vuex/store';

export default {
    name: 'layout-composition',
    components: { vUser },

    // данная функция включает в себя два жизненных цикла: created, beforeCreated. более того, это
    // главная функция, которая включает в себя всю логику приложения: хуки, содержит данные и т.д.
    setup() {
        // здесь мы деструктурируем наш стейт из стора. useStore() возвращает Store
        // теперь нам доступен стейт из стора
        // dispatch позволяет вызывать экшены
        const { state, dispatch } = useStore();

        // по аналогии со state. делаю деструкторизацию из функции users(), чтобы можно было использовать данную функцию getUsers в хуке onMounted
        const { getUsers } = users();

        // по умолчанию во вью3 не реактивно ничего. reactive позволяет установить эту реактивность
        // reactive для коллекций, а рефы для одиночных переменных
        // не забываем обращаться в темплейте к нашему filteredUsers через localState.filteredUsers
        // данная коллекция реактивна, т.к. мы рендерим ее в компоненте User
        const localState = reactive({
            filteredUsers: [],
        });

        // создаем функцию, которая будет отвечать только за работу с пользователями
        function users() {
            //создали константу, которую сделали реактивной. это по сути объект с пустыми полями, в который будут прилетать значения из инпутов через директиву v-model
            const newUser = reactive({
                name: '',
                age: '',
                grade: '',
                language: '',
                job: '',
            });

            // обращаемся через dispatch к экшену из вьюэкса
            // обрати внимание, что напрямую нельзя обратиться к апи и вернуть промис(!по крайней мере на момент записи видео. для этого в сторе делаем переменную appLoaded. к ней подвязываем вотчер и следим за ее изменением)
            function getUsers() {
                dispatch('FETCH_USERS');
            }

            function addUser() {
                let user = {
                    id: state.users.length + 1,
                    ...newUser,
                };

                dispatch('ADD_NEW_USER', user); // вызвали ADD_NEW_USER в сторе и передали туда объект user
                getUsers(); // и как и в optional API сделали повторный запрос к уже имеющейся (обновленной) базе данных

                // закостылил сюда принудительный перезапуск страницы. почему-то без обновления страницы не отображается новый добавленный пользовательь. но это стремно выглядит. надо почитать про аксиос. возможно, дело в нем
                setTimeout(() => {
                    location.reload();
                }, 500);
            }

            // каждая функция должна будет что-либо возвращать. все объявленные в ней константы, вложенные функции
            // - newUser возвращаем, потому что будем юзать ее для рендеринга в темплейте. класть в нее значения из инпутов
            // - addUser возвращаем, потому что будем юзать ее в темплейте (вешать на кнопку)
            // - getUsers возвращаем, потому что будем юзать ее в хуке onMounted
            return { newUser, getUsers, addUser };
        }

        // создаем функцию, которая будет отвечать только за работу с фильтрами
        function filters() {
            // создаем константу filter и делаем ее раективной. реактивность нужна, так как я буду обращаться к этому объекту из темплейта, чтобы вызвать метод applyFilters()
            const filter = reactive({
                name: 'ALL',
                age: 'ALL',
                grade: 'ALL',
                language: 'ALL',
            });

            // новый синтаксис вычисляемых свойств. хотя по сути он похож на предыдущий. то есть каждое свойство возвращает результат вызова функции getOptions(). Видимо, компьютеды не надо делать реактивными, потому что изменению они подвергаться не будут. они нужны лишь для того, чтобы пройтись по ним циклом v-for и отрендерить нужный набор опций в селекте
            const nameOptions = computed(() => getOptions('name'));
            const ageOptions = computed(() => getOptions('age'));
            const gradeOptions = computed(() => getOptions('grade'));
            const languageOptions = computed(() => getOptions('language'));

            // критических изменений в данной функции нет, кроме замены this.filteredUsers на
            // localState.filteredUsers
            function getOptions(key) {
                let result = ['ALL'];
                localState.filteredUsers.map((item) => {
                    function capitalizeLetter(word) {
                        let array = word.split('');
                        array[0] = array[0].toUpperCase();
                        return (array = array.join(''));
                    }
                    result.push(capitalizeLetter(item[key]));
                    // просто поприкалывался и сделал функцию, которая вписывает в селекты опшены только с заглавной буквы
                });
                return (result = [...new Set(result)]);
            }

            // критических изменений не произошло. кроме замены this на localState
            function applyFilters(key, value) {
                if (value === 'ALL') {
                    localState.filteredUsers = [...state.users];
                } else {
                    localState.filteredUsers = localState.filteredUsers.filter(
                        (item) => {
                            return (
                                item[key].toLowerCase() === value.toLowerCase()
                            );
                        }
                    );
                }
            }

            // ну и не забывем возвращать то, что будем использовать вне функции
            return {
                filter,
                nameOptions,
                ageOptions,
                gradeOptions,
                languageOptions,
                applyFilters,
            };
        }

        onMounted(() => {
            // чтобы юзать функцию из сетапа, ее нужно в этом сетапе продеструкторизировать
            getUsers();

            // зачем нужен вотчер: на момент записи видео нет возможности напрямую обратиться к мутациям и экшенам. поэтому отслеживаем изменения в стейте переменной appLoaded и вотчер вызовет функцию, которая в свою очередь положит нужные нам значения в наш созданный локалстейт, откуда он успешно используется в темплейте и других функциях
            watch(
                // новый синтаксис вотчеров. сначала указали то, за чем следим.
                // в видео указаны state.users, но и если их не указать, то тоже все работает
                () => (state.appLoaded, state.users),

                // а потом: какие действия мы с эти производим
                () => {
                    localState.filteredUsers = [...state.users];
                }
            );
        });

        //чтобы юзать в темплейте данные, их надо вернуть. то есть, мои функции возвращают мне объекты. в свою очередь спрэд-оператор раскравает возвращаемый ими объект в список
        return { localState, ...filters(), ...users() };
    },
};
</script>

<style lang="scss"></style>
