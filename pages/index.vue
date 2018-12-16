<template>
  <div class="background">
    <no-ssr v-if="deckA" class="video-background" :style="`opacity: ${opacityA}`">
      <youtube :video-id="deckA.id.videoId" @ready="readyA" player-width="100%" player-height="100%" />
    </no-ssr>
    <no-ssr v-if="deckB" class="video-background" :style="`opacity: ${opacityB}`">
      <youtube :video-id="deckB.id.videoId" @ready="readyB" player-width="100%" player-height="100%" />
    </no-ssr>
    <section class="container ui-container" v-hotkey="keymap">
      <div class="columns">
        <div class="column">
          <deck :info="deckA" :current-time="fmtTimeA"
            @on-play="playA"
            @on-mute="mute(playerA)"
            @change-volume="changeVolumeA" />{{ volumeRateA }}
        </div>
        <div class="column is-2 has-text-centered fader-container">
          <div class="is-absolute-bottom">
            <p>Fader</p>
            <input class="fader-input" type="range" v-model="faderValue" min="0" max="200" />
          </div>
        </div>
        <div class="column">
          <deck :info="deckB" :current-time="fmtTimeB"
            @on-play="playB"
            @on-mute="mute(playerB)"
            @change-volume="changeVolumeB" />{{ volumeRateB }}
        </div>
      </div>
      <search />
    </section>
  </div>
</template>

<script>
import Deck from '@/components/Deck';
import Search from '@/components/Search';
let intervalIdA, intervalIdB, intervalIds = {};
export default {
  data (context) {
    return {
      playerA: null,
      playerB: null,
      faderValue: 100,
      volumeRateA: 100,
      volumeRateB: 100,
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
          keydown: ()=>{this.mute(this.playerA)}
        },
        ',': {
          keydown: ()=>{this.mute(this.playerB)}
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
      return formatTime(this.$store.state.currentTime.A || 0);
    },
    fmtTimeB () {
      return formatTime(this.$store.state.currentTime.B || 0);
    }
  },
  methods: {
    readyA (e) {
      this.playerA = e.target;
      if (!!intervalIdA) clearInterval(intervalIdA)
    },
    readyB (e) {
      this.playerB = e.target;
      if (!!intervalIdB) clearInterval(intervalIdB)
    },
    playA () {
      if (this.playerA.getPlayerState() === 1) {
        this.playerA.pauseVideo();
        clearInterval(intervalIdA);
      } else {
        this.playerA.playVideo();
        intervalIdA = setInterval(() => {
          const currentTime = this.playerA.getCurrentTime()
          this.$store.commit('setCurrentTime', ['A', currentTime]);
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
          const currentTime = this.playerB.getCurrentTime()
          this.$store.commit('setCurrentTime', ['B', currentTime])
        }, 100);
      }
    },
    mute (player) {
      if (!player) {
        return;
      }
      if (player.isMuted()) {
        player.unMute();
      } else {
        player.mute();
      }
    },
    changeVolumeA (volume) {
      this.volumeRateA = volume
    },
    changeVolumeB (volume) {
      this.volumeRateB = volume
    },
  },
  watch: {
    faderValue: calculateVolumes,
    volumeRateA: calculateVolumes,
    volumeRateB: calculateVolumes
  },
  mounted () {
    this.$store.dispatch('getInfo', this.$cookies.get('videoIdA') || 'HAIDqt2aUek')
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

function formatTime (seconds) { // TODO: formatに移す
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
