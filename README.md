# New Construction Tracker

A full-page illustrated map of new-construction permits with mayoral reporting periods, housing-unit colors and build-site breakdowns. Open the website at http://127.0.0.1:5174/ in this session. To run it later, serve this directory with a static server such as `python3 -m http.server 5174`.

## Explore

The bottom timeline is divided into five clickable mayoral-term blocks: Ed Lee (2011–2017), acting mayor London Breed (2017–2018), Mark Farrell (2018), London Breed (2018–2024 chart window), and Daniel Lurie (2025–present). Selecting a mayor shows that reporting period’s calendar years and selects its first year. The selected year filters the map within the mayor’s exact inclusive dates; the initial selection is Daniel Lurie, 2025. Full-term counts and charts remain under Term charts & details. There is no daily scrubber, date picker, Play button, stacked chart or empty-result banner.

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

Bright orange (#FF6A34) overrides the unit-count color for identified affordable housing. Details retain reported total units and stories and separately show affordability evidence. The source is a retrieved snapshot, not a claim that affordability was known on the permit's issue date. Blue does not establish market-rate status.

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

The map legend uses descriptive home-type names, with unit ranges underneath. Its existing 2–4-unit color remains combined as Duplexes & small multifamily; map color thresholds are unchanged.

## Overlay appearance

Floating surfaces use translucent cool gray, background-only frosting, rounded corners and soft shadows, inspired by the supplied reference. Typography is system sans-serif with charcoal primary labels and muted gray secondary text. Selected mayor rows use a quiet gray fill; tabs and the term-details action use pill shapes. Text and data marks retain full opacity. The map remains sharp outside the overlays. Browsers without background-filter support receive a more opaque fallback. Reset and zoom buttons are removed; normal map gestures remain available.

## Legend and block history

Clicking a colored map area replaces the right-hand Home types legend with that area's permit history in the same frosted overlay. The panel expands for readable descriptions, scrolls for longer histories and retains the selected mayor's permit scope. Clicking an uncolored part of the map or pressing Escape restores the key. Hit testing uses the painted mark outlines rather than a nearby-point selection radius. Changing the mayor, neighborhood or reloading data clears the selected block. The single overlay carries a Home types / Permit history accessible label and returns keyboard focus to the legend heading on Escape.

## Two-row mayor and year navigation

The bottom overlay follows the supplied interaction reference: a pale-blue selected mayor above a pale-blue selected issue year. Each mayor exposes only the years in the configured reporting period. Picking a mayor resets to its first year, and picking a year filters only the map’s permit cohort. Boundary years are clipped to the mayor’s dates and data snapshot. London Breed’s elected reporting window ends in 2024. The two London Breed buttons have accessible labels and hover titles distinguishing acting and elected periods. Term charts & details preserves full-period analysis with neighborhood search, independently of the map’s year selection. Clicking a map mark shows only that year’s issued permits in the legend/history overlay.

Each year button shows the number of distinct issued permits in that mayor/year, respecting neighborhood search. A live caption identifies the selected year and issuance count, including a note for permits without map coordinates. Clicking a year rebuilds the map block groups and redraws the painted marks; the map is not cumulative across years. For the saved Lurie cohort, 2025 has 46 issued new-construction permits and 2026 has 51 through October 27.

Year navigation binds click handlers only to buttons inside the mayor/year rows. The enclosing panel uses a separate selected-mayor attribute, preventing bubbled year clicks from resetting to the first year. Regression coverage: `node tests/mayor-year-navigation.cjs`; browser-verified Lurie 2025/2026 and Lee 2014/2015, including changing map marks and counts.

The main palette uses #053161 navy for text, #BED9DA pale blue for button backgrounds, and #FF6A34 orange-red for important emphasis and identified affordable-housing map marks. Residential unit colors progress from pale blue to navy; counts, category boundaries and affordability evidence are unchanged. Selected navigation uses a navy underline and stronger fill to remain clear without borrowing the affordable-housing accent.

## Neighborhood zoom

Searching a neighborhood fits the map to its DataSF analysis-neighborhood shape, outlines the selected area, and mutes everything outside it with a non-interactive overlay. The bundled [DataSF Analysis Neighborhoods](https://data.sf.gov/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods/p5b7-5n3h) GeoJSON contains 41 census-tract-based analysis areas, retrieved November 4, 2026; these are not codified neighborhood boundaries. Polygon holes and disconnected areas are preserved. The highlight persists across year and home-type changes; clearing the search removes it and returns to the city overview. Exact names take precedence over partial matches (Mission excludes Mission Bay); partial queries highlight and fit the combined matching areas. If boundary loading fails, zoom bounds fall back to all bundled permit locations across the full history and all permit types. The map occupies the space beside the sidebar; neighborhood fitting uses even padding within that unobstructed map area. Unknown queries clear the highlight and leave the camera in place. Mayor/year buttons share the overlay’s system font and pill styling. Regression coverage: `node tests/neighborhood-search.cjs` and `node tests/neighborhood-focus.cjs`.

## Interactive home-type legend

Legend rows are keyboard-accessible toggle buttons. Selecting a home type isolates that category on the map and updates the annual permit labels/caption. The affordable-housing row selects identified affordable projects; selecting a size category still includes affordable projects within that size. Clicking outside the legend clears the temporary type filter before the clicked control or map area acts, preserving the current mayor, year and neighborhood. Clicking the selected row again or pressing Escape inside the legend also clears it. Full-term charts retain their existing cohort. Browser verification: Breed 2020 changes from 70 permits to 5 identified-affordable or 21 single-unit permits, then returns to 70 on an outside click. Regression coverage: `node tests/legend-filter.cjs`.


## Docked exploration sidebar

Search, mayor and annual filters, home-type legend, permit history, data status and refresh now live in a fixed left sidebar, inspired by Morphocode Explorer’s map-and-panel layout. Charts expand inline with an accessible expanded/collapsed control rather than opening a modal. Term chart headings and totals update as filters change. Permit clicks replace the legend in the sidebar; clicking blank map restores it. The sidebar scrolls independently, with search pinned at its top. The map occupies the remaining width with no control cards over it. On screens up to 600px wide, the map sits above a scrollable details panel.

Browser-verified Lurie 2025/2026 navigation, inline chart expansion/collapse, Hayes Valley highlighting, and a permit click followed by blank-map dismissal. Basemap tiles were unavailable during these captures.


## Walking and scheduled Muni travel ranges

The sidebar’s Travel range tool lets viewers pick a starting point, a 15/30/45/60 minute budget, a departure date/time in America/Los_Angeles, and walking-only or walking + Muni. It shades reachable grid cells and mutes construction marks outside the range. The count follows the current mayor, year, neighborhood and home-type selection; build sites are deduplicated, and reported proposed units use the existing consistent-residential-site rules. Unknown/conflicting units are excluded from the unit total. Permit locations remain approximate. Clear removes the origin, range and temporary muting. Origin coordinates stay in browser memory and are not sent to an external routing API.

The bundled [SFMTA GTFS production snapshot](https://data.sf.gov/Transportation/SFMTA-General-Transit-Feed-Specification-GTFS-Prod/dni7-qpv3), `SFMTA_GTFS_20260829_20270115v2.zip`, was retrieved November 4, 2026. It covers August 29, 2026–January 15, 2027 and contains 68 routes and 34,668 scheduled trips. The app restricts departure dates to that period. Service calendars, exceptions, waiting, a one-minute boarding allowance, and up to three vehicle rides (two transfers) are included. After-midnight services can belong to the previous service day. This does not reconstruct historical transit service for earlier mayoral years and does not include BART, Caltrain, ferries or live disruptions.

Walking is an approximate 150 m grid over the bundled analysis-neighborhood land polygons at 4.5 km/h, with eight-direction movement and no diagonal corner-cutting across water. Stops and origins connect to nearby land cells. It is not pedestrian street routing: buildings, path access, bridges, grades, crossings, inland water and other barriers inside neighborhood polygons, and accessibility restrictions are not modeled. Reach boundaries and site inclusion can vary by a grid cell; this is an exploratory estimate, not directions or a guaranteed journey time. A future production version should replace the walking grid with a pedestrian street network and add other regional transit feeds.

`travel-engine.js` runs a bounded-round timetable search and walking relaxation in `travel-worker.js`. The compressed timetable is loaded on demand, processed locally, and kept off the main UI thread. Rebuild the snapshot with `python3 scripts/prepare-transit.py /path/to/SFMTA_GTFS.zip` and verify its metadata before publishing. Regression coverage: `node tests/travel-engine.cjs` checks waiting, transfers, missed boarding, weekday/exception services, after-midnight service, water barriers, feed dates, and a real-data walking/transit comparison. Browser checks cover selecting an origin, changing mode and duration, updating year-specific site counts, and clearing the range.


## Mayor and year controls removed

The sidebar no longer contains mayor or permit-year controls. The map and travel-range housing counts now use the full bundled permit history (January 11, 2011–October 27, 2026), subject to neighborhood and home-type filters. Construction charts remain available as a general dataset overview rather than a mayoral-term breakdown. Travel departure date/time remains independent of permit issuance dates. This supersedes the mayor/year navigation behavior documented in earlier iteration notes. Regression: `node tests/all-history.cjs`.


## Drag travel ranges

The origin marker and the shaded reachable area can both be dragged. The existing outline translates as a preview while held; releasing moves the origin and recalculates the real scheduled range and housing counts. Pending earlier calculations are invalidated when dragging begins. Map panning is disabled only for a shaded-area drag and restored on release or cancellation; outside-range drags continue to pan the map. Cancelled pointer drags restore the original geometry. Regression: `node tests/travel-drag.cjs`; browser-verified marker and whole-area movement with changed outlines and counts.


The active travel range now cuts a clear window through a gray outside mask above the permit marks and basemap. The mask follows the drag preview and recalculated outline, preserves disconnected reachable areas and holes with an even-odd fill, and is removed when the travel range is cleared. It does not intercept map interactions.


The gray outside mask was removed at the user’s request. Travel ranges retain the selected-area fill and outline, draggable origin and area, and existing muted permit marks outside the range.


## Pale street map and travel lens

The map now follows the supplied Morphocode-style visual reference: pale land, soft gray water, white street lines, sparse muted labels, a dotted charcoal travel boundary, no gray exterior mask, and colored construction marks only within the active reachable area. The calculated travel shape and existing unit/affordability colors remain data-driven. Permit marks are approximate block symbols, not building footprints. With no travel range selected, all matching construction marks remain visible.

The basemap uses bundled analysis-neighborhood land shapes and [DataSF active street centerlines](https://data.sf.gov/Geographic-Locations-and-Boundaries/Streets-Active-and-Retired/3psu-pn9h), retrieved November 4, 2026. `scripts/prepare-streets.py` removes address fields and retired streets and produces the compressed local geometry. Streets and labels render above permit marks so the street grid remains visible. This removes the dependency on external map tiles and fonts for the SF view. The bundled geographic coverage is San Francisco; neighboring cities and detailed park/lake polygons are not included.


## Geographic context beyond the permit footprint

The map now has a bundled grayscale regional backdrop beyond San Francisco’s data boundary: generalized world land from [Natural Earth](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/), detailed regional land geometry, and public [Census TIGERweb roads](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer). The regional road coverage is longitude -122.75 to -122.05, latitude 37.45 to 38.1, encompassing the neighboring Peninsula, Marin and East Bay. Natural Earth city labels provide orientation. Coastlines are generalized context, not parcel boundaries. Beyond the regional rectangle, generalized land remains visible, with no bundled street detail. This supersedes the previous SF-only basemap coverage limitation.

The regional dataset is local and needs no tile service or account key. A direct OpenStreetMap tile background was tested but failed to load in the preview; it was replaced with bundled vector geometry. No OSM tiles were downloaded or archived. The new context does not extend the SF permit dataset or Muni routing coverage. Source metadata is in `data/regional-context-meta.json`; `scripts/prepare-regional-context.py` builds the compressed dataset from the recorded public sources.


## Permit hover cards

Hover cards now show a colloquial home/building type, reported proposed units, and the permit’s actual filing year (`filed_date`), rather than issuance year or a year inferred from the permit number. A sidecar snapshot retrieved November 4, 2026 matches all 1,803 existing new-construction permits by exact permit number; live refresh also requests `filed_date`. Missing dates explicitly say the submission year is not recorded. Unit counts are per permit and are not summed across a shared block. Up to four permits are shown separately when a block contains several records, followed by a remaining-record count.

Labels distinguish single-unit homes, duplexes, triplexes, fourplexes, and apartment-building sizes. The display label “High-rise” uses a conservative 12-or-more proposed stories heuristic for residential records beyond the 1–4 unit categories, not a legal height classification. Unit count alone never determines high-rise status. Nonresidential or unknown counts are labeled explicitly. Regression: `node tests/permit-tooltip.cjs` validates type labels, filing versus issuance years, missing values, grouped records and complete sidecar coverage.


## Smoother zoom

The map supports quarter-level zoom stops, half-level keyboard/double-click increments, and less sensitive wheel movement with a shorter debounce. The local basemap, regional context and permit canvases remain visible and transform with Leaflet’s zoom animation; expensive geometry redraws happen when the view settles. Basemap layers no longer repaint twice for both zoomend and moveend. `canvas-zoom.js` uses public projection APIs and keeps the canvas anchored through fractional zooms and existing map-pane offsets. Regression: `node tests/canvas-zoom.cjs`; browser checked zooming in and back out without console errors.


## Submission-year slider

A timeline slider is pinned above neighborhood search at the top of the sidebar. It defaults to All years and has independently draggable start and end handles for an inclusive filing/submission-year range, plus an All years reset. The limits come from actual `filed_date` values in the issued-permit snapshot (2000–2026); applications filed before 2011 appear because their permits were issued within the saved 2011–2026 issuance cohort. The slider does not imply that the dataset contains every application submitted in each year. Unknown filing dates remain in All years and are omitted from bounded year ranges.

The selected filing-year range filters map marks, permit details, construction-chart cohorts and travel-range housing counts alongside existing neighborhood and home-type selections. Chart horizontal axes and the Construction overview date heading now follow the selected submission-year range. Annual charts group by filing date, matching the range filter; travel departure date and schedules remain independent. Year changes preserve the map camera and computed travel outline. Two native slider handles support pointer and keyboard input, stop at each other and allow a single-year range; redraws are coalesced per animation frame. No autoplay was added. Regression: `node tests/submission-timeline.cjs`, including filing/issuance distinction, saved 2019 and 2026 counts, missing dates, inclusive ranges, crossing clamps, pointer dragging, endpoint keyboard selection and reset behavior.


Construction overview now starts expanded in the sidebar, with its charts and totals immediately available. The redundant Construction charts toggle and close button have been removed. The sidebar order is Home types, Construction overview, then Travel range.

Construction overview uses annual stacked bars, colored by home type, for both build sites and housing units. Bar segments retain exact-count hover/focus readouts and legend highlighting.

Annual charts resize to the sidebar width, with fewer year labels on long ranges; horizontal scrolling is not required on desktop.
