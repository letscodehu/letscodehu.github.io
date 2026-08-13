<script setup>
// Csak nyomtatásban látszik (`.print-only`). A számozott lista tördelését és
// tipográfiáját teljes egészében a print-réteg adja, ezért itt nincs utility.
import { CHAPTERS } from '../chapters.js'
import { useReport } from '../useReport.js'
import ContentWrap from '../ui/ContentWrap.vue'

const { D } = useReport()
</script>

<template>
  <!-- a class a ContentWrap gyökerére öröklődik (Vue attribútum-öröklés) -->
  <ContentWrap class="print-only rp-toc-page">
    <h2 class="rp-toc-h">Tartalom</h2>
    <ol class="rp-toc">
      <li v-for="c in CHAPTERS" :key="c.id">{{ c.label }}</li>
    </ol>
    <p class="rp-toc-note">
      Forrás: online kérdőív. Minden arány a válaszadókra vonatkozik. Az adatok önbevallásosak, a
      minta nem reprezentatív.
    </p>
  </ContentWrap>
</template>
