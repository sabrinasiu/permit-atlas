const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const G=require('../neighborhood-focus.js');
const shape={type:'Feature',properties:{nhood:'Example'},geometry:{type:'MultiPolygon',coordinates:[[[[0,0],[2,0],[2,2],[0,2],[0,0]],[[.5,.5],[1.5,.5],[1.5,1.5],[.5,1.5],[.5,.5]]],[[[4,0],[5,0],[5,1],[4,1],[4,0]]]]}};
const rings=G.maskRings([shape]);assert.equal(rings.length,4);assert.deepEqual(G.extent(shape),{south:0,north:2,west:0,east:5});
function inside([x,y],ring){let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [a,b]=ring[i],[c,d]=ring[j];if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)hit=!hit}return hit}
const muted=point=>rings.filter(r=>inside(point,r)).length%2===1;
assert.equal(muted([.2,.2]),false);assert.equal(muted([.7,.7]),true);assert.equal(muted([3,3]),true);assert.equal(muted([.5,4.5]),false);
const collection=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/neighborhoods.geojson'),'utf8')),index=G.index(collection);assert.equal(index.size,41);assert.ok(index.has('hayes valley'));assert.ok(index.has('mission'));
for(const feature of index.values()){const e=G.extent(feature);assert.ok(e.north>e.south&&e.east>e.west);for(const poly of G.polygons(feature.geometry))for(const ring of poly){assert.ok(ring.length>=4);assert.deepEqual(ring[0],ring.at(-1))}}
assert.equal(G.maskRings([...index.values()]).length>41,true);
console.log('Passed spotlight holes, multipart islands, geometry extents and all 41 bundled analysis-neighborhood boundaries.');
