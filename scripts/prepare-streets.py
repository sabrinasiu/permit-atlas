"""Compact public DataSF street centerlines, excluding all address fields.
Usage: python3 scripts/prepare-streets.py /path/to/3psu-pn9h.geojson
"""
from pathlib import Path
import json,sys,gzip,datetime
root=Path(__file__).resolve().parent.parent
source=json.loads(Path(sys.argv[1]).read_text());features=[]
for f in source['features']:
 p=f['properties'];g=f.get('geometry')
 if not g or not p.get('active'):continue
 def rounded(x):return [round(a,6) for a in x] if isinstance(x[0],(int,float)) else [rounded(a) for a in x]
 features.append({'type':'Feature','properties':{'name':p.get('streetname',''),'class':int(p.get('classcode') or 0)},'geometry':{'type':g['type'],'coordinates':rounded(g['coordinates'])}})
meta={'source':'https://data.sf.gov/Geographic-Locations-and-Boundaries/Streets-Active-and-Retired/3psu-pn9h','retrieved':datetime.date.today().isoformat(),'features':len(features),'note':'Active street centerlines only; names and class codes retained, address fields omitted.'}
data={'type':'FeatureCollection','metadata':meta,'features':features};raw=json.dumps(data,separators=(',',':')).encode();out=root/'data/streets.geojson.gz';out.write_bytes(gzip.compress(raw,mtime=0));(root/'data/streets-meta.json').write_text(json.dumps(meta,indent=2)+'\n');print(len(features),'active streets;',out.stat().st_size,'compressed bytes')
