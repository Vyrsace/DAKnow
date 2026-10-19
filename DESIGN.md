# DAKnow catalog design

## Direction

A readable historical catalog with the feel of a curated paper collection. Cool pebble gray surrounds warm stone structures and off-white content. Plum identifies links and focus; marigold identifies selected filters and Download actions. These colors have separate jobs rather than making every component a variation of one hue.

Color reference: [Woset on Refero Styles](https://styles.refero.design/style/430813c0-f0c7-434f-92ef-d3a0780ba734), reviewed October 18, 2026. Its gray canvas, dark text and selective yellow accents inform this adaptation. The reference's muted text is darkened for this catalog's small type. Warm structural neutrals and a restrained plum link color preserve the catalog's existing hierarchy.

This is the current visual contract for the catalog and its three policy pages. Color values live once in `assets/site.css`; components consume semantic variables. Later owner instructions take precedence.

Table and Downloads category title bars toggle without transferring pointer focus to their +/- buttons. Pointer/touch activation shows no purple square around these controls; keyboard navigation and activation retain the shared visible focus outline.

Methodology, File Hashes and Sources Index are static tables inside their collapsible sections. Their title bars retain the shared visual hierarchy but have no +/- button, toggle action, pointer cursor or interactive hover fill. Research quick links highlight only the destination category divider using the shared three-second feedback.

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
- Keep links plum and ordinary labels ink. Download is a gold action. Downloads omits the Legend, Type column and all descriptive package/conversion badges. Preserve package identity in metadata and the existing compact Notes, and retain aligned filename/action/size/file slots.
- Highlight table title bars in both states and only the hovered column-header cell. Body rows have no hover fill. Use the existing shared neutral hover surfaces; retain visible focus outlines.
- Keep Official material in consistent flat quote panels with thin horizontal rules. Above each panel, use bold Official · italic literal post title (named original publisher · linked archive, or linked named source) followed immediately by its upright superscript reference. Source labels use Nexon Korea, NewsWire, Library of Loures and other established names, rather than raw domains or a platform alone. Link to the exact post/snapshot, preserving each post's native title and any authored date. Translation labels use muted ink; language switches update citation tooltips as well as titles and bodies.
- Retain the lightbox's approved dark backdrop and white image edges. Preserve every original image, logo and flag color.
- Keep surfaces flat and restrained. No new gradients, glows, decorative color blocks, animations or UI dependencies are needed for this palette.
- Choose coordinated colors by their roles and relationships. Do not default to greens or turn future components into tints of one core hue. Add a new accent only when a clear, repeated function needs it.

## Existing structure and type

The original Malaysian title is Legends of Opherlias, including its short form Opherlias in current descriptions and accessible/filter labels. Preserve the existing orphelias anchors, asset/download filenames, URLs, source captures and quotations. This display spelling correction does not rename preserved files or rewrite historical evidence.

Titles metadata follows a compact two-column definition-list pattern with subtle horizontal dividers: Company, Region, Launched/Announced/Active, Website. Region combines the shared flag with a smaller muted uppercase country code and full country name. The Official Website link has an 11px external-link glyph within its existing 24px target. Its compact shared preview fits short URLs naturally and caps long URLs at 320px (or viewport minus 24px), with a locally preserved 16px destination favicon, ellipsized URL/open arrow and 16px overlapping-squares Copy icon in a 24px button. Keep copy feedback/failure accessible without changing the panel width, exact URL copying, keyboard/touch dismissal and focus return. Archived destinations use the Internet Archive favicon; all six original icon files/provenance live in assets/website-icons, with no third-party hover requests. Keep ordinary link navigation and keyboard/touch access. Active titles show starting years only, Taiwan uses Announced, and inactive services keep Years ranges.

Downloads General Notes uses one integrated default-collapsed table with the shared title bar and seven highlighted full-width category rows. Preserve its existing Subject/Notes/Sources geometry and category filtering/fragment identities; do not add extra nested cards or regional toggle bars.

Downloads' primary table is Files. Its seven full-width regional category rows keep the previous region order and flag-first labels. Each has the same 24px +/- target and 21px glyph as the shared disclosure control; the button stays 8px inside the scrolling viewport's right edge. Only the first region opens initially, while Files itself starts collapsed. The whole non-interactive category row toggles, with the normal title-row hover and keyboard-accessible button. A regional quick link closes sibling categories and reveals its target; manual toggles can open multiple categories. Filters reveal all matching categories and hide zero-result categories; print includes non-filtered contents. Retain four-column geometry and all synchronized file slots.

Research now contains two integrated tables, both initially collapsed. Methodology groups the unchanged Research and File Verification paragraphs under full-width group rows, with a single Notes column that wraps to the viewport. Research Notes consolidates General, File Verification and all eight game-title categories. The two former verification-note groups become rows under File Verification. Retain all 248 original research rows, their kind headings, flags, citations and anchors, plus the two moved verification rows. Its columns are fixed 320px Subject, 144px Region, fluid Notes and fixed 240px Sources, with the existing 1604px minimum. All table text remains on the central 12px scale; disclosure glyphs retain their shared control sizing. Keep the shared palette, group fills, title/header hover, default collapse, conditional drag/native touch and print behavior.

Printing temporarily opens the five collapsible main sections so their non-filtered table contents can render, then restores the previous section states. Temporary print openings must not replace saved session choices; table/category controls stay hidden in print.

Hashes likewise uses one integrated default-collapsed File Hashes table. Seven full-width, five-column title rows use the shared table-group-surface, bold left alignment and 5px/8px padding. Preserve all 34 executable rows, category flags and regional fragments. Version, Filename and Size retain 96px, 116px and 205px widths; Hash is fixed at calc(64ch + 16px), fitting complete SHA-256 values and cell padding. Notes takes the remaining width within the existing 2070px table minimum. Regional shortcuts have a 6px bottom margin, followed by the shared Page top link and its 6px gap. Preserve notes wrapping, conditional overflow/dragging, native touch and exact-byte parentheses. Keep the File Hashes title bar outside horizontal scrolling, with the same shared +/-/hover/focus behavior as other tables.

Archived Versions citations show the original publisher and linked Internet Archive or Library of Loures, with reviewed English titles initially. Library of Loures links target the exact News XML blob; its selected pre-2005 posts are Nexon US and its selected later posts are KRU Interactive. Downloads source phrases likewise identify the provider before a platform: The Buck Network (Google Drive), with the provider archive page and exact Drive file page linked separately. Internet Archive links target the matching snapshot/item; Nexon Korea points to the relevant LoD or Elancia site. Use ATFile and Nexon US consistently. Opherlias mirrors omit the visible Repack suffix while retaining package classifications and hosted Repack labels. Navigation feedback uses the existing restrained selection wash/border for three seconds, also clearing on click-away. Apply it to the destination section/table/row without a permanent :target fill or new color role.

Titles is the hero section: page introduction, Titles, Table of Contents, Version History, Downloads, Research, Hashes and Sources. Verification's content is integrated into Research. A normal TOC activation closes all collapsible sections and tables, opens the selected section, and reveals its target table/category only when a subsection link was chosen. Titles retains its hero carousel. Preserve native modified/keyboard links, repeated-fragment reveal, independent filters and ordinary non-TOC navigation. The page has eight catalog tables and five collapsible main sections.

Outer Titles controls sit below the cards, centered on the visible carousel viewport. Place the live range just above the paired arrows (2px row gap), with 10px above the control group. Arrows use 32px by 30px targets and 18px glyphs; retain muted/plum hover/focus colors and disabled endpoint feedback. Do not shrink nested image-gallery or popup controls. Versions and Downloads Region dropdown choices use the existing 3:2 flags at the adjacent label's font height, separated from their country names by 6px; retain ordinary checkbox and selected-state feedback.

The Table of Contents container spans the same full width as the other section cards, sharing their left and right edges at every viewport size. Its bottom-to-Versions card gap matches the shared 10px gap between main section cards.

Keep the existing body type and central 12px Consolas-first table typography, including its deliberate citation/route exceptions. Retain section padding, fitted fixed columns, scrollable table wrappers, default collapse, +/- controls, top-aligned download file slots, filters, sorting, translation switching and drag/swipe. The reference's shop layout, oversized headline, pill geometry and font are outside this color adaptation.

All six main collapsible sections, including Versions, start closed without a valid saved choice. Retain independent tab-session choices, browser refresh scroll restoration and intentional deep-link reveal. Individual tables still start collapsed.

Use the shared 8px table gap between peer tables in Versions, Downloads, Hashes and Research. General Notes uses its own integrated table title bar instead of a separate subsection heading. Retain the 6px section Page top gap.

Finger scrolling on the outer Titles strip and overflowing table bodies is native browser panning, including inertia and vertical scrolling/pinch zoom. Titles retains its owner-approved native touch snapping. Do not capture touch pointers, consume their movement or apply JavaScript release-distance snapping to these surfaces. Desktop mouse/pen card dragging and horizontal wheel scrolling are free-positioned: preserve the exact released offset, without forced whole-card advancement, snapback or restored CSS magnetism. Arrow and keyboard controls still move deliberately between cards. Nested image galleries retain their separate infinite swipe implementation.

Overflowing table backgrounds and Titles backgrounds use grab and custom mouse/pen dragging, with ew-resize while held. Actual text uses an I-beam and native selection; links/buttons/icons and image galleries retain their normal cursors/controls. Hit-test text geometry so whitespace within text elements can drag. Tables enable this only when expanded and actually overflowing in the current viewport; clear stale cursor/gesture state after resize/filter/collapse. Mobile table text remains selectable by long press. Clear selection artifacts only when a custom background drag actually begins/ends. Table scrollbar space remains stable: transparent at rest, visible during an active horizontal drag and hidden on release, without resizing the wrapper.

Downloads file notes use `Region Title Version Type`, with ` · Repack` only for repacked files and ` · source` only for external mirrors. Do not display an Original marker in Notes. Italicize the entire external-source phrase and link named hosting platforms to their main pages. Owner-hosted lines omit attribution. Preserve package classification internally and known channel distinctions. Omit gray Filename source captions and Original/Repack badges. Every filename begins at the same unindented left edge; omit Mirror badges and matching mirror-heading spacer slots in all file columns. Keep aligned actions, sizes and per-file slots unchanged. The Legend, Type column and conversion badges are omitted. Type filtering and four patch-route metadata values remain available internally. Detailed prior package notes and source captions remain in `assets/data/download-note-labels.json`, the existing research records and General Notes. The content master keeps the compact identity in Notes and the italic source separately in Source, without duplicating either text.

Downloads uses four columns: Version at 96px, Filename at calc(60ch + 32px), Size at calc(29ch + 17px) and fluid Notes with at least 320px. The minimum is calc(89ch + 465px), replacing its former 2070px canvas; General Notes uses 200px Subject, fluid Notes and 240px Sources at a 760px minimum. Preserve aligned filename/action edges and synchronized file slots. Version remains left aligned with its accepted vertical alignment. All fourteen Downloads regional table titles place the preserved flag before the game title, omitting the visible country name; country tooltips, image alt text, data-country metadata and region-qualified toggle labels preserve identification and filtering. Versions Regions shortcuts show only the flags plus All, with accessible country names and country tooltips. Selecting a flag adds a highlighted border; selecting it again clears the shortcut and country selection. Another flag replaces it; All and Reset clear it. Every manual filter/search refresh clears the shortcut highlight without discarding the resulting dropdown/search choices. Keep the shared versionfilterschange event and regression coverage. Downloads omits its Regions shortcut line. Sources Index uses the same conditional overflow, background drag, native touch pan, text selection, active-only scrollbar and collapse behavior as all other tables; verify it explicitly rather than adding a second gesture implementation. The former Legend definitions remain historical evidence; do not restore the removed Legend.

Country flag icons share the Korean flag's 3:2 display box (1.5em wide by 1em high, scaled with adjacent text), with consistent fitting across every section and table. This supersedes natural per-country display proportions; preserve original SVG assets and colors. U.S. and Malaysian flags use the small root-viewport display variants in assets/flags/display to prevent intrinsic SVG letterboxing; source and display hashes are separate in assets/flags/sources.json, and all original SVGs remain untouched. Each Titles card places its country flag before its unchanged region text. Hashes and Downloads regional table headings use flag-first game titles without visible country labels, retaining tooltips, accessible country identification and country-qualified toggle labels. Every game-specific Research heading has its represented countries' flags; DarkAges uses United States/Singapore, Legends of Darkness uses South Korea/Singapore, and General stays neutral.

Versions and Downloads manual filter activation (flag, dropdown or nonempty search) expands all matching visible tables in that section, including matching Downloads General Notes, without sorting or moving focus. Use the shared catalogfilteractivate event only for explicit active filtering, not startup/passive refresh, Reset or clearing the last filter; do not open unrelated or filter-hidden tables. Hashes/Research category and regional jumps, including repeated current-fragment activation, expand the targeted table before scrolling. Keep default collapse, native keyboard links, existing row/citation reveal, independent section/filter state and ordinary reset behavior.

## Review before publication

Desktop popup image viewers additionally support wheel navigation over the image area: down/right advances, up/left reverses, using the existing animated, infinitely wrapping gallery. Enable only above the 620px narrow layout with a fine, hovering primary pointer. Accumulate small deltas and rate-limit steps without queuing during transitions. Keep caption scrolling, modified-wheel browser zoom, touch/pen swipes, arrows, keyboard controls, dismissal and card synchronization unchanged. Dispose the popup wheel listener on close/rebuild; do not add wheel navigation to card images or the outer Titles reel.

- Check all four pages, including headings, cards, controls, tables, badges, quotes, galleries and footer.
- Inspect desktop and mobile views, expanded/collapsed tables, selected filters, hover/focus, dark image viewer and native-language text.
- Check enabled small text at 4.5:1 and identifying control/focus boundaries at 3:1 against their actual backgrounds. Darken reference colors where necessary.
- Verify table containment and download alignment at representative widths. Keep the current horizontal scrolling instead of a mobile card transformation.
- Refresh shared stylesheet hashes on all four pages. Run relevant content/master checks, publish to the existing destination, then inspect the served result.

Downloads parenthetical host attribution contains only the linked platform name, without via or a media-format prefix inside those parentheses. Preserve edition/date/media information outside the parentheses and the original source detail internally.
