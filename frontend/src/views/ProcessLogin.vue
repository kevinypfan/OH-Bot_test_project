<template>
  <div class="text-center mt-5">
    <v-progress-circular :size="50" color="primary" indeterminate>
    </v-progress-circular>
  </div>
</template>
<script>
export default {
  async mounted() {
    window.localStorage.setItem("auth_token", this.$route.query.token);
    const { data } = await this.$axios.get("/api/profile", {
      headers: { auth_token: this.$route.query.token },
    });
    console.log(data);
    this.$store.commit("setUser", data);
    this.$router.replace("/store");
  },
};
</script>
