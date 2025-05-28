<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useMotionStore } from '../stores/motionStore'

const motionStore = useMotionStore()
const showOrientation = ref(false)

const toggleOrientation = () => {
  showOrientation.value = !showOrientation.value
}

// Create a 3D transform based on device orientation
const deviceTransform = ref('rotateX(0deg) rotateY(0deg) rotateZ(0deg)')

watch(() => [motionStore.orientation.alpha, motionStore.orientation.beta, motionStore.orientation.gamma], 
  ([alpha, beta, gamma]) => {
    if (alpha !== null && beta !== null && gamma !== null) {
      // Convert orientation data to CSS transform
      // Limit the rotation values to prevent extreme angles
      const limitedBeta = Math.max(-45, Math.min(45, beta))
      const limitedGamma = Math.max(-45, Math.min(45, gamma))
      
      deviceTransform.value = `
        rotateX(${limitedBeta}deg)
        rotateY(${limitedGamma}deg)
        rotateZ(${alpha}deg)
      `
    }
  }, 
  { immediate: true }
)
</script>

<template>
  <div class="device-orientation">
    <button class="toggle-button" @click="toggleOrientation">
      {{ showOrientation ? 'Hide Orientation' : 'Show Orientation' }}
    </button>
    
    <div v-if="showOrientation" class="orientation-display">
      <div class="phone-model" :style="{ transform: deviceTransform }">
        <div class="phone-front"></div>
        <div class="phone-back"></div>
        <div class="phone-left"></div>
        <div class="phone-right"></div>
        <div class="phone-top"></div>
        <div class="phone-bottom"></div>
      </div>
      
      <div class="orientation-data">
        <div class="data-row">
          <span class="data-label">Alpha:</span>
          <span class="data-value">{{ Math.round(motionStore.orientation.alpha || 0) }}°</span>
        </div>
        <div class="data-row">
          <span class="data-label">Beta:</span>
          <span class="data-value">{{ Math.round(motionStore.orientation.beta || 0) }}°</span>
        </div>
        <div class="data-row">
          <span class="data-label">Gamma:</span>
          <span class="data-value">{{ Math.round(motionStore.orientation.gamma || 0) }}°</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-orientation {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.toggle-button {
  background-color: #e2e8f0;
  color: #1e293b;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.toggle-button:hover {
  background-color: #cbd5e1;
}

.orientation-display {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
}

.phone-model {
  width: 60px;
  height: 120px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  margin-bottom: 1.5rem;
}

.phone-front,
.phone-back,
.phone-left,
.phone-right,
.phone-top,
.phone-bottom {
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.phone-front,
.phone-back {
  width: 60px;
  height: 120px;
  background-color: #3B82F6;
}

.phone-left,
.phone-right {
  width: 10px;
  height: 120px;
  background-color: #2563eb;
  left: 25px;
}

.phone-top,
.phone-bottom {
  width: 60px;
  height: 10px;
  background-color: #2563eb;
  top: 55px;
}

.phone-front {
  transform: translateZ(5px);
}

.phone-back {
  transform: translateZ(-5px) rotateY(180deg);
}

.phone-left {
  transform: translateX(-30px) rotateY(-90deg);
}

.phone-right {
  transform: translateX(30px) rotateY(90deg);
}

.phone-top {
  transform: translateY(-60px) rotateX(90deg);
}

.phone-bottom {
  transform: translateY(60px) rotateX(-90deg);
}

.orientation-data {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 200px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.data-label {
  font-weight: 500;
  color: #64748b;
}

.data-value {
  font-weight: 600;
  color: #1e293b;
}
</style>