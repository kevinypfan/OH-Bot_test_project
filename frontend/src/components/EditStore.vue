<template>
  <div>
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>新增店家</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="submitDialog(mode, store)"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-subheader>輸入內容並點擊儲存</v-subheader>
        <v-card-text>
          <form>
            <v-text-field
              v-model="store.name"
              label="店家名稱"
              required
            ></v-text-field>
            <v-text-field
              v-model="store.address"
              label="店家地址"
              required
            ></v-text-field>
            <v-text-field
              v-model="store.phone"
              label="店家電話"
              required
            ></v-text-field>
            <v-text-field
              v-model="store.principal"
              label="店家負責人"
              required
            ></v-text-field>
          </form>
        </v-card-text>

        <div style="flex: 1 1 auto"></div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    closeDialog: Function,
    store: Object,
    mode: String,
    submitDialog: Function,
  },
  data() {
    return {
      //   form: {
      //     name: "",
      //     address: "",
      //     phone: "",
      //     principal: "",
      //   },
    };
  },
  //   mounted() {
  //     console.log(this.store);
  //     this.form.name = this.store.name;
  //     this.form.address = this.store.address;
  //     this.form.phone = this.store.phone;
  //     this.form.principal = this.store.principal;
  //   },
};
</script>