<template>
  <div class="default-layout">
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn text @click="loginHandler">
        <span>登入</span>
        <!-- <v-icon>mdi-open-in-new</v-icon> -->
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
      <v-btn class="mx-2" fab dark color="indigo" fixed right bottom>
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </v-main>
  </div>
</template>
<script>
export default {
  mounted() {
    // console.log(process.env.VUE_APP_LINE_LOGIN_URI);
  },
  methods: {
    loginHandler() {
      console.log("login btn clicked");
      window.location.href = process.env.VUE_APP_LINE_LOGIN_URI;
    },
  },
};
</script>
