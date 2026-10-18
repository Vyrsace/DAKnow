# DAKnow catalog design

## Direction

A readable historical catalog with the feel of a curated paper collection. Cool pebble gray surrounds warm stone structures and off-white content. Plum identifies links and focus; marigold identifies selected filters and Download actions. These colors have separate jobs rather than making every component a variation of one hue.

Color reference: [Woset on Refero Styles](https://styles.refero.design/style/430813c0-f0c7-434f-92ef-d3a0780ba734), reviewed October 18, 2026. Its gray canvas, dark text and selective yellow accents inform this adaptation. The reference's muted text is darkened for this catalog's small type. Warm structural neutrals and a restrained plum link color preserve the catalog's existing hierarchy.

This is the current visual contract for the catalog and its three policy pages. Color values live once in `assets/site.css`; components consume semantic variables. Later owner instructions take precedence.

## Palette by role

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Cool canvas | `--bg` | `#e5e7eb` | Space around all page containers |
| Paper | `--paper` | `#fcfbf8` | Cards, table bodies, inputs and policy text |
| Ink | `--ink` | `#29282d` | Body text and filenames |
| Heading ink | `--heading` | `#25232b` | Headings and column labels |
| Muted ink | `--muted` | `#615e66` | Metadata, counts and translation labels |
| Warm stone | `--section-surface` | `#d9d6d0` | Section and policy title bands |
| Pale stone | `--table-title-surface` | `#e7e3dc` | Integrated table title rows |
| Cool pale gray | `--table-header-surface` | `#f0eff2` | Column headers |
| Group gray | `--table-group-surface` | `#dfdbe5` | Merged title and research group rows |
| Quiet stripe | `--row-stripe` | `#f4f3f0` | Alternating data rows |
| Quote gray | `--quote-surface` | `#eeedf3` | Official excerpt panels |
| Plum | `--accent` | `#50456f` | Text links, disclosure signs and icons |
| Deep plum | `--accent-hover` | `#3b3154` | Link hover |
| Focus plum | `--focus` | `#64527e` | Keyboard focus outlines |
| Marigold | `--action` | `#ecca53` | Download actions and compact current-state labels |
| Marigold hover | `--action-hover` | `#dfbd49` | Download hover |
| Action ink | `--on-action` | `#2d2a22` | Dark, legible labels on yellow actions |
| Selected wash | `--selection-surface` | `#f5e6ac` | Applied chips, selected dropdowns/options and citation target |
| Plum wash | `--accent-soft` | `#eeebf5` | Release-status labels outside Downloads |
| Warm wash | `--warm-surface` | `#f5e9cb` | Beta/planned-status labels outside Downloads |
| Warm label ink | `--warm-ink` | `#715321` | Text on warm badges |
| Neutral wash | `--neutral-surface` | `#eeece8` | All descriptive Downloads badges and conversion labels |

Other border and state tokens provide related neutral steps, not additional accent families. Borders use Ash-like warm grays: `--line` #d5d1cc, `--card-border` #b8b3ab and `--control-border` #89847d. Interactive yellow uses the darker `--action-border` #91752a. Muted Stone #8d8c8a is reserved for disabled controls, not ordinary small text.

## Component rules

- Use warm section bands, lighter table titles and cool column/group rows to make the nested hierarchy visible. Keep their current padding, borders and geometry.
- Use marigold sparingly for useful actions and selected state. Do not fill section headers, tables, paragraphs or whole cards with yellow.
- Keep links plum and ordinary labels ink. Download is a gold action. Original, Repack, Mirror, Client, Patch and conversion labels all use the same neutral wash, ink and card-border colors, including the Legend. Do not assign arbitrary colors to descriptive package categories. Preserve their shared dimensions and file alignment.
- Highlight table title bars in both states and only the hovered column-header cell. Body rows have no hover fill. Use the existing shared neutral hover surfaces; retain visible focus outlines.
- Keep Official material in consistent flat quote panels with thin horizontal rules. Translation labels use muted ink, and language links use plum.
- Retain the lightbox's approved dark backdrop and white image edges. Preserve every original image, logo and flag color.
- Keep surfaces flat and restrained. No new gradients, glows, decorative color blocks, animations or UI dependencies are needed for this palette.
- Choose coordinated colors by their roles and relationships. Do not default to greens or turn future components into tints of one core hue. Add a new accent only when a clear, repeated function needs it.

## Existing structure and type

Titles is the hero section: page introduction, Titles, Table of Contents, Versions, Downloads, Hashes, Verification, Research and Sources. Preserve the current carousel, responsive behavior and anchor IDs.

The Table of Contents container spans the same full width as the other section cards, sharing their left and right edges at every viewport size.

Keep the existing body type and central 12px Consolas-first table typography, including its deliberate citation/route exceptions. Retain section padding, fitted fixed columns, scrollable table wrappers, default collapse, +/- controls, top-aligned download file slots, filters, sorting, translation switching and drag/swipe. The reference's shop layout, oversized headline, pill geometry and font are outside this color adaptation.

All six main collapsible sections, including Versions, start closed without a valid saved choice. Retain independent tab-session choices, browser refresh scroll restoration and intentional deep-link reveal. Individual tables still start collapsed.

Use the shared 8px table gap between peer tables in Versions, Downloads, General Notes, Hashes and Research. Retain the separate General Notes subsection heading and 6px section Page top gap.

Finger scrolling on the outer Titles strip and overflowing table bodies is native browser panning, including inertia and vertical scrolling/pinch zoom. Titles retains its owner-approved native touch snapping. Do not capture touch pointers, consume their movement or apply JavaScript release-distance snapping to these surfaces. Desktop mouse/pen card dragging and horizontal wheel scrolling are free-positioned: preserve the exact released offset, without forced whole-card advancement, snapback or restored CSS magnetism. Arrow and keyboard controls still move deliberately between cards. Nested image galleries retain their separate infinite swipe implementation.

Overflowing table backgrounds use the grab cursor and custom mouse/pen dragging. Actual text uses a text-selection cursor and native selection, not table dragging; links/buttons retain their pointing cursor. Hit-test text geometry rather than marking entire cells as text or wrapping every text node. Mobile table text remains selectable by long press: never disable its touch selection, even while tracking native scrolling. Clear selection artifacts only when a custom background drag actually begins/ends. Table scrollbar space remains stable: its paint is transparent at rest, appears during an active horizontal drag and hides on release, without resizing the wrapper.

Downloads file notes use `Region Title Version Type · Original/Repack`, followed only for external mirrors by ` · source`. Italicize the entire external-source phrase and link named hosting platforms to their main pages. Owner-hosted Original/Repack lines omit the hosting phrase. Classify mirrors by their verified contents: archives of original installers remain Original, while extracted setup/runtime packages are Repack. Preserve known channel distinctions. Omit gray Filename source captions; filenames, aligned actions, sizes and per-file slots stay unchanged. Detailed prior package notes and source captions remain in `assets/data/download-note-labels.json`, the existing research records and General Notes. The content master keeps the compact identity in Notes and the italic source separately in Source, without duplicating either text.

## Review before publication

- Check all four pages, including headings, cards, controls, tables, badges, quotes, galleries and footer.
- Inspect desktop and mobile views, expanded/collapsed tables, selected filters, hover/focus, dark image viewer and native-language text.
- Check enabled small text at 4.5:1 and identifying control/focus boundaries at 3:1 against their actual backgrounds. Darken reference colors where necessary.
- Verify table containment and download alignment at representative widths. Keep the current horizontal scrolling instead of a mobile card transformation.
- Refresh shared stylesheet hashes on all four pages. Run relevant content/master checks, publish to the existing destination, then inspect the served result.
