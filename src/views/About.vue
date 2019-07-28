<template>
  <v-content>
    <Navbar back title="About" />
    <v-container
      fluid
      :fill-height="$vuetify.breakpoint.smAndUp"
      :class="{ 'pa-0': $vuetify.breakpoint.xs }"
    >
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card :flat="$vuetify.breakpoint.xs" :tile="$vuetify.breakpoint.xs">
            <v-card-title primary-title>Aplikasi QuickCount</v-card-title>
            <v-card-text>
              Aplikasi QuickCount ini dibuat dengan tujuan untuk mendukung
              transparasi dalam proses pemilihan umum.
            </v-card-text>
            <v-card-text>
              <p>
                Kami tidak menjamin bahwa data yang kami sajikan 100% akurat,
                karena kesalahan input mungkin saja terjadi.
              </p>
              <p>
                Website ini hanya bersifat sebagai <i>referensi</i> dan
                keputusan hasil akhir tetap berada pada pihak penyelenggara.
              </p>
              <p>
                <b>Keluhan, Kritik dan Saran:</b>
                <a href="mailto:klampok.child@gmail.com">
                  klampok.child@gmail.com
                </a>
              </p>
            </v-card-text>
            <v-divider></v-divider>
            <ListSponsor />
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