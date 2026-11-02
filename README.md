# New Construction Tracker

A full-page illustrated map of new-construction permits with mayoral reporting periods, housing-unit colors and build-site breakdowns. Open the website at http://127.0.0.1:5174/ in this session. To run it later, serve this directory with a static server such as `python3 -m http.server 5174`.

## Explore

The bottom timeline is divided into five clickable mayoral-term blocks: Ed Lee (2011–2017), acting mayor London Breed (2017–2018), Mark Farrell (2018), London Breed (2018–2024 chart window), and Daniel Lurie (2025–present). Selecting one updates the issuance heat map and counts to that term's exact inclusive dates. The initial selection is Daniel Lurie. There is no daily scrubber, date picker, Play button, stacked chart or empty-result banner.

Counts reflect issuance during the selected term, not claims that the mayor initiated the project. Colors represent proposed housing-unit counts: 1, 2–4, 5–19, 20–49, 50–99, and 100+. Recognized residential uses receive progressively darker blues. Nonresidential, ambiguous residential uses, missing counts and zero counts appear gray. Hotels and other commercial uses with positive source unit counts are kept gray. Stories are displayed separately and are not used to assign color. Only Type 1 new construction and Type 2 wood-frame new construction are included. Both are always enabled; there is no permit-layer selector. Neighborhood search refines the results. Click an approximate block for descriptions and full recorded histories of permits issued during the selected term. Dates after the term are marked accordingly.

The heat map shows relative spatial concentrations, with stronger opacity where permits are denser. It does not show exact addresses or individual property boundaries.

## Evidence and matching

Building permits: https://data.sf.gov/resource/i98e-djp9.json
Building inspections: https://data.sf.gov/resource/vckc-dh2h.json
Dictionary: https://sfdigitalservices.gitbook.io/dataset-explainers/dbi-building-permits-and-permit-addenda-data/building-permits-data-dictionary

Snapshot: October 27, 2026. There are 439,698 unique primary-address permits issued January 11, 2011–October 27, 2026. All administrative statuses are retained. The five data partitions are historical download partitions; there is no mayor filter.

Physical-work evidence is the earliest actual `appointment_date` on a PASSED, non-cancelled, permit-referenced inspection with a qualifying physical-work code. It must match the permit number AND the primary address's parcel, street number/name/suffix, and unit/suffix after conservative normalization. Ambiguous or unmatched addresses are excluded. Scheduled/request dates are not used. Dates before issuance or after a valid completion are excluded. No staff names are collected.

Qualifying codes: 120 forms, 121 partial forms, 122 reinforcing steel, 123 OK to pour, 125 partial rough frame, 126 rough frame, 127 insulation, 128 masonry, 129 shear wall, 132 flues/vents/ducts, 133 exterior lath, 134 OK to cover, 135 sheetrock nailing, 146 mechanical, 147 partial ceiling, 153 partial pour, 154 partial cover. Code 101 START WORK is excluded because it can be a preconstruction meeting. Office review, plan review, site verification, complaint and preapplication events are excluded. This is a conservative activity proxy, not a certified start-date dataset.

Inspection records begin October 2, 2014. No missing start is inferred. 277,546 qualifying inspection rows referenced permits in this cohort; 274,488 matched the primary address and valid chronology, yielding 106,177 permits with physical-work evidence. The public `work-milestones.json` contains only permit identifiers, evidence dates and codes; private address matching inputs are outside this website.

Valid `completed_date` values determine green. Eighteen completion dates before issuance are excluded and flagged. At the snapshot: 138,688 permit-only records, 18,796 work-documented records, and 282,214 completed records. These sum to 439,698. There are 215 records without usable map coordinates, included in counts but not plotted. The cohort excludes permits issued before January 11, 2011 even if their inspections or completion were later.

Refresh from DataSF refreshes permit records only; the inspection evidence remains dated October 27, 2026 and is separately labeled. Newly refreshed permits without matched snapshot evidence have unknown work start. Refresh does not overwrite bundled files. If inspection evidence fails to load, the interface warns that work-start stages cannot be determined.

## Location and map

