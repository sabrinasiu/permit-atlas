/* Transform existing canvas frames during Leaflet zoom; repaint geometry when it settles. */
(function(root){
  function bind(layer,map,canvases){
    const transform=event=>{const view=layer._canvasView;if(!view)return;const zoom=event.zoom??map.getZoom(),center=event.center||map.getCenter(),scale=map.getZoomScale(zoom,view.zoom),topLeft=map.project(view.topLeft,zoom).subtract(map.project(center,zoom)).add(map.getSize().divideBy(2)),offset=map.containerPointToLayerPoint(topLeft);for(const canvas of canvases)L.DomUtil.setTransform(canvas,offset,scale)};
    layer._canvasZoomHandler=transform;map.on('zoomanim zoom',transform);
  }
  function rendered(layer,map){layer._canvasView={zoom:map.getZoom(),topLeft:map.containerPointToLatLng([0,0])}}
  function unbind(layer,map){map.off('zoomanim zoom',layer._canvasZoomHandler);layer._canvasZoomHandler=null;layer._canvasView=null}
  const api={bind,rendered,unbind};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CanvasZoom=api;
})(globalThis);
