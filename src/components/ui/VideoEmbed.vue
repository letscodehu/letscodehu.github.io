<script setup lang="ts">
import { computed, ref } from 'vue'

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

function toYoutubeThumbnail(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl)
    const host = parsed.hostname.replace('www.', '')

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v')
      if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    }

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    }

    return null
  } catch {
    return null
  }
}

const embedUrl = computed(() => toEmbedUrl(props.url))
const thumbnailUrl = computed(() => toYoutubeThumbnail(props.url))

// Embeds only load once clicked so YouTube/Vimeo trackers don't fire on page load, ahead of cookie consent.
const playing = ref(false)
</script>

<template>
  <div class="video">
    <div v-if="embedUrl" class="video-frame-wrap">
      <iframe
        v-if="playing"
        class="video-frame"
        :src="`${embedUrl}?autoplay=1`"
        :title="title"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
      <button
        v-else
        type="button"
        class="video-facade"
        :style="thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : undefined"
        :aria-label="linkLabel || title"
        @click="playing = true"
      >
        <span class="video-play-icon" aria-hidden="true">▶</span>
      </button>
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

.video-facade {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  background-color: #111;
  background-size: cover;
  background-position: center;
  cursor: pointer;
}

.video-play-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 1.1rem;
  padding-left: 0.2rem;
  transition: background-color 0.16s ease, transform 0.16s ease;
}

.video-facade:hover .video-play-icon,
.video-facade:focus-visible .video-play-icon {
  background-color: var(--color-primary);
  transform: scale(1.08);
}

.video-facade:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
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
