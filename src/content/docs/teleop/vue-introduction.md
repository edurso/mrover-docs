---
title: "Vue Introduction"
---
# Vue Introduction

Vue is a versatile and beginner-friendly JavaScript framework. This introduction covers what is relevant to our codebase.

We use the **Composition API** with `<script setup>`, which is the modern recommended style for Vue 3.

## File Structure

A typical `.vue` file includes:
- A `<template>` block for HTML markup *(structure)*
- A `<script lang="ts" setup>` block for TypeScript logic *(functionality)*
- A `<style scoped>` block for CSS styling *(appearance)*

```vue
<template>
  <div class="flex flex-col gap-2">
    <!-- Child content here -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<style scoped>
/* Component-specific styles */
</style>
```

:::note
`<style scoped>` limits the styling to the current component
:::

## Reactive State: `ref` and `reactive`

[Reactive state](https://vuejs.org/guide/essentials/reactivity-fundamentals.html) lets the script detect when a variable changes and update the HTML accordingly.  
Use `ref()` for primitive values and `reactive()` for objects:

```ts
import { ref, reactive } from 'vue'

const count = ref(0)
const user = reactive({ name: 'Alice', age: 20 })

count.value++ // access .value in script
user.name = 'Bob' // direct access for reactive
```

In `<template>`, refs are auto-unwrapped (no `.value` needed):

```html
<p>{{ count }}</p>
```

## Looping Through Data: `v-for`

Create an element/do something for each element in a list.  

```vue
<!-- Create an AutonWaypointItem for each waypoint in waypoints, and add the 
corresponding attributes for each one -->
<AutonWaypointItem
  v-for="(waypoint, index) in waypoints"
  :key="waypoint.id"
  :waypoint="waypoint"
  :index="index"
  @delete="removeWaypoint(index)"
/>
```

## Conditional Rendering: `v-if`

Only render the element if the condition is true.

```vue
<button
  v-if="!enabled"
  class="cmd-btn cmd-btn-danger"
  @click="toggle"
>
  Disabled
</button>

<button
  v-else
  class="cmd-btn cmd-btn-success"
  @click="toggle"
>
  Enabled
</button>
```

## Event Binding: `@`

Bind a function to a [DOM (Document Object Model) event](https://www.w3schools.com/jsref/dom_obj_event.asp):

```vue
<!-- handleClick() would be defined in <script>, and runs when button clicked -->
<button @click="handleClick">Click me</button>

<!-- Runs submitForm() when user presses "enter" in this textbox -->
<input @keydown.enter="submitForm" />
```

## Computed Properties

Derived values that automatically update when their dependencies change:

```ts
import { ref, computed } from 'vue'

const items = ref([1, 2, 3])
const total = computed(() => items.value.reduce((a, b) => a + b, 0))
```

## Watchers

Run side effects when a reactive value changes:

```ts
import { ref, watch } from 'vue'

const query = ref('')

// Prints the new "query" value whenever it changes
watch(query, (newVal) => {
  console.log('Query changed:', newVal)
})
```

## Lifecycle Hooks

Run some code when the Vue component enters a new phase of it's lifecycle.  

```ts
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  document.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKey)
})
```

Common hooks:
- `onMounted()` - after component is added to the DOM/page
- `onBeforeUnmount()` - before component is removed, for cleanup
- `onUpdated()` - after any DOM update

## Importing Components

With `<script setup>`, imported components are automatically available in the template without registration:

```vue
<template>
  <GamepadDisplay :axes="axes" :buttons="buttons" />
  <IndicatorDot :is-active="connected" />
</template>

<script lang="ts" setup>
import GamepadDisplay from './GamepadDisplay.vue'
import IndicatorDot from './IndicatorDot.vue'
</script>
```

## State Management: Pinia

We use **Pinia** (not Vuex) for shared state across components:

```ts
import { useWebsocketStore } from '@/stores/websocket'

const websocketStore = useWebsocketStore()
websocketStore.sendMessage('arm', { type: 'ra_controller', axes, buttons })
```

Pinia stores are defined in `src/stores/` and accessed via composable functions (`useXStore`).

## See [here](/teleop/sample-vue-component) for a complete example  
## See [here](https://vuejs.org/tutorial/#step-1) for an online tutorial
