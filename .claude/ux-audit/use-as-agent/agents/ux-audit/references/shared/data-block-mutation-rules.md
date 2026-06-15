# Data Block Mutation Rules

## Purpose

When an interactive HTML deliverable contains an embedded JSON data block, the LLM must choose how to modify it. Two options exist: invoke the shared utility library, or edit specific strings inline. Without a clear rule, the LLM defaults to writing a fresh standalone script each time — producing the ad-hoc proliferation (34 scripts across 5 workflows) that this library was built to eliminate. These rules are the single source of truth for that choice.

## Hard rule

Never write a fresh standalone Python script to mutate a data block. Every mutation goes through one of two paths: (a) the library at `references/scripts/ux_utils.py`, or (b) a targeted inline Edit on specific known-unique strings. A new one-off script is not a valid third path.

## Default

Use the library (`shell_template` + `data_block_mutator` modules inside `ux_utils.py`). The library handles extraction, navigation, mutation, and write-back as a tested unit. It is the correct choice for any operation that touches more than a handful of top-level keys, involves nested paths, spans multiple sections or variants, or requires a structural insert. When uncertain whether an operation is simple enough for inline Edit, default here — the cost is slightly more setup; the risk is zero.

## Exceptions

Inline Edit is acceptable in exactly two cases:

1. **Top-level dict patch, ≤4 keys.** The target keys are at the top level of the data block (e.g., the `labels` object), the values are known-unique strings (no risk of hitting the wrong occurrence), and the total number of changed keys is four or fewer.
2. **Single-location flat-array insert.** One new item appended at one visible, unambiguous location in a short, flat array — no nesting, no cross-section spread, one insertion point.

Both exceptions require that the target strings are genuinely unique in the file. If uniqueness is in doubt, use the library.

## When in doubt

Pick the library. A library call that was unnecessary costs one extra function invocation. An inline Edit that silently truncates a nested array, mis-targets an adjacent element, or produces invalid JSON can corrupt the deliverable in ways that are hard to detect. Inline failures on complex shapes break silently; library errors surface explicitly. Default to the safe path.

## Context

FIN-006 (Test B — scripts vs. manual comparison across wireframes + messaging canvas) showed scripts win on three op shapes and tie on two:

- **Script wins:** scattered multi-depth field updates (WF2), nested bulk rewrites across variants (MC1), structural inserts with full schema (MC2).
- **Tie:** consistent bulk rename at same depth (WF1), structural append at known location (WF3).
- **Manual wins:** top-level labels remap, ≤4 keys (MC3) — the sole case the Exception list covers.

This evidence bounds the exception list to MC3-shaped operations and confirms the library is the right default for everything else.

---

## References

- Library: `references/scripts/ux_utils.py` (single-file bundle — `shell_template`, `data_block_mutator`, `html_inspector`, `json_inspector` sections)
- FIN-009: Phase 2 direction — module scope and build order — `projects/2026-04-23-interactive-html-utilities/DECISIONS.md`
- FIN-010: Rule shape, location, and cross-reference convention — `projects/2026-04-23-interactive-html-utilities/DECISIONS.md`
