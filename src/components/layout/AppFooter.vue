<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'
import { openCookieSettings } from '../../cookieConsent'

const { t, currentLang } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-main">
        <section class="footer-company">
          <h2 class="footer-company-name">{{ t('common.companyName') }}</h2>
          <p class="footer-tagline">{{ t('common.footerTagline') }}</p>
          <p class="footer-address">{{ t('common.footerAddress') }}</p>
          <p class="footer-tax">{{ t('common.footerTaxLine') }}</p>
        </section>

        <section class="footer-links">
          <div class="footer-link-group">
            <a
              :href="t('common.youtubeChannelUrl')"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              {{ t('common.youtubeChannelLabel') }}
            </a>
            <a
              :href="t('common.facebookUrl')"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              {{ t('common.facebookLabel') }}
            </a>
            <a
              :href="t('common.linkedinUrl')"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              {{ t('common.linkedinLabel') }}
            </a>
          </div>

          <div class="footer-link-group">
            <RouterLink :to="{ name: 'privacy-en', params: { lang: currentLang } }" class="footer-link">
              {{ t('common.privacyLink') }}
            </RouterLink>
            <button type="button" class="cookie-settings-btn" @click="openCookieSettings">
              {{ t('cookies.settingsLink') }}
            </button>
          </div>
        </section>
      </div>

      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} {{ t('common.companyName') }}.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg);
  margin-top: 3rem;
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1.5rem 1.25rem;
}

.footer-main {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.footer-company-name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
}

.footer-tagline {
  margin: 0.6rem 0 0;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.35;
}

.footer-address,
.footer-tax {
  margin: 0.45rem 0 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.35;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.footer-link-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
}

.footer-link {
  color: var(--color-text-muted);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
  text-decoration-thickness: 1.5px;
  text-underline-offset: 0.18em;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.2;
  transition: color var(--transition-fast), text-decoration-color var(--transition-fast);
}

.footer-link:hover {
  color: var(--color-primary);
  text-decoration-color: var(--color-primary);
}

.footer-link:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-primary-soft) 70%, transparent);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.footer-bottom {
  padding-top: 1rem;
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.cookie-settings-btn {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.2;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
  text-decoration-thickness: 1.5px;
  text-underline-offset: 0.18em;
  transition: color var(--transition-fast), text-decoration-color var(--transition-fast);
}

.cookie-settings-btn:hover {
  color: var(--color-primary);
  text-decoration-color: var(--color-primary);
}

.cookie-settings-btn:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-primary-soft) 70%, transparent);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

@media (max-width: 760px) {
  .footer-inner {
    padding: 1.5rem 1rem 1rem;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }

  .footer-link-group {
    gap: 0.55rem;
  }
}
</style>

