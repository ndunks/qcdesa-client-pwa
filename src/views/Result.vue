<template>
  <v-content>
    <Navbar back :color="color" :title="title" />
    <v-container grid-list-md :class="{'pa-0': $vuetify.breakpoint.xs }">
      <v-layout v-if="ready" wrap>
        <v-flex xs12 sm6 md4 xl4>
          <v-card :flat="$vuetify.breakpoint.xs" :tile="$vuetify.breakpoint.xs" height="100%">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline">
                  Perolehan Suara
                </v-list-item-title>
                <v-list-item-subtitle>
                  Diurutkan berdasarkan jumlah pemilih
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <ResultBoard v-if="sortedResults.length" @click="candidateClick" :list="sortedResults"/>
            <v-card-text v-else-if="status == ''" class="text-center" >
              <v-progress-circular
                :color="color"
                large
                size="100"
                indeterminate
              ></v-progress-circular>
            </v-card-text>
            <v-alert v-else :color="color" dark tile>Belum Tersedia</v-alert>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 md4 xl4>
          <v-card :flat="$vuetify.breakpoint.xs" :tile="$vuetify.breakpoint.xs" height="100%">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title
                  class="headline"
                  v-text="name"
                ></v-list-item-title>
                <v-list-item-subtitle v-text="desc"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-text>
              <v-layout align-center>
                <v-flex xs6 text-center>
                  <div class="display-3" v-text="total || '?'"></div>
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
                <v-list-item-title style="flex-basis: auto">Dimulai</v-list-item-title>
                <v-list-item-subtitle style="flex-basis: auto" class="text-right">
                  <v-chip :color="color" v-text="startedDate"></v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title style="flex-basis: auto">Diupdate</v-list-item-title>
                <v-list-item-subtitle style="flex-basis: auto" class="text-right">
                  <v-chip :color="color" v-text="updatedDate"></v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Jumlah Kandidat</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  <v-chip :color="color" v-text="candidates.length"></v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 md4 xl4>
          <ResultDetail :details="details" />
        </v-flex>
        <v-flex xs12 sm6 md4 xl4>
          <v-card :flat="$vuetify.breakpoint.xs" :tile="$vuetify.breakpoint.xs">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline">
                  Ringkasan Setiap TPS
                </v-list-item-title>
                <v-list-item-subtitle>
                  Data pada setiap TPS
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list>
              <v-list-group
                v-for="item in locations"
                :key="item.name"
                no-action
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                    <v-list-item-subtitle
                      >Suara Masuk: {{ item.total }} ({{((100 / item.participant) * item.total).toFixed(2)}}%)</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text
                      ><v-chip :class="statusClass[item.status]">{{
                        item.status
                      }}</v-chip></v-list-item-action-text
                    >
                  </v-list-item-action>
                </template>
                <ResultBoard :list="item.sortedResults" @click="candidateClick" :locationName="item.name"/>
              </v-list-group>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout v-else align-center justify-center>
        <v-flex xs12 sm6 md4>
          <v-sheet :flat="$vuetify.breakpoint.xs" :tile="$vuetify.breakpoint.xs" dark :color="color" class="text-center pa-5 elevation-3">
            <v-progress-circular large indeterminate></v-progress-circular>
            <h1 class="title">Please Wait</h1>
          </v-sheet>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog ref="dialog" max-width="500" scrollable v-model="dialogVisible">
      <ResultCandidate v-bind="dialogData" @click="dialogVisible = false"/>
    </v-dialog>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";
//@ts-ignore
import ResultDetail from "@/components/ResultDetail.vue";
//@ts-ignore
import ResultBoard from "@/components/ResultBoard.vue";

@Component({
  name: "Result",
  components: { Navbar, ResultDetail, ResultBoard }
})
export default class Result extends Vue implements Vote, VoteResult<VoteCandidate & VoteReactive> {
  name: string = null as any
  desc: string = null as any
  hide?: boolean = undefined
  candidates: Array<VoteCandidate & VoteReactive> = []
  locations: Array<VoteLocation & VoteResult<VoteCandidate & VoteReactive>> = []
  started = 0
  startedDate = ''
  updated = 0
  updatedDate = ''
  status: VoteStatus = '' as any;

  accepted = 0
  declined = 0
  total = 0
  participant = 0
  // Computed after all Tps Result finish
  results: Array<VoteCandidate & VoteReactive> = []
  sortedResults: Array<VoteCandidate & VoteReactive> = []

  id = 0
  ready = false;
  _timer: number = 0;

  statusIcon: VoteStatusObj<string> = {
    'Selesai': 'mdi-check-all',
    'Belum Dimulai': 'mdi-alarm-off',
    'Dihitung': 'mdi-alarm',
  }
  statusClass: VoteStatusObj<string> = {
    'Selesai': 'success white--text',
    'Belum Dimulai': 'grey white--text',
    'Dihitung': 'warning white--text',
  }

