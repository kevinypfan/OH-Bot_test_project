<template>
  <div class="store">
    <template v-for="i in 10">
      <div class="card my-1" :key="i">
        <CardTile />
      </div>
    </template>
  </div>
</template>
<script>
import CardTile from "../components/CardTile";
export default {
  components: { CardTile },
};
</script>