Addresses are used privately for evidence matching, then omitted from website records. Saved coordinates are approximate centers of a fixed 150 m grid. No exact-address markers, address fields, or individual property boundaries are displayed. Multiple permits at a property remain distinct permits, not deduplicated construction projects. Primary-address matching does not claim coverage of every secondary address on a multi-address permit. Original descriptions may contain location references in their narrative. Permit identifiers are retained and this is not an anonymized source database.

The only basemap is the illustrated vector map: land #EEEEEA, water #C5E3F3, blue streets. House-number, building, POI and shield layers are omitted; numbered street names remain. Leaflet 1.9.4, MapLibre GL JS 5.6.1 and the Leaflet bridge 0.1.4 are bundled with licenses. Internet is required for OpenFreeMap tiles, vector fonts and live refresh. Attribution is retained.

## Verification

Validated red → orange → green boundaries with a real permit issued March 31, 2023, physical-work inspection August 31, 2023, and completion August 7, 2025. Checked missing starts, invalid completion chronology, future milestones, complete-data totals, and every published work date's relation to issuance and completion. Checked the single daily scrubber, date picker, additive type filtering, neighborhood filtering and clickable detail histories in the browser. No Play control is present.

Host the complete directory, including data/ and vendor/. The largest permit snapshot is approximately 85 MB; data is substantial and initial loading can take a few seconds. A GitHub repository alone does not publish a live website.

## Unit colors

`construction-details.json` enriches all 1,803 new-construction permits in the saved cohort with proposed use, units, existing units and stories from DataSF, retrieved October 28, 2026. No address fields are included. Recognized residential uses are one-family dwelling, two-family dwelling, apartments, residential hotel and residential workshop. Other uses remain gray even if a source unit count is positive. Group residences remain gray for review because counts may not represent conventional dwellings. Missing values are never converted to zero. Site-level proposed units are not units completed or verified units per individual tower. Totals sum reported units across distinct permit records, with the limitations described below; they do not infer unique completed homes.

Colors indicate each proposed-unit category, using layered brush marks for mixed blocks. Mixed blocks show their category breakdown in the tooltip and individual permit unit counts in details. Live refresh requests the same extra fields.

## Painterly marks

The map uses deterministic, textured palette-knife marks instead of blurred circular density spots. Ragged edges, parallel bristles and lighter paint ridges are drawn at device resolution. Colors retain the proposed-unit bins. Marks aggregate permits within approximate grid blocks; they do not depict exact footprints. Multiple categories within one block layer their strokes, and clicking retains the full breakdown. The mark shape stays stable while panning; size adjusts with zoom. Texture is decorative and does not encode additional data.

## Affordable housing in orange

