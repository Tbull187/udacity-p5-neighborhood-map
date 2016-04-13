function initMap() {

	// Create a map object and specify the DOM element for display.
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: {lat: 47.6062, lng: -122.332}
	});

  var marker1 = new google.maps.Marker({
    map: map,
    position: {lat: 47.629552, lng: -122.360127},
    title: 'Kerry Park',
    animation: google.maps.Animation.DROP
  });

  var marker2 = new google.maps.Marker({

  })

  marker1.addListener('click', toggleBounce);
}

var marker;
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
*/


