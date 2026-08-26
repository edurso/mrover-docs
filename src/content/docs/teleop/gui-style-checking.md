---
title: "GUI Style Checking"
---
## Style Teleop Code

Keeping our code well-formatted makes it easier for everyone to read and maintain.

**Always format your code before pushing commits,** or at least try to remember.

### Backend ROS Code (Python/C++)

From the root of the `mrover` repo, run:

```bash
./style.sh --fix
```

- Running `./style.sh` by itself will **show files that need formatting**.
- Running with `--fix` will **automatically apply formatting**.

### Frontend Code (Vue/TypeScript/CSS)

Navigate to the frontend directory (from root `mrover`):

```bash
cd teleoperation/basestation_gui/frontend
```

Then run:

```bash
bun run lint
```

- This runs **ESLint**, which checks for code style violations and common bugs in your TypeScript and Vue code.
- If you see any lint errors, **fix them before pushing** your code.

For CSS style checking:

```bash
bun run stylelint
```

- This runs **Stylelint**, which checks CSS ordering and conventions in `.vue` and `.css` files.

:::tip
You can use

```zsh
bun run stylelint "**/*.css"
# or
bun run stylelint "**/*.vue"
```

in zsh *(type of terminal shell; what you are probably already using)* to run stylelint on every css or vue file in the current directory/folder.
:::

Additionally, the **Prettier** plugin should take care of the more mundane tasks like spacing and indentation in your code when you save (Ctrl-S).

---
