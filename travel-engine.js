/* Scheduled Muni accessibility on an approximate land walking grid. */
(function(root){
  class Heap{
    constructor(){this.a=[]}
    push(value){let i=this.a.length;this.a.push(value);while(i){const p=(i-1)>>1;if(this.a[p][0]<=value[0])break;this.a[i]=this.a[p];i=p}this.a[i]=value}
    pop(){const first=this.a[0],last=this.a.pop();if(this.a.length){let i=0;while(i*2+1<this.a.length){let c=i*2+1;if(c+1<this.a.length&&this.a[c+1][0]<this.a[c][0])c++;if(this.a[c][0]>=last[0])break;this.a[i]=this.a[c];i=c}this.a[i]=last}return first}
  }
  function dayShift(date,days){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)}
  function activeService(service,date){if(!service)return false;const key=date.replaceAll('-',''),exception=service.exceptions?.[key];if(exception!==undefined)return exception===1;return key>=service.start&&key<=service.end&&!!service.days[new Date(date+'T12:00:00Z').getUTCDay()]}
  function prepare(data){const g=data.grid,land=new Uint8Array(g.width*g.height);for(const id of g.land)land[id]=1;data.landMask=land;return data}
  function snap(data,lng,lat,maxMeters=225){const g=data.grid,gx=(lng-g.west)/g.dx-.5,gy=(lat-g.south)/g.dy-.5;let best=-1,dist=Infinity;for(let y=Math.max(0,Math.round(gy)-2);y<Math.min(g.height,Math.round(gy)+3);y++)for(let x=Math.max(0,Math.round(gx)-2);x<Math.min(g.width,Math.round(gx)+3);x++){const id=y*g.width+x;if(!data.landMask[id])continue;const d=Math.hypot(x-gx,y-gy)*g.meters;if(d<dist){dist=d;best=id}}return dist<=maxMeters?{cell:best,seconds:dist/1.25}:null}
  function walk(data,best,seeds,deadline){const g=data.grid,heap=new Heap(),step=g.meters/1.25;for(const [id,time] of seeds)if(time<best[id]&&time<=deadline){best[id]=time;heap.push([time,id])}while(heap.a.length){const [time,id]=heap.pop();if(time>best[id])continue;const x=id%g.width,y=Math.floor(id/g.width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;if(nx<0||nx>=g.width||ny<0||ny>=g.height)continue;const next=ny*g.width+nx;if(!data.landMask[next])continue;if(dx&&dy&&(!data.landMask[y*g.width+nx]||!data.landMask[ny*g.width+x]))continue;const arrival=time+step*(dx&&dy?Math.SQRT2:1);if(arrival<=deadline&&arrival<best[next]){best[next]=arrival;heap.push([arrival,next])}}}}
  function compute(data,request){if(!data.landMask)prepare(data);const {origin,date,time,minutes,mode}=request;if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time)||![15,30,45,60].includes(+minutes)||!['transit','walking'].includes(mode))throw Error('Choose a valid departure date, time and travel duration.');const dateKey=date.replaceAll('-','');if(dateKey<data.meta.start||dateKey>data.meta.end)throw Error('Choose a date covered by the bundled Muni schedule.');const [hour,minute]=time.split(':').map(Number);if(hour>23||minute>59)throw Error('Choose a valid departure time.');const departure=hour*3600+minute*60,deadline=departure+minutes*60,start=snap(data,origin.lng,origin.lat);if(!start)throw Error('Choose a starting point on San Francisco land.');const best=new Float64Array(data.grid.width*data.grid.height).fill(Infinity);walk(data,best,[[start.cell,departure+start.seconds]],deadline);let improvedRides=0;
    if(mode==='transit'){
      const active=[];for(const shift of [-1,0,1]){if(shift===1&&deadline<86400)continue;const day=dayShift(date,shift);for(const pattern of data.patterns)if(activeService(data.services[pattern[0]],day))active.push([pattern,shift*86400])}
      for(let ride=0;ride<(data.meta.max_rides||3);ride++){
        const previous=best.slice(),seeds=new Map();
        for(const [pattern,shift] of active){const visits=pattern[2],departures=pattern[3],last=visits[visits.length-1][1];let lo=0,hi=departures.length;while(lo<hi){const mid=(lo+hi)>>1;if(departures[mid]+shift+last<departure)lo=mid+1;else hi=mid}
          for(let j=lo;j<departures.length;j++){const base=departures[j]+shift;if(base+visits[0][2]>deadline)break;let aboard=false;for(const [stopIndex,arr,dep] of visits){const stop=data.stops[stopIndex],cell=stop[2],walkSeconds=stop[3],arrival=base+arr;if(arrival>deadline)break;
              if(aboard&&cell>=0){const candidate=arrival+walkSeconds;if(candidate<best[cell]&&candidate<(seeds.get(cell)??Infinity)&&candidate<=deadline)seeds.set(cell,candidate)}
              if(!aboard&&cell>=0&&previous[cell]+walkSeconds+(data.meta.boarding_buffer_seconds||60)<=base+dep)aboard=true;
            }
          }
        }
        if(!seeds.size)break;walk(data,best,seeds,deadline);improvedRides++;
      }
    }
    const times=new Float32Array(best.length).fill(-1);let cells=0;for(const id of data.grid.land)if(best[id]<=deadline){times[id]=Math.round(best[id]-departure);cells++}return {times,cells,improvedRides,minutes:+minutes,grid:data.grid,meta:data.meta,request};
  }
  function rings(result){const {grid:g,times,minutes}=result,edges=new Map(),inside=id=>id>=0&&id<times.length&&times[id]>=0&&times[id]<=minutes*60,add=(a,b)=>{const key=a.join(',');if(!edges.has(key))edges.set(key,[]);edges.get(key).push(b)};
    for(const id of g.land){if(!inside(id))continue;const x=id%g.width,y=Math.floor(id/g.width);if(y===0||!inside(id-g.width))add([x,y],[x+1,y]);if(x===g.width-1||!inside(id+1))add([x+1,y],[x+1,y+1]);if(y===g.height-1||!inside(id+g.width))add([x+1,y+1],[x,y+1]);if(x===0||!inside(id-1))add([x,y+1],[x,y])}
    const out=[];while(edges.size){const start=edges.keys().next().value;let key=start,ring=[];do{const ends=edges.get(key);if(!ends?.length)break;const [x,y]=key.split(',').map(Number);ring.push([g.south+y*g.dy,g.west+x*g.dx]);const end=ends.pop();if(!ends.length)edges.delete(key);key=end.join(',')}while(key!==start);if(ring.length>=4){ring.push(ring[0]);out.push(ring)}}return out;
  }
  const api={prepare,snap,activeService,compute,rings};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TravelEngine=api;
})(globalThis);
