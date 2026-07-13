<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { trackSlackJoinClick } from '../tracking'

const SLACK_INVITE_URL =
  'https://join.slack.com/t/letscodehu/shared_invite/zt-rar6y94y-WUcNmdu9vxUIJz96HZAT9g'

const { t, currentLang } = useI18n()
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('slack.pageTitle') }}
      </h1>
      <p class="page-intro">
        {{ t('slack.intro') }}
      </p>
    </header>

    <section class="section">
      <div class="join-highlight">
        <p class="social-proof">{{ t('slack.socialProof') }}</p>
        <div class="join-actions">
          <BaseButton
            as="a"
            :href="SLACK_INVITE_URL"
            target="_blank"
            rel="noopener"
            @click="trackSlackJoinClick()"
          >
            {{ t('slack.joinCta') }}
          </BaseButton>
          <p class="join-note">{{ t('slack.joinNote') }}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="explore-title">{{ t('slack.exploreTitle') }}</h2>
      <p class="explore-intro">{{ t('slack.exploreIntro') }}</p>
      <div class="grid grid--three">
        <BaseCard>
          <template #title>{{ t('slack.exploreTrainingTitle') }}</template>
          <p class="body">{{ t('slack.exploreTrainingBody') }}</p>
          <router-link class="card-link" :to="{ name: 'training-en', params: { lang: currentLang } }">
            {{ t('slack.exploreTrainingCta') }}
          </router-link>
        </BaseCard>

        <BaseCard>
          <template #title>{{ t('slack.exploreConsultingTitle') }}</template>
          <p class="body">{{ t('slack.exploreConsultingBody') }}</p>
          <router-link class="card-link" :to="{ name: 'consulting-en', params: { lang: currentLang } }">
            {{ t('slack.exploreConsultingCta') }}
          </router-link>
        </BaseCard>

        <BaseCard>
          <template #title>{{ t('slack.exploreBlogTitle') }}</template>
          <p class="body">{{ t('slack.exploreBlogBody') }}</p>
          <router-link class="card-link" :to="{ name: 'blog-list-en', params: { lang: currentLang } }">
            {{ t('slack.exploreBlogCta') }}
          </router-link>
        </BaseCard>
      </div>
    </section>
  </article>
</template>

<style scoped>
.page-header {
  margin-bottom: 2.25rem;
}

.page-title {
  margin: 0 0 0.75rem;
  font-size: 1.6rem;
}

.page-intro {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.section {
  margin-bottom: 2rem;
}

.join-highlight {
  border: 1px solid var(--color-primary-soft);
  border-left: 4px solid var(--color-primary);
  background-color: var(--color-primary-soft);
  border-radius: var(--radius-md);
  padding: 1.6rem 1.75rem;
}

.social-proof {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.join-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.join-note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.explore-title {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
}

.explore-intro {
  margin: 0 0 1.25rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.grid {
  display: grid;
  gap: 1.25rem;
}

.grid--three {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.body {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
}

.card-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.card-link:hover {
  text-decoration: underline;
}
</style>
