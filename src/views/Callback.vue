<template>
    <div>
        <h1>Callback</h1>
        <p>Authenticating, please wait...</p>
    </div>
</template>

<style scoped>
div{
    display: grid;
    gap: 1rem;
}
</style>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { Spotify } from "../assets/spotify.js";

onBeforeMount(() => {
    // Get router
    const router = useRouter();

    // Get the code from the URL
    const code = router.currentRoute.value.query.code;
    if (!code) router.replace("/");

    // Request the access token
    spotify.getToken(code).then(() => {
        router.replace("/");
    });
});
</script>
