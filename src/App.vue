<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <router-view />
    <float-container v-slot="props">
      <the-image v-bind="props" />
    </float-container>
    <Footer />
  </main>
</template>
