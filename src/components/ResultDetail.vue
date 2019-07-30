<template functional>
  <v-card
    class="d-flex"
    style="flex-direction: column"
    height="100%"
    :flat="parent.$vuetify.breakpoint.xs"
    :tile="parent.$vuetify.breakpoint.xs"
  >
    <v-list-item two-line style="flex: 0">
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
        <v-list-item-title style="flex-basis: auto">{{
          index
        }}</v-list-item-title>
        <v-list-item-subtitle style="flex-basis: auto" class="text-right">
          {{ item }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-card-actions text-center style="flex: 1 0 auto">
      <v-container fill-height pa-0>
        <v-layout justify-center align-center>
          <ResultLogs :locations="props.locations" />
        </v-layout>
      </v-container>
    </v-card-actions>
  </v-card>
</template>
