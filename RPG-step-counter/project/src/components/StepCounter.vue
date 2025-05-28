<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMotionStore } from '../stores/motionStore'

const motionStore = useMotionStore()
const isTracking = ref(true)

const toggleTracking = () => {
  isTracking.value = !isTracking.value
  if (isTracking.value) {
    motionStore.startTracking()
  } else {
    motionStore.stopTracking()
  }
}

// Computed values for progress circle
const circumference = computed(() => 2 * Math.PI * 90)
const progressOffset = computed(() => {
  // Calculate progress based on steps (assuming 10000 steps is the daily goal)
  const progress = Math.min(motionStore.steps / 10000, 1)
  return circumference.value * (1 - progress)
})

// Animate the step count when it changes
const displayedCount = ref(0)
watch(() => motionStore.steps, (newValue) => {
  const duration = 1000 // Duration of the animation in milliseconds
  const startTime = Date.now()
  const startValue = displayedCount.value
  const endValue = newValue
  
  const updateCount = () => {
    const currentTime = Date.now()
    const elapsedTime = currentTime - startTime
    
    if (elapsedTime < duration) {
      const progress = elapsedTime / duration
      displayedCount.value = Math.floor(startValue + (endValue - startValue) * progress)
      requestAnimationFrame(updateCount)
    } else {
      displayedCount.value = endValue
    }
  }
  
  updateCount()
}, { immediate: true })
</script>

<template>
  <div class="step-counter">
    <div class="progress-container">
      <svg class="progress-ring" width="200" height="200">
        <circle
          class="progress-ring__circle-bg"
          stroke="#e2e8f0"
          stroke-width="10"
          fill="transparent"
          r="90"
          cx="100"
          cy="100"
        />
        <circle
          class="progress-ring__circle"
          stroke="#3B82F6"
          stroke-width="10"
          stroke-linecap="round"
          fill="transparent"
          r="90"
          cx="100"
          cy="100"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
        />
      </svg>
      <div class="step-display">
        <div class="step-count">{{ displayedCount }}</div>
        <div class="step-label">steps</div>
      </div>
    </div>
    
    <button class="control-button" @click="toggleTracking">
      {{ isTracking ? 'Pause' : 'Resume' }}
    </button>
    
    <div class="stats">
      <div class="stat-item">
        <div class="stat-value">{{ Math.round(motionStore.steps * 0.0008 * 100) / 100 }}</div>
        <div class="stat-label">km</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ Math.round(motionStore.steps * 0.04) }}</div>
        <div class="stat-label">calories</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ Math.round(motionStore.steps * 0.0008 * 60 / 5 * 10) / 10 }}</div>
        <div class="stat-label">minutes</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
}

.progress-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 1.5rem;
}

.progress-ring {
  transform: rotate(-90deg);
  overflow: visible;
}

.progress-ring__circle {
  transition: stroke-dashoffset 0.5s ease;
}

.step-display {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.step-count {
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.step-label {
  font-size: 1rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.control-button {
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -2px rgba(59, 130, 246, 0.1);
}

.control-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -1px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
}

.control-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -2px rgba(59, 130, 246, 0.05);
}

.stats {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  margin: 0 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}

@media (max-width: 600px) {
  .progress-container {
    width: 180px;
    height: 180px;
  }
  
  .step-count {
    font-size: 2.5rem;
  }
  
  .stats {
    flex-wrap: wrap;
  }
  
  .stat-item {
    margin: 0.25rem;
  }
}
</style>