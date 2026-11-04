const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),calls=[];
const context={neighborhoodExtents:new Map(),neighborhoodShapes:new Map(),lastZoomedSearch:'',validPoint:p=>Array.isArray(p.location?.coordinates),map:{setView(...args){calls.push(['city',...args])},fitBounds(...args){calls.push(['neighborhood',...args])},getSize:()=>({x:900,y:750})},$:selector=>({getBoundingClientRect:()=>selector==='#timeline'?{height:180}:{width:220}})};vm.createContext(context);vm.runInContext(source.slice(source.indexOf('function indexNeighborhoods('),source.indexOf('function setRecords(')),context);
const p=(name,lng,lat)=>({neighborhoods_analysis_boundaries:name,location:{coordinates:[lng,lat]}});
context.neighborhoodExtents=context.indexNeighborhoods([p('Mission',-122.42,37.75),p('Mission',-122.4,37.77),p('Mission Bay',-122.39,37.78),{neighborhoods_analysis_boundaries:'Mission'}]);
assert.deepEqual([...context.matchingNeighborhoods('mission')],['mission']);assert.deepEqual([...context.matchingNeighborhoods('miss')],['mission','mission bay']);assert.equal(context.matchingNeighborhoods('unknown').size,0);
context.zoomToNeighborhood('mission',context.matchingNeighborhoods('mission'));assert.equal(calls.length,1);assert.equal(calls[0][0],'neighborhood');assert.equal(calls[0][1][0][0],37.749);assert.equal(calls[0][2].maxZoom,15);
context.zoomToNeighborhood('mission',context.matchingNeighborhoods('mission'));assert.equal(calls.length,1); // Year switches must not undo a user's pan/zoom.
context.zoomToNeighborhood('unknown',context.matchingNeighborhoods('unknown'));assert.equal(calls.length,1);
context.zoomToNeighborhood('',null);assert.equal(calls[1][0],'city');assert.equal(calls[1][2],12);
console.log('Passed full-neighborhood extent fitting, exact-name precedence, partial matches, unmatched queries, persistent map view and clear-search reset.');
