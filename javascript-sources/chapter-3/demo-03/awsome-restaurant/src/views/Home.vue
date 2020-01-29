<template>
  <div class="home flex-container">
    <div style="width: 100vw;">
      <img alt="Vue logo" src="/img/wide-logo.jpg" />
    </div>
    <div class="flex-row">
      <FoodItem
        v-for="item in this.$store.state.food_items"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import FoodItem from "../components/FoodItem";
import store from "../store";
import { ON_LOAD_FIXES, SET_USER } from "../constants";
const uuid = require("uuid/v1");

export default {
  name: "home",
  mounted() {
    if (!store.state.user) store.commit(SET_USER, uuid());
    store.commit(ON_LOAD_FIXES);
  },
  components: {
    FoodItem
  }
};
</script>

<style>
.flex-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
</style>
