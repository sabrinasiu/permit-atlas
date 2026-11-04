const assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib'),path=require('node:path');
const data=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'../data/regional-context.json.gz'))));
function ring(point,points){let inside=false;const [x,y]=point;for(let i=0,j=points.length-1;i<points.length;j=i++){const [xi,yi]=points[i],[xj,yj]=points[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside}return inside}
function land(point){return data.land.some(poly=>ring(point,poly[0])&&!poly.slice(1).some(h=>ring(point,h)))}
for(const [name,point] of [['SF',[-122.419,37.779]],['Daly City',[-122.47,37.687]],['Oakland',[-122.27,37.8]],['Marin',[-122.54,37.9]]])assert.ok(land(point),name+' must have land context');
assert.equal(land([-122.7,37.75]),false,'Pacific remains water');assert.equal(land([-122.32,37.75]),false,'SF Bay remains water');assert.ok(data.roads.length>40000);assert.ok(data.world.length>1000);assert.ok(data.places.some(p=>p.name==='Oakland'));assert.ok(data.roads.every(f=>Object.keys(f.properties).every(k=>['name','class'].includes(k))));
console.log('Passed regional land/water checks, surrounding-city coverage, road completeness and address-field exclusion.');
