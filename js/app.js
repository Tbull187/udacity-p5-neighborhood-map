
// This is unique data that will be injected into google map markers

var model = [
  {
    title: 'Kerry Park',
    lat: 47.629552,
    lng: -122.360127
  },
  {
    title: 'Uncle Ike\'s',
    lat: 47.613352,
    lng: -122.302226
  },
    {
    title: 'Showbox Sodo',
    lat: 47.587926,
    lng: -122.333627
  },
    {
    title: 'Toulouse Petit',
    lat: 47.624761,
    lng: -122.357008
  },
    {
    title: 'GameWorks',
    lat: 47.611909,
    lng: -122.334027
  }
]

var marker;

function initMap() {

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: {lat: 47.6062, lng: -122.332}
	});

  marker = new google.maps.Marker({
    map: map,
    position: {lat: 47.629552, lng: -122.360127},
    title: 'Kerry Park',
    animation: google.maps.Animation.DROP
  });

  marker.addListener('click', toggleBounce);
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}


/* Locations

Kinear Park
Uncle Ike's
Showbox Sodo
Petite Toulouse
Gameworks
*/


