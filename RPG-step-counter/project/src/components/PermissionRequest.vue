<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits(['requestPermission'])

const requestPermission = () => {
  emit('requestPermission')
}
</script>

<template>
  <div class="permission-request">
    <div class="permission-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
      </svg>
    </div>
    <h2 class="permission-title">Motion Sensor Access Required</h2>
    <p class="permission-text">
      This app needs access to your device's motion sensors to count your steps.
      Your data will never leave your device and is not stored or shared.
    </p>
    <button class="permission-button" @click="requestPermission">
      Allow Access
    </button>
  </div>
</template>

<style scoped>
.permission-request {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.permission-icon {
  color: #3B82F6;
  margin-bottom: 1.5rem;
}

.permission-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.permission-text {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.permission-button {
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -2px rgba(59, 130, 246, 0.1);
}

.permission-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -1px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
}

.permission-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -2px rgba(59, 130, 246, 0.05);
}
</style>