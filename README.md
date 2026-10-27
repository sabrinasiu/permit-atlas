# San Francisco Permit Atlas

Interactive map of building permits shown in approximate 150 × 150 meter blocks. The map fills the page, with floating search, counts, details, and a collapsible Permit layers tile.

The only basemap is a clean vector illustration: pearl gray land (#EEEEEA), thin blue streets, and sky blue water (#C5E3F3). Street and neighborhood names are drawn as crisp vector text at device resolution, with no text blur or pixel-recoloring effect. Address-number, building, POI, shield, grain, and hatching layers are omitted. Numbered street names such as 18th Street remain street names.

## Controls

- The mayor dropdown has been removed. All available snapshots are combined for January 11, 2011–October 27, 2026 (439,698 unique permits).
- A single Permit layers tile expands into a horizontally scrollable tray of additive permit-type cards. The tray starts collapsed; selections remain active when closed. Neighborhood search refines the combined data.
- Click a block for descriptions, categories, and issue dates. Single-category headings read “N issued [type] permit(s).”
- No address fields or exact-location markers are displayed. Blocks remain fixed as you zoom.

Blocks containing multiple selected types display a colored strip for each type. Strips distinguish categories and do not indicate project footprints. Darker strips contain more permits of that type. These are approximate block-sized grid areas, not official city-block boundaries. Text descriptions are public source text and may mention locations in their narrative.

## Data coverage

Complete primary-address permit snapshots were downloaded October 27, 2026, with pagination rather than a single response limit:

- Lurie: 38,547 permits, January 8, 2025 through October 27, 2026.
- Breed: 164,037 permits, July 11, 2018 through January 7, 2025.
- Farrell: 17,114 permits, January 23 through July 10, 2018.
- Acting Breed: 3,457 permits, December 12, 2017 through January 22, 2018.
- Lee: 216,543 permits, January 11, 2011 through December 11, 2017.

Terms use issue dates, with the successor’s inauguration date assigned to the successor at day-level precision. These are periods when permits were issued, not claims about who initiated or approved a project. All statuses are included. Permit numbers are deduplicated; address fields are omitted and precise coordinates are replaced by grid centers in saved files. Records without map coordinates remain in counts but cannot be plotted.

Source: https://data.sf.gov/resource/i98e-djp9.json
Dictionary: https://sfdigitalservices.gitbook.io/dataset-explainers/dbi-building-permits-and-permit-addenda-data/building-permits-data-dictionary
Term chronology: https://en.wikipedia.org/wiki/Mayor_of_San_Francisco
Breed inauguration city transcript: https://sanfrancisco.granicus.com/TranscriptViewer.php?clip_id=30982&view_id=18
Lee swearing-in city transcript: https://sanfrancisco.granicus.com/TranscriptViewer.php?clip_id=11391&view_id=197
Lurie inauguration coverage: https://www.sfchronicle.com/sf/article/daniel-lurie-was-sworn-in-as-s-f-mayor-20013863.php/

Refresh from DataSF requests every page from January 11, 2011 through the present. It does not overwrite the bundled snapshots. If any saved partition fails to load, the map shows an error rather than incomplete totals. Source type 9 has no definition and is labeled unspecified. Electrical and plumbing permits are separate datasets and are not included.

## Run or host

The site is running in this session at http://127.0.0.1:5174/. To run it later, serve this folder with a static server, for example `python3 -m http.server 5174`. File-URL opening may prevent JSON loading. To publish elsewhere, upload the complete directory including data/ and vendor/.

Internet is required for OpenFreeMap vector tiles, map fonts, and live refresh. Leaflet 1.9.4, MapLibre GL JS 5.6.1, and the MapLibre Leaflet bridge 0.1.4 are bundled with their licenses. The local map-style.json sets the palette and label rules. OpenFreeMap, OpenMapTiles, and OpenStreetMap attribution is retained. UI Google Fonts has system-font fallbacks.

## Verification

Checked syntax, all five term boundaries, uniqueness and total counts, omission of address fields, illustrated tile rendering, removal of other basemap controls, mayor selection and count changes, roomy dropdown rendering, full-viewport map layout, opening and closing the layers tray, retained checkbox selections, additive counts (27 + 70 = 97 for two Lurie construction types), and existing block descriptions. The earlier version’s issue-date filters and address-level views have been removed.

## Manual timeline and permit history

The floating timeline has no Play button or autoplay. Use its two month inputs or two range handles to set an inclusive month range. All dates resets the full available period.

- Issued: issuance falls inside the period.
- Completed: a valid recorded completion falls inside the period, even when issuance was earlier.
- Permit window: issuance overlaps the period through recorded completion or a known terminal status change. A missing end is left unknown, not described as confirmed ongoing construction.
- History: cumulative permits issued by the end month; types with recorded completion are faded.

The histogram shows the selected permit types’ monthly issuance counts, or completion counts in Completed mode. A block’s history lists original descriptions, both milestone dates, elapsed days when valid, and the current status with its recorded date. Current status is not a reconstruction of past statuses. The snapshots cover permits issued since January 11, 2011; completions of earlier-issued permits are outside this cohort.

Lifecycle audit, October 27, 2026: 439,698 permits; 282,232 have a completion date; 157,466 have no completion recorded. Eighteen completion dates predate issuance and are flagged and excluded from completion filtering and elapsed-day calculations. Issuance is not actual construction start; recorded completion is when inspection staff finalized completed work. No actual construction duration is asserted.

Validated lifecycle boundary conditions, missing completions, recorded closures, inconsistent dates, cumulative history, and elapsed days. Compared browser counts against independently counted source records: new construction has 488 issued permits, 315 valid completions, and one recorded completion in January 2024.

## Push to GitHub

From this directory, initialize Git, commit the files, and create a repository with the GitHub CLI. The data snapshots are included so a clone runs without a data-download setup step. The largest snapshot is about 85 MB, under GitHub’s 100 MiB per-file limit, but may trigger a large-file warning. Publishing to GitHub does not itself deploy a live website.
