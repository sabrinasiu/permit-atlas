const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),handlers={},buttons=['one','small','largest','affordable'].map(homeType=>({dataset:{homeType},setAttribute(k,v){this[k]=v}})),els={};
for(const id of ['#unitColors','#unitLegend','#legendFilterHint','#mapYearSummary'])els[id]={textContent:'',classList:{toggle(){}},contains:t=>!!t.inside,addEventListener(type,fn){handlers['legend:'+type]=fn}};
const p=(id,type,date,affordable=false)=>({_key:id,_issuedDay:date,_classification:{category:{id:type}},_affordability:{identified_affordable:affordable}});
const context={selectedLegendType:null,timelineReady:true,selectedYear:2026,selectedMayor:'lurie',mayorTerms:[{id:'lurie',name:'Daniel Lurie'}],legendNames:{one:'Single-unit homes'},filtered:[p('a','one','2026-02-01'),p('b','one','2026-03-01',true),p('c','largest','2026-04-01'),p('d','one','2025-01-01')],blockGroups:new Map(),mapPeriod:()=>({start:'2026-01-01',end:'2026-10-27'}),validPoint:()=>true,$:id=>els[id],$$:selector=>selector==='#unitColors [data-home-type]'?buttons:[],document:{addEventListener(type,fn,capture){assert.equal(capture,true);handlers['document:'+type]=fn}},draw(){}};
vm.createContext(context);vm.runInContext(source.slice(source.indexOf('function matchesLegendType('),source.indexOf('function indexNeighborhoods(')),context);context.setupLegendFilter();
context.chooseLegendType('one');assert.deepEqual([...context.blockGroups.keys()],['a','b']);assert.equal(buttons[0]['aria-pressed'],'true');// Includes affordable single-unit homes.
context.chooseLegendType('affordable');assert.deepEqual([...context.blockGroups.keys()],['b']);assert.match(els['#legendFilterHint'].textContent,/Click outside/);
handlers['document:click']({target:{inside:true}});assert.equal(context.selectedLegendType,'affordable');
handlers['document:click']({target:{inside:false}});assert.equal(context.selectedLegendType,null);assert.deepEqual([...context.blockGroups.keys()],['a','b','c']);assert.equal(context.selectedYear,2026);assert.equal(context.selectedMayor,'lurie');
context.chooseLegendType('small');assert.equal(context.blockGroups.size,0);
context.chooseLegendType('one');handlers['legend:click']({target:{closest:()=>buttons[0]}});assert.equal(context.selectedLegendType,null);assert.equal(context.blockGroups.size,3);
console.log('Passed home-type isolation, affordable overlaps, year preservation, empty categories, inside/outside clicks and toggle-off.');
