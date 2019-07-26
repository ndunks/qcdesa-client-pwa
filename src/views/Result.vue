<template>
  <v-content>
    <Navbar back :color="color" :title="title" />
    <v-container fluid grid-list-md>
      <v-layout v-if="!vote" align-center justify-center>
        <v-flex xs12 sm6 md4>
          <v-sheet dark color="primary" class="text-center pa-5 elevation-3">
            <v-progress-circular large indeterminate></v-progress-circular>
            <h1 class="title">Please Wait</h1>
          </v-sheet>
        </v-flex>
      </v-layout>
      <v-layout v-else>
        <v-flex xs12 sm6 md4>
          <v-card>
            <v-card-title>Detail QuickCount</v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 md4>
          <v-card>
            <v-card-title>Perolehan Suara</v-card-title>
            <v-list-item v-for="(item, index) of results" :key="index">
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
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { setInterval, clearTimeout, setTimeout } from 'timers';
import Navbar from "@/components/Navbar.vue";

@Component({
  name: "Result",
  components: { Navbar }
})
export default class Result extends Vue {
  vote: any = null;
  result: any = null;
  results: any[] = [];
  status: string = '';

  _timer: number = 0;


  get title() {
    return this.vote ? `${this.vote.name}: ${this.status}` : this.status;
  }
  get color() {
    switch (this.status) {
      case 'Selesai':
        return 'success';
      case 'Belum dimulai':
        return 'grey';
      case 'Sedang Berlangsung':
        return 'warning';
      default:
        return null;
    }
  }

  created() {
    const id = parseInt(this.$route.params.id);
    this.$api.listQuickcount().then(list => {
      if (!list[id]) {
        return this.$router.push('/');
      }
      this.vote = list[id];

      this.results = this.vote.candidates.map(v => {
        this.$set(v, 'count', '?');
        return v;
      })

      this.loadResult();
    })
  }
  beforeDestroy() {
    console.log('Destry call');

    clearTimeout(this.$data._timer);
    this.$data._timer = undefined;
  }
  loadResult() {
    const url = `${this.$api.url}/public/${this.$route.params.id}.json`;
    return fetch(url).then(
      res => {
        if (res.status == 404) {
          this.status = 'Belum dimulai';
        } else {
          return res.json().then(
            result => {
              this.result = result;
              this.status = this.result.finished ? 'Selesai' : 'Sedang Berlangsung';
              this.result.results.forEach((v, i) => this.results[i].count = v);
            }
          );

        }
      }
    ).then(() => {
      // Runtime
      if (typeof (this.$data._timer) == 'undefined') {
        return;
      }
      this.$data._timer = setTimeout(() => {
        this.loadResult()
      }, 10000
      );

    }).catch(console.error)
  }

}
</script>