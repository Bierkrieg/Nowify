<template>
    <div class="itembar">
        <div v-if="isTrackbar" class="itembar__trackbar">
            <div class="itembar__topfade"></div>
            <div class="itembar__placeholder" style="width:80vh;"></div>
            <div :key="track.id" v-for="track in tracks" class="itembar__trackbox">
                <div class="itembar__placeholder"></div>
                <img :src="track.cover" :alt="track.title" class="itembar__image" />
                <div class="itembar__detailblock">
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
            <div :key="artist.id" v-for="artist in artists" class="itembar__artistbox">
                <div class="itembar__placeholder"></div>
                <img :src="artist.image" :alt="artist.name" class="itembar__image" />
                <div class="itembar__detailblock">
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
export default {
    name: 'Itembar',
    props: {
        tracks: Array,
        artists: Array,
        isTrackbar: Boolean, //kind of ugly
    }
}
</script>

<style src="@/styles/components/itembar.scss" lang="scss" scoped>

</style>