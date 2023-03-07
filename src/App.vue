<template>
  <!-- <FetchAllLeads /> -->
  <Dashboard />
</template>

<script>
// import FetchAllLeads from './components/FetchAllLeads.vue'
import Dashboard from '@/components/Dashboard';


export default {
  name: 'App',
  components: {
    // FetchAllLeads,
    Dashboard
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