Bright orange (#FF7A1A) overrides the unit-count color for identified affordable housing. Details retain reported total units and stories and separately show affordability evidence. The source is a retrieved snapshot, not a claim that affordability was known on the permit's issue date. Blue does not establish market-rate status.

`data/affordability.json` was built October 28, 2026 from the current SF Planning Pipeline (6jgi-cpb4), MOHCD Affordable Housing Pipeline (aaxw-2cb8), and explicit 100% affordable statements in the permit descriptions. Matches use exact 12-digit building permit numbers. A unique exact Planning case can bridge to MOHCD; no fuzzy or address matches are automatically accepted. Planning rows with confirmed, positive affordable units and type 100% or On-Site qualify. Fee-only and ambiguous/combination cases are not treated as confirmed on-site units. Unique MOHCD case matches with positive project affordable units qualify unless contradicted by a fee-only designation. Explicit 100% affordable permit descriptions qualify as reported, not independently confirmed. General keyword mentions do not qualify.

The cohort contains 27 confirmed and 26 description-reported orange permits. Estimates, preliminary data and ambiguous matches remain outside the orange class. Missing matches remain unknown, never zero affordable. Current pipelines omit many completed/historic projects, so this is not exhaustive affordability coverage. Affordable unit counts preserve their scope: remaining pipeline units are not substituted for full-project affordable totals or housing units completed. The website does not sum them across permits or phases. No matching addresses or contact fields are distributed. Affordability refresh remains a saved snapshot when permit data is refreshed.

## Mayoral reporting window

London Breed’s displayed reporting window ends December 31, 2024, so her label is 2018–2024 and no 2025 bar appears. Her official term continued until the January 8, 2025 handover; the original exclusive handover boundary is retained separately in the term configuration. The chart cutoff does not reassign January 1–7 permits to Lurie. There are zero Type 1/2 permits in those seven days in this snapshot, so her displayed total remains 597.

## Annual housing-unit totals

The mayor's total and annual bar graph now sum reported proposed housing units, grouped by permit issue year, rather than counting permits. Both respect the selected reporting period and neighborhood search. Only recognized residential uses with a valid nonnegative integer unit count contribute. Unknown values are not treated as zero, and nonresidential source counts (such as hotel rooms) are excluded. The chart note reports the excluded permit count. Permits are deduplicated by permit number. These are proposed site units recorded in issued permits, not completed units, net housing additions, or fully deduplicated project/tower totals across related permits. Affordability counts are not added to proposed-unit counts. Partial years remain marked.

## Build sites and units per build record

The mayoral panel shows separate build-site and proposed-unit totals. The By build site view lists anonymous sites with each associated permit's housing-unit count and issue date; By year retains the annual proposed-unit chart. The units total is explicitly labeled units in permit records. It is not a fully deduplicated physical dwelling inventory.

`build-sites.json` groups permits by exact primary parcel, street number/suffix/name/suffix, excluding unit identifiers. Raw address fields are used only in private preparation, and only opaque site IDs are published. This produces 1,737 site identities for 1,803 permits across the saved cohort; per-term grouping may differ. Site identities do not prove a one-to-one relationship to physical buildings. Repeated permits at one site remain visible with their individual counts rather than being assumed to add distinct homes. No unsupported unique-unit sum is inferred for a multi-permit site. Unknown and nonresidential unit counts remain explicit.

## Screenshot history

[Browse screenshots by commit and development iteration](screenshots/README.md). Historical commit images are representative original captures; the latest version includes direct overview, annual-unit and build-site-detail captures.

## Nested home-size donut

By home size is available beneath the mayor selector; Over time is the initial view. Categories are 1 unit, 2 units, 3–4 units, 5–19 units, 20–49 units, 50–99 units and 100+ units. The inner ring measures the number of build sites in each category; the outer ring sums the actual proposed housing units of the sites within each group. Group boundaries are never substituted for actual unit counts. Each ring has its own denominator. The scrollable key gives both exact numbers, and hover, focus or selection highlights a category in both rings. The chart follows the mayor and neighborhood filters.

A site contributes once if every selected permit at that site is residential and reports the same positive integer unit count. Conflicting, unknown, zero and nonresidential site records are excluded and counted in the chart note. Repeated agreeing permits are not added together. This is an explicit site-level proxy, not proof of separate physical buildings or unique completed dwellings. The key uses descriptive names (Single-unit homes, Duplexes, Small multifamily, Small/Medium/Large apartment buildings, Very large developments), with numeric ranges shown underneath. These are unit-count labels, not verified building types. The donut totals therefore differ from the header and annual chart, which retain their per-permit definitions. Sites may appear in more than one mayoral period when they have permits in both.

## Home sizes over time

Annual home-size trends use the same qualifying sites as the donut, grouped by the earliest issued permit at the site within the selected mayoral reporting period. A site contributes once across the whole period, even when repeated permits occur in different years. All qualifying selected records must agree on a positive residential unit count; conflicting, unknown, zero and nonresidential sites are excluded. The unit series sums actual reported units, not category endpoints. A site can occur under more than one mayor if it had permits in both terms. These are issuance-year trends in proposed sites and units, not construction-start or completion counts. Partial boundary years and the snapshot year are marked.

The Over time view draws one line for each of the seven home types. Build sites / Housing units switches the shared zero-based vertical axis between counts. Hover or keyboard-focus a point for an exact year/type/count; hover or focus a legend item to isolate its line. All years in the mayoral reporting period remain visible, including zero years. Distinct line colors and dash patterns identify home types.
