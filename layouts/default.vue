<script setup lang="ts">
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  HeartIcon,
  HomeIcon,
  InformationCircleIcon,
  Squares2X2Icon,
} from "@heroicons/vue/24/solid";

const route = useRoute();

function getTitle() {
  switch (route.name) {
    case "clientId":
      return "Colle";
    case "clientId-collage":
      return "Collage";
    case "clientId-tracked":
      return "Tracked";
    case "clientId-daily":
      return "Daily";
    default:
      return "Error";
  }
}

function linkGetTo(target?: string) {
  const { clientId } = route.params;
  return target ? `/${clientId}/${target}` : `/${clientId}`;
}

function linkGetClass(target?: string) {
  let fullTarget = "clientId";
  if (target) {
    fullTarget += `-${target}`;
  }
  return route.name === fullTarget ? "active bg-opacity-50" : "";
}

const drawerState = ref(false);
</script>

<template>
  <!-- Full screen height app -->
  <div class="h-screen">
    <!-- Drawer -->
    <div class="h-full drawer drawer-end lg:drawer-open overflow-y-auto">
      <input
        v-model="drawerState"
        id="app-drawer"
        type="checkbox"
        class="drawer-toggle"
      />

      <!-- Page content here -->
      <div ref="contentDiv" class="drawer-content pb-12 flex flex-col">
        <!-- Sticky nav -->
        <nav
          class="navbar sticky top-0 shadow bg-base-100 bg-opacity-75 backdrop-blur"
        >
          <!-- Menu -->
          <div class="navbar-start">
            <div
              v-if="$slots.menu"
              class="dropdown dropdown-bottom dropdown-hover"
            >
              <label tabindex="0" class="btn btn-ghost btn-square">
                <AdjustmentsHorizontalIcon class="w-5 h-5" />
              </label>
              <div
                tabindex="0"
                class="dropdown-content w-80 p-2 rounded-box shadow bg-base-100 bg-opacity-75"
              >
                <slot name="menu" />
              </div>
            </div>
          </div>
          <!-- Title -->
          <div class="navbar-center">
            <div class="text-xl font-semibold">
              <span class="text-primary">Wai</span>
              <span class="text-secondary">{{ getTitle() }}</span>
            </div>
          </div>
          <!-- Side -->
          <div class="navbar-end">
            <label
              v-if="$slots.side"
              for="app-drawer"
              class="btn btn-ghost btn-square drawer-button lg:hidden"
            >
              <InformationCircleIcon class="w-5 h-5" />
            </label>
          </div>
        </nav>

        <!-- Main content -->
        <main class="h-full p-2">
          <slot
            :content-div="$refs.contentDiv"
            :open-drawer="() => (drawerState = true)"
          />
        </main>
      </div>

      <!-- Sidebar content here -->
      <div v-if="$slots.side" class="drawer-side">
        <label
          for="app-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        />
        <div
          class="min-h-full w-80 max-w-[75vw] pb-12 p-4 bg-base-100 border-l border-base-200"
        >
          <slot name="side" />
        </div>
      </div>
    </div>

    <!-- Bottom nav -->
    <div class="btm-nav btm-nav-sm bg-opacity-75 backdrop-blur">
      <NuxtLink :to="linkGetTo()" :class="linkGetClass()">
        <HomeIcon class="w-5 h-5" />
        <span class="btm-nav-label">Home</span>
      </NuxtLink>
      <NuxtLink :to="linkGetTo('collage')" :class="linkGetClass('collage')">
        <Squares2X2Icon class="w-5 h-5" />
        <span class="btm-nav-label">Collage</span>
      </NuxtLink>
      <NuxtLink :to="linkGetTo('tracked')" :class="linkGetClass('tracked')">
        <HeartIcon class="w-5 h-5" />
        <span class="btm-nav-label">Tracked</span>
      </NuxtLink>
      <NuxtLink :to="linkGetTo('daily')" :class="linkGetClass('daily')">
        <CalendarDaysIcon class="w-5 h-5" />
        <span class="btm-nav-label">Daily</span>
      </NuxtLink>
    </div>
  </div>
</template>
