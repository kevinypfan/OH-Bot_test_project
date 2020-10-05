<template>
  <v-card class="mx-auto" dark>
    <v-card-title>
      <v-icon large left> mdi-office-building-outline </v-icon>
      <span class="title font-weight-light">{{ store.name }}</span>
      <v-spacer></v-spacer>
      <v-menu offset-y v-if="$store.getters.isAuth">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="editStore(store.id_store, store)">
            <v-list-item-title> 修改 </v-list-item-title>
          </v-list-item>
          <v-list-item @click="deleteStore(store.id_store, store)">
            <v-list-item-title> 刪除 </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text>
      <div class="text-subtitle-1">
        <p>
          店家地址：
          <a :href="'https://maps.google.com/maps?q=' + store.address">
            {{ store.address }}
          </a>
        </p>
        <p>
          店家電話： <a :href="'tel:' + store.phone">{{ store.phone }}</a>
        </p>
        <p>店家負責人： {{ store.principal }}</p>
      </div>
      <!-- "Turns out semicolon-less style is easier and safer in TS because most
      gotcha edge cases are type invalid as well." -->
    </v-card-text>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img class="elevation-6" :src="store.user.picture"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ store.user.name }}</v-list-item-title>
        </v-list-item-content>

        <!-- <v-row align="center" justify="end">
          <v-icon class="mr-1">mdi-heart</v-icon>
          <span class="subheading mr-2">256</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">mdi-share-variant</v-icon>
          <span class="subheading">45</span>
        </v-row> -->
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    store: Object,
    editStore: Function,
    deleteStore: Function,
  },
  data: () => ({}),
  methods: {
    btnClick() {
      console.log("hello");
    },
  },
};
</script>
