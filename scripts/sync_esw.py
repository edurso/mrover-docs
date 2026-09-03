#!/usr/bin/env python3
"""
re-create `src/content/docs/esw/` and the associated sidebar from umrover/mrover-esw

the esw docs are authored there, and this script converts them to the astro starlight markdown flavor

usage:
    python3 scripts/sync_esw.py <path-to-mrover-esw>

NOTE this script is stdlib only, so it will run on a vanilla python3 install without a venv
"""

import json
import posixpath
import re
import shutil
import sys
import tomllib
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEST = REPO / "src" / "content" / "docs" / "esw"
CONFIG = REPO / "astro.config.mjs"
START = "// ESW_SIDEBAR_START"
END = "// ESW_SIDEBAR_END"

# map zensical -> starlight, default to !!! TODO (unlisted)
ASIDE = {
    "note": "note",
    "info": "note",
    "tip": "tip",
    "warning": "caution",
    "important": "caution",
    "danger": "danger",
}

# compile zenzical identification regexs
HEADING = re.compile(r"^#\s+(.+?)\s*$")
LINK = re.compile(r"\]\(([^)\s]+\.md)(#[^)\s]*)?\)")
EXTERNAL = re.compile(r"^([a-z]+:|/)", re.IGNORECASE)
ADMONITION = re.compile(r'^(?:!!!|\?\?\?\+?)\s+(\w+)(?:\s+"(.*)")?\s*$')
FENCE = re.compile(r"^\s*(```|~~~)")


def _slug_of(rel: str) -> str:
    """
    remap paths

    `info/timers.md` -> `esw/info/timers`
    `index.md` -> `esw`
    """
    trimmed = re.sub(r"(^|/)index\.md$", r"\1", rel)
    trimmed = re.sub(r"\.md$", "", trimmed)
    return f"esw/{trimmed}".rstrip("/")


def _frontmatter(md: str):
    """
    lift header (`# title`) to starlight frontmatter, return None if no H1
    """
    lines = md.split("\n")
    i = 0
    while i < len(lines) and not lines[i].strip():
        i += 1
    match = HEADING.match(lines[i]) if i < len(lines) else None
    if not match:
        return None
    # titles are not markdown-processed, so undo escapes: `STM32Cube\*` -> `STM32Cube*`.
    title = re.sub(r"\\([^A-Za-z0-9])", r"\1", match.group(1))
    body = "\n".join(lines[i + 1 :]).lstrip("\n")
    # json string is a yaml double-quoted scalar
    return title, f"---\ntitle: {json.dumps(title)}\n---\n\n{body}"


def _rewrite_links(md: str, rel: str, exists=lambda target: True):
    """
    rewrite `.md` links to starlight slugs

    abort on miss, do not keep invalid links
    """
    directory = posixpath.dirname(rel)
    count = 0

    def replace(match: re.Match) -> str:
        nonlocal count
        target, anchor = match.group(1), match.group(2) or ""
        if EXTERNAL.match(target):
            return match.group(0)
        resolved = posixpath.normpath(posixpath.join(directory, target))
        if not exists(resolved):
            sys.exit(f"{rel}: link to missing file {target}")
        count += 1
        return f"](/{_slug_of(resolved)}{anchor})"

    return LINK.sub(replace, md), count


def _convert_admonitions(md: str):
    """
    `!!! warning` plus a 4-space indented body -> `:::caution` ... `:::`
    """
    lines = md.split("\n")
    out: list[str] = []
    count = 0
    fenced = False
    i = 0
    while i < len(lines):
        if FENCE.match(lines[i]):
            fenced = not fenced
        match = None if fenced else ADMONITION.match(lines[i])
        if not match:
            out.append(lines[i])
            i += 1
            continue

        raw_type, raw_title = match.group(1), match.group(2)
        kind = ASIDE.get(raw_type.lower(), "note")
        if raw_title is not None:
            title = raw_title
        else:
            title = None if raw_type.lower() in ASIDE else raw_type

        # consume the indented block, dedenting by exactly 4 so a nested fence survives
        body: list[str] = []
        j = i + 1
        while j < len(lines):
            if not lines[j].strip():
                body.append("")
            elif lines[j].startswith("    "):
                body.append(lines[j][4:])
            else:
                break
            j += 1

        trailing_blank = False
        while body and body[-1] == "":
            body.pop()
            trailing_blank = True

        out.append(f":::{kind}[{title}]" if title else f":::{kind}")
        out.extend(body)
        out.append(":::")
        if trailing_blank:
            out.append("")
        count += 1
        i = j

    return "\n".join(out), count


