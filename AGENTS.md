# DAKnow project rules

These rules carry the user's standing request to review, verify, and troubleshoot every catalog change before delivery. Apply them to work in this repository. The user's latest instructions and accepted decisions take precedence; use judgment to fulfill the intended result without rigidly overinterpreting an example or expanding the scope.

## Scope and evidence

- This is a historical catalog of Windows versions of DarkAges and its related games and regional editions. Add only titles and services the user has authorized. Do not introduce phone games, the Code Dragon mobile project, or other unsolicited services.
- Never invent a title, release date, version, developer credit, logo, official translation, or download identity. Keep regional operator, original developer, localization company, service territory, and server location distinct. A regional service is not automatically a separate original game.
- Prefer primary evidence: official pages, contemporary publisher announcements, recovered packages, and their embedded metadata. Clearly distinguish an announced plan from an observed release, and a Wayback capture date or file timestamp from a release date. A manifest schema version is not a game version.
- Show material uncertainty plainly and briefly. At the user's request, "Final Release" labels the last numbered version documented in this catalog for an inactive service; preserve the Research qualification that this does not prove a terminal build. A historical download is not automatically current. Do not resolve conflicting evidence by silently choosing the convenient claim.
- Use real, inspected publisher logos. If an authentic logo cannot be recovered, leave it absent. Do not generate, improvise, or substitute one. Use established English names; otherwise retain the native name and use a clearly identified pronunciation only when requested.

## File and package identity

- Name the file actually downloaded. If it is an archive, disc image, repack, or multipart container, describe its relevant contents consistently and distinguish that container from the original client or patch installer inside it.
- Hash the original installer or relevant game payload when establishing identity. Do not present a container hash as the enclosed installer's hash, or assume different package names mean different clients. Record the algorithm and the exact object hashed.
- Consolidate identical files only on verified exact-hash identity. Containers with different hashes may be mirrors of the same enclosed installer only after its identity is verified. Retain meaningful differences between variants and keep multipart sets together.
- Preserve verified URLs, filenames, hashes, source references, findings, and version associations unless the requested change or new evidence justifies correcting them. Version List Notes contain documented changes from previous regional versions and significant release events only. Package properties, prerequisites and conversion routes belong in Downloads; supporting research and citations remain in Research Notes and Sources.
- Downloads has Version, Type, Filename, Size and Notes columns. Client includes an installer, packaged client or standalone game executable; Patch modifies existing files. The loose Singapore 4.21 game executable is Client, while its patch installer is Patch. Hosted links carry Client/Patch badges, patch routes use a secondary badge, and external mirrors carry Archive badges. Until hosting is configured, keep hosted links as inert dummy targets with href="#downloads" and data-hosted-placeholder="true"; do not invent hosting URLs or add visible or ARIA hosting-status remarks. Preserve all mirror aliases and complete multipart order.
- Hashes has Version, Filename, Size, Hash and Notes columns and lists the main executable only for versions with preserved downloads, grouped by region with United States first and South Korea second. Korean game clients use Legend.exe; lodr.exe is an installer. Put each client version in the first column instead of repeating it in Notes. Use exact filename case, decimal MB with exact bytes in square brackets on one line, SHA-256 and bulleted file notes. The supporting assets/data/client-hashes.json retains executable provenance; scripts/build_version_catalog_hashes.py in the parent project rehashes preserved bytes and supports --verify.

## Preserve the accepted presentation

