import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { SET_USER, ADD_ITEM, REMOVE_ITEM, ON_LOAD_FIXES } from "./constants";

const vuexPersist = new VuexPersist({
  key: "awsome-restaurant",
  storage: localStorage
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    ordered_items: new Map(),
    food_items: [
      {
        name: "Arugula Crust",
        image: "/img/arugula-crust-dish-208537.jpg",
        id: 100,
        price: 11.15,
        ordered: false
      },
      {
        name: "Beef Cheese Circle",
        image: "/img/beef-cheese-circle-262977.jpg",
        id: 200,
        price: 12.45,
        ordered: false
      },
      {
        name: "Burrito Chicken",
        image: "/img/burrito-chicken-close-up-461198.jpg",
        id: 300,
        price: 9.75,
        ordered: false
      }
    ]
  },
  getters: {
    get_user: state => state.user,
    get_ordered_items: state => new Map(state.ordered_items),
    is_ordered: (state, item_id) => new Map(state.ordered_items).has(item_id)
  },
  mutations: {
    [SET_USER]: (state, payload) => (state.user = payload),
    [ADD_ITEM]: (state, payload) =>
      state.ordered_items.set(payload[0], payload[1]),
    [REMOVE_ITEM]: (state, id) => state.ordered_items.delete(id),
    [ON_LOAD_FIXES]: state =>
      (state.ordered_items = new Map(state.ordered_items)) // Bug in VuexPersist plugin converting Map to array, so converting back to map
  },
  actions: {},
  plugins: [vuexPersist.plugin]
});
