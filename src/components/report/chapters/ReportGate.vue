<script setup>
// A zárolt fejezetek helyén álló e-mail-bekérő. A felette lévő tartalmat
// elhalványítja (a fade a blokk tetejéről lóg rá az előző fejezet aljára).
// A zárolt fejezetek ilyenkor nincsenek a DOM-ban: a gyökér `v-if`-fel csak
// feliratkozás után rakja ki őket.
import ContentWrap from '../ui/ContentWrap.vue'
import { useReportSubscription } from '../useReportSubscription.js'

const { email, errorMessage, isSubmitting, submit } = useReportSubscription({ placement: 'gate' })
</script>

<template>
  <div class="rp-gate no-print relative">
    <div
      class="pointer-events-none absolute inset-x-0 bottom-full h-[220px] bg-linear-to-b from-transparent to-plane"
      aria-hidden="true"
    ></div>

    <ContentWrap>
      <div class="rounded-[18px] bg-ink px-7 py-[26px] text-surface">
        <div class="flex flex-wrap items-start justify-between gap-5">
          <div class="min-w-0 grow basis-[24rem]">
            <h3 class="mb-1 text-[19px] font-[750] tracking-[-0.015em]">Olvasd tovább a teljes riportot</h3>
            <p class="max-w-[52ch] text-[14.5px] leading-[1.5] opacity-[0.78]">
              Kulcsállítások, archetípusok, agentic coding, review, governance, biztonság és tanulási igények — minden
              ábrával, szegmensenként szűrhetően, plusz a letölthető PDF. Írd be az e-mail-címed, és azonnal kinyílik.
            </p>
          </div>

          <form
            class="flex min-w-0 grow basis-[17rem] flex-wrap items-start gap-2.5"
            @submit.prevent="submit"
          >
            <div class="min-w-0 grow basis-[13rem]">
              <label class="sr-only" for="report-gate-email">E-mail-cím</label>
              <input
                id="report-gate-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="te@ceged.hu"
                class="w-full rounded-[10px] border border-surface/30 bg-surface/10 px-3.5 py-[13px] text-[14.5px] text-surface placeholder:text-surface/50 focus:border-surface/60 focus:outline-none"
              />
              <p v-if="errorMessage" class="mt-1.5 text-[13px] leading-[1.4] font-bold text-surface" role="alert">
                {{ errorMessage }}
              </p>
            </div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-none rounded-[10px] bg-accent px-[22px] py-[13px] text-[14.5px] font-bold text-white no-underline transition-[filter] duration-150 hover:brightness-[1.12] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ isSubmitting ? 'Küldés…' : 'Megnyitom' }}
            </button>
          </form>
        </div>
      </div>
    </ContentWrap>
  </div>
</template>
