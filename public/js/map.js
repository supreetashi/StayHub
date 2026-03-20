    
      // map = new mappls.Map('map', {center:{lat:12.9629,lng:77.5775} });
   const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: listing.geometry.coordinates,
    zoom: 9,
    container: 'map',
  })

new maplibregl.Marker({color : "red"})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maplibregl.Popup().setHTML(`<h4>${listing.title}</h4><P>Exact location will be provided after booking!</p>`)
  )
  // .addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}))
  .addTo(map);

  const nav = new maplibregl.NavigationControl({
    visualizePitch: true
});
map.addControl(nav, 'bottom-right');

map.addControl(new maplibregl.FullscreenControl({container: document.querySelector('#map')}))