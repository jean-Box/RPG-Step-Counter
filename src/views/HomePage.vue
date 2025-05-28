<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import StepCounter from '../components/StepCounter.vue'
import DeviceOrientation from '../components/DeviceOrientation.vue'
import PermissionRequest from '../components/PermissionRequest.vue'
import { useMotionStore } from '../stores/motionStore'

const motionStore = useMotionStore()
const hasPermission = ref(false)

const checkPermission = async () => {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // iOS 13+ requires explicit permission
    try {
      const permissionState = await DeviceMotionEvent.requestPermission()
      hasPermission.value = permissionState === 'granted'
      if (hasPermission.value) {
        motionStore.startTracking()
      }
    } catch (error) {
      console.error('Error requesting motion permission:', error)
    }
  } else {
    // Other browsers don't require permission or automatically grant it
    hasPermission.value = true
    motionStore.startTracking()
  }
}

// For browsers that don't support permission API
onMounted(() => {
  if (typeof DeviceMotionEvent.requestPermission !== 'function') {
    hasPermission.value = true
    motionStore.startTracking()
  }
})

onUnmounted(() => {
  motionStore.stopTracking()
})
</script>

<template>
  <div class="home-container">
    <div v-if="!hasPermission" class="permission-container">
      <PermissionRequest @request-permission="checkPermission" />
    </div>
    <div v-else class="content-container">
      <h1 class="app-title">Step Counter</h1>
      <StepCounter />
      <DeviceOrientation />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  padding: 2rem;
  background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
}

.permission-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  text-align: center;
}

@media (max-width: 600px) {
  .home-container {
    padding: 1rem;
  }
  
  .app-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
}
</style>