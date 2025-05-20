<template>
  <div>
    <h1>Electron + Vue</h1>
    <button @click="sendToElectron">Send Message to Electron</button>
    <h1>Hello</h1>
  </div>
</template>

<script>
export default {
  methods: {
    sendToElectron() {
      window.myAPI.sendMessage('Hello from Renderer!')
    },
  },
}
</script>
