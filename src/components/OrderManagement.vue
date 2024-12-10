<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const orders = ref<any[]>([]);
const newOrder = ref({
  range: ''
});
const showDroneSelectionModal = ref(false);
const availableDrones = ref<any[]>([]);

const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:8080/orders');
    orders.value = await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

const openDroneSelectionModal = async () => {
  try {
    const response = await fetch(`http://localhost:8080/drones?status=Available&range=${newOrder.value.range}`);
    availableDrones.value = await response.json();
    showDroneSelectionModal.value = true;
  } catch (error) {
    console.error('Error fetching available drones:', error);
  }
};

const closeDroneSelectionModal = () => {
  showDroneSelectionModal.value = false;
};

const selectDrone = async (drone: any) => {
  try {
    const response = await fetch('http://localhost:8080/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: Date.now().toString(),
        range: newOrder.value.range,
        droneId: drone.id
      }),
    });

    if (response.ok) {
      await fetchOrders();
      newOrder.value = { range: '' };
      closeDroneSelectionModal();
    } else {
      console.error('Error creating order:', await response.text());
    }
  } catch (error) {
    console.error('Error creating order:', error);
  }
};

const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString();
};

let interval: number | undefined;

onMounted(() => {
  fetchOrders();
  interval = setInterval(fetchOrders, 30000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Order Management</h2>

    <!-- Create Order Form -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">Create New Order</h3>
      <form @submit.prevent="openDroneSelectionModal" class="space-y-4">
        <div>
          <label for="orderRange" class="block text-sm font-medium text-gray-700">Delivery Range (km)</label>
          <input v-model="newOrder.range" id="orderRange" type="number" step="0.1" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <button type="submit"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Create
          Order</button>
      </form>
    </div>

    <!-- Order List -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">Order List</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range (km)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.range }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.drone.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDateTime(order.startTime) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Drone Selection Modal -->
    <div v-if="showDroneSelectionModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">Select a Drone</h3>
        <div v-if="availableDrones.length > 0">
          <ul class="space-y-2">
            <li v-for="drone in availableDrones" :key="drone.id"
              class="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
              <span>{{ drone.name }} (Range: {{ drone.range }} km)</span>
              <button @click="selectDrone(drone)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Select</button>
            </li>
          </ul>
        </div>
        <div v-else class="text-center py-4">
          <p class="text-gray-600">No available drones for this order range.</p>
        </div>
        <button @click="closeDroneSelectionModal"
          class="mt-4 w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">Close</button>
      </div>
    </div>
  </div>
</template>
