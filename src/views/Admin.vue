<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-card-title>
                <v-toolbar-title>Administrator Access</v-toolbar-title>
              </v-card-title>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="passcode"
                    label="Passcode"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Admin"
})
export default class Admin extends Vue {
  passcode = ''
  mounted() {

  }
  submit(){
    
  }
}
</script>