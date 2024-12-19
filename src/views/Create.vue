<template>
    <div class="container" v-if="store.track">
        <h1>Create a QR code</h1>
        <div class="card-holder">
            <div class="spotify-card">
                <img :src="store.track.album.images[0].url" alt="Album cover" />
                <div class="overlay">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288"
                        />
                    </svg>
                    <div class="footer">
                        <h1>{{ store.track.name }}</h1>
                        <img class="qr" v-if="qr" :src="qr" alt="QR code" />
                    </div>
                </div>
            </div>
        </div>
        <div>
            <button @click="download">Download QR code</button>
        </div>
    </div>
</template>

<style scoped>
.card-holder {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    border: 1px solid #ccc;
    box-sizing: border-box;
    width: fit-content;
}

.spotify-card {
    position: relative;
    display: flex;
    max-width: 512px;
}

.spotify-card img {
    width: 100%;
    height: auto;
}

.spotify-card .overlay {
    width: 100%;
    height: 100%;
    background-color: linear-gradient(0deg, #00000088 30%, #ffffff44 100%);
    display: flex;
    position: absolute;
    color: white;
}

.overlay svg {
    position: absolute;
    top: 5%;
    left: 5%;
    width: 2rem;
    height: 2rem;
}

.overlay .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: end;
    box-sizing: border-box;
    gap: 1rem;
}

.footer h1 {
    font-size: 3em;
    text-overflow: ellipsis;
    overflow: hidden;
}

.footer .qr {
    width: 128px;
    height: 128px;
}
</style>

<script setup>
import { ref, onBeforeMount } from "vue";
import { store } from "@/assets/store";
import { useRouter } from "vue-router";
import QRCode from "qrcode";
import domtoimage from "dom-to-image";

const router = useRouter();
const qr = ref(null);

async function create_qr(url) {
    const qrcode = await QRCode.toDataURL(url);
    qr.value = qrcode;
}

async function download() {
    // Download spotify-card element as image
    const card = document.querySelector(".spotify-card");
    const data_url = await domtoimage.toPng(card);

    // Create a link element
    const a = document.createElement("a");
    a.href = data_url;
    a.download = `${store.track.uri}.png`;
    a.click();
}

onBeforeMount(async () => {
    // Check if we have track in store
    if (store.track == null) {
        router.push("/");
        return
    }

    // Create QR code
    const url = store.track.external_urls.spotify;
    await create_qr(url);
});
</script>
