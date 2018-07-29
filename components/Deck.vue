<template>
  <div>
    <div v-if="info && info.snippet" class="deck-container">
      <figure class="image">
        <img :src="info.snippet.thumbnails.high.url" alt="">
      </figure>
      <div class="is-overlay deck-ui">
        <h2>{{ info.snippet.title }}</h2>
        <p>{{ currentTime }}</p>
      </div>
    </div>
    <div>
      <button class="button" @click="playClickHandler">play / pause (Z)</button>
      <button class="button" @click="muteClickHandler">mute (X)</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['info', 'currentTime', 'playClickHandler', 'muteClickHandler']
}
</script>


<style scoped>
.deck-container {
  position: relative;
}

.deck-ui {
  background: rgba(0, 0, 0, .3);
  color: white;
  padding: 15px;
}
</style>