- The page h1 has two lines: "DarkAges" first and "International Version Catalog" second, with the subtitle at 60% of the main h1 size (0.6em). Retain the established font for text outside tables.
- Keep the established compact visual language: restrained spacing, consistent file labels and download links, square note bullets, and no extra panels. Version List, Downloads and Hashes use matching collapsible cards, all closed by default. Version List omits Downloads; Filters has its own heading. Keep gaps between sections tight and make outer card borders clearly visible. Do not add dividers between sections or a divider after the header introduction; keep the requested Notes column borders.
- Table of Contents is a static vertical guide outline with tight line spacing, slight indentation and no counters, numbering, underlines or internal divider. Keep the gap from its heading to the first Titles link tight. Match the padding above its heading to the padding below the Sources link, using one shared 12px value on desktop and mobile. Its card has a fixed width of roughly one title card (400px), capped at 100% of available width on mobile. Contents links reveal collapsed destination cards, including repeated clicks on the same fragment.
- Version List sorting accumulates columns in header-click order (primary, then secondary), cycles ascending/descending/off and keeps undocumented values last. Do not show a sorting-status/reset toolbar, a separate Reset sorting control or sorting help text. Retain Reset filters, which preserves sorting.
- The summary dividers in all six expandable sections (Version List, Downloads, Hashes, Verification, Research Notes and Sources) use the same visible border token as their outer cards.
- Research Notes use title-based groups, with General first. Sources remain one consolidated list in numeric Ref order. Preserve reference IDs and working cross-links. Both sections remain collapsed by default unless requested otherwise. Their tables use visible border colors and rules consistent with the other table sections.
- Title cards follow the shared metadata and paragraph layout with tight gaps between cards. Keep company and country text left aligned, history before gameplay, native names on their own line, and date ranges without a "Released:" prefix. The visible title-range indicator uses "# - #" without a total count. Maintain a usable desktop and mobile presentation.
- Share the fixed 96px Version width across Version List, Downloads and Hashes. Version List and Downloads share a fixed 720px Notes column at the right, with its left edge aligned between those two tables. Hashes retains its separate fixed 360px Notes column. In each table, the column immediately before Notes absorbs the remaining width. Give other columns fixed widths sufficient to keep each item and header unwrapped. Verification, Research Notes and Sources are excluded from this sizing rule. Preserve left alignment, top-aligned Notes, exact data and all working links.
- File Verification Methodology and Research Methodology paragraphs fill the available card width and wrap responsively. Do not limit these paragraphs with a character-based maximum width.
- Every table uses a Consolas-first monospace font for all its text, including headers, buttons, badges, links, nested spans and code. This includes Verification, Research Notes and Sources tables even though their column sizing remains independent. Keep text outside tables in its existing font.

The user's current table and spacing requirements supersede earlier display defaults:

1. Top align Notes cells in Version List.
2. Top align Notes cells in Hashes.
3. Decrease padding in every Version List row, keeping the contents tight with a small gap so they do not touch.
4. Decrease spacing between title cards.
5. Make Downloads and Hashes collapsible and closed by default, matching Version List; Contents navigation still expands them before scrolling.
6. Remove the "Hosting pending" remark everywhere, including visible labels, helper text and ARIA remarks. Keep the hosted dummy links without inventing real download URLs.
7. Keep each Hashes size on one line, for example 0.70 MB [704,512 bytes].
8. Place Version first in Hashes and move the version value from Notes into that column.
9. Left align all cells in tables that contain a Version column.
10. Display ? in place of Unnumbered, including qualified Unnumbered labels. Preserve raw unknown-version labels in catalog records and provenance where needed.
11. Add a left border to every Notes column cell, including the header. Apply the same Notes treatment to Research Notes' Evidence and notes columns.

The catalog uses shared typography, spacing and download sizing tokens. A dedicated styling skill is pending the user’s next review and agreement on the visual direction.

Version List and Downloads use a 1600px minimum table width and fixed 720px Notes columns, doubled from the previous 360px width while preserving all existing non-Notes column widths. Hashes keeps its 1240px minimum table width and fixed 360px Notes column; the latest Notes expansion applies only to Version List and Downloads. All three retain a fixed 96px Version column. At narrower viewports, scroll each table within its card. Release Date, download Size and Hash remain the fluid columns immediately before Notes. Keep the other column widths fixed and check the longest displayed values before changing these tokens; make only the minimal width adjustments needed for wider monospaced text.

## Change and review workflow

1. Start from the latest published and accepted baseline. Check repository state and current deployment before applying a builder or script. Never rerun a stale builder that could revert accepted changes. Preserve unrelated content and work already in progress.
2. Implement the authorized request in full, with routine choices guided by the user's intent. Keep a clear distinction between requested edits and evidence-driven corrections. Do not add speculative features or redesign unrelated areas.
3. Review the content against the request and its evidence, including title/region distinctions, release labels, package contents, hashes, citations, and retained data. Check that the wording does not imply more than the sources establish.
4. Inspect the actual rendered result at desktop and mobile widths. Review alignment, wrapping, card and table widths, overflow, density, readability, and complete native-script glyph rendering. Exercise affected controls and links, including filters, reset, navigation, and expandable sections. Run checks appropriate to the change.
5. Fix any errors, conflicts, regressions, or gaps found in review, then repeat the affected review. Continue until the authorized work is complete and confidence is high. Do not substitute a claim of review for inspection or leave a known issue unexplained.
6. The user has already authorized publishing this catalog to the existing DAKnow GitHub repository and GitHub Pages site. Routine updates to that destination do not require renewed approval. Verify the published result and report the outcome concisely, with any material unresolved uncertainty. New destinations or unrelated actions are outside that authorization.

This review routine applies throughout the project; the user should not have to repeat it on each request.
