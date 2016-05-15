// Raw location data.
var model = [
  {
    title: 'Kerry Park',
    lat: 47.629552,
    lng: -122.360127,
    venueID: '4558a938f964a520493d1fe3',
    description: 'Nunc non fringilla erat, et iaculis lorem. Nam orci odio, ornare sit amet ligula eget, sodales sollicitudin est. Vivamus et augue hendrerit, pellentesque neque ut, finibus lectus. Nulla maximus magna neque, a rhoncus mi laoreet quis. Proin porta efficitur dictum.'
  },
  {
    title: 'Uncle Ike\'s',
    lat: 47.613352,
    lng: -122.302226,
    venueID: '542b0848498e259fb7853267',
    description: 'Nunc non fringilla erat, et iaculis lorem. Nam orci odio, ornare sit amet ligula eget, sodales sollicitudin est. Vivamus et augue hendrerit, pellentesque neque ut, finibus lectus. Nulla maximus magna neque, a rhoncus mi laoreet quis. Proin porta efficitur dictum.'
  },
  {
    title: 'Showbox Sodo',
    lat: 47.587926,
    lng: -122.333627,
    venueID: '472e59eaf964a520074c1fe3',
    description: 'Nunc non fringilla erat, et iaculis lorem. Nam orci odio, ornare sit amet ligula eget, sodales sollicitudin est. Vivamus et augue hendrerit, pellentesque neque ut, finibus lectus. Nulla maximus magna neque, a rhoncus mi laoreet quis. Proin porta efficitur dictum.'
  },
  {
    title: 'Toulouse Petit',
    lat: 47.624761,
    lng: -122.357008,
    venueID: '4ae60430f964a52018a421e3',
    description: 'Nunc non fringilla erat, et iaculis lorem. Nam orci odio, ornare sit amet ligula eget, sodales sollicitudin est. Vivamus et augue hendrerit, pellentesque neque ut, finibus lectus. Nulla maximus magna neque, a rhoncus mi laoreet quis. Proin porta efficitur dictum.'
  },
  {
    title: 'GameWorks',
    lat: 47.611909,
    lng: -122.334027,
    venueID: '40b7d280f964a5208d001fe3',
    description: 'Nunc non fringilla erat, et iaculis lorem. Nam orci odio, ornare sit amet ligula eget, sodales sollicitudin est. Vivamus et augue hendrerit, pellentesque neque ut, finibus lectus. Nulla maximus magna neque, a rhoncus mi laoreet quis. Proin porta efficitur dictum.'
  }
];

// As a global variable there is only one instance of infoWindow.
// This allows for just one infoWindow to be open at a time.
var infoWindow;

var viewModel = function() {

  // Self will always refer to the viewModel.
  var self = this;

  // Create Google Map.
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 47.6062, lng: -122.332}
  });

  // Array to hold MyMarker objects.
  self.allMarkers = [];

  // Marker constructor
  var MyMarker = function(data) {
    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;
    this.venueID = data.venueID;
    this.description = data.description;
    this.marker = null;
  };

  // Loop over model, create MyMarker objects, push them into allMarkers.
  model.forEach(function(data) {
    self.allMarkers.push( new MyMarker(data));
  });

  // FourSquare api URL's.
  var baseURL = 'https://api.foursquare.com/v2/venues/';
  var venueID = '';
  var endURL = '?client_id=NVT0H2AVTCVAS3AZM5M5ITUQ4Q1D05GA2LL0BW33OEVEPAFE&client_secret=BTEL02NGF4LMABLSNMYAKKLC43N0ZH0QUDZYB4H54Q3VSEDD&v=20130815';

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

        // Open infoWindow on click.
        infoWindow.open(self.googleMap, markerCopy);

        // API call to fourSquare. Build infoWindow with returned data.
        $.getJSON(baseURL+item.venueID+endURL, function(data){
          var venue = data.response.venue;

          infoWindow.setContent('');

          infoWindow.setContent(
            '<h3>'+venue.name+'</h3>'+
            '<h5>'+venue.categories[0].name+'</h5>'+
            '<div>'+item.description+'</div>'+
            '<div><h6 id="address">Address:</h6><span>'+venue.location.address+'</span></div>'+
            '<div id="center">'+
            '<img src="'+venue.photos.groups[0].items[0].prefix+'200x200'+venue.photos.groups[0].items[0].suffix+'"">'+
            '<img src="'+venue.photos.groups[0].items[1].prefix+'200x200'+venue.photos.groups[0].items[1].suffix+'"">'+
            '<img src="'+venue.photos.groups[0].items[2].prefix+'200x200'+venue.photos.groups[0].items[3].suffix+'"">'+
            '</div>'+
            '<p id="attribution">Photos courtesy of FourSquare</p>'

          );
        }).error(function(){
          infoWindow.setContent('<div>Network Error.</div>');
        });

        // Marker bounce effect and timeout.
        markerCopy.setAnimation(google.maps.Animation.BOUNCE);

        window.setTimeout(function(){
          markerCopy.setAnimation(null);
        }, 1450);

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

  // Empty observable tied to textInput of search field.
  self.query = ko.observable('');


  self.search = function() {
    var searchInput = self.query().toLowerCase();

    // Empty visibleMarkers array.
    self.visibleMarkers.removeAll();

    // First remove all markers from the map.
    self.allMarkers.forEach(function(item) {
      item.marker.setMap(null);

      // If marker title matches searchInput, push that marker into visibleMarkers.
      if (item.title.toLowerCase().indexOf(searchInput) !== -1) {
        self.visibleMarkers.push(item);
      }
    });

    // Finally add all visibleMarkers back on the map
    self.visibleMarkers().forEach(function(item) {
      item.marker.setMap(self.googleMap);
    });
  };

  // Triggers click event on marker when list item is clicked
  self.listClick = function(item) {
    google.maps.event.trigger(item.marker, 'click');
  };

};

ko.applyBindings( new viewModel() );
