<template>
  <v-container fluid fill-height>
    <v-layout v-if="!vote" align-center justify-center>
      <v-flex xs12 sm6 md4>
        <v-sheet dark color="primary" class="text-center pa-3 elevation-3">
            <v-progress-circular large indeterminate></v-progress-circular>
            <h1 class="title">Please Wait</h1>
        </v-sheet>
      </v-flex>
    </v-layout>
    <v-layout v-else align-center justify-center>
      <v-flex xs12 sm6 md4>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title v-text="vote.name"></v-toolbar-title>
          </v-toolbar>
          <v-list-item
            @click="pilih(index, item)"
            v-for="(item, index) of results"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar>
              {{ item.count }}
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Result"
})
export default class Result extends Vue {
  vote: any = null;
  status: string = '';

  get results() {
      return this.vote ? this.vote.results : [];
  }

  created() {
    const id = parseInt(this.$route.params.id);
    const url = `${this.$api.url}/public/${id}.json`;
    fetch(url).then(
      res => {
        console.log(res.status, res.statusText);
        if (res.status == 404) {
          this.status = 'Belum dimulai';
        } else {
          this.vote = res.json();
          this.status = this.vote.finished ? 'Selesai' : 'Sedang Berlangsung';
        }
      }
    ).catch(console.error)
  }

}
</script>