<template>
    <div class="search-container">
        <div class="search-input">
            <span class="bi bi-search"></span>
            <input
                type="text"
                placeholder="Search for a song, artist, or album..."
                @input="search"
            />
        </div>
        <div v-show="searching">
            <span class="bi bi-hourglass-split"></span>
            <span>Searching...</span>
        </div>
        <ul v-if="results.length" class="search-results">
            <Track v-for="(track, index) in results" :key="track.id" :track="track" :index="index" @select="create_qr" />
        </ul>
    </div>
</template>

<style scoped>
.search-container {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    flex: 1 1 auto;
    border-radius: 6px;
}

.search-input {
    display: flex;
    gap: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1.5rem;
}

.search-input input {
    width: 100%;
    border: 0;
    color: white;
    background-color: transparent;
    outline: none;
    font-size: inherit;
}

.placeholder {
    display: flex;
    width: 100%;
    aspect-ratio: 1;
}

.search-results{
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
}
</style>

<script setup>
import { ref } from 'vue';
import { store } from '@/assets/store';
import { useRouter } from 'vue-router';
import Track from './Track.vue';

const router = useRouter();

const results = ref([]);
const searching = ref(false);

function debounce(func, timeout = 750) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

const search = debounce((event) => {
    const query = event.target.value;
    if (query.length < 3) return;

    // Check if a query is already in progress
    if (searching.value) return;

    // Search for the query
    results.value = [];
    searching.value = true;
    spotify.search(query).then(res => {
        searching.value = false;
        results.value = res.tracks.items;
    });
}, 500);

async function create_qr(track) {
    // Save the track to the store
    store.track = track;

    // Redirect to the create page
    router.push('/create');
}
</script>
