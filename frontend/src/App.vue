<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    // HelloWorld,
  },

  data: () => ({
    //
  }),
  async mounted() {
    const auth_token = window.localStorage.getItem("auth_token");
    if (auth_token && !this.$store.getters.isAuth) {
      const { data } = await this.$axios.get("/api/profile", {
        headers: { auth_token },
      });
      this.$store.commit("setUser", data);
    }
  },
};
</script>
