<template>
  <v-content>
    <Navbar back color="orange" title="Voter Access" />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm6 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="orange">
              <v-toolbar-title>Pilih QuickCount</v-toolbar-title>
            </v-toolbar>
            <v-list-item
              v-for="(item, index) of list"
              :key="index"
              @click="pilihQuickcount(index, item)"
            >
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
      <v-dialog v-model="dialogTps" max-width="290">
        <v-card>
          <v-card-title class="headline">Pilih TPS</v-card-title>
          <v-list>
            <v-list-item
              v-for="(item, index) of locations"
              :key="index"
              @click="pilihTps(index, item)"
            >
              <v-list-item-title v-text="item.name"> </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";

@Component({
  name: "VoterLogin",
  components: { Navbar }
})
export default class VoterLogin extends Vue {
  dialog: boolean = false;
  dialogTps: boolean = false;
  list: any[] = [];
  passcode = '';
  selectedIndex = -1;
  selectedTpsIndex = -1;

  get locations() {
    return this.selectedIndex >= 0 ? this.list[this.selectedIndex].locations : [];
  }

  created() {
    if (typeof (window['WebSocket']) != 'function') {
      alert('Perangkat anda tidak mendukung');
    }
    this.$api.listQuickcount().then(list => this.list = list)
  }

  pilihQuickcount(index, item) {
    this.selectedIndex = index;
    this.dialogTps = true;
  }

  pilihTps(index, item) {
    this.selectedTpsIndex = index;
    this.passcode = localStorage[`voter_${this.selectedIndex}_${this.selectedTpsIndex}`] || '';
    this.dialog = true;
  }
  submit() {
    this.$api.voterCheck(this.selectedIndex, this.selectedTpsIndex, this.passcode).then(
      res => {
        if (res.valid) {
          //save passcode
          localStorage[`voter_${this.selectedIndex}_${this.selectedTpsIndex}`] = this.passcode;
          this.$router.replace(`/voter/dash/${this.selectedIndex}/${this.selectedTpsIndex}`)
        } else {
          alert('Invalid passcode')
        }
      }
    ).catch(err => alert(err.message))
  }
}
</script>
