<template>
  <div id="app">
    <Component
      :is="getCurrentComponent"
      :auth="auth"
      :endpoints="endpoints"
      :player="player"
      :defaultDevice="defaultDevice"
      @spotifyTrackUpdated="updateCurrentTrack"
      @requestRefreshToken="requestRefreshTokens"
    ></Component>
  </div>
</template>

<script>
import Authorise from '@/components/Authorise'
import NowPlaying from '@/components/NowPlaying'

import { getStoredAuth, setStoredAuth } from '@/utils/utils.js'

export default {
  name: 'App',

  components: {
    Authorise,
    NowPlaying
  },

  props: {},

  data() {
    return {
      storedAuth: '',
      test: 'hello, world',
      auth: {
        status: false,
        clientId: process.env.VUE_APP_SP_CLIENT_ID,
        clientSecret: process.env.VUE_APP_SP_CLIENT_SECRET,
        authCode: '',
        accessToken: '',
        refreshToken: ''
      },
      endpoints: {
        auth: 'https://accounts.spotify.com/authorize',
        token: 'https://accounts.spotify.com/api/token',
        base: 'https://api.spotify.com/v1',
        nowPlaying: 'me/player/currently-playing',
        topTracks: 'me/top/tracks',
        topArtists: 'me/top/artists',
        recommendations: 'recommendations',
        audiofeatures: 'audio-features',
        startPlayback: 'me/player/play',
        pausePlayback: 'me/player/pause',
        skipNext: 'me/player/next',
        checkFav: 'me/tracks/contains'
      },
      player: {
        playing: false,
        trackAlbum: [],
        trackArtists: [],
        trackId: '',
        trackTitle: ''        
      },
      storedId: '',
      defaultDevice: process.env.VUE_APP_SP_DEFAULT_DEVICE
    }
  },

  computed: {
    /**
     * Check for the existence of a stored access token and
     * return the correct Component to be displayed.
     * @return {String}
     */
    getCurrentComponent() {
      return this.auth.status === false ? 'Authorise' : 'NowPlaying'
    }
  },

  created() {
    this.auth = {
      ...this.auth,
      ...getStoredAuth()
    }
  },

  mounted() {},

  methods: {
    /**
     * Store
     */
    storeAccessToken() {
      this.getAccessToken()
    },

    /**
     * Request a refresh token from Spotify.
     */
    requestRefreshTokens() {
      this.auth.status = false
    },

    /**
     * Update the player object.
     * @param {Object} value - Spotify player object.
     */
    updateCurrentTrack(value) {
      this.player = value
    }
  },

  watch: {
    /**
     * Watch the authorisation status.
     */
    'auth.status': function() {
      setStoredAuth(this.auth)
    }
  }
}
</script>
