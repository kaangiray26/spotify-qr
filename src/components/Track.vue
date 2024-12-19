<template>
<li @click="emit('select', track)">
    <span class="index">{{ index + 1 }}</span>
    <img :src="track.album.images[2].url" alt="Album cover" />
    <div class="track-header">
        <p class="name">{{ track.name }}</p>
        <p class="artist">{{ track.artists.map(artist => artist.name).join(', ') }}</p>
    </div>
</li>
</template>

<style scoped>
li {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
}

li:hover{
    border-radius: 6px;
    background-color: #2a2a2a;
}

li img{
    width: 40px;
    height: 40px;
}

.index {
    width: 2ch;
    color: #ccc;
}

.track-header {
    display: flex;
    flex-direction: column;
}

.name {
    font-weight: bold;
}

.artist {
    color: #ccc;
}
</style>

<script setup>
import { ref } from 'vue';
const props = defineProps(['track', 'index']);
const emit = defineEmits(['select']);
</script>