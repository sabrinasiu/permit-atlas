(function(root){
  function polygons(geometry){if(geometry?.type==='Polygon')return [geometry.coordinates];if(geometry?.type==='MultiPolygon')return geometry.coordinates;return []}
  function index(collection){return new Map((collection.features||[]).filter(f=>f.properties?.nhood&&polygons(f.geometry).length).map(f=>[f.properties.nhood.trim().toLowerCase(),f]))}
  function extent(feature){const points=polygons(feature.geometry).flat(2);return {south:Math.min(...points.map(p=>p[1])),north:Math.max(...points.map(p=>p[1])),west:Math.min(...points.map(p=>p[0])),east:Math.max(...points.map(p=>p[0]))}}
  function maskRings(features){const world=[[-85,-180],[85,-180],[85,180],[-85,180]];return [world,...features.flatMap(f=>polygons(f.geometry).flatMap(p=>p.map(ring=>ring.map(([lng,lat])=>[lat,lng]))))]}
  const api={polygons,index,extent,maskRings};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NeighborhoodFocus=api;
})(globalThis);
