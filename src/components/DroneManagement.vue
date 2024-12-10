<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const drones = ref<any[]>([]);
const newDrone = ref({
  name: '',
  speed: '',
  range: '',
  chargingTime: ''
});

const fetchDrones = async () => {
  try {
    const response = await fetch('http://localhost:8080/drones');
    drones.value = await response.json();
  } catch (error) {
    console.error('Error fetching drones:', error);
  }
};

const addDrone = async () => {
  try {
    const response = await fetch('http://localhost:8080/drones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: Date.now().toString(),
        ...newDrone.value
      }),
    });

    if (response.ok) {
      await fetchDrones();
      newDrone.value = { name: '', speed: '', range: '', chargingTime: '' };
    } else {
      console.error('Error adding drone:', await response.text());
    }
  } catch (error) {
    console.error('Error adding drone:', error);
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Delivering':
      return 'text-blue-600';
    case 'Returning':
      return 'text-yellow-600';
    case 'Recharging':
      return 'text-orange-600';
    case 'Available':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

const getAvailableIn = (drone: any) => {
  if (drone.status === 'Available') {
    return 'Now';
  }

  const returnTime = new Date(drone.returnTime);
  const now = new Date();
  const diffInMinutes = Math.ceil((returnTime.getTime() - now.getTime()) / (1000 * 60));

  if (diffInMinutes <= 0) {
    return 'Soon';
  }

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

let interval: number | undefined;

onMounted(() => {
  fetchDrones();
  interval = setInterval(fetchDrones, 30000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Drone Management</h2>

    <!-- Add Drone Form -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">Add New Drone</h3>
      <form @submit.prevent="addDrone" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="newDrone.name" id="name" type="text" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="speed" class="block text-sm font-medium text-gray-700">Speed (km/h)</label>
          <input v-model="newDrone.speed" id="speed" type="number" step="0.1" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="range" class="block text-sm font-medium text-gray-700">Range (km)</label>
          <input v-model="newDrone.range" id="range" type="number" step="0.1" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="chargingTime" class="block text-sm font-medium text-gray-700">Charging Time (minutes)</label>
          <input v-model="newDrone.chargingTime" id="chargingTime" type="number" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <button type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">Add
          Drone</button>
      </form>
    </div>

    <!-- Drone List -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">Drone List</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed (km/h)
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range (km)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charging Time
                (min)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available In
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="drone in drones" :key="drone.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ drone.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ drone.speed }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ drone.range }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ drone.chargingTime }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(drone.status)">
                  {{ drone.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ getAvailableIn(drone) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
