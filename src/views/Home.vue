<template>
  <v-content>
    <Navbar app />
    <v-container fluid :fill-height="$vuetify.breakpoint.smAndUp" :class="{'pa-0': $vuetify.breakpoint.xs }">
      <v-layout justify-center class="pt-2">
        <v-flex xs12 sm8 md6>
          <v-card :flat="$vuetify.breakpoint.xs"  :tile="$vuetify.breakpoint.xs">
            <v-card-title primary-title>
              Daftar Quick Count
            </v-card-title>
            <v-list>
              <v-list-item
                v-for="(item, index) of list"
                :key="index"
                :to="'/result/' + item.id"
              >
                <v-list-item-avatar>
                  <v-icon
                    v-show="item.fetched"
                    v-text="item.statusIcon"
                    :class="item.statusClass"
                  ></v-icon>
                  <v-progress-circular v-show="!item.fetched" indeterminate>
                  </v-progress-circular>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="item.status"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
          <v-card class="pt-5" flat color="transparent">
            <ListSponsor hide="true" />
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";

@Component({
  name: "Home",
  components: { Navbar }
})
export default class Home extends Vue {
  //$set:(target: Object, field: 'status', value: VoteStatus) => VoteStatus
  list: any[] = [];
  created() {
    this.$api.listQuickcount().then(list => {
      this.list = list.filter((v, index) => {
        v.id = index
        return !v.hide
      });
      list.forEach(this.fetch)
    })
  }
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

  fetch = (item, index, list) => {
    let fetchedTps = 0;
    for (let tpsId in item.locations) {
      const tps = item.locations[tpsId];
      fetch(`${this.$api.url}/public/${index}-${tpsId}.json`).then(
        res => {
          if (res.status == 404) {
            this.$set<VoteStatus>(tps, 'status', 'Belum Dimulai');
          } else {
            res.json().then(
              json => {
                this.$set<VoteStatus>(tps, 'status', json.finished ? 'Selesai' : 'Dihitung');
              }
            );
          }
        }
      ).finally(() => {
        this.$set(tps, 'statusIcon', this.statusIcon[tps.status]);
        this.$set(tps, 'statusClass', this.statusClass[tps.status]);
        this.$set(tps, 'fetched', true);
        if (++fetchedTps == item.locations.length) {
          this.onAllTpsFetched(item);
        }
      })
    }
  }

  onAllTpsFetched(item) {
    const allStatus: VoteStatusObj<number> = item.locations.reduce((all, c) => {
      all[c.status]++;
      return all;
    }, {
      'Selesai': 0,
      'Dihitung': 0,
      'Belum Dimulai': 0
    } as VoteStatusObj<number>)

    this.$set<VoteStatus>(item, 'status', (Object.keys(allStatus) as VoteStatus[])
      .reduce(
        (cur: VoteStatus, v: VoteStatus, i) => allStatus[v] == item.locations.length ? v : cur,
        'Dihitung' as VoteStatus)
    );
    this.$set(item, 'statusIcon', this.statusIcon[item.status]);
    this.$set(item, 'statusClass', this.statusClass[item.status]);
    this.$set(item, 'allStatus', allStatus);
    this.$set(item, 'fetched', true);
  }
}
</script>