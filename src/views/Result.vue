<template>
  <v-content>
    <Navbar back :color="color" :title="title" />
    <v-container grid-list-md>
      <v-layout v-if="ready" wrap>
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
export default class Result extends Vue implements Vote, VoteResult<VoteCandidate & VoteReactive> {
  name: string = null as any
  desc: string = null as any
  candidates: Array<VoteCandidate & VoteReactive> = null as any
  locations: Array<VoteLocation & VoteResult<VoteCandidate & VoteReactive>> = null as any

  status: VoteStatus = null as any;
  started = 0
  accepted = 0
  declined = 0
  total = 0
  updated = 0
  participant = 0
  // Computed after all Tps Result finish
  results: Array<VoteCandidate & VoteReactive> = []
  sortedResults: Array<VoteCandidate & VoteReactive> = []
  
  id = 0
  ready = false;
  _timer: number = 0;
  get dimulai() {
    return this.started ? new Date(this.started).toLocaleString() : '-'
  }

  details = {
    'Total Pemilih': 0,
    'Suara Sah': 0,
    'Suara Tidak Sah': 0,
    'Suara Total': 0,
  }

  get title() {
    return this.name ? `${this.name}: ${this.status}` : this.status;
  }
  get color() {
    switch (this.status) {
      case 'Selesai':
        return 'success';
      case 'Belum Dimulai':
        return 'grey';
      case 'Sedang Berlangsung':
        return 'warning';
      default:
        return 'primary';
    }
  }
  get percent() {
    return ((100 / this.participant) * this.total).toFixed(2);
  }

  created() {
    this.id = parseInt(this.$route.params.id);
    this.$api.listQuickcount().then(list => {
      if (!list[this.id]) {
        return this.$router.push('/');
      }
      const vote = list[this.id];
      // Set all property from vote
      for (let field in vote) {
        this[field] = vote[field];
      }
      // result total on all TPS
      this.candidates.forEach((v, i) => {
        this.$set(v, 'count', '?');
        this.$set(v, 'pos', v.number);
        this.$set(v, 'move', '');
        this.$set(v, 'moveColor', '');
      })

      // Candidate and result are combined
      this.results = this.candidates;

      this.locations.forEach((loc: VoteLocation, ii) => {
        if (typeof (loc.participant) == 'string') {
          loc.participant = parseInt(loc.participant);
        }

        this.$set(loc, 'started', 0)
        this.$set(loc, 'accepted', 0)
        this.$set(loc, 'declined', 0)
        this.$set(loc, 'total', 0)
        this.$set(loc, 'results', [])
        this.$set(loc, 'updated', 0)

        this.$set(loc, 'status', null)
        this.$set(loc, 'sortedResults', []);
        const locRes = loc as VoteLocation & VoteResult<VoteCandidate & VoteReactive>;
        // Clone all candidate to loc resuts
        this.candidates.forEach((v, i) => {
          for (let f in v) {
            this.$set(locRes.results[i], f, v[f]);
          }
        })
        this.details['Total Pemilih'] += loc.participant;
      })
      this.ready = true;
      this.loadResult();
    })
  }
  beforeDestroy() {
    clearTimeout(this.$data._timer);
    this.$data._timer = undefined;
  }
  /** Runtime */
  loadResult() {
    if (this.status == 'Selesai') {
      console.log('Status selesain, runtime checker off');
      return;
    }
    this.loadTps().then((allStatus: VoteStatusObj<number>) => {
      console.log('resolved', allStatus);
      // Determine the most stats, if all 'Selesai' or 'Belum Berjalan' mean it,
      // if status is mixed, mean Sedang Berlangsung,
      this.status = (Object.keys(allStatus) as VoteStatus[])
        .reduce(
          (cur, v, i) => allStatus[v] == this.locations.length ? v : cur,
          'Sedang Berlangsung' as VoteStatus
        );

      this.started = this.locations.reduce(
        (min, v) => min > v.started ? v.started : min,
        this.locations[0].started);
      this.updated = this.locations.reduce(
        (max, v) => max < v.updated ? v.updated : max,
        this.locations[0].updated);

      this.accepted = this.locations.reduce((sum, v) => sum + v.accepted, 0);
      this.declined = this.locations.reduce((sum, v) => sum + v.declined, 0);
      this.total = this.accepted + this.declined;
      Result.sortResults.call(this)
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
  async loadTps(): Promise<VoteStatusObj> {
    return new Promise((resolve, reject) => {
      let fetchedTps = 0;
      const uniq = `${Date.now().toString(36)}=${Date.now().toString(36)}`;
      for (let tpsId in this.locations) {
        const url = `${this.$api.url}/public/${this.id}-${tpsId}.json?` + uniq;
        const tps = this.locations[tpsId];
        fetch(url).then(async (res) => {
          if (res.status < 400) {
            await res.json().then(
              (json: VoteResultRaw<number>) => {
                for (let field in json) {
                  tps[field] = json[field];
                }
                tps.status = json.finished ? 'Selesai' : 'Sedang Berlangsung';
                Result.sortResults.call(tps);
              }
            );
          } else {
            tps.status = 'Belum Dimulai';
          }
          if (++fetchedTps == this.locations.length) {
            // Sumarize all status on all TPS
            const allStatus: VoteStatusObj<number> = this.locations.reduce((all, c) => {
              all[c.status as VoteStatus]++;
              return all;
            }, {
              'Selesai': 0,
              'Sedang Berlangsung': 0,
              'Belum Dimulai': 0
            } as VoteStatusObj<number>)
            resolve(allStatus)
          }
        }).catch(e => console.log(e.message))
      }
    })
  }

  async onAllTpsLoaded() {

  }


  static sortResults = function (this: VoteResult<VoteCandidate & VoteReactive>) {
    //this.results.forEach((v, i) => this.results[i].count = v.count);
    this.sortedResults = this.results.slice().sort((a, b) => b.count - a.count)
      .map((v, i) => {
        // update position
        v.move = (i + 1 == v.pos) ? '' : (i + 1 > v.pos ? 'mdi-arrow-down' : 'mdi-arrow-up');
        v.moveColor = (i + 1 == v.pos) ? '' : (i + 1 > v.pos ? 'error' : 'success');
        v.pos = i + 1;
        return v;
      })

  }

}
</script>