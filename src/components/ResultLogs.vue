<template>
  <v-dialog v-model="visible">
    <template #activator="{ on, value }">
      <v-btn v-on="on" text>Lihat Log</v-btn>
    </template>
    <v-card>
      <v-toolbar dense>
        <v-select :items="items" label="Pilih TPS" solo></v-select>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon style="float: right" @click="visible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="pa-0"> </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
@Component({
  name: 'ResultLogs'
})
export default class ResultLogs extends Vue {
  @Prop()
  locations: any[]

  get items(){
    return this.locations ? this.locations.map( v => v.name) : ['Loading..']
  }

  visible = false
  id = -1

  @Watch('visible')
  visibleChanged(cur, old) {
    console.log('Visible changed', cur);

  }

  mounted() {
    console.log('DISPLAYIT', this.$route.params);
    this.id = parseInt(this.$route.params.id)
  }
}
</script>
