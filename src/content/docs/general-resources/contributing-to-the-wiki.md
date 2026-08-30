---
title: "Contributing to the wiki"
---

This docs site is built with [Astro Starlight](https://starlight.astro.build/). Pages are just Markdown files. You don't need to know any web stuff.

## 1. Create a Markdown file

Add a `.md` file under `src/content/docs/` wherever appropriate:

```
src/content/docs/
  general/        # general tutorials
  teleop/         # teleop docs
  navigation/     # nav docs
  perception/     # perception docs
  ...
```

## 2. Add frontmatter

Every page needs a `title` in the frontmatter at the top:

````md
---
title: "My New Page"
---

## A section

- bullets
  [links](https://mrover.org)

```bash
code blocks
```
````

````


## 3. Add it to the sidebar

Open `astro.config.mjs` and find the `sidebar` array. Locate the section your page belongs to and add an entry:

```js
{
  label: 'Navigation',
  collapsed: true,
  items: [
    { label: 'Navigation', slug: 'navigation/overview' },
    { label: 'My New Page', slug: 'navigation/my-new-page' },  // add this
  ],
},
````

The `slug` matches the file path under `src/content/docs/` without the `.md` extension.

## 4. Preview locally

```bash
cd ~/mrover-docs
bun install   # first time only
bun run dev
```

Open `localhost:4321` in your browser

## Extras

### Images

Put images in `public/` and reference them:

```md
![description](/my-image.png)
```

Objects in public will be built to root, so reference them from root.

### Admonitions

GitHub-flavored `> [!NOTE]` syntax does **not** work here. Use Starlight's `:::` syntax:

```md
:::note
This is a note.
:::

:::caution
This is a warning.
:::

:::tip
This is a tip.
:::
```
