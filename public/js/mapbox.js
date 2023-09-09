/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoib2hpZGFsZ292IiwiYSI6ImNsbTc1czhzdzNlbWYzcG85NGxnd2x0ZmIifQ.VKbzlHOCeTBeQUmSU_rnHA';

  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ohidalgov/clm7783ut02mr01qb7o6ven76',
    scrollZoom: false,
    center: [-118.113491, 34.111745],
    zoom: 10,
    //interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
