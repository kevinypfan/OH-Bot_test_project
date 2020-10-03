<template>
  <v-progress-circular
    :size="50"
    color="primary"
    indeterminate
  ></v-progress-circular>
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
