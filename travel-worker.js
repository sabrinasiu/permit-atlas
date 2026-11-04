importScripts('travel-engine.js');
let datasetPromise;
function load(){return datasetPromise??=(async()=>{const response=await fetch('data/muni-schedule.json.gz');if(!response.ok)throw Error('Could not load the saved Muni schedule.');const stream=response.body.pipeThrough(new DecompressionStream('gzip'));return TravelEngine.prepare(await new Response(stream).json())})().catch(error=>{datasetPromise=null;throw error})}
onmessage=async event=>{const {id,request}=event.data;try{const data=await load(),result=TravelEngine.compute(data,request);postMessage({id,result},[result.times.buffer])}catch(error){postMessage({id,error:error.message})}};
