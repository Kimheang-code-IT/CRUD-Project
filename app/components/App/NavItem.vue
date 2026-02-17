<script lang="ts" setup>
import { all as menuItems } from '~/utils/constants/menu'

provide('menuItems', menuItems)
</script>

<template>
  <slot />
</template>
