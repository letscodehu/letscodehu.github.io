# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Dark mode support

This project ships with a system-aware dark mode:

- CSS custom properties are scoped through `.theme-light` / `.theme-dark` classes on `<html>` so shared components adapt automatically.
- An inline preference script applies the correct class before the stylesheet loads, defaulting to `prefers-color-scheme` when no explicit choice is stored.
- The header exposes a toggle that updates the class, persists the preference in both `localStorage` and a cookie, and remains accessible via `aria-pressed`.
 
When developing, toggle the header control or adjust the `dark-mode-preference` storage value to preview each palette. The theme choice survives navigation and reloads.