  get details() {
    return {
      'Total TPS': this.locations.length,
      'Total Pemilih': this.participant,
      'Suara Sah': this.accepted,
      'Suara Tidak Sah': this.declined,
      'Suara Total': this.total,
    }
  }

  get title() {
    return this.status ? `${this.name}: ${this.status}` : this.name;
  }
  get color() {
    switch (this.status) {
      case 'Selesai':
        return 'success';
      case 'Belum Dimulai':
        return 'grey';
      case 'Dihitung':
        return 'warning';
      default:
        return 'primary';
    }
  }
  get percent() {
    return ((100 / this.participant) * this.total).toFixed(2);
  }
  @Watch('status')
  statusChanged(cur, old) {
    console.log('StatusCHanged', cur, old);

  }
    dialogVisible = false;
  dialogData = {
    item: {},
    locationName: null as any,
    locations: null as any
  };

  candidateClick( item, locationName? ){
    console.log('candidateClick', item, locationName);
    this.dialogData.item = item;
    if( locationName ){
      this.dialogData.locationName = locationName;
      this.dialogData.locations = null;
    }else{
      this.dialogData.locationName = 'Total';
      this.dialogData.locations = this.locations;
    }
    this.$nextTick( () => this.dialogVisible = true )
  }
  getDate(field: 'updated' | 'started', getMax = false): string {
    let hasValues;
    if (this.locations && (hasValues = this.locations.filter(v => !isNaN(v[field]) && v[field] > 0 )).length) {
      // find minimum or maximum of
      const found = hasValues.reduce(
        (val, v) => (getMax ?
          (val < (v[field] as number)) :
          (val > (v[field] as number))
        ) ? v[field] as number : (val || v[field]),
        null
      );
      this[field] = found;
      return new Date(found).toLocaleString()
    }
    return '-' as any;
  }
  created() {
    this.id = parseInt(this.$route.params.id);
    this.$api.listQuickcount().then(list => {
      if (!list[this.id]) {
        return this.$router.push('/');
      }
      const vote = list[this.id];
      vote.id = this.id
      // Set all property from vote, skip some getter
      for (let f in vote) {
        this[f] = vote[f];
      }
      // result total on all TPS
      this.candidates.forEach((v, i) => {
        v.id = i;
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
        loc.id = ii;
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
          this.$set(locRes.results, i, {});
          for (let f in v) {
            this.$set(locRes.results[i], f, v[f]);
          }
        })
        this.participant += loc.participant;
      })
      this.ready = true;
      this.$nextTick(() => {
        console.log('Tick Load results');
        this.loadResult();
      })
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
      // Determine the most stats, if all 'Selesai' or 'Belum Dihitung' mean it,
      // if status is mixed, mean Dihitung,
      this.status = (Object.keys(allStatus) as VoteStatus[])
        .reduce(
          (cur, v, i) => allStatus[v] == this.locations.length ? v : cur,
          'Dihitung' as VoteStatus
        );

      this.accepted = this.locations.reduce((sum, v) => sum + v.accepted, 0);
      this.declined = this.locations.reduce((sum, v) => sum + v.declined, 0);
      this.total = this.accepted + this.declined;
      this.startedDate = this.getDate('started')
      this.updatedDate = this.getDate('updated', true)
      this.candidates.forEach((v, i) => {
        v.count = this.locations.reduce(
          (sum, loc, ii) => sum + (isNaN(loc.results[i].count) ? 0 : loc.results[i].count)
          , 0)
      })
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
  loadTps(): Promise<VoteStatusObj> {
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
                json.results.forEach((v, i) => tps.results[i].count = v);
                // results is changed with object, dont clone it!
                delete json.results;
                for (let field in json) {
                  tps[field] = json[field];
                }
                // Map the result
                tps.status = json.finished ? 'Selesai' : 'Dihitung';
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
              'Dihitung': 0,
              'Belum Dimulai': 0
            } as VoteStatusObj<number>)
            resolve(allStatus)
          }
        }).catch(e => console.log(e.message))
      }
    })
  }

  static sortResults = function (this: VoteResult<VoteCandidate & VoteReactive>) {
    //this.results.forEach((v, i) => this.results[i].count = v.count);
    this.sortedResults = this.results.slice().sort((a, b) => b.count - a.count)
      .map((v, i) => {
        // update position
        if( this.status != 'Belum Dimulai' ) {
          v.move = (i + 1 == v.pos) ? '' : (i + 1 > v.pos ? 'mdi-arrow-down' : 'mdi-arrow-up');
          v.moveColor = (i + 1 == v.pos) ? '' : (i + 1 > v.pos ? 'error' : 'success');
          v.pos = i + 1;
        }
        return v;
      })

  }

}
</script>