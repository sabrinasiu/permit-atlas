const assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib'),E=require('../travel-engine');
function fixture(){return E.prepare({meta:{start:'20261101',end:'20261130',max_rides:3,boarding_buffer_seconds:60},grid:{west:0,south:0,dx:.001,dy:.001,width:30,height:1,meters:150,land:Array.from({length:30},(_,i)=>i)},stops:[[0,0,0,0],[0,0,20,0],[0,0,29,0]],services:{weekday:{start:'20261101',end:'20261130',days:[0,1,1,1,1,1,0],exceptions:{}}},patterns:[['weekday','A',[[0,0,0],[1,540,540]],[9*3600+60]],['weekday','B',[[1,0,0],[2,200,200]],[9*3600+700]]]})}
const req={origin:{lng:.0005,lat:.0005},date:'2026-11-04',time:'09:00',minutes:15,mode:'transit'};
let d=fixture(),r=E.compute(d,req);assert.equal(r.times[29],900);assert.ok(E.rings(r).every(ring=>JSON.stringify(ring[0])===JSON.stringify(ring.at(-1))));
let w=E.compute(d,{...req,mode:'walking'});assert.equal(w.times[29],-1);assert.equal(w.times[7],840);
assert.equal(E.compute(d,{...req,date:'2026-11-08'}).times[20],-1);
d.services.weekday.exceptions['20261108']=1;assert.ok(E.compute(d,{...req,date:'2026-11-08'}).times[20]>=0);
d=fixture();d.patterns=[['weekday','A',[[0,0,0],[1,300,300]],[9*3600+30]]];assert.equal(E.compute(d,req).times[20],-1); // Missed departure: must allow the boarding buffer.
d.patterns=[['weekday','A',[[0,0,0],[1,300,300]],[24*3600+300]]];assert.equal(E.compute(d,{...req,date:'2026-11-05',time:'00:01'}).times[20],540); // Previous service day's after-midnight trip.
d=fixture();d.grid.land=d.grid.land.filter(i=>i!==4);E.prepare(d);d.patterns=[];assert.equal(E.compute(d,{...req,minutes:60,mode:'walking'}).times[5],-1); // Walking cannot jump a water gap.
assert.throws(()=>E.compute(d,{...req,date:'2026-12-01'}),/covered/);
const saved=E.prepare(JSON.parse(zlib.gunzipSync(fs.readFileSync(require('node:path').join(__dirname,'../data/muni-schedule.json.gz'))))),real=E.compute(saved,{...req,origin:{lng:-122.4194,lat:37.7793},minutes:30});
assert.ok(real.cells>0);assert.ok(real.improvedRides>0);const walk=E.compute(saved,{...req,origin:{lng:-122.4194,lat:37.7793},minutes:30,mode:'walking'});assert.ok(real.cells>walk.cells);assert.ok(real.times.every(t=>t===-1||(t>=0&&t<=1800)));
console.log('Passed scheduled waiting, transfers, missed buses, service exceptions, midnight service, water barriers and bundled Muni comparison:',{walkingCells:walk.cells,transitCells:real.cells});
