"""Build a compact static Muni timetable and 150 m walking grid from public data.
Usage: python3 scripts/prepare-transit.py /path/to/SFMTA_GTFS.zip
"""
import csv,io,json,zipfile,sys,math,gzip,datetime,hashlib
from pathlib import Path
from collections import defaultdict
root=Path(__file__).resolve().parent.parent
source=Path(sys.argv[1]);z=zipfile.ZipFile(source)
def rows(name):return csv.DictReader(io.TextIOWrapper(z.open(name),encoding='utf-8-sig'))
def sec(t):
 h,m,s=map(int,t.split(':'));return h*3600+m*60+s
calendar=list(rows('calendar.txt'));exceptions=list(rows('calendar_dates.txt'))
stop_rows=list(rows('stops.txt'));stop_index={s['stop_id']:i for i,s in enumerate(stop_rows)}
trips={t['trip_id']:t for t in rows('trips.txt')};routes={r['route_id']:r['route_short_name'] for r in rows('routes.txt')}
bytrip=defaultdict(list)
for s in rows('stop_times.txt'):
 if not s['arrival_time'] or not s['departure_time']:raise ValueError('Missing stop time requires interpolation')
 bytrip[s['trip_id']].append((int(s['stop_sequence']),stop_index[s['stop_id']],sec(s['arrival_time']),sec(s['departure_time'])))
patterns=defaultdict(list)
for tid,times in bytrip.items():
 times.sort();base=times[0][3];trip=trips[tid]
 if any(times[i][2]<times[i-1][3] for i in range(1,len(times))):raise ValueError('Nonmonotonic timetable')
 key=(trip['service_id'],trip['route_id'],tuple((s,a-base,d-base) for _,s,a,d in times));patterns[key].append(base)
collection=json.loads((root/'data/neighborhoods.geojson').read_text());polygons=[]
for f in collection['features']:
 for poly in f['geometry']['coordinates'] if f['geometry']['type']=='MultiPolygon' else [f['geometry']['coordinates']]:
  ring=poly[0];polygons.append((min(p[0] for p in ring),max(p[0] for p in ring),min(p[1] for p in ring),max(p[1] for p in ring),poly))
def inring(x,y,ring):
 inside=False;px,py=ring[-1]
 for nx,ny in ring:
  if (ny>y)!=(py>y) and x<(px-nx)*(y-ny)/(py-ny)+nx:inside=not inside
  px,py=nx,ny
 return inside
def onland(x,y):
 for w,e,s,n,poly in polygons:
  if w<=x<=e and s<=y<=n and inring(x,y,poly[0]) and not any(inring(x,y,h) for h in poly[1:]):return True
 return False
latstep=150/111320;lngstep=150/(111320*math.cos(math.radians(37.77)))
west=-122.52;south=37.705;width=math.ceil((-122.35-west)/lngstep);height=math.ceil((37.84-south)/latstep)
land=[]
for y in range(height):
 for x in range(width):
  if onland(west+(x+.5)*lngstep,south+(y+.5)*latstep):land.append(y*width+x)
landset=set(land)
def snap(lng,lat):
 gx=(lng-west)/lngstep-.5;gy=(lat-south)/latstep-.5;best=None
 for y in range(max(0,round(gy)-3),min(height,round(gy)+4)):
  for x in range(max(0,round(gx)-3),min(width,round(gx)+4)):
   cell=y*width+x
   if cell not in landset:continue
   dist=math.hypot(x-gx,y-gy)*150
   if best is None or dist<best[1]:best=(cell,dist)
 return [best[0],round(best[1]/1.25)] if best and best[1]<=450 else [-1,0]
stops=[]
for s in stop_rows:
 lat=float(s['stop_lat']);lng=float(s['stop_lon']);cell,walk=snap(lng,lat);stops.append([round(lat,6),round(lng,6),cell,walk])
services={c['service_id']:{'start':c['start_date'],'end':c['end_date'],'days':[int(c[d]) for d in ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']],'exceptions':{}} for c in calendar}
for e in exceptions:
 services.setdefault(e['service_id'],{'start':e['date'],'end':e['date'],'days':[0]*7,'exceptions':{}})['exceptions'][e['date']]=int(e['exception_type'])
data={'meta':{'agency':'SFMTA / Muni','source':'https://data.sf.gov/Transportation/SFMTA-General-Transit-Feed-Specification-GTFS-Prod/dni7-qpv3','filename':'SFMTA_GTFS_20260829_20270115v2.zip','retrieved':'2026-11-04','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'start':min(c['start_date'] for c in calendar),'end':max(c['end_date'] for c in calendar),'timezone':'America/Los_Angeles','walking':'150 m land grid; 4.5 km/h; not a pedestrian street network','boarding_buffer_seconds':60,'max_rides':3,'routes':len(routes),'trips':len(trips)},'grid':{'west':west,'south':south,'dx':lngstep,'dy':latstep,'width':width,'height':height,'meters':150,'land':land},'stops':stops,'services':services,'patterns':[[svc,routes[route],list(times),sorted(bases)] for (svc,route,times),bases in patterns.items()]}
raw=json.dumps(data,separators=(',',':')).encode();out=root/'data/muni-schedule.json.gz';out.write_bytes(gzip.compress(raw,mtime=0));print(json.dumps({'patterns':len(patterns),'trips':len(trips),'land_cells':len(land),'json_bytes':len(raw),'gzip_bytes':out.stat().st_size,'validity':data['meta']['start']+'–'+data['meta']['end']}))
(root/'data/muni-schedule-meta.json').write_text(json.dumps(data['meta'],indent=2)+'\n')
