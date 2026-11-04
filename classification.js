(function(root){
  const categories=[
    {id:'one',label:'1 unit',min:1,max:1,color:'#BED9DA'},
    {id:'small',label:'2–4 units',min:2,max:4,color:'#9CBEC8'},
    {id:'medium',label:'5–19 units',min:5,max:19,color:'#7BA1B4'},
    {id:'large',label:'20–49 units',min:20,max:49,color:'#567FA0'},
    {id:'larger',label:'50–99 units',min:50,max:99,color:'#2E5882'},
    {id:'largest',label:'100+ units',min:100,max:Infinity,color:'#053161'},
    {id:'unknown',label:'Nonresidential / unknown units',color:'#959b9b'}
  ];
  function number(value){if(value===null||value===undefined||String(value).trim()==='')return null;const text=String(value).trim().replace(/,/g,'');if(!/^\d+(\.0+)?$/.test(text))return null;const n=Number(text);return Number.isSafeInteger(n)&&n>=0?n:null}
  function classify(p){const use=String(p.proposed_use||'').trim().toLowerCase(),residential=['1 family dwelling','2 family dwelling','apartments','residential hotel','workshop residential'].includes(use),units=number(p.proposed_units),stories=number(p.number_of_proposed_stories),existing=number(p.existing_units),index=residential&&units&&units>0?categories.findIndex(c=>c.min!==undefined&&units>=c.min&&units<=c.max):categories.length-1;return {index,category:categories[index],units,residential,stories,existing,net:units!==null&&existing!==null?units-existing:null}}
  const api={categories,number,classify};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PermitClass=api;
})(globalThis);
