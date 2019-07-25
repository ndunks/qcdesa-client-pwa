<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Pilih QuickCount</v-toolbar-title>
          </v-toolbar>
          <v-list-item v-for="(item, index) of list" :key="index" @click="pilih(index, item)">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Passcode</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="passcode"
              label="Passcode"
              autocomplete
              type="password"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "VoterLogin"
})
export default class VoterLogin extends Vue {
  dialog: boolean = false;
  list: any[] = [];
  passcode = '';
  selectedIndex = -1;
  created() {
    if( typeof(window['WebSocket']) != 'function' ){
      alert('Perangkat anda tidak mendukung');
    }
    this.$api.listQuickcount().then(list => this.list = list)
  }

  pilih(index, item) {
    this.selectedIndex = index;
    this.passcode = localStorage[`voter_${this.selectedIndex}`] || '';
    this.dialog = true;
  }
  submit() {
    this.$api.voterCheck(this.selectedIndex, this.passcode).then(
      res => {
        if (res.valid) {
          //save passcode
          localStorage[`voter_${this.selectedIndex}`] = this.passcode;
          this.$router.replace(`/voter/dash/${this.selectedIndex}`)
        } else {
          alert('Invalid passcode')
        }
      }
    ).catch(err => alert(err.message))
  }
}
</script>
