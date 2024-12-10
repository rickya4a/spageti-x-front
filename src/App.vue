<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">SpagetiX Drone Management</h1>
    <nav class="mb-4">
      <router-link :to="{ name: 'drone-management' }" class="mr-4 text-blue-600 hover:text-blue-800"
        active-class="text-black hover:text-blue-800">
        Drones
      </router-link>
      <router-link :to="{ name: 'order-management' }" class="text-blue-600 hover:text-blue-800"
        active-class="text-black hover:text-blue-800">
        Orders
      </router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
