(function(root){
  const categories=[
    {size:1,label:'Single-unit homes',range:'1 unit',min:1,max:1,color:'#BED9DA'},
    {size:2,label:'Duplexes',range:'2 units',min:2,max:2,color:'#ACCBD1'},
    {size:3,label:'Small multifamily',range:'3–4 units',min:3,max:4,color:'#9CBEC8'},
    {size:5,label:'Small apartment buildings',range:'5–19 units',min:5,max:19,color:'#7BA1B4'},
    {size:20,label:'Medium apartment buildings',range:'20–49 units',min:20,max:49,color:'#567FA0'},
    {size:50,label:'Large apartment buildings',range:'50–99 units',min:50,max:99,color:'#2E5882'},
    {size:100,label:'Very large developments',range:'100+ units',min:100,max:Infinity,color:'#053161'}
  ];
  // One site contributes once only when all its selected permit records agree.
  function summarize(records){
    const sites=new Map(),seen=new Set(),bins=new Map(categories.map(c=>[c.size,{...c,sites:0,units:0}])),excluded={conflicting:0,unverified:0},entries=[];
    for(const p of records){if(p.permit_number&&seen.has(p.permit_number))continue;if(p.permit_number)seen.add(p.permit_number);const id=p._siteId||'permit-'+p.permit_number;if(!sites.has(id))sites.set(id,[]);sites.get(id).push(p)}
    for(const list of sites.values()){
      const values=list.map(p=>p._classification),valid=values.every(c=>c?.residential&&Number.isSafeInteger(c.units)&&c.units>0);
      if(!valid){excluded.unverified++;continue}
      const counts=new Set(values.map(c=>c.units));if(counts.size!==1){excluded.conflicting++;continue}
      const units=values[0].units,category=categories.find(c=>units>=c.min&&units<=c.max),bin=bins.get(category.size);bin.sites++;bin.units+=units;entries.push({size:category.size,units,date:list.map(p=>p._issuedDay||(p.issued_date||'').slice(0,10)).filter(Boolean).sort()[0]||null});
    }
    const rows=[...bins.values()].sort((a,b)=>a.size-b.size);
    return {rows,sites:rows.reduce((s,b)=>s+b.sites,0),units:rows.reduce((s,b)=>s+b.units,0),totalSites:sites.size,excluded,entries};
  }
  function annual(records,start,end,size='all'){
    const inPeriod=records.filter(p=>{const date=p._issuedDay||(p.issued_date||'').slice(0,10);return date&&date>=start&&date<=end}),summary=summarize(inPeriod),years=[];
    for(let year=+start.slice(0,4);year<=+end.slice(0,4);year++)years.push({year,sites:0,units:0,groups:categories.map(c=>({...c,sites:0,units:0})),partial:start>year+'-01-01'||end<year+'-12-31'});
    for(const site of summary.entries){if(size!=='all'&&site.size!==Number(size))continue;const bin=years[+site.date.slice(0,4)-years[0].year];if(bin){bin.sites++;bin.units+=site.units;const group=bin.groups.find(c=>c.size===site.size);group.sites++;group.units+=site.units}}
    return {years,excluded:summary.excluded};
  }
  const api={categories,summarize,annual};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HomeSizes=api;
})(globalThis);
