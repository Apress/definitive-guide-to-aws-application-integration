<template>
  <div class="main-view">
    <h1>{{ item.name }}</h1>
    <div class="order-container">
      <img class="img-fluid" :src="item.image" :alt="item.name" />
      <button
        type="button"
        :class="order_button_style"
        @click="on_order_button_click()"
      >
        {{ order_button_text }}
      </button>
    </div>
  </div>
</template>

<script>
import store from "../store";
import { ADD_ITEM, REMOVE_ITEM } from "../constants";
import { LambdaCaller } from "../utils/lambda_caller";
let lambda_caller = new LambdaCaller();

export default {
  methods: {
    on_order_button_click() {
      if (this.item.ordered) {
        lambda_caller
          .cancel_order(this.item.id)
          .then(() => {
            console.log("success");
            store.commit(REMOVE_ITEM, this.item.id);
            this.item.ordered = !this.item.ordered;
            this.item.errored = false;
          })
          .catch(err => {
            console.log(err);
            this.item.errored = true;
          });
      } else {
        lambda_caller
          .save_order(this.item.id, this.item.price)
          .then(t => {
            console.log("success");
            store.commit(ADD_ITEM, [this.item.id, t]);
            this.item.ordered = !this.item.ordered;
            this.item.errored = false;
          })
          .catch(err => {
            console.log(err);
            this.item.errored = true;
          });
      }
    }
  },
  mounted() {
    this.item.ordered = this.$store.getters["get_ordered_items"].has(
      this.item.id
    );
  },
  name: "FoodItem",
  data: function() {
    return {
      counter: 0
    };
  },
  props: {
    item: Object
  },
  computed: {
    order_button_text() {
      return this.item.ordered === true ? "Ordered" : "Order";
    },
    order_button_style() {
      if (this.item.errored === true) return "button errored-button";
      else if (this.item.ordered === true) return "button ordered-button";
      else return "button unordered-button";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.order-container {
  flex-direction: column;
  display: flex;
  justify-content: space-evenly;
  padding: 10px;
}
.img-fluid {
  max-height: 100%;
  height: auto;
  margin: 10px;
  border-radius: 10px;
}

.button {
  background-color: #4caf51;
  border: none;
  color: white;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  border-radius: 5px;
  transition-duration: 0.4s;
  cursor: pointer;
  outline: 0;
  box-shadow: none !important;
}

.unordered-button {
  background-color: white;
  color: black;
  border: 2px solid #4caf51;
}

.unordered-button:hover {
  background-color: #4caf51;
  color: white;
}

.ordered-button {
  background-color: #4caf51;
  color: black;
  border: 2px solid whitesmoke;
}

.ordered-button:hover {
  background-color: whitesmoke;
  color: #4caf50;
}

.errored-button {
  background-color: rosybrown;
  color: black;
  border: 2px solid whitesmoke;
}
</style>
