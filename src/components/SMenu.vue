<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

defineProps<{ menus: { path: string }[] }>()

const [open, toggleOpen] = useToggle(false)

function setOpen() {
  if (!open.value)
    toggleOpen(true)
}
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="btn"
        @mouseenter="setOpen"
        @click="toggleOpen()"
      >
        more <i i-carbon-chevron-down icon w-4 h-4 />
      </MenuButton>
    </div>

    <transition
      v-show="open"
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        z="9999"
        static
        class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        @mouseenter="setOpen"
        @mouseleave="toggleOpen(false)"
      >
        <div class="px-1 py-1">
          <MenuItem v-for="menu in menus" :key="menu.path">
            <router-link
              s-link
              :to="menu.path"
              @click="toggleOpen(false)"
            >
              {{ menu.path }}
            </router-link>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
