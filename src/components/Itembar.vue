<template>
    <div class="itembar">
        <vue-element-loading :active="loadingRadio" is-full-screen background-color="rgba(255,255,255,0.5)">
            <img :src="radioSource" width="70%">
        </vue-element-loading>
        <vue-element-loading :active="loadingRadio" is-full-screen spinner="line-scale" size="128" duration="0.8" background-color="rgba(255,255,255,0.1)"/>
        <div v-if="isTrackbar" class="itembar__trackbar">
            <div class="itembar__topfade"></div>
            <div class="itembar__placeholder" style="width:80vh;"></div>
            <div :key="track.id" v-for="track in tracks" @click.stop="playTrackRadio(track)" class="itembar__trackbox">
                <div class="itembar__placeholder" @click.stop></div>
                <img :src="track.cover" :alt="track.title" class="itembar__image"/>
                <div class="itembar__detailblock" @click.stop>
                    <div class="itembar__detailinstance">
                        <span class="material-icons">music_note</span>
                        <h2 class="headerclass">song</h2>
                        <p class="itembar__detaildescription">{{track.title}}</p>
                    </div>
                    <div class="itembar__detailinstance">
                        <span class="material-icons">interpreter_mode</span>
                        <h2 class="headerclass">artists</h2>
                        <p class="itembar__detaildescription">{{track.artists.join('\n')}}</p>
                    </div>
                    <div class="itembar__detailinstance">
                        <span class="material-icons">album</span>
                        <h2 class="headerclass">album</h2>
                        <p class="itembar__detaildescription">{{track.album}}</p>
                    </div>
                    <div class="itembar__detailinstance">
                        <span class="material-icons">trending_up</span>
                        <h2 class="headerclass">popularity</h2>
                        <p class="itembar__detaildescription"></p>
                        <div class="itembar__progressbar">
                            <div :style="{width:track.popularity + '%'}"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="itembar__placeholder" style="width:80vh;"></div>
            <div class="itembar__bottomfade"></div>
        </div>
        <div v-else class="itembar__artistbar">
            <div class="itembar__topfade"></div>
            <div class="itembar__placeholder" style="width:80vh;"></div>
            <div :key="artist.id" v-for="artist in artists" @click.stop="playArtistRadio(artist)" class="itembar__artistbox">
                <div class="itembar__placeholder" @click.stop></div>
                <img :key=artist.id :src="artist.image" :alt="artist.name" class="itembar__image"/>
                <div class="itembar__detailblock" @click.stop>
                    <div class="itembar__detailinstance">
                        <span class="material-icons">interpreter_mode</span>
                        <h2 class="headerclass">artist</h2>
                        <p class="itembar__detaildescription">{{artist.name}}</p>
                    </div>
                    <div class="itembar__detailinstance">
                        <span class="material-icons">groups</span>
                        <h2 class="headerclass">followers</h2>
                        <p class="itembar__detaildescription">{{artist.followers}}</p>
                    </div>
                    <div class="itembar__detailinstance">
                        <span class="material-icons">theater_comedy</span>
                        <h2 class="headerclass">genres</h2>
                        <p class="itembar__detaildescription">{{artist.genres.slice(0,3).join('\n')}}</p> <!-- might cause errors in very niche cases-->
                    </div>
                    <div class="itembar__detailinstance">
                        <span class="material-icons">trending_up</span>
                        <h2 class="headerclass">popularity</h2>
                        <p class="itembar__detaildescription"></p>
                        <div class="itembar__progressbar">
                            <div :style="{width:artist.popularity + '%'}"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="itembar__placeholder" style="width:80vh;"></div>
            <div class="itembar__bottomfade"></div>
        </div>
    </div>
</template>

<script>
import VueElementLoading from 'vue-element-loading';
export default {
    name: 'Itembar',
    props: {
        tracks: Array,
        artists: Array,
        isTrackbar: Boolean, //kind of ugly
    },
    data() {
        return{
            loadingRadio: false,
            radioSource: "https://i.scdn.co/image/ab67616d0000b2736ba1cffc9b2c5469503430b3"
        }
    },
    components: {
        VueElementLoading
    },
    methods: {

        playArtistRadio(artist) {
            this.$emit('playArtistRadio', artist.id)
            this.radioSource = artist.image
            this.loadingRadio = true //gets reset automatically
            //if not:...
            setTimeout(() => this.loadingRadio = false, 8000);
        },

        playTrackRadio(track) {
            this.$emit('playTrackRadio', track)
            this.radioSource = track.cover
            this.loadingRadio = true //gets reset automatically
            //if not:...
            setTimeout(() => this.loadingRadio = false, 8000);
        }
    }
}
</script>

<style src="@/styles/components/itembar.scss" lang="scss" scoped>

</style>