# Global styles

All app-wide CSS/SCSS is loaded via `nuxt.config.ts` → `css: ['~/assets/styles/vuetify.scss', '~/assets/styles/index.scss', '~/assets/styles/tailwind.css']`.

## Strategy: Vuetify + Tailwind

- **Vuetify** – Use for all UI: buttons, dialogs, inputs, tables, navigation, etc. (`v-btn`, `v-dialog`, `v-text-field`, `v-data-table`, etc.)
- **Tailwind CSS** – Use for layout, spacing, colors, typography, borders, and overrides. Tailwind is loaded **last**, so its utilities win when both apply.
- **Vuetify utility classes** are disabled in `vuetify.scss` (padding, margin, flex, display, typography, rounded, etc.) so Tailwind is the single source for those; no duplicate class names.

## Load order

1. **vuetify.scss** – Vuetify component styles (with utility classes disabled)
2. **index.scss** – Icons, design tokens, reset, Siemreap font, global, layout, button, utilities, components.
3. **tailwind.css** – Tailwind + `@theme` (custom colors). Last so Tailwind utilities win when both apply.

## Structure (`scss/`)

| File | Purpose |
|------|--------|
| `_variables.scss` | Design tokens (colors, spacing, typography, radius). Use in SCSS as `$primary`; in HTML use Tailwind or `var(--color-primary)`. |
| `_reset.scss` | Minimal reset (box-sizing, body margin, etc.). |
| `siemreap-font.scss` | Siemreap font for EN + Khmer (`.siemreap-regular`, `.base-font-sans`). |
| `_global.scss` | Body, scrollbar, links, full-height app shell. |
| `_layout.scss` | `.fill-height` for full-height layout. |
| `_button.scss` | Global `.v-btn` overrides (use Tailwind for button colors). |
| `_utilities.scss` | `.truncate`, `.sr-only` (prefer Tailwind for new utilities). |
| `_components.scss` | AppBar, Sidebar, Dialog (app-bar-icon-btn, sidebar-blue, etc.). |

## Adding new styles

- **Design tokens** → `_variables.scss` (add `$name` and optionally `:root { --name: #{$name}; }`).
- **New global/base** → new `_*.scss` and `@use './scss/...'` in `index.scss`.
- **Component-specific** → prefer component `<style scoped>` or Tailwind; if it’s shared across components, add to `_components.scss`.

## Using in Vue

- **Components** → Vuetify (`<v-btn>`, `<v-dialog>`, `<v-text-field>`, `<v-data-table>`, etc.).
- **Layout and custom style** → Tailwind (`flex`, `gap-4`, `p-4`, `text-primary`, `rounded-sm`, `bg-[#2A5A7F]`, etc.).
- **Design tokens** → CSS variables from `_variables.scss` or Tailwind `@theme` in `tailwind.css`, e.g. `var(--color-primary)` or Tailwind `text-primary` / `bg-primary`.
- **Utilities** → Prefer Tailwind; `.truncate` and `.sr-only` remain in `_utilities.scss`.

**Do not use** Vuetify utility/typography classes that are disabled in `vuetify.scss` (e.g. `d-flex`, `align-center`, `pa-*`, `ma-*`, `text-h5`, `font-weight-bold`, `rounded-*`). Use Tailwind instead (`flex`, `items-center`, `p-*`, `m-*`, `text-xl`, `font-bold`, `rounded-lg`).

---

## Using Vuetify with Tailwind (how to combine both)

| Need | Use |
|------|-----|
| Buttons, inputs, dialogs, tables, nav | Vuetify components (`v-btn`, `v-text-field`, `v-dialog`, etc.) |
| Layout & spacing | Tailwind (`flex`, `grid`, `gap-4`, `p-4`, `m-2`, `min-h-0`) |
| Colors | Tailwind (`text-primary`, `bg-[#2A5A7F]`) or Vuetify `color="primary"` on components |
| Typography | Tailwind (`text-sm`, `font-medium`, `text-neutral-600`) |
| Border radius | Tailwind (`rounded-sm`, `rounded-lg`) on the component’s `class` |
| Override Vuetify inner styles | Tailwind on the component: `<v-btn class="rounded-xl px-6">` or use `:deep()` in scoped style with Tailwind `@apply` |

**Examples**

```vue
<!-- Vuetify component + Tailwind layout and spacing -->
<v-btn color="primary" class="rounded-lg px-4 py-2">
  Save
</v-btn>

<!-- Vuetify dialog with Tailwind on content -->
<v-dialog>
  <v-card class="rounded-xl p-6">
    <p class="text-neutral-700">Content</p>
  </v-card>
</v-dialog>

<!-- Tailwind for layout, Vuetify for form -->
<div class="flex flex-col gap-4">
  <v-text-field label="Name" class="max-w-md" />
  <v-btn class="self-end rounded-sm">Submit</v-btn>
</div>
```

When the same property is set by both (e.g. padding), Tailwind wins because it is loaded after Vuetify.

## Pages checklist

All pages under `app/pages/` should follow this strategy. When adding or editing a page:

1. **UI** – Use Vuetify components only (no raw `<button>`, `<input>`, `<select>` for forms).
2. **Layout & spacing** – Use Tailwind classes (`flex`, `grid`, `gap-*`, `p-*`, `m-*`, `space-y-*`).
3. **Typography** – Use Tailwind (`text-sm`, `text-base`, `font-medium`, `font-bold`, `text-neutral-500`, etc.), not Vuetify typography utilities.
4. **Colors** – Prefer Tailwind theme colors (`text-primary`, `bg-[#2A5A7F]`) or CSS variables.
5. **Responsive** – Use Tailwind breakpoints (`md:mb-6`, `sm:col-span-6`) rather than Vuetify responsive utilities.

## Components checklist

All components under `app/components/` should follow the same strategy:

1. **UI** – Use Vuetify components only (no raw `<button>`, `<input>`, `<select>` for form/controls).
2. **Layout & spacing** – Use Tailwind (`flex`, `items-center`, `gap-*`, `p-*`, `m-*`). Do not use disabled Vuetify utilities (`d-flex`, `align-center`, `pa-*`, `ma-*`, etc.).
3. **Typography** – Use Tailwind (`text-sm`, `font-medium`, etc.), not Vuetify typography classes.
4. **Colors** – Use Tailwind theme or CSS variables.
5. **Scoped styles** – Prefer Tailwind in template; use `<style scoped>` or `:deep()` only when needed for Vuetify component overrides.
