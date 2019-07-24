<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md4>
        <v-card class="elevation-12">
          <v-card-title>
            <v-toolbar-title>Administrator Access</v-toolbar-title>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="passcode"
                label="Passcode"
                autocomplete
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "AdminLogin"
})
export default class AdminLogin extends Vue {
  passcode = '';
  mounted() {

  }
  submit() {
    console.log('Checkpasscode', this.passcode);
    this.$api.send('POST', 'admin', {passcode : this.passcode })
    .then( res => {
      if( res.valid ){
        this.$api.setPasscode( this.passcode );
      }else{
        alert('Invalid Passcode')
      }
    }).catch( alert )
  }
}
</script>
