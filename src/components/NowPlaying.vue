<template>
  <div id="app">
    <div
      @click="handleClick()"
      v-if="player.playing"
      class="now-playing"
    >
      <div class="now-playing__cover">
        <img
          :src="player.trackAlbum.image"
          :alt="player.trackTitle"
          class="now-playing__image"
        />
      </div>
      <div class="now-playing__details">
        <h1 class="now-playing__track" v-text="player.trackTitle"></h1>
        <h2 class="now-playing__artists" v-text="getTrackArtists"></h2>
      </div>
    </div>
    <div v-else @click="handleClick()" class="now-idle">
      <!-- event should only work on background, not on tracks/artists-->
      <Itembar v-if="itemDataLoaded" :tracks="this.userTopItems.tracks" :isTrackbar="true"/>
      <Itembar v-if="itemDataLoaded" :artists="this.userTopItems.artists" :isTrackbar="false"/>
    </div>
  </div>
</template>

<script>
import * as Vibrant from 'node-vibrant'

import props from '@/utils/props.js'
import Itembar from './Itembar.vue'

export default {
  name: 'NowPlaying',

  components: {
    Itembar
  },

  props: {
    auth: props.auth,
    endpoints: props.endpoints,
    player: props.player
  },

  data() {
    return {
      pollPlaying: '',
      pollTopItems: '',
      playerResponse: {},
      topItemsResponse: {},
      playerData: this.getEmptyPlayer(),
      userTopItems: this.getEmptyTopItems(),
      colourPalette: '',
      swatches: [],
      clickCount: 0,
      clickTimer: null,
      vibrantToggle: false,
      itemDataLoaded: false
    }
  },

  computed: {
    /**
     * Return a comma-separated list of track artists.
     * @return {String}
     */
    getTrackArtists() {
      return this.player.trackArtists.join(', ')
    }
  },

  mounted() {
    this.getTopItems()
    this.setDataInterval()
  },

  beforeDestroy() {
    clearInterval(this.pollPlaying)
    clearInterval(this.pollTopItems)
  },

  methods: {
    /**
     * Make the network request to Spotify to
     * get the current played track.
     */
    async getNowPlaying() {
      let data = {}

      try {
        //error with 503 response causes glitch?
        const response = await fetch(
          `${this.endpoints.base}/${this.endpoints.nowPlaying}`,
          {
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

        /**
         * Fetch error.
         */
        if (!response.ok) {
          throw new Error(`An error has occured: ${response.status}`)
        }

        /**
         * Spotify returns a 204 when no current device session is found.
         * The connection was successful but there's no content to return.
         */
        if (response.status === 204) {
          data = this.getEmptyPlayer()
          this.playerData = data
          this.$nextTick(() => {
            this.$emit('spotifyTrackUpdated', data)
          })
          return
        }

        data = await response.json()
        this.playerResponse = data
      } catch (error) {
        this.handleExpiredToken()
        data = this.getEmptyPlayer()
        this.playerData = data

        this.$nextTick(() => {
          this.$emit('spotifyTrackUpdated', data)
        })
      }
    },

    /**
     * Make the network request to Spotify to
     * get the Top Items of the current User.
     */
    async getTopItems() {

      const time_range = 'short_term'
      const limit = 5
      
      let Trackdata = {}
      let Artistdata = {}
      
      try {
        const responseTracks = await fetch(
          `${this.endpoints.base}/${this.endpoints.topTracks}?time_range=${time_range}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

        /**
         * Fetch error.
         */
        if (!responseTracks.ok) {
          throw new Error(`An error has occured: ${responseTracks.status}`)
        }

        const responseArtists = await fetch(
          `${this.endpoints.base}/${this.endpoints.topArtists}?time_range=${time_range}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

        /**
         * Fetch error.
         */
        if (!responseArtists.ok) {
          throw new Error(`An error has occured: ${responseArtists.status}`)
        }

        Trackdata = await responseTracks.json()
        Artistdata = await responseArtists.json() 

        this.topItemsResponse = {
          Trackdata: Trackdata,
          Artistdata : Artistdata
        }

      } catch (error) {
        this.handleExpiredToken()
        this.userTopItems = this.getEmptyTopItems()
      }

      //here?
      this.handleNowIdle()
    },

    /**
    * prevent overlap of click and dblclick
    */
    handleClick() {
      //https://antenna.io/blog/2018/03/handle-single-and-double-clicks-on-the-same-element-in-vue-js/
      this.clickCount++

      if (this.clickCount === 1) {
        this.clickTimer = setTimeout(() => {
          this.clickCount = 0
          this.togglePlayback()
        }, 500)
      } else if (this.clickCount === 2) {
        clearTimeout(this.clickTimer)
        this.clickCount = 0
        this.skipSong()
      }
    },

    /**
     * toggle Playback or start playing array of Songs
     * @param {Array} songlist 
     */
    async togglePlayback(songlist = []) {

      //pause when playing, resume when idle
      let endpoint = this.playerResponse.is_playing ? this.endpoints.pausePlayback : this.endpoints.startPlayback
      let response = ""
      //let data = {}

      try {
        //when songlist is not empty, play the array of Songs
        if (songlist.length !== 0) {
          //coming up

          /* bodydata = '{\"uris:\"}'
             const response = await fetch(
            `${this.endpoints.base}/${this.endpoints.startPlayback}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${this.auth.accessToken}`
              }
              //body: JSON.stringify()
            }
          ) */
        }

        //when songlist is empty, pause when playing, resume when idle
        else if (songlist.length === 0) {

          response = await fetch(
            `${this.endpoints.base}/${endpoint}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${this.auth.accessToken}`
              }
            }
          )
        }

        /**
         * Fetch error.
         */
        if (!response.ok) {
          throw new Error(`An error has occured: ${response.status}`)
        }

      } catch (error) {

        /* //probably not needed, but maybe useful later
        data = this.getEmptyPlayer()
        this.playerData = data
        this.$nextTick(() => {
          this.$emit('spotifyTrackUpdated', data)
        }) */
      }
    },

    /**
     * skip the current song
     */
    async skipSong() {
      try {
        const response = await fetch(
          `${this.endpoints.base}/${this.endpoints.skipNext}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.auth.accessToken}`
            }
          }
        )

        if (!response.ok) {
          throw new Error(`An error has occured: ${response.status}`)
        }
      } catch (error) {
        //what here
        console.log("error")
      }

    },

    /**
     * Get the colour palette from the album cover.
     */
    getAlbumColours() {
      /**
       * No image (rare).
       */
      if (!this.player.trackAlbum?.image) {
        return
      }

      /**
       * Run node-vibrant to get colours if album changed
       * DOES NOT WORK IF PAUSE/UNPAUSE
       */
      if (!this.vibrantToggle) {
        Vibrant.from(this.player.trackAlbum.image)
        .quality(1)
        .clearFilters()
        .getPalette()
        .then(palette => {
          this.handleAlbumPalette(palette)
        })
      }
    },

    /**
     * Return a formatted empty object for an idle player.
     * @return {Object}
     */
    getEmptyPlayer() {
      
      return {
        playing: false,
        trackAlbum: {},
        trackArtists: [],
        trackId: '',
        trackTitle: ''
      }
    },

    /**
     * Return a formatted empty object for the Top Artists and Tracks for Users
     * @return {Object}
     */
    getEmptyTopItems() {
      return {
        //cant find a better way, looks ugly
        tracks: [{},{},{},{},{}],
        artists: [{},{},{},{},{}],
      }
    },

    /**
     * Poll Spotify for data.
     */
    setDataInterval() {
      clearInterval(this.pollPlaying)
      clearInterval(this.pollTopItems)
      this.pollPlaying = setInterval(() => {
        this.getNowPlaying()
      }, 2500)

      //29min Interval, since tokens persist for 1 hour?
      this.pollTopItems = setInterval(() => {
        this.getTopItems()
      }, 1740000)
    },

    /**
     * Set the stylings of the app based on received colours.
     */
    setAppColours() {
      document.documentElement.style.setProperty(
        '--color-text-primary',
        this.colourPalette.text
      )

      document.documentElement.style.setProperty(
        '--colour-background-now-playing',
        this.colourPalette.background
      )
    },

    /**
     * Handle Top Tracks and Artists
     */
    handleNowIdle() {
      if (
        this.topItemsResponse.Trackdata.error?.status === 401 ||
        this.topItemsResponse.Trackdata.error?.status === 400 ||
        this.topItemsResponse.Artistdata.error?.status === 401 ||
        this.topItemsResponse.Artistdata.error?.status === 400 
      ) {
        this.handleExpiredToken()
        return
      }

      for (let i = 0; i < 5; i++) {         
        this.userTopItems.tracks[i].id = this.topItemsResponse.Trackdata.items[i].id
        this.userTopItems.tracks[i].title = this.topItemsResponse.Trackdata.items[i].name
        this.userTopItems.tracks[i].cover = this.topItemsResponse.Trackdata.items[i].album.images[0].url 
        this.userTopItems.tracks[i].artists = this.topItemsResponse.Trackdata.items[i].artists.map(artists => artists.name)
        this.userTopItems.tracks[i].album = this.topItemsResponse.Trackdata.items[i].album.name
        this.userTopItems.tracks[i].popularity = this.topItemsResponse.Trackdata.items[i].popularity

        this.userTopItems.artists[i].id = this.topItemsResponse.Artistdata.items[i].id
        this.userTopItems.artists[i].name = this.topItemsResponse.Artistdata.items[i].name 
        this.userTopItems.artists[i].image = this.topItemsResponse.Artistdata.items[i].images[0].url
        this.userTopItems.artists[i].followers = this.topItemsResponse.Artistdata.items[i].followers.total
        this.userTopItems.artists[i].genres = this.topItemsResponse.Artistdata.items[i].genres
        this.userTopItems.artists[i].popularity = this.topItemsResponse.Artistdata.items[i].popularity
      }
      //only load itembar component when this happened, maybe little dirty
      this.itemDataLoaded = true
    },

    /**
     * Handle newly updated Spotify Tracks.
     */
    handleNowPlaying() {
      if (
        this.playerResponse.error?.status === 401 ||
        this.playerResponse.error?.status === 400
      ) {
        this.handleExpiredToken()
        return
      }

      /**
       * Player is active, but user has paused.
       */
      if (this.playerResponse.is_playing === false) {
        this.playerData = this.getEmptyPlayer()
        return
      }

      /**
       * The newly fetched track is the same as our stored
       * one, we don't want to update the DOM yet.
       */
      if (this.playerResponse.item?.id === this.playerData.trackId) {
        return
      }

      /**
       * Store the current active track and check if its the same album cover.
       */
      //prevent background from updating when cover stays the same
      this.vibrantToggle = (this.playerData.trackAlbum.title === this.playerResponse.item.album.name)
      this.playerData = {
        playing: this.playerResponse.is_playing,
        trackArtists: this.playerResponse.item.artists.map(
          artist => artist.name
        ),
        trackTitle: this.playerResponse.item.name,
        trackId: this.playerResponse.item.id,
        trackAlbum: {
          title: this.playerResponse.item.album.name,
          image: this.playerResponse.item.album.images[0].url
        }
      }
    },

    /**
     * Handle newly stored colour palette:
     * - Map data to readable format
     * - Get and store random colour combination.
     */
    handleAlbumPalette(palette) {
      let albumColours = Object.keys(palette)
        .filter(item => {
          return item === null ? null : item
        })
        .map(colour => {
          return {
            text: palette[colour].getTitleTextColor(),
            background: palette[colour].getHex()
          }
        })

      this.swatches = albumColours

      this.colourPalette =
        albumColours[Math.floor(Math.random() * albumColours.length)]

      this.$nextTick(() => {
        this.setAppColours()
      })
    },

    /**
     * Handle an expired access token from Spotify.
     */
    handleExpiredToken() {
      clearInterval(this.pollPlaying)
      clearInterval(this.pollTopItems)
      this.$emit('requestRefreshToken')
    }
  },
  watch: {
    /**
     * Watch the auth object returned from Spotify.
     */
    auth: function(oldVal, newVal) {
      if (newVal.status === false) {
        clearInterval(this.pollPlaying)
      }
    },

    /**
     * Watch the returned track object.
     */
    playerResponse: function() {
      this.handleNowPlaying()
    },

    /**
     * Watch our locally stored track data.
     */
    playerData: function() {
      this.$emit('spotifyTrackUpdated', this.playerData)

      this.$nextTick(() => {
        this.getAlbumColours()
      })
    }
  }
}
</script>

<style src="@/styles/components/now-playing.scss" lang="scss" scoped></style>
