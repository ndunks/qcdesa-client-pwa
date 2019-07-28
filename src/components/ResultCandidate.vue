<template functional>
  <v-card>
    <v-toolbar dense>
      <v-toolbar-title v-text="props.name"></v-toolbar-title>
<!--       <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon style="float: right"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar-items> -->
    </v-toolbar>
    <v-card-text class="pa-0">
      <v-img
        v-if="props.image"
        class="grey--text"
        height="200px"
        :src="props.image"
      ></v-img>
      <v-list dense>
        <v-list-item>
          <v-list-item-title
            >Suara
            {{ props.locationName || "Total" }}</v-list-item-title
          >
          <v-list-item-subtitle class="text-right">
            <v-chip v-text="props.count"></v-chip>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Peringkat</v-list-item-title>
          <v-list-item-subtitle class="text-right">
            <v-chip v-text="props.pos"></v-chip>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Nomor Urut</v-list-item-title>
          <v-list-item-subtitle class="text-right">
            <v-chip v-text="props.number"></v-chip>
          </v-list-item-subtitle>
        </v-list-item>
        <template v-if="props.locations">
          <v-subheader>Hasil di TPS</v-subheader>
          <v-list-item-group v-model="item" color="primary">
            <v-list-item v-for="(item, i) in props.locations" :key="i">
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle class="text-right">
                <v-chip v-text="item.results[props.id].count"></v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list-item-group>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>