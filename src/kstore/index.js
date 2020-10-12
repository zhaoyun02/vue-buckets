import Vue from "vue";
import Vuex from "./kstore.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    add(state) {
      return state.count++;
    },
  },
  actions: {
    addAsync({ commit }) {
      setTimeout(() => {
        commit("add");
      }, 1000);
    },
  },
  getters: {
    doubleCounter(state) {
      console.log(22222222);
      return state.count * 2;
    },
    showRandomNum(state) {
      return "随机数:" + state.randomNum;
    },
  },
  modules: {},
});
