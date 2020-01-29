<template>
  <div class="my-order">
    <h1>{{ message }}</h1>
    <p>Click button to increment: {{ counter }}</p>
    <button type="button" @click="on_increment_click()">
      Increment
    </button>
  </div>
</template>

<script>
module.exports = {
  methods: {
    on_increment_click() {
      this.counter++;
    }
  },
  data: function() {
    return {
      message: "No current order from you",
      counter: 0
    };
  }
};
</script>
