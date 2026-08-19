<script setup>
import { computed, onUnmounted, ref } from 'vue'
import ContentWrap from '../ui/ContentWrap.vue'
import { WAITLIST_SIGNUP_API_URL, WAITLIST_SIGNUP_TIMEOUT_MS } from '../../../config'

const props = defineProps({
  /** A letölthető PDF útvonala. */
  href: { type: String, required: true },
})

/**
 * Soft gate: az e-mail az alapértelmezett út a PDF-hez, de a letöltés e-mail
 * nélkül is elérhető marad. A PDF URL amúgy is publikus (a fejlécben szerepel
 * `link rel=alternate`-ként), ezért a kemény kapu csak bosszantana, konverziót
 * nem védene.
 */
const email = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)

let activeAbortController = null
let activeTimeoutId = 0

const canSubmit = computed(() => !isSubmitting.value && !isSuccess.value)

function clearPendingRequest() {
  if (activeTimeoutId) {
    window.clearTimeout(activeTimeoutId)
    activeTimeoutId = 0
  }
  if (activeAbortController) {
    activeAbortController.abort()
    activeAbortController = null
  }
}

onUnmounted(clearPendingRequest)

/** A sikeres feliratkozás után a letöltés magától indul, hogy ne kelljen újra kattintani. */
function startDownload() {
  const link = document.createElement('a')
  link.href = props.href
  link.download = ''
  document.body.appendChild(link)
  link.click()
  link.remove()
}

async function handleSubmit() {
  if (!canSubmit.value) {
    return
  }

  errorMessage.value = ''
  const normalizedEmail = email.value.trim()
  email.value = normalizedEmail

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errorMessage.value = 'Adj meg egy érvényes e-mail-címet.'
    return
  }

  isSubmitting.value = true

  const abortController = new AbortController()
  activeAbortController = abortController
  activeTimeoutId = window.setTimeout(() => {
    abortController.abort()
  }, WAITLIST_SIGNUP_TIMEOUT_MS)

  try {
    const response = await fetch(WAITLIST_SIGNUP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, firstName: '' }),
      signal: abortController.signal,
    })

    clearPendingRequest()
    isSubmitting.value = false

    if (!response.ok) {
      errorMessage.value = 'Most nem sikerült elküldeni. Próbáld újra, vagy töltsd le e-mail nélkül.'
      return
    }

    isSuccess.value = true
    startDownload()
  } catch (error) {
    clearPendingRequest()
    isSubmitting.value = false
    const isAbortError = error instanceof DOMException && error.name === 'AbortError'
    errorMessage.value = isAbortError
      ? 'Túl sokáig tartott a válasz. Próbáld újra, vagy töltsd le e-mail nélkül.'
      : 'Most nem sikerült elküldeni. Próbáld újra, vagy töltsd le e-mail nélkül.'
  }
}
</script>

<template>
  <ContentWrap class="no-print">
    <div class="reveal mt-10 rounded-[18px] bg-ink px-7 py-[26px] text-surface">
      <div class="flex flex-wrap items-start justify-between gap-5">
        <div class="min-w-0 grow basis-[24rem]">
          <h3 class="mb-1 text-[19px] font-[750] tracking-[-0.015em]">Szerkesztett PDF-változat</h3>
          <p class="max-w-[52ch] text-[14.5px] leading-[1.5] opacity-[0.78]">
            A teljes riport nyomtatható, lapozható formában — borítóval, tartalomjegyzékkel és minden
            ábrával. Írd be az e-mail-címed, és azonnal indul a letöltés.
          </p>
        </div>

        <form
          v-if="!isSuccess"
          class="flex min-w-0 grow basis-[17rem] flex-wrap items-start gap-2.5"
          @submit.prevent="handleSubmit"
        >
          <div class="min-w-0 grow basis-[13rem]">
            <label class="sr-only" for="report-pdf-email">E-mail-cím</label>
            <input
              id="report-pdf-email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="te@ceged.hu"
              class="w-full rounded-[10px] border border-surface/30 bg-surface/10 px-3.5 py-[13px] text-[14.5px] text-surface placeholder:text-surface/50 focus:border-surface/60 focus:outline-none"
            />
            <p v-if="errorMessage" class="mt-1.5 text-[13px] leading-[1.4] font-bold text-surface">
              {{ errorMessage }}
            </p>
          </div>
          <button
            type="submit"
            :disabled="!canSubmit"
            class="flex-none rounded-[10px] bg-accent px-[22px] py-[13px] text-[14.5px] font-bold text-white no-underline transition-[filter] duration-150 hover:brightness-[1.12] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ isSubmitting ? 'Küldés…' : 'Kérem a PDF-et' }}
          </button>
        </form>

        <p v-else class="grow basis-[17rem] text-[14.5px] leading-[1.5] font-bold">
          Köszönöm — a letöltés elindult.
        </p>
      </div>

      <p class="mt-3.5 text-[13px] leading-[1.5] opacity-[0.6]">
        <a class="underline underline-offset-2" :href="href" download>Letöltés e-mail megadása nélkül</a>
        — az e-mail-címet csak a riporthoz és a következő kiadáshoz használom, tovább nem adom.
      </p>
    </div>
  </ContentWrap>
</template>
