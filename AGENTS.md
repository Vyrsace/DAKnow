# DAKnow project rules

These rules carry the user's standing request to review, verify, and troubleshoot every catalog change before delivery. Apply them to work in this repository. The user's latest instructions and accepted decisions take precedence; use judgment to fulfill the intended result without rigidly overinterpreting an example or expanding the scope.

## Scope and evidence

- This is a historical catalog of Windows versions of DarkAges and its related games and regional editions. Add only titles and services the user has authorized. Do not introduce phone games, the Code Dragon mobile project, or other unsolicited services.
- Never invent a title, release date, version, developer credit, logo, official translation, or download identity. Keep regional operator, original developer, localization company, service territory, and server location distinct. A regional service is not automatically a separate original game.
- Prefer primary evidence: official pages, contemporary publisher announcements, recovered packages, and their embedded metadata. Clearly distinguish an announced plan from an observed release, and a Wayback capture date or file timestamp from a release date. A manifest schema version is not a game version.
- Show material uncertainty plainly and briefly. The latest preserved or documented version is not necessarily the final release, and a historical download is not automatically current. Do not resolve conflicting evidence by silently choosing the convenient claim. Preserve the qualification in Research Notes when the table needs a concise label.
- Use real, inspected publisher logos. If an authentic logo cannot be recovered, leave it absent. Do not generate, improvise, or substitute one. Use established English names; otherwise retain the native name and use a clearly identified pronunciation only when requested.

## File and package identity

- Name the file actually downloaded. If it is an archive, disc image, repack, or multipart container, describe its relevant contents consistently and distinguish that container from the original client or patch installer inside it.
- Hash the original installer or relevant game payload when establishing identity. Do not present a container hash as the enclosed installer's hash, or assume different package names mean different clients. Record the algorithm and the exact object hashed.
- Consolidate identical files only on verified exact-hash identity. Containers with different hashes may be mirrors of the same enclosed installer only after its identity is verified. Retain meaningful differences between variants and keep multipart sets together.
- Preserve verified URLs, filenames, hashes, source references, findings, and version associations unless the requested change or new evidence justifies correcting them. Keep table Notes about file properties or the requested release labels; place supporting research and citations in Research Notes and Sources.

## Preserve the accepted presentation

- Keep the established compact visual language: restrained spacing, consistent file labels and download links, square note bullets, and no unnecessary dividers or extra panels. Client and Patch download cards remain visible without expand/collapse controls unless the user changes that decision.
- Research Notes use title-based groups, with General first. Sources remain one consolidated list in numeric Ref order. Preserve reference IDs and working cross-links. Both sections remain collapsed by default unless requested otherwise.
- Title cards follow the shared metadata and paragraph layout. Keep company and country text left aligned, history before gameplay, native names on their own line, and date ranges without a "Released:" prefix. Maintain a usable desktop and mobile presentation.

## Change and review workflow

1. Start from the latest published and accepted baseline. Check repository state and current deployment before applying a builder or script. Never rerun a stale builder that could revert accepted changes. Preserve unrelated content and work already in progress.
2. Implement the authorized request in full, with routine choices guided by the user's intent. Keep a clear distinction between requested edits and evidence-driven corrections. Do not add speculative features or redesign unrelated areas.
3. Review the content against the request and its evidence, including title/region distinctions, release labels, package contents, hashes, citations, and retained data. Check that the wording does not imply more than the sources establish.
4. Inspect the actual rendered result at desktop and mobile widths. Review alignment, wrapping, card and table widths, overflow, density, readability, and complete native-script glyph rendering. Exercise affected controls and links, including filters, reset, navigation, and expandable sections. Run checks appropriate to the change.
5. Fix any errors, conflicts, regressions, or gaps found in review, then repeat the affected review. Continue until the authorized work is complete and confidence is high. Do not substitute a claim of review for inspection or leave a known issue unexplained.
6. The user has already authorized publishing this catalog to the existing DAKnow GitHub repository and GitHub Pages site. Routine updates to that destination do not require renewed approval. Verify the published result and report the outcome concisely, with any material unresolved uncertainty. New destinations or unrelated actions are outside that authorization.

This review routine applies throughout the project; the user should not have to repeat it on each request.
