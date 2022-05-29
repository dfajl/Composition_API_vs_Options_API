<template>
    <div class="layout">
        <div class="filters">
            <h2>FILTERS</h2>
            <div class="inputs">
                <div class="input_wrapper">
                    <p>Filter by name</p>
                    <select
                        class="filters__select"
                        @click="showSelectedItem"
                        v-model="filters.name"
                        @change="applyFilters('name', filters.name)"
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
                        v-model="filters.age"
                        @change="applyFilters('age', filters.age)"
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
                        v-model="filters.grade"
                        @change="applyFilters('grade', filters.grade)"
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
                        v-model="filters.language"
                        @change="applyFilters('language', filters.language)"
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
                v-for="user in filteredUsers"
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
import { mapActions, mapState } from 'vuex';
import vUser from './v-User';

export default {
    name: 'layout-optional',
    components: { vUser },
    props: {},
    data() {
        return {
            filters: {
                name: 'ALL',
                age: 'ALL',
                grade: 'ALL',
                language: 'ALL',
            },
            newUser: {
                name: '',
                age: '',
                grade: '',
                language: '',
                job: '',
            },
            filteredUsers: [],
        };
    },
    methods: {
        ...mapActions(['FETCH_USERS', 'ADD_NEW_USER']),
        getOptions(key) {
            // получаю список опций в селект
            let result = ['ALL'];
            this.filteredUsers.map((item) => {
                function capitalizeLetter(word) {
                    let array = word.split('');
                    array[0] = array[0].toUpperCase();
                    return (array = array.join(''));
                }
                result.push(capitalizeLetter(item[key]));
                // просто поприкалывался и сделал функцию, которая вписывает в селекты опшены только с заглавной буквы
            });
            return (result = [...new Set(result)]);
            // Set - это объект уникальных значений (без ключей). помещаем в new Set() любой итерируемый объект. получаем уникальную коллекцию. потом через рест-оператор распаковываем ее в список и тут же кладем в массив
        },
        showSelectedItem() {
            console.log(this.filters.name);
            // как работает v-model в селекте: выбранный опшн записывается через директиву v-model в приравненное к последней значение
        },
        applyFilters(key, value) {
            if (value === 'ALL') {
                this.filteredUsers = [...this.users];
            } else {
                this.filteredUsers = this.filteredUsers.filter((item) => {
                    return item[key].toLowerCase() === value.toLowerCase();
                });
            }
            // логика следующая: сравниваю значение из v-model с All. если результат true - то фильтрация по сути не происходит.
            // если же получаем false, то фильтрую исходный массив с данными путем сравнения поля объекта с ключом (первый аргумент) со значением из v-model
        },
        addUser() {
            let user = {
                // в данном объекте добавим новое поле и скопируем все значения из объекта newUser, ведь именно в него прилетают все значения из инпутов с помощью директивы v-model
                id: this.users.length + 1,
                ...this.newUser,
            };
            this.ADD_NEW_USER(user);

            // перезапрашиваю уже новый список с сервера
            this.FETCH_USERS().then(() => {
                this.filteredUsers = [...this.users];
            });
            this.clearInputs();
        },
        clearInputs() {
            for (let key in this.newUser) {
                this.newUser[key] = '';
            }
        },
    },
    computed: {
        ...mapState(['users']),
        nameOptions() {
            return this.getOptions('name');
            /* как работает данное вычисляемое св-во: 
                - каждое вычисляемое св-во в каждом селекте вызывает метод. здесь вызван метод getOptions с аргументом 'name'. в данном методе происходит создание массива, в которой при каждой итерации пушатся поля с именем 'name' из каждого отдельного объекта (юзера) из удаленной базы данных;

                - в каждом селекте идет отрисовка всех опшнов из определенного массива, которые отображаются благодаря выведенному {{ option }}
            */
        },
        ageOptions() {
            return this.getOptions('age');
        },
        gradeOptions() {
            return this.getOptions('grade');
        },
        languageOptions() {
            return this.getOptions('language');
        },
    },
    mounted() {
        this.FETCH_USERS().then((result) => {
            this.filteredUsers = [...this.users];
            console.log(result); // undefined
            // видим, что результат вызова аксиос-запроса не доступен в данном компоненте
        });
    },
};
</script>

<style lang="scss"></style>
