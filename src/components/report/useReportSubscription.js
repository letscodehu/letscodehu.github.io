// A riport e-mail-feliratkozása: a gate és a PDF-blokk ugyanazt az állapotot
// látja. A „feliratkozott” jelző modul-szintű, tehát egy oldalon belül közös,
// és localStorage-ban él tovább, hogy visszatérve ne kelljen újra megadni.
//
// Prerendereléskor és a hidratálás első renderében mindig `false`: a tárolót
// csak mount után olvassuk (restoreSubscription), különben a szerver és a
// kliens HTML-je elválna egymástól.
import { onUnmounted, readonly, ref } from 'vue'
import { WAITLIST_SIGNUP_API_URL, WAITLIST_SIGNUP_TIMEOUT_MS } from '../../config'
import { trackAiBenchmarkDownload } from '../../tracking'

const STORAGE_KEY = 'letscode.aiReport.subscribed'

const subscribed = ref(false)

/** Mount után hívandó: visszaállítja a korábbi feliratkozást. */
export function restoreSubscription() {
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') subscribed.value = true
  } catch {
    // privát mód / letiltott tároló: marad a gate
  }
}

function markSubscribed() {
  subscribed.value = true
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // ha nem tudjuk elmenteni, ebben a munkamenetben akkor is nyitva marad
  }
}

/**
 * @param {{ placement: 'gate' | 'pdf_cta' }} options  honnan jött a feliratkozás (GA-paraméter)
 */
export function useReportSubscription({ placement }) {
  const email = ref('')
  const errorMessage = ref('')
  const isSubmitting = ref(false)

  let activeAbortController = null
  let activeTimeoutId = 0

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

  async function submit() {
    if (isSubmitting.value || subscribed.value) return

    errorMessage.value = ''
    const normalizedEmail = email.value.trim()
    email.value = normalizedEmail

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errorMessage.value = 'Adj meg egy érvényes e-mail-címet.'
      return
    }

    isSubmitting.value = true
    // A kérés indulásakor küldjük, nem a válasz után: a már feliratkozott címre
    // adott szerverhiba se veszítse el az eseményt. Az isSubmitting-őr fent
    // biztosítja, hogy beküldésenként csak egyszer menjen ki.
    trackAiBenchmarkDownload({ placement })

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

      // A waitlist Lambda a már feliratkozott címre is hibát adhat. A backend
      // nincs ebben a repóban, a duplikált cím válasza nem különíthető el
      // megbízhatóan, ezért bármilyen szerverválasz után továbbengedünk:
      // a cím formátumát fent már ellenőriztük. Hibát csak hálózati hiba és
      // timeout jelez (az a catch ág).
      if (!response.ok) {
        console.warn(`[ai-report] waitlist signup returned ${response.status}; unlocking anyway`)
      }

      markSubscribed()
    } catch (error) {
      clearPendingRequest()
      isSubmitting.value = false
      const isAbortError = error instanceof DOMException && error.name === 'AbortError'
      errorMessage.value = isAbortError
        ? 'Túl sokáig tartott a válasz. Ellenőrizd a kapcsolatot, és próbáld újra.'
        : 'Most nem sikerült elküldeni. Ellenőrizd a kapcsolatot, és próbáld újra.'
    }
  }

  return {
    email,
    errorMessage,
    isSubmitting,
    subscribed: readonly(subscribed),
    submit,
  }
}

/** Csak az állapot, űrlap nélkül (a gyökérkomponensnek). */
export function useSubscribed() {
  return readonly(subscribed)
}
