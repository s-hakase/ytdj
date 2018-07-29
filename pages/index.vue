<template>
  <div class="background">
    <no-ssr v-if="deckA" class="video-background" :style="`opacity: ${opacityA}`">
      <youtube :video-id="deckA.id" @ready="readyA" player-width="100%" player-height="100%" />
    </no-ssr>
    <no-ssr v-if="deckB" class="video-background" :style="`opacity: ${opacityB}`">
      <youtube :video-id="deckB.id" @ready="readyB" player-width="100%" player-height="100%" />
    </no-ssr>
    <section class="container ui-container" v-hotkey="keymap">
      <div class="columns">
        <div class="column">
          <deck :info="deckA" :current-time="fmtTimeA"
            :play-click-handler="playA"
            :mute-click-handler="muteA" />
          <div>
            Deck A Vol.<input type="range" class="volume-range" v-model="volumeRateA" />
          </div>
        </div>
        <div class="column is-2 has-text-centered fader-container">
          <div class="is-absolute-bottom">
            <p>Fader</p>
            <input class="fader-input" type="range" v-model="faderValue" min="0" max="200" />
          </div>
        </div>
        <div class="column">
          <deck :info="deckB" :current-time="fmtTimeB"
            :play-click-handler="playB"
            :mute-click-handler="muteB" />
          <div>
            Deck B Vol.<input type="range" class="volume-range" v-model="volumeRateB" :mute-click-handler="muteA" />
          </div>
        </div>
      </div>
      <search />
    </section>
  </div>
</template>

<script>
import Deck from '@/components/Deck';
import Search from '@/components/Search';
let intervalIdA, intervalIdB;
export default {
  data (context) {
    return {
      videoId: '',
      videoId2: '',
      faderValue: 100,
      volumeRateA: 100,
      volumeRateB: 100,
      currentTimeA: 0,
      currentTimeB: 0,
      durationA: 0,
      durationB: 0
    }
  },
  computed: {
    keymap () {
      return {
        'z': {
          keydown: this.playA
        },
        'm': {
          keydown: this.playB
        },
        'x': {
          keydown: this.muteA
        },
        ',': {
          keydown: this.muteB
        }
      }
    },
    deckA () {
      return this.$store.state.deckA;
    },
    deckB () {
      return this.$store.state.deckB;
    },
    opacityA () {
      return (200 - this.faderValue) / 200;
    },
    opacityB () {
      return this.faderValue / 200;
    },
    fmtTimeA () {
      return formatTime(this.currentTimeA);
    },
    fmtTimeB () {
      return formatTime(this.currentTimeB);
    }
  },
  methods: {
    readyA (e) {
      this.playerA = e.target;
    },
    readyB (e) {
      this.playerB = e.target;
    },
    playA () {
      if (this.playerA.getPlayerState() === 1) {
        this.playerA.pauseVideo();
        clearInterval(intervalIdA);
      } else {
        this.playerA.playVideo();
        intervalIdA = setInterval(() => {
          this.currentTimeA = this.playerA.getCurrentTime();
        }, 100);
      }
    },
    playB () {
      if (this.playerB.getPlayerState() === 1) {
        this.playerB.pauseVideo();
        clearInterval(intervalIdB);
      } else {
        this.playerB.playVideo();
        intervalIdB = setInterval(() => {
          this.currentTimeB = this.playerB.getCurrentTime();
        }, 100);
      }
    },
    muteA () {
      if (this.playerA.isMuted()) {
        this.playerA.unMute();
      } else {
        this.playerA.mute();
      }
    },
    muteB () {
      if (this.playerB.isMuted()) {
        this.playerB.unMute();
      } else {
        this.playerB.mute();
      }
    }
  },
  watch: {
    faderValue: calculateVolumes,
    volumeRateA: calculateVolumes,
    volumeRateB: calculateVolumes
  },
  mounted () {
    this.$store.dispatch('getInfo', this.$cookies.get('videoIdA') || 'fzQ6gRAEoy0')
      .then(item => {
        this.$store.commit('setToDeckA', item);
      }).catch(err => {
        console.info(err);
      });
    this.$store.dispatch('getInfo', this.$cookies.get('videoIdB') || 'D1sZ_vwqwcE')
      .then(item => {
        this.$store.commit('setToDeckB', item);
      }).catch(err => {
        console.info(err);
      });
  },
  components: {
    Deck,
    Search
  }
}

function calculateVolumes() {
  let value = this.faderValue;
  let rateA = this.volumeRateA, rateB = this.volumeRateB;
  let volA, volB;
  if (value < 100) { // 0 ~ 100
    volA = 100;
    volB = value;
  } else if (value <= 200) { // 100 ~ 200
    volA = 200 - value;
    volB = 100;
  }

  if (this.playerA && this.playerB) {
    this.playerA.setVolume(volA * (rateA / 100));
    this.playerB.setVolume(volB * (rateB / 100));
  }
}

function formatTime (seconds) {
  let hh = ('00' + Math.floor(seconds / 3600)).slice(-2),
      mm = ('00' + Math.floor((seconds % 3600) / 60)).slice(-2),
      ss = ('00' + Math.floor(seconds % 60)).slice(-2);

  return `${hh}:${mm}:${ss}`;
}
</script>

<style>
.background {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: black;
}

.video-background {
  position: absolute;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}

.ui-container {
  background: rgba(0, 0, 0, .4);
  color: white;
  height: 100vh;
  padding: 15px;
}

.deck-container {
  position: relative;
}

.deck-ui {
  background: rgba(0, 0, 0, .3);
  color: white;
  padding: 15px;
}

.fader-container {
  position: relative;
}

.fader-container p {
  width: calc(100% - 24px);
}

.fader-input {
  display: block;
  width: calc(100% - 24px);
}

.is-absolute-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
