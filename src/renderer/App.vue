<template>
  <div>
    <h1>Welcome to stream buddy</h1>
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

