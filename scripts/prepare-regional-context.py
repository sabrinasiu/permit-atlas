"""Prepare grayscale regional context from Natural Earth land and Census TIGER roads.
Input files are downloaded from the source URLs recorded in the output metadata.
"""
import json,gzip,math
from pathlib import Path
r=Path(__file__).resolve().parent.parent
bbox=[-122.75,37.45,-122.05,38.1]
def simplify(points,tol):
 if len(points)<4:return points
 pts=points[:-1] if points[0]==points[-1] else points
 def part(a):
  if len(a)<3:return a
  x,y=a[0];dx=a[-1][0]-x;dy=a[-1][1]-y;den=dx*dx+dy*dy
  distances=[]
  for px,py in a[1:-1]:
   t=max(0,min(1,((px-x)*dx+(py-y)*dy)/den)) if den else 0;distances.append((px-x-t*dx)**2+(py-y-t*dy)**2)
  mx=max(distances,default=0)
  if mx<=tol*tol:return [a[0],a[-1]]
  i=distances.index(mx)+1;return part(a[:i+1])[:-1]+part(a[i:])
 # Divide closed rings at a far vertex so their identical endpoints do not collapse.
 mid=len(pts)//2;out=part(pts[:mid+1])[:-1]+part(pts[mid:]+[pts[0]])
 return out if len(out)>=4 else []
def clip(points):
 out=points[:-1] if points[0]==points[-1] else points
 for axis,limit,greater in [(0,bbox[0],True),(0,bbox[2],False),(1,bbox[1],True),(1,bbox[3],False)]:
  if not out:break
  inp=out;out=[];a=inp[-1];ia=a[axis]>=limit if greater else a[axis]<=limit
  for b in inp:
   ib=b[axis]>=limit if greater else b[axis]<=limit
   if ia!=ib:
    t=(limit-a[axis])/(b[axis]-a[axis]);out.append([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])])
   if ib:out.append(b)
   a=b;ia=ib
 return out+[out[0]] if len(out)>=3 else []
def rounded(x):return [round(v,5) for v in x] if isinstance(x[0],(int,float)) else [rounded(a) for a in x]
land=json.load(open('/private/tmp/permit-atlas-world-land.geojson'));world=[];regional=[]
for f in land['features']:
 ps=f['geometry']['coordinates'] if f['geometry']['type']=='MultiPolygon' else [f['geometry']['coordinates']]
 for p in ps:
  outer=simplify(p[0],.025)
  if outer:world.append([rounded(outer)]+[rounded(h) for ring in p[1:] if (h:=simplify(ring,.025))])
  outer=clip(p[0])
  if outer:regional.append([rounded(outer)]+[rounded(h) for ring in p[1:] if (h:=clip(ring))])
roads=[]
for layer,cls in [(2,1),(6,3),(8,5)]:
 d=json.load(open('/private/tmp/permit-atlas-roads-'+str(layer)+'.geojson'))
 if d.get('exceededTransferLimit') or d.get('error'):raise ValueError('Incomplete road query')
 for f in d['features']:
  if f.get('geometry'):roads.append({'type':'Feature','properties':{'name':f['properties'].get('NAME',''),'class':cls},'geometry':f['geometry']})
places=[]
p=Path('/private/tmp/permit-atlas-places.geojson')
if p.exists():
 for f in json.loads(p.read_text())['features']:
  lng,lat=f['geometry']['coordinates'][:2]
  if bbox[0]<=lng<=bbox[2] and bbox[1]<=lat<=bbox[3]:places.append({'name':f['properties'].get('name',f['properties'].get('NAME','')),'coordinates':[lng,lat]})
data={'meta':{'retrieved':'2026-11-04','bbox':bbox,'land_source':'https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/','road_source':'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer','note':'Generalized world land; detailed Bay Area coastline and Census roads within bbox. Context only; no expanded permit or transit coverage.'},'world':world,'land':regional,'roads':roads,'places':places}
raw=json.dumps(data,separators=(',',':')).encode();out=r/'data/regional-context.json.gz';out.write_bytes(gzip.compress(raw,mtime=0));(r/'data/regional-context-meta.json').write_text(json.dumps({**data['meta'],'roads':len(roads),'places':places},indent=2)+'\n');print({'world_polygons':len(world),'regional_land':len(regional),'roads':len(roads),'places':places,'compressed_bytes':out.stat().st_size})
