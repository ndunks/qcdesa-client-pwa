<template>
  <v-content>
    <Navbar back :color="color" :title="title" />
    <v-container grid-list-md>
      <v-layout v-if="vote" wrap>
        <v-flex xs12 sm6 md4 xl4>
          <v-card height="100%">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline"
                  >Perolehan Suara</v-list-item-title
                >
                <v-list-item-subtitle
                  >Diurutkan berdasarkan jumlah pemilih</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-list v-if="sortedResults.length">
              <v-list-item
                v-for="(item, index) of sortedResults"
                :key="item.number"
              >
                <v-list-item-avatar :color="color" class="white--text">
                  {{ index + 1 }}
                  <!-- <img v-if="item.image" :src="item.image" />
                <v-icon v-else>mdi-account</v-icon> -->
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar>
                  <v-icon
                    :v-show="!!item.move"
                    :color="item.moveColor"
                    v-text="item.move"
                  ></v-icon>
                  {{ item.count }}
                </v-list-item-avatar>
              </v-list-item>
            </v-list>
            <v-card-text v-else-if="status == ''" text-center>
              <v-progress-circular
                :color="color"
                indeterminate
              ></v-progress-circular>
            </v-card-text>
            <v-alert v-else :color="color" dark tile>Belum Tersedia</v-alert>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 md4 xl4>
          <v-card height="100%">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title
                  class="headline"
                  v-text="vote.name"
                ></v-list-item-title>
                <v-list-item-subtitle v-text="vote.desc"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-text>
              <v-layout align-center>
                <v-flex xs6 text-center>
                  <div
                    class="display-3"
                    v-text="result ? result.total : '?'"
                  ></div>
                  <div class="subtitle">Suara</div>
                </v-flex>
                <v-flex xs6 text-center>
                  <v-progress-circular
                    :rotate="180"
                    :size="120"
                    :width="15"
                    :value="percent"
                    :color="color"
                  >
                    {{ percent }}%
                  </v-progress-circular>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-list class="transparent">
              <v-list-item>
                <v-list-item-title>Status</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  <v-chip :color="color" v-text="status"></v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Dimulai</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  <v-chip :color="color" v-text="dimulai"></v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Jumlah Kandidat</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  <v-chip
                    :color="color"
                    v-text="vote.candidates.length"
                  ></v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 md4 xl4>
          <v-card height="100%">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline"
                  >Statistik</v-list-item-title
                >
                <v-list-item-subtitle
                  >Informasi perhitungan rinci</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-list>
              <v-list-item v-for="(item, index) in details" :key="index">
                <v-list-item-title>{{ index }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ item }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text>Lihat Log</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-layout wrap mt-5>
          <v-flex
            xs12
            sm6
            md4
            xl4
            v-for="item of sortedResults"
            :key="item.number"
          >
            <v-card>
              <v-img
                v-if="item.image"
                class="white--text"
                height="200px"
                :src="item.image"
              >
                <v-avatar :color="item.pos < 2 ? 'success' : color">{{
                  item.pos
                }}</v-avatar>
              </v-img>
              <v-card-title>
                {{ item.name }}
              </v-card-title>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Perolehan Suara</v-list-item-title>
                  <v-list-item-subtitle class="text-right">
                    <v-chip>{{ item.count }}</v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Peringkat</v-list-item-title>
                  <v-list-item-subtitle class="text-right">
                    <v-chip>{{ item.pos }}</v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Nomor Urut</v-list-item-title>
                  <v-list-item-subtitle class="text-right">
                    <v-chip>{{ item.number }}</v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-layout>
      <v-layout v-else align-center justify-center>
        <v-flex xs12 sm6 md4>
          <v-sheet dark :color="color" class="text-center pa-5 elevation-3">
            <v-progress-circular large indeterminate></v-progress-circular>
            <h1 class="title">Please Wait</h1>
          </v-sheet>
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
  sortedResults: any[] = []
  get dimulai() {
    return this.result ? new Date(this.result.started).toLocaleString() : '-'
  }
  get details() {
    const detail = {};
    if (this.result) {
      detail['Suara Sah'] = this.result.accepted;
      detail['Suara Tidak Sah'] = this.result.declined;
      detail['Suara Total'] = this.result.total;
    }
    detail['Total Pemilih'] = this.vote.participant;
    return detail;
  }
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
        return 'primary';
    }
  }
  get percent() {
    return (this.result ? (100 / this.vote.participant) * this.result.total : 0).toFixed(2);
  }
  created() {
    const id = parseInt(this.$route.params.id);
    this.$api.listQuickcount().then(list => {
      if (!list[id]) {
        return this.$router.push('/');
      }
      this.vote = list[id];

      this.results = this.vote.candidates.map((v, i) => {
        this.$set(v, 'count', '?');
        this.$set(v, 'pos', v.number);
        this.$set(v, 'move', '');
        this.$set(v, 'moveColor', '');

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
    const url = `${this.$api.url}/public/${this.$route.params.id}.json?${Date.now().toString(36)}=${Date.now().toString(36)}`;
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
              this.sortedResults = this.results.slice().sort((a, b) => b.count - a.count)
                .map((v, i) => {
                  // update position
                  v.move = (i + 1 == v.pos) ? '' : (i + 1 > v.pos ? 'mdi-arrow-down' : 'mdi-arrow-up');
                  v.moveColor = (i + 1 == v.pos) ? '' : (i + 1 > v.pos ? 'error' : 'success');
                  v.pos = i + 1;
                  return v;
                })
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