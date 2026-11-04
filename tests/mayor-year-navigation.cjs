const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, {
    dataset: {}, buttons: [], textContent: '', onclick: null,
    setAttribute() {}, focus() {},
    set innerHTML(html) {
      this.buttons = [...html.matchAll(/<button\b([^>]*)>/g)].map(match => {
        const attrs = match[1];
        const dataset = {};
        for (const attr of attrs.matchAll(/data-(mayor|year)="([^"]+)"/g)) dataset[attr[1]] = attr[2];
        return { dataset, focus() {} };
      });
    }
  });
  return elements.get(id);
}
function query(selector) {
  const button = selector.match(/^#(mayorBlocks|mayorYears) \[data-(mayor|year)="([^"]+)"\]$/);
  return button ? element('#' + button[1]).buttons.find(b => b.dataset[button[2]] === button[3]) : element(selector);
}
function queryAll(selector) {
  if (selector === '#mayorBlocks [data-mayor]') return element('#mayorBlocks').buttons;
  if (selector === '#mayorYears [data-year]') return element('#mayorYears').buttons;
  // Include the enclosing panel when it carries the same data attribute:
  // a global handler binding would also react to bubbled year-button clicks.
  if (selector === '[data-mayor]') return [...(element('#timeline').dataset.mayor ? [element('#timeline')] : []), ...element('#mayorBlocks').buttons];
  if (selector === '[data-year]') return element('#mayorYears').buttons;
  return [];
}
const context = { meta: { through: '2026-10-27' }, $: query, $$: queryAll, esc: String, formatDate: String, filter() {} };
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('const mayorTerms='), source.indexOf('function setRecords(')), context);
vm.runInContext('syncTimelineControls()', context);
function click(selector) {
  query(selector).onclick();
  // Native click propagation reaches the containing timeline after the button.
  if (element('#timeline').onclick) element('#timeline').onclick();
}
click('#mayorYears [data-year="2026"]');
assert.equal(context.mapPeriod().start, '2026-01-01');
click('#mayorYears [data-year="2025"]');
assert.equal(context.mapPeriod().start, '2025-01-08');
click('#mayorBlocks [data-mayor="lee"]');
click('#mayorYears [data-year="2014"]');
assert.equal(context.mapPeriod().start, '2014-01-01');
assert.equal(context.mapPeriod().end, '2014-12-31');
assert.equal(element('#timeline').onclick, null);
console.log('Year selections survive click bubbling for Lurie and Lee; mayor handlers are confined to mayor buttons.');
