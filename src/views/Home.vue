<template>
  <v-content>
    <Navbar />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card>
            <v-card-title primary-title>
              Daftar Quick Count
            </v-card-title>
            <v-list>
              <v-list-item
                :to="'/result/' + index"
                v-for="(item, index) of list"
                :key="index"
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
  list: any[] = [];
  created() {
    this.$api.listQuickcount().then(list => {
      this.list = list.filter(v => !v.hide);
      list.forEach(this.fetch)
    })
  }
  statusIcon = {
    'Selesai': 'mdi-check-all',
    'Belum dimulai': 'mdi-alarm-off',
    'Sedang Berlangsung': 'mdi-alarm',
  }
  statusClass = {
    'Selesai': 'success white--text',
    'Belum dimulai': 'grey white--text',
    'Sedang Berlangsung': 'warning white--text',
  }
  fetch = (item, index, list) => {
    let fetchedTps = 0;
    for (let tpsId in item.locations) {
      const tps = item.locations[tpsId];
      fetch(`${this.$api.url}/public/${index}-${tpsId}.json`).then(
        res => {
          if (res.status == 404) {
            this.$set(tps, 'status', 'Belum dimulai');
          } else {
            res.json().then(
              json => {
                this.$set(tps, 'status', json.finished ? 'Selesai' : 'Sedang Berlangsung');
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
    const allStatus = item.locations.reduce((all, c) => {
      all[c.status]++;
      return all;
    }, {
        'Selesai': 0, 'Sedang Berlangsung': 0, 'Belum dimulai': 0
      })

    this.$set(item, 'status', Object.keys(allStatus)
      .reduce(
        (cur, v, i) => allStatus[v] == item.locations.length ? v : cur,
        'Sedang Berlangsung'));
    this.$set(item, 'statusIcon', this.statusIcon[item.status]);
    this.$set(item, 'statusClass', this.statusClass[item.status]);
    this.$set(item, 'allStatus', allStatus);
    this.$set(item, 'fetched', true);
  }
}
</script>