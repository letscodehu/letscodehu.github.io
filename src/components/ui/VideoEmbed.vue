<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    url: string
    title: string
    linkLabel?: string
  }>(),
  {
    linkLabel: '',
  },
)

function toEmbedUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl)
    const host = parsed.hostname.replace('www.', '')

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v')
      if (id) {
        return `https://www.youtube.com/embed/${id}`
      }

      const pathParts = parsed.pathname.split('/').filter(Boolean)
      if (pathParts[0] === 'shorts' && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}`
      }

      if (pathParts[0] === 'embed' && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}`
      }
    }

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const pathParts = parsed.pathname.split('/').filter(Boolean)
      const maybeId = pathParts[pathParts.length - 1]
      return maybeId ? `https://player.vimeo.com/video/${maybeId}` : null
    }

    return null
  } catch {
    return null
  }
}

const embedUrl = computed(() => toEmbedUrl(props.url))
</script>

<template>
  <div class="video">
    <div v-if="embedUrl" class="video-frame-wrap">
      <iframe
        class="video-frame"
        :src="embedUrl"
        :title="title"
        loading="lazy"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>

    <a
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="video-link"
    >
      {{ linkLabel || title }}
    </a>
  </div>
</template>

<style scoped>
.video {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.video-frame-wrap {
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background-color: #000;
}

.video-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: block;
}

.video-link {
  font-size: 0.86rem;
  color: var(--color-primary);
  text-decoration: none;
}

.video-link:hover {
  color: var(--color-primary-strong);
  text-decoration: underline;
}
</style>
