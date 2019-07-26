<template>
  <v-content>
    <Navbar back title="About" />
    <v-container fluid grid-list-md>
      <v-layout align-center justify-center>
        <v-flex xs12 sm6 md4>
          <v-card>
            <v-card-title>About Pilkades QuickCount</v-card-title>
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
  name: "About",
  components: { Navbar }
})
export default class About extends Vue {
}
</script>