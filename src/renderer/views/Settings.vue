<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  settings: Object,
  setSettings: Function,
  refreshView: Function,
  resetSettings: Function,
})

// Local reactive copy of settings to avoid mutating prop directly
const localSettings = ref({ ...props.settings })

// Watch localSettings and propagate changes up
watch(
  localSettings,
  (newVal) => {
    props.setSettings(newVal)
  },
  { deep: true },
)

const version = ref('Loading...')
const newVersion = ref('')
const showUpdateBox = ref(false)

async function clearInput() {
  try {
    await window.myAPI.clearDataCache()
  } catch (err) {
    window.myAPI.logError(`Failed to clear data: ${err.message}`)
  }
}

async function applySavePath() {
  try {
    await window.myAPI.setCustomSavePath(localSettings.value.savePath)
  } catch (err) {
    window.myAPI.logError(`Error updating save path: ${err.message}`)
  }
}

async function checkForUpdate() {
  const updateInfo = await window.myAPI.checkForUpdate()
  if (updateInfo.version && updateInfo.version !== version.value) {
    newVersion.value = updateInfo.version
    showUpdateBox.value = true
  } else {
    alert('You are using the latest version.')
  }
}

function startUpdate() {
  window.myAPI.startUpdate()
}

window.myAPI.getAppVersion().then((v) => {
  version.value = v
})
</script>

<template>
  <div
    :class="[
      'mt-10 p-6 min-h-screen transition-colors duration-500',
      localSettings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-white text-gray-900',
    ]"
  >
    <h2
      :class="[
        'text-3xl font-extrabold text-center mb-10',
        localSettings.displayMode === 'light' ? 'text-black' : 'text-white',
      ]"
    >
      ⚙️ Application Settings
    </h2>

    <div class="'p-4 rounded-lg  transition-colors duration-300',">
      <p class="mb-3 text-lg font-semibold">
        App Version: <span class="font-mono text-blue-500">{{ version }}</span>
      </p>

      <button
        @click="checkForUpdate"
        class="mb-4 w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
      >
        Check for Update
      </button>

      <div
        v-if="showUpdateBox"
        class="mt-4 p-4 bg-green-600 bg-opacity-80 rounded-lg shadow transition-opacity duration-300"
      >
        <p class="mb-2 font-semibold">
          New version available:
          <span class="font-mono">{{ newVersion }}</span>
        </p>
        <button
          @click="startUpdate"
          class="px-4 py-2 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Update Now
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Display Mode -->
      <div>
        <label
          :class="[
            'block text-sm font-semibold mb-1',
            localSettings.displayMode === 'light' ? 'text-black' : 'text-white',
          ]"
        >
          Display Mode
        </label>
        <select
          v-model="localSettings.displayMode"
          class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          :class="
            localSettings.displayMode === 'dark'
              ? 'bg-gray-900 text-white border-gray-600'
              : 'bg-white text-gray-900 border-gray-300'
          "
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
        </select>
      </div>

      <!-- Navigation Mode -->
      <div>
        <label
          :class="[
            'block text-sm font-semibold mb-1',
            localSettings.displayMode === 'light' ? 'text-black' : 'text-white',
          ]"
        >
          Navigation Mode
        </label>
        <select
          v-model="localSettings.navMode"
          class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          :class="
            localSettings.displayMode === 'dark'
              ? 'bg-gray-900 text-white border-gray-600'
              : 'bg-white text-gray-900 border-gray-300'
          "
        >
          <option value="full">Full</option>
          <option value="mini">Mini</option>
        </select>
      </div>

      <!-- Save Path with button -->
      <div class="md:col-span-2 flex items-center gap-4 justify-center">
        <div class="flex-grow">
          <input
            v-model="localSettings.savePath"
            type="text"
            placeholder="/path/to/save"
            class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
            :class="
              localSettings.displayMode === 'dark'
                ? 'bg-gray-900 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            "
          />
        </div>

        <button
          @click="applySavePath"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
        >
          Apply Path
        </button>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex flex-wrap justify-between gap-4 pt-6">
      <button
        @click="props.resetSettings"
        class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-lg shadow transition"
      >
        Reset to Defaults
      </button>

      <button
        @click="clearInput"
        class="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
      >
        Clear Input Data
      </button>
    </div>
  </div>
</template>