def _sidebar_item(entry, titles: dict) -> dict:
    """
    zensical `nav` -> starlight sidebar
    """
    if isinstance(entry, str):
        return {"label": titles.get(entry, entry), "slug": _slug_of(entry)}
    label, value = next(iter(entry.items()))
    if isinstance(value, str):
        return {"label": label, "slug": _slug_of(value)}
    return {
        "label": label,
        "items": [_sidebar_item(child, titles) for child in value],
    }


def _quote(text: str) -> str:
    return "'" + text.replace("\\", "\\\\").replace("'", "\\'") + "'"


def _render_item(item: dict, indent: int) -> str:
    pad = " " * indent
    if "slug" in item:
        return f"{pad}{{ label: {_quote(item['label'])}, slug: {_quote(item['slug'])} }}"
    children = ",\n".join(_render_item(child, indent + 4) for child in item["items"])
    return "\n".join(
        [
            f"{pad}{{",
            f"{pad}  label: {_quote(item['label'])},",
            f"{pad}  collapsed: true,",
            f"{pad}  items: [",
            children,
            f"{pad}  ]",
            f"{pad}}}",
        ]
    )


def _splice_sidebar(config: str, block: dict) -> str:
    """
    replace everything between the markers, keeping their indentation
    """
    lines = config.split("\n")
    starts = [i for i, line in enumerate(lines) if line.strip() == START]
    ends = [i for i, line in enumerate(lines) if line.strip() == END]
    if not starts or not ends or ends[0] < starts[0]:
        sys.exit(f"astro.config.mjs: missing or misordered {START} / {END} markers")
    a, b = starts[0], ends[0]
    indent = len(lines[a]) - len(lines[a].lstrip())
    return "\n".join(lines[: a + 1] + [_render_item(block, indent) + ","] + lines[b:])


def main(argv: list[str]) -> None:
    if len(argv) != 2:
        sys.exit("usage: python3 scripts/sync_esw.py <path-to-mrover-esw>")

    esw = Path(argv[1]).resolve()
    src_docs = esw / "docs"
    if not src_docs.is_dir():
        sys.exit(f"{src_docs} is not a directory, is that a mrover-esw checkout?")
    with (esw / "zensical.toml").open("rb") as handle:
        zensical = tomllib.load(handle)

    files = sorted(
        path.relative_to(src_docs).as_posix() for path in src_docs.rglob("*") if path.is_file()
    )
    markdown = {name for name in files if name.endswith(".md")}

    shutil.rmtree(DEST, ignore_errors=True)

    titles: dict[str, str] = {}
    links = asides = 0
    for rel in files:
        destination = DEST / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        if not rel.endswith(".md"):
            shutil.copyfile(src_docs / rel, destination)
            continue

        lifted = _frontmatter((src_docs / rel).read_text(encoding="utf-8"))
        if lifted is None:
            sys.exit(f"{rel}: no leading '# Title' to lift into frontmatter")
        title, text = lifted
        titles[rel] = title

        text, count = _rewrite_links(text, rel, markdown.__contains__)
        links += count
        text, count = _convert_admonitions(text)
        asides += count
        destination.write_text(text, encoding="utf-8")

    items = [_sidebar_item(entry, titles) for entry in zensical["project"]["nav"]]
    block = {"label": "ESW", "items": items}
    CONFIG.write_text(
        _splice_sidebar(CONFIG.read_text(encoding="utf-8"), block), encoding="utf-8"
    )

    print(f"synced {len(markdown)} pages and {len(files) - len(markdown)} assets from {esw}")
    print(
        f"rewrote {links} links, converted {asides} admonitions, "
        f"{len(items)} top-level nav sections"
    )


if __name__ == "__main__":
    main(sys.argv)
