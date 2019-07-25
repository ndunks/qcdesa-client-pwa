<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md4>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Daftar Quick Count</v-toolbar-title>
          </v-toolbar>
          <v-list-item
            @click="pilih(index, item)"
            v-for="(item, index) of list"
            :key="index"
          >
            <v-list-item-avatar>
              <v-icon v-if="item.fetched" v-text="item.statusIcon" :class="item.statusClass"></v-icon>
              <v-progress-circular v-else indeterminate> </v-progress-circular>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.status"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Home"
})
export default class Home extends Vue {
  list: any[] = [];
  created() {
    this.$api.listQuickcount().then(list => {
      this.list = list;
      list.forEach(this.fetch)
    })
  }
  statusIcon = {
      'Selesai': 'mdi-check-all',
      'Belum dimulai': 'mdi-alarm-off',
      'Sedang Berlangsung': 'mdi-alarm',
  }
  statusClass = {
      'Selesai': 'success',
      'Belum dimulai': 'grey',
      'Sedang Berlangsung': 'yellow',
  }
  fetch = (item, index, list) => {
      const url = `${this.$api.url}/public/${index}.json`;
      fetch(url).then(
          res => {
              console.log(res.status, res.statusText);
              if(res.status == 404){
                  throw "NOTTT FOUND";
                  
              }else{
                  const json:any = res.json();
                  this.$set(item,'status',json.finished ? 'Selesai' : 'Sedang Berlangsung');
              }
          }
      ).catch(
          error => {
              console.log('FEER', error);
              this.$set(item, 'status', 'Belum dimulai');
              
          }
      ).finally( () => {

          this.$set(item, 'statusIcon', this.statusIcon[ item.status ] );
          this.$set(item, 'statusClass', this.statusClass[ item.status ] );
          this.$set(item, 'fetched', true);
      })
  }
  pilih(index, item) {

  }

}
</script>