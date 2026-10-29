(function(root){
 function groups(records){const groups=new Map();for(const p of records){const id=p._siteId||'permit-'+p.permit_number;if(!groups.has(id))groups.set(id,{id,number:p._siteNumber||null,records:[]});groups.get(id).records.push(p)}return [...groups.values()].sort((a,b)=>(b.records.reduce((d,p)=>(p._issuedDay||'')>d?p._issuedDay:d,'')).localeCompare(a.records.reduce((d,p)=>(p._issuedDay||'')>d?p._issuedDay:d,''))).map(g=>({...g,records:g.records.slice().sort((a,b)=>(b._issuedDay||'').localeCompare(a._issuedDay||''))}))}
 const api={groups};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BuildSites=api;
})(globalThis);
