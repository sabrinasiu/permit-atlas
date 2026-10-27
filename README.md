# San Francisco Permit Atlas

A full-page illustrated map with a manual construction-history scrubber. Open the website at http://127.0.0.1:5174/ in this session. To run it later, serve this directory with a static server such as `python3 -m http.server 5174`.

## Explore

Drag the daily timeline or choose a date. The map, top card, timeline count, and permit-type counts show only permits issued on that exact day. Only red issuance heat is displayed; open permit windows, physical-work inspections, and completions are not separate map overlays. There is no stacked chart, cumulative total, Play button, or empty-day banner.

Permit layers opens additive type filters. Neighborhood search refines the results. Click an approximate block for descriptions and full recorded histories of permits issued that day. Historical inspection and completion dates remain available in the detail panel. Dates after the selected day are marked accordingly.

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
