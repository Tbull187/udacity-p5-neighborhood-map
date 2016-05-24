// Raw location data.
var model = [
	{
		title: 'Kerry Park',
		lat: 47.629552,
		lng: -122.360127,
		venueID: '4558a938f964a520493d1fe3'
	},
	{
		title: 'Showbox Sodo',
		lat: 47.587926,
		lng: -122.333627,
		venueID: '472e59eaf964a520074c1fe3'
	},
	{
		title: 'Toulouse Petit',
		lat: 47.624761,
		lng: -122.357008,
		venueID: '4ae60430f964a52018a421e3'
	},
	{
		title: 'GameWorks',
		lat: 47.611909,
		lng: -122.334027,
		venueID: '40b7d280f964a5208d001fe3'
	},
	{
		title: 'Trading Musician',
		lat: 47.671845,
		lng: -122.317115,
		venueID: '4ae0f365f964a520fb8321e3'
	},
	{
		title: 'Brave Horse Tavern',
		lat: 47.621754,
		lng: -122.336879,
		venueID: '4d9a7c885e52224b217e2ee3'
	},
	{
		title: 'Uncle Ike\'s',
		lat: 47.613352,
		lng: -122.302226,
		venueID: '542b0848498e259fb7853267'
	},
	{
		title: 'Pagliacci Pizza',
		lat: 47.624396,
		lng: -122.356561,
		venueID: '459c14eef964a52095401fe3'
	},
	{
		title: 'The Masonry',
		lat: 47.625676,
		lng: -122.355746,
		venueID: '51fdb194498e5101da70bb56'
	},
	{
		title: 'Cinerama',
		lat: 47.614275,
		lng: -122.341445,
		venueID: '4276bf00f964a52083211fe3'
	}
];

// Initialize collapsible side nav.
$(".button-collapse").sideNav();

// If google maps script fails to load:
function googleError() {
  alert('Google Maps script failed to load. Please check network connection');
}

// If google maps script succeeds, this callback initializes the viewModel.
function googleSuccess() {
  ko.applyBindings( new viewModel() );
}



// As a global variable there is only one instance of infoWindow.
// This allows for just one infoWindow to be open at a time.
var infoWindow;

var viewModel = function() {

  // Self will always refer to the viewModel.
  var self = this;

  // Create Google Map.
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 47.625143, lng: -122.326594}
  });

  // Bound the map so all markers appear in view even on small screens
  var bounds = new google.maps.LatLngBounds(),
      point1 = new google.maps.LatLng(47.590211, -122.396608),
      point2 = new google.maps.LatLng(47.679511, -122.243143);

  bounds.extend(point1);
  bounds.extend(point2);
  self.googleMap.fitBounds(bounds);

  // Array to hold MyMarker objects.
  self.allMarkers = [];

  // Marker constructor
  var MyMarker = function(data) {
    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;
    this.venueID = data.venueID;
    this.marker = null;
  };

  // Loop over model, create MyMarker objects, push them into allMarkers.
  model.forEach(function(data) {
    self.allMarkers.push( new MyMarker(data));
  });

  // FourSquare api URL's.
  var baseURL = 'https://api.foursquare.com/v2/venues/',
      venueID = '',
      endURL = '?client_id=NVT0H2AVTCVAS3AZM5M5ITUQ4Q1D05GA2LL0BW33OEVEPAFE&client_secret=BTEL02NGF4LMABLSNMYAKKLC43N0ZH0QUDZYB4H54Q3VSEDD&v=20130815';

  // Loop over allMarkers and initialize marker property as new Google Maps marker object.
  self.allMarkers.forEach(function(item) {

    var markerOptions = {
      map: self.googleMap,
      animation: google.maps.Animation.DROP,
      title: item.title,
      position: {lat: item.lat, lng: item.lng}
    };

    item.marker = new google.maps.Marker(markerOptions);

    // Create infoWindow.
    infoWindow = new google.maps.InfoWindow({
      content: null
    });

    // Add click event listener to marker objects.
    // Use IIFE pattern to add listner at the time each object is referenced.
    item.marker.addListener('click', (function(markerCopy){
      return function() {

        // Pan to map marker.
        self.googleMap.panTo(markerCopy.getPosition());

        // Open infoWindow.
        infoWindow.open(self.googleMap, markerCopy);

        // API call to fourSquare. Build infoWindow with returned data.
        $.getJSON(baseURL+item.venueID+endURL, function(data){
          var venue = data.response.venue;

          infoWindow.setContent('');

          infoWindow.setContent(
            '<h3>'+venue.name+'</h3>'+
            '<h5>'+venue.categories[0].name+'</h5>'+
            '<div>'+
              '<div class="icon">'+
                '<img src="'+venue.categories[0].icon.prefix+'bg_64'+venue.categories[0].icon.suffix+'" >'+
              '</div>'+
              '<div class="address">'+
                '<h6>Address:</h6>'+
                '<p>'+venue.location.address+'</p>'+
                '<p>'+venue.location.city+', '+venue.location.state+', '+venue.location.postalCode+'</p>'+
              '</div>'+
            '</div>'+
            '<div class="center">'+
              '<img src="'+venue.photos.groups[0].items[0].prefix+'200x200'+venue.photos.groups[0].items[0].suffix+'"">'+
              '<img src="'+venue.photos.groups[0].items[1].prefix+'200x200'+venue.photos.groups[0].items[1].suffix+'"">'+
              '<img src="'+venue.photos.groups[0].items[2].prefix+'200x200'+venue.photos.groups[0].items[3].suffix+'"">'+
            '</div>'+
            '<p class="attribution">Info and photos courtesy of FourSquare</p>'
          );
        }).fail(function(){
          infoWindow.setContent('<div>Network Error.</div>');
        });

        // Marker bounce effect and timeout.
        markerCopy.setAnimation(google.maps.Animation.BOUNCE);

        window.setTimeout(function(){
          markerCopy.setAnimation(null);
        }, 1400);

      };
    })(item.marker));

  });

  /*** FILTER SEARCH ***/

  // Credit to http://codepen.io/prather-mcs/pen/KpjbNN?editors=1010
  // Array to hold markers that are visible on the map.
  self.visibleMarkers = ko.observableArray();

  // All markers should be visiible at first. Push markers from allMarkers into visibleMarkers.
  self.allMarkers.forEach(function(marker) {
    self.visibleMarkers.push(marker);
  });

  // An empty observable tied to textInput of search field.
  self.query = ko.observable('');

  self.search = function() {
    var searchInput = self.query().toLowerCase();

    // Empty visibleMarkers array.
    self.visibleMarkers.removeAll();

    // First make all marker invisible.
    self.allMarkers.forEach(function(item) {
      item.marker.setVisible(false);

      // If marker's title matches searchInput, push that marker into visibleMarkers.
      if (item.title.toLowerCase().indexOf(searchInput) !== -1) {
        self.visibleMarkers.push(item);
      }
    });

    // Finally set all visibleMarkers to visible.
    self.visibleMarkers().forEach(function(item) {
      item.marker.setVisible(true);
    });
  };

  // Triggers click event on marker when list item is clicked.
  self.listClick = function(item) {
    google.maps.event.trigger(item.marker, 'click');
  };

};
