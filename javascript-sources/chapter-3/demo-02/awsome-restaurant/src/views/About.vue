<template>
  <div class="about">
    <input v-model.trim="phone" placeholder="phone number" />
    <br />
    <input v-model.trim="email" placeholder="email address" />
    <br />
    <button type="button" @click="on_subscribe_click()">
      Subscribe
    </button>
    <p>{{ subscribe_message }}</p>
  </div>
</template>

<script>
import store from "../store";
import { SnsCaller } from "../utils/sns_caller";
import { ON_SUBSCRIBE } from "../constants";

let sns_caller = new SnsCaller();

export default {
  name: "about",
  methods: {
    on_subscribe_click() {
      sns_caller.subscribe(this.phone, this.email);
      store.commit(ON_SUBSCRIBE, {
        phone_number: this.phone,
        email: this.email
      });
      this.subscribe_message = "Check your email to confirm subscription";
    }
  },
  data: function() {
    return {
      phone: store.state.phone_number,
      email: store.state.email,
      subscribe_message: ""
    };
  }
};
</script>
