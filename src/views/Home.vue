<template>
    <div class="container">
        <h1>Spotify QR</h1>
        <p>Create QR codes for Spotify songs, albums, and artists</p>
        <div v-if="!isAuthenticated">
            <button @click="authenticate">Please log in to Spotify</button>
        </div>
        <div v-else>
            <Search/>
        </div>
        <p>Powered by <b>Giorgi</b> 🪿</p>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import Search from '../components/Search.vue'

const isAuthenticated = ref(false);

async function authenticate(){
    spotify.auth();
}

onBeforeMount(async ()=>{
    // Check if the user is authenticated
    isAuthenticated.value = spotify.isAuthenticated()

    // Check if the access token is expired
    if (isAuthenticated.value){
        const me = await spotify.me();
        if (me.error){
            // Refresh the token
            await spotify.refreshToken();
        }

    }

})
</script>