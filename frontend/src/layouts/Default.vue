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
      <template v-if="!$store.state.user">
        <v-btn
          text
          @click="loginHandler"
          v-for="(value, key) in oauthUrls"
          :key="key"
        >
          <span class="font-weight-bold text-body-1">{{ key }} 登入</span>
        </v-btn>
      </template>

      <v-menu open-on-hover offset-y v-else>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-avatar size="36">
              <img
                :src="$store.state.user.picture"
                :alt="$store.state.user.name"
              />
            </v-avatar>
            <span class="ml-3 font-weight-bold text-body-1"
              >Hi! {{ $store.state.user.name }}</span
            >
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="logoutHandler">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- <div class="profile-block" v-else>
        <v-avatar size="36">
          <img :src="$store.state.user.picture" :alt="$store.state.user.name" />
        </v-avatar>
        <span class="mx-3 font-weight-bold text-body-1"
          >Hi! {{ $store.state.user.name }}</span
        >
      </div> -->
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      oauthUrls: null,
    };
  },
  mounted() {
    // console.log(process.env.VUE_APP_LINE_LOGIN_URI);
    this.loadOauthUrls();
  },
  methods: {
    async loadOauthUrls() {
      const { data } = await this.$axios.get("/api/oauth-urls");
      this.oauthUrls = data;
    },
    loginHandler() {
      window.location.href = process.env.VUE_APP_LINE_LOGIN_URI;
    },
    logoutHandler() {
      this.$axios
        .delete("/api/logout", {
          headers: { auth_token: window.localStorage.getItem("auth_token") },
        })
        .then((result) => {
          window.localStorage.clear();
          console.log("logout ok: ", result);
          this.$store.commit("setUser", null);
          this.$router.replace("/");
        })
        .catch((err) => {
          console.log("logout error: ", err);
        });
    },
  },
};
</script>
