export const state = () => ({
  deckA: null,
  durationA: 0,
  playerA: null,
  deckB: null,
  durationB: 0,
  playerB: null,
  searchResults: [],
  currentTime: {
    A: 0,
    B: 0
  }
})

export const mutations = {
  setToDeckA (state, vidObj) {
    state.deckA = vidObj;
  },
  setToDeckB (state, vidObj) {
    state.deckB = vidObj;
  },
  setSearchResults (state, results) {
    state.searchResults = results;
  },
  setCurrentTime (state, obj) {
    let newObj = JSON.parse(JSON.stringify(state.currentTime));
    newObj[obj[0]] = obj[1];
    state.currentTime = newObj;
  }
}

export const actions = {
  search (context, q) {
    const queries = {
      part: 'snippet',
      q: q,
      type: 'video',
      videoEmbeddable: true,
      maxResults: 25,
      key: 'AIzaSyA4U03XcR2FOLp-2HAHg0cUNJPNpeCxpi4'
    };
    const queryString = Object.keys(queries)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queries[key])}`)
      .join('&');

    return new Promise((resolve, reject) => {
      fetch('https://www.googleapis.com/youtube/v3/search?' + queryString)
        .then(res => res.json())
        .then(data => {
          context.commit('setSearchResults', data.items);
          resolve('success');
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getInfo (context, id) {
    const queries = {
      part: 'snippet',
      id: id,
      key: 'AIzaSyA4U03XcR2FOLp-2HAHg0cUNJPNpeCxpi4'
    };
    const queryString = Object.keys(queries)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queries[key])}`)
      .join('&');

    return new Promise((resolve, reject) => {
      fetch('https://www.googleapis.com/youtube/v3/videos?' + queryString)
        .then(res => res.json())
        .then(data => {
          if (data.items && data.items.length > 0) {
            resolve(data.items[0]);
          } else {
            reject('no items');
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
