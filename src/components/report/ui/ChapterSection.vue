<script setup>
import { anchor } from '../chapters.js'
import ContentWrap from './ContentWrap.vue'

defineProps({
  /** A CHAPTERS-beli azonosító — ebből lesz a prefixelt horgony. */
  id: { type: String, required: true },
  /** Kétjegyű sorszám a fejezetcímkében. */
  num: { type: String, required: true },
  /** A fejezetcímke szövege a sorszám után. */
  tag: { type: String, required: true },
  /** A fejezet H2 címe. */
  title: { type: String, required: true },
})
</script>

<template>
  <section :id="anchor(id)" class="rp-chapter reveal border-t border-brd py-[clamp(48px,7vw,86px)]">
    <ContentWrap>
      <div class="rp-chaptag mb-4 font-mono text-[12.5px] uppercase tracking-[0.13em] text-muted">
        <b class="font-semibold text-accent">{{ num }}</b> — {{ tag }}
      </div>
      <h2
        class="rp-h2 mt-[0.05em] mb-[0.32em] text-[clamp(27px,4.4vw,44px)] font-extrabold leading-[1.06] tracking-[-0.028em]"
      >
        {{ title }}
      </h2>
      <slot />
    </ContentWrap>
  </section>
</template>
