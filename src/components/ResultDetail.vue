<template functional>
  <v-card height="100%" :flat="parent.$vuetify.breakpoint.xs" :tile="parent.$vuetify.breakpoint.xs">
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">
          Statistik Total
        </v-list-item-title>
        <v-list-item-subtitle>
          Informasi perhitungan rinci
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list>
      <v-list-item v-for="(item, index) in props.details" :key="index">
        <v-list-item-title style="flex-basis: auto">{{ index }}</v-list-item-title>
        <v-list-item-subtitle style="flex-basis: auto" class="text-right">
          {{ item }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn text>Lihat Log</v-btn>
    </v-card-actions>
  </v-card>
</template>
