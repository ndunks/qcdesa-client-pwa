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
  resultData: any = null;
  status: string = '';

  get results() {
    if (!this.vote) {
      return [];
    }

    let res = this.vote.candidates;
    if (this.resultData) {
      this.resultData.results.forEach((v, i) => {
        res[i] = { ...res[i], ...v }
      })
    } else {
      res.forEach(v => v.count = '?');
    }

    return res;
  }

  created() {
    const id = parseInt(this.$route.params.id);

    this.$api.listQuickcount().then(list => {
      if (list[id]) {
        this.vote = list[id];
        this.fetch();
      } else {
        alert('Not Found')
      }
    })
  }

  fetch() {
    const id = parseInt(this.$route.params.id);
    const url = `${this.$api.url}/public/${id}.json`;
    fetch(url).then(
      res => {
        console.log(res.status, res.statusText);
        if (res.status == 404) {
          this.status = 'Belum dimulai';
        } else {
          this.resultData = res.json();
          this.status = this.resultData.finished ? 'Selesai' : 'Sedang Berlangsung';
        }
      }
    ).catch(console.error)
  }

}
</script>