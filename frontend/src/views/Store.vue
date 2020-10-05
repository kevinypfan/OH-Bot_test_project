<template>
  <div class="store">
    <v-row align-content="center" justify="center">
      <v-col cols="9"
        ><v-text-field
          label="店家名稱關鍵字搜尋"
          outlined
          solo
          rounded
          dense
          v-model="searchTerm"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="2" v-if="$store.getters.isAuth">
        <v-btn-toggle v-model="toggleExclusive">
          <v-btn> 顯示全部店家 </v-btn>

          <v-btn> 屬於我的店家 </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <div class="store-list" v-if="filterStoreByTerm">
      <template v-for="item in filterStoreByTerm">
        <div class="card my-1" :key="item.id_store">
          <CardTile
            :store="item"
            :editStore="editDiglogHandler"
            :deleteStore="deleteDiglogHandler"
          />
        </div>
      </template>
    </div>
    <v-btn
      class="mx-2"
      fab
      dark
      color="indigo"
      fixed
      right
      bottom
      v-if="$store.getters.isAuth"
      @click="openNewStoreDialogHandler"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>
    <EditStore
      :dialog="editDialog"
      :closeDialog="closeDialogHandler"
      :store="selectedStoreForm"
      :mode="dialogMode"
      :submitDialog="submitDialogHandler"
    />
    <v-dialog v-model="deleteConfirmDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"> 刪除確認 </v-card-title>
        <v-card-text>
          <p>請確定是否要刪除店家名稱：{{ selectedStoreForm.name }}。</p>
          <p>注意刪除後將無法復原。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="deleteConfirmDialog = false"
          >
            取消</v-btn
          >
          <v-btn color="green darken-1" text @click="deleteDialogHandler">
            刪除</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor" right top>
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import CardTile from "../components/CardTile";
import EditStore from "../components/EditStore";

const storeInitForm = {
  name: "",
  address: "",
  phone: "",
  principal: "",
};

export default {
  data() {
    return {
      snackbar: false,
      snackbarColor: "error",
      snackbarText: "Something wrong",
      toggleExclusive: 0,
      searchInput: "",
      editDialog: false,
      dialogMode: null,
      selectedStoreId: null,
      selectedStoreForm: storeInitForm,
      stores: null,
      deleteConfirmDialog: false,
      searchTerm: "",
    };
  },
  components: { CardTile, EditStore },
  mounted() {
    this.loadStores();
  },
  computed: {
    filterStoreByTerm() {
      if (!this.stores) return null;
      return this.stores.filter((store) => {
        return store.name.indexOf(this.searchTerm) > -1;
      });
    },
  },
  methods: {
    async loadStores() {
      try {
        let requestUrl =
          '/api/stores?filter={"include": [{"relation": "user"}],"order":["id_store DESC"]}';
        if (this.toggleExclusive === 1) {
          requestUrl = `/api/stores?filter={"where": {"id_user": "${this.$store.state.user.id_user}"},"include": [{"relation": "user"}],"order":["id_store DESC"]}`;
        }
        const { data } = await this.$axios.get(requestUrl);
        this.stores = data;
      } catch (error) {
        console.log(error);
      }
    },
    openNewStoreDialogHandler() {
      this.editDialog = true;
      this.dialogMode = "NEW";
    },
    editDiglogHandler(storeId, store) {
      console.log({ storeId, store });
      this.selectedStoreId = storeId;
      this.selectedStoreForm.name = store.name;
      this.selectedStoreForm.address = store.address;
      this.selectedStoreForm.phone = store.phone;
      this.selectedStoreForm.principal = store.principal;
      this.dialogMode = "EDIT";
      this.editDialog = true;
    },
    deleteDiglogHandler(storeId, store) {
      this.selectedStoreId = storeId;
      this.selectedStoreForm.name = store.name;
      this.selectedStoreForm.address = store.address;
      this.selectedStoreForm.phone = store.phone;
      this.selectedStoreForm.principal = store.principal;
      this.deleteConfirmDialog = true;
    },
    async deleteDialogHandler() {
      try {
        await this.$axios.delete("/api/stores/" + this.selectedStoreId, {
          headers: { auth_token: window.localStorage.getItem("auth_token") },
        });
        this.snackbar = true;
        this.snackbarColor = "success";
        this.snackbarText = "已成功刪除";
        this.deleteConfirmDialog = false;
        this.loadStores();
      } catch (error) {
        this.snackbar = true;
        this.snackbarColor = "error";
        this.snackbarText = error.response.data.error.message;
      }
    },
    async submitDialogHandler(mode, payload) {
      if (mode === "NEW") {
        try {
          await this.$axios.post("/api/stores", payload, {
            headers: { auth_token: window.localStorage.getItem("auth_token") },
          });
          this.snackbar = true;
          this.snackbarColor = "success";
          this.snackbarText = "已成功新增";
          this.closeDialogHandler();
          this.loadStores();
        } catch (error) {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarText = error.response.data.error.message;
        }
      } else if (mode === "EDIT") {
        try {
          await this.$axios.patch(
            "/api/stores/" + this.selectedStoreId,
            payload,
            {
              headers: {
                auth_token: window.localStorage.getItem("auth_token"),
              },
            }
          );
          this.snackbar = true;
          this.snackbarColor = "success";
          this.snackbarText = "已成功編輯";
          this.closeDialogHandler();
          this.loadStores();
        } catch (error) {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarText = error.response.data.error.message;
        }
      } else {
        console.log("no support");
      }
    },
    closeDialogHandler() {
      this.editDialog = false;
      this.selectedStoreForm = storeInitForm;
    },
  },
  watch: {
    toggleExclusive() {
      this.loadStores();
    },
  },
};
</script>
