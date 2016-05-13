
// Model holds data that will be injected into google map markers

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
]



// Global variables
var marker, infoWindow;


var viewModel = function() {

  // Self will always refer to the viewModel ;)
  var self = this;

  // Create Google Map
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 47.6062, lng: -122.332}
  });

  // Observable array holds map markers
  self.allMarkers = ko.observableArray([]);

  // Marker constructor
  var MyMarker = function(data) {
    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;
    this.venueID = data.venueID;
    this.description = data.description;
    this.marker = null;
  };

  // Loop over model, create Marker objects, push them into allMarkers
  model.forEach(function(data) {
    self.allMarkers.push( new MyMarker(data));
  });

  // FourSquare api URL's
  var baseURL = 'https://api.foursquare.com/v2/venues/';
  var venueID = '';
  var endURL = '?client_id=NVT0H2AVTCVAS3AZM5M5ITUQ4Q1D05GA2LL0BW33OEVEPAFE&client_secret=BTEL02NGF4LMABLSNMYAKKLC43N0ZH0QUDZYB4H54Q3VSEDD&v=20130815';

  // Loop over allMarkers and initialize marker objects
  self.allMarkers().forEach(function(item) {

    // var markerOptions = {
    //   map: self.googleMap,
    //   animation: google.maps.Animation.DROP,
    //   title: item.title,
    //   position: {lat: item.lat, lng: item.lng}
    // };

    // item.marker = new google.maps.Marker(markerOptions);

    marker = new google.maps.Marker({
      map: self.googleMap,
      Animation: google.maps.Animation.DROP,
      title: item.title,
      position: {lat: item.lat, lng: item.lng}
    })

    // Create infoWindow
    infoWindow = new google.maps.InfoWindow({
      content: null
    });

    // Add click event listener to marker objects.
    // Use IIFE pattern in order to add listner at the time of ...
    marker.addListener('click', (function(markerCopy){
      return function() {

        // Open infoWindow on click
        infoWindow.open(self.googleMap, markerCopy);

        // API call to fourSquare. Build infoWindow with returned data.
        $.getJSON(baseURL+item.venueID+endURL, function(data){
          var venue = data.response.venue;

          infoWindow.setContent('');

          infoWindow.setContent(
            '<h3>'+venue.name+'</h3>'+
            '<h5>'+venue.categories[0].name+'</h5>'+
            '<div>'+item.description+'</div>'+
            '<div><h6 id="address">Address: </h6>'+venue.location.address+'</div>'+
            '<div id="center">'+
            '<img src="'+venue.photos.groups[0].items[0].prefix+'width200'+venue.photos.groups[0].items[0].suffix+'"">'+
            '<img src="'+venue.photos.groups[0].items[1].prefix+'width200'+venue.photos.groups[0].items[1].suffix+'"">'+
            '<img src="'+venue.photos.groups[0].items[2].prefix+'width200'+venue.photos.groups[0].items[3].suffix+'"">'+
            '</div>'
          )
        });

        // Marker bounce effect and timeout.
        markerCopy.setAnimation(google.maps.Animation.BOUNCE);

        window.setTimeout(function(){
          markerCopy.setAnimation(null);
        }, 1450)

      };
    })(marker));

  });

  /*** FILTER SEARCH ***/

  // Empty observable tied to textInput of search field
  self.query = ko.observable('');

  // Search function: Returns a filtered instance of allMarkers array
  self.search = ko.computed(function(){
    return ko.utils.arrayFilter(self.allMarkers(), function(point){
      return point.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
  });

  self.listClick = function(location) {
    google.maps.event.trigger(marker, 'click');

    console.log('click.');
  };



};




ko.applyBindings( new viewModel() );

viewModel();













