<template>
  <div>
    <div>
      <input class="input is-inline" type="text" v-model="searchText" @keydown.stop @keydown.13="search(searchText)" />
      <button class="button" @click="search(searchText)">search</button>
    </div>
    <div class="search-result-container">
      <div class="media" v-for="item in searchResults" :key="item.id.videoId">
        <figure class="media-left">
          <p class="image">
            <img :src="item.snippet.thumbnails.default.url" :alt="item.snippet.title" class="search-result-item-image">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <span>{{ item.snippet.title }}</span>
          </div>
        </div>
        <div class="media-right">
          <button class="button" @click="setA(item)">set to Deck A</button>
          <button class="button" @click="setB(item)">set to Deck B</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchText: ''
    }
  },
  computed: {
    searchResults () {
      return this.$store.state.searchResults;
    }
  },
  methods: {
    setA (item) {
      this.$store.commit('setToDeckA', item);
      this.$cookies.set('videoIdA', item.id.videoId);
    },
    setB (id) {
      this.$store.commit('setToDeckB', item);
      this.$cookies.set('videoIdB', item.id.videoId);
    },
    search (searchText) {
      this.$store.dispatch('search', searchText)
        .catch(err => {
          console.info(err);
        });
    }
  }
}
</script>


<style scoped>
.search-result-container {
  height: 40vh;
  max-height: 40vh;
  overflow-y: scroll;
  padding-top: 16px;
}

.search-result-container .search-result-item-image {
  height: 40px;
  width: auto;
}
</style>
