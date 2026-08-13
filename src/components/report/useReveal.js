// Fejezetek úsztatott megjelenése görgetéskor.
// JS nélkül, `reveal=false` mellett vagy csökkentett mozgásigénynél minden
// azonnal látszik — a tartalom soha nem tűnhet el.
import { onBeforeUnmount, onMounted } from 'vue'

/**
 * @param {Ref<HTMLElement>} rootEl
 * @param {Ref<boolean>|ComputedRef<boolean>} enabled
 */
export function useReveal(rootEl, enabled) {
  let observer = null

  function setup() {
    observer?.disconnect()
    observer = null
    const els = [...rootEl.value.querySelectorAll('.reveal')]
    if (!enabled.value || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            observer.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((e) => observer.observe(e))
  }

  onMounted(setup)
  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return { setup }
}
