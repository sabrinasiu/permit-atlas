(function(root){
  function year(p){const date=String(p.filed_date||'');return /^\d{4}-\d{2}-\d{2}/.test(date)?Number(date.slice(0,4)):null}
  function bounds(records){const years=records.map(year).filter(y=>y!==null);return years.length?{min:Math.min(...years),max:Math.max(...years)}:null}
  function matches(p,selected){if(selected===null)return true;const y=year(p);if(typeof selected==='number')return y===selected;return y!==null&&y>=selected.start&&y<=selected.end}
  const api={year,bounds,matches};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SubmissionTimeline=api;
})(globalThis);
