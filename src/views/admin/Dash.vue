<template>
  <v-content>
    <Navbar back color="success" />
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm6 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="success">
              <v-toolbar-title>Pilih QuickCount</v-toolbar-title>

              <v-spacer></v-spacer>
              <VoteAddDialog
                @save="save"
                v-model="dialogVisible"
                @batal="dialogVisible = false"
                v-bind="selected"
              />
            </v-toolbar>
            <v-list-item
              v-for="(item, index) of list"
              :key="index"
              @click="showDialog(index)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import VoteAddDialog from "@/components/VoteAddDialog.vue";
import Navbar from "@/components/Navbar.vue";

@Component({
  name: "AdminDash",
  components: { VoteAddDialog, Navbar }
})
export default class AdminDash extends Vue {

  dialogVisible: boolean | null = null;
  @Watch('dialogVisible')
  dialogVisibleChanged(cur, old) {
    if (!cur) {
      this.selectedIndex = -1;
    }
  }
  selectedIndex: number = -1;
  list: any[] = [];

  get selected() {
    return this.list[this.selectedIndex] || false;
  }
  showDialog(editId) {
    this.selectedIndex = editId;
    this.dialogVisible = true;
  }
  mounted() {
    this.$api.adminListQuickcount().then(list => this.list = list)
  }
  save(changed) {
    if (!Object.keys(changed).length) {
      console.log('Nothing to save, ignore', changed);
      this.dialogVisible = false;
      return;
    }
    if (this.selectedIndex >= 0) {
      // Patch
      this.$api.adminPatchQuickcount(this.selectedIndex, changed).then(
        () => {
          const item = this.selected;
          for (let field in changed) {
            item[field] = changed[field];
          }
          this.dialogVisible = false;
        }
      ).catch(err => alert(err.message))
    } else {
      this.$api.adminAddQuickcount(changed).then(
        () => {
          this.list.push(changed);
          this.dialogVisible = false
        }
      ).catch(err => alert(err.message));
    }
  }
}
</script>
