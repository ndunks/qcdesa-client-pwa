<template functional>
  <v-card>
    <v-img
      v-if="props.image"
      class="grey--text"
      height="200px"
      :src="props.image"
    >
      <v-avatar v-text="props.pos"></v-avatar>
    </v-img>
    <v-card-title v-text="props.name"></v-card-title>
    <v-list>
      <v-list-item>
        <v-list-item-title
          >Perolehan Suara
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
  </v-card>
</template>