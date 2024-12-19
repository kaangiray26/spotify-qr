<template>
    <RouterView />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Spotify } from './assets/spotify.js'

onMounted(()=>{
    // Check if the user is authenticated
    window.spotify = new Spotify()
})
</script>