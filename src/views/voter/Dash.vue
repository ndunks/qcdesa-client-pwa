<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md4>
        <v-card class="elevation-12">
          <v-toolbar>
            <v-toolbar-title>Vote List</v-toolbar-title>

            <v-spacer></v-spacer>
            <VoteAddDialog @save="save" @click="selectedIndex = -1" v-bind="selected" />
          </v-toolbar>
          <v-list-item v-for="(item, index) of list" :key="index">
            <v-list-item-content @click="selectedIndex = index">
              <v-list-item-title>{{item.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VoteAddDialog from "@/components/VoteAddDialog.vue";

@Component({
  name: "AdminDash",
  components: { VoteAddDialog }
})
export default class AdminDash extends Vue {
  id: number = -1;
  item = null;

  mounted() {
    this.id = parseInt( this.$route.params['id'] );
    this.$api.listQuickcount().then(list => this.item = list[this.id]);
  }
}
</script>
