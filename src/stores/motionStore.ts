import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { detectStep } from '../utils/stepDetection'

export const useMotionStore = defineStore('motion', () => {
  // State
  const steps = ref(0)
  const isTracking = ref(false)
  const orientation = reactive({
    alpha: null as number | null,
    beta: null as number | null,
    gamma: null as number | null
  })
  const acceleration = reactive({
    x: 0,
    y: 0,
    z: 0,
    timestamp: 0
  })

  // Acceleration history for step detection
  const accelerationHistory = ref<number[]>([])
  const MAX_HISTORY_LENGTH = 10

  // Handle device motion events
  const handleMotionOld = (event: DeviceMotionEvent) => {
    if (!event.accelerationIncludingGravity) return

    const { x, y, z } = event.accelerationIncludingGravity
    if (x === null || y === null || z === null) return

    acceleration.x = x
    acceleration.y = y
    acceleration.z = z
    acceleration.timestamp = Date.now()

    // Calculate acceleration magnitude
    const magnitude = Math.sqrt(x * x + y * y + z * z)
    accelerationHistory.value.push(magnitude)
    
    if (accelerationHistory.value.length > MAX_HISTORY_LENGTH) {
      accelerationHistory.value.shift()
    }

    if (detectStep(accelerationHistory.value)) {
      steps.value++
    }
  }

    const stepCount = ref(0)
    const isRunning = ref(false)
    
    // Variables pour l'algorithme de détection de pas
    let lastAccel = { x: 0, y: 0, z: 0 }
    let lastTimestamp = 0
    
    // Seuils pour la détection de pas
    const THRESHOLD = 8.0
    const TIME_THRESHOLD = 300

  
   const handleMotion = (event: DeviceMotionEvent) => {
      
      const acceleration = event.accelerationIncludingGravity
      if (!acceleration) return
      
      const { x, y, z } = acceleration
      const timestamp = performance.now()
      
      // Calculer la magnitude du changement d'accélération
      const deltaX = Math.abs(x - lastAccel.x)
      const deltaY = Math.abs(y - lastAccel.y)
      const deltaZ = Math.abs(z - lastAccel.z)
      
      const acceleration_magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)
      
      // Détecter un pas
      if (acceleration_magnitude > THRESHOLD && (timestamp - lastTimestamp) > TIME_THRESHOLD) {
        steps.value++
        lastTimestamp = timestamp
      }
      
      // Mettre à jour les dernières valeurs
      lastAccel = { x, y, z }
    }


  // Handle device orientation events
  const handleOrientation = (event: DeviceOrientationEvent) => {
    orientation.alpha = event.alpha
    orientation.beta = event.beta
    orientation.gamma = event.gamma
  }

  // Start tracking motion and orientation
  const startTracking = () => {
    if (isTracking.value) return
    
    window.addEventListener('devicemotion', handleMotion)
    window.addEventListener('deviceorientation', handleOrientation)
    isTracking.value = true
  }

  // Stop tracking motion and orientation
  const stopTracking = () => {
    window.removeEventListener('devicemotion', handleMotion)
    window.removeEventListener('deviceorientation', handleOrientation)
    isTracking.value = false
  }

  // Reset step count
  const resetSteps = () => {
    steps.value = 0
  }

  return {
    steps,
    isTracking,
    orientation,
    acceleration,
    startTracking,
    stopTracking,
    resetSteps
  }
})