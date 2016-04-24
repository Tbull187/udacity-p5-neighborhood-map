
// Model holds data that will be injected into google map markers

var model = [
  {
    title: 'Kerry Park',
    lat: 47.629552,
    lng: -122.360127,
    venueID: '4558a938f964a520493d1fe3'
  },
  {
    title: 'Uncle Ike\'s',
    lat: 47.613352,
    lng: -122.302226,
    venueID: '542b0848498e259fb7853267'
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
  }
]

// Global variables
var marker, infoWindow;


function viewModel() {

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
  var Marker = function(data) {
    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;
    this.venueID = data.venueID;
  };

  // Loop over model, create Marker objects, push them into allMarkers
  model.forEach(function(data){
    self.allMarkers.push( new Marker(data));
  });

  // FourSquare api URL's
  var baseURL = 'https://api.foursquare.com/v2/venues/';
  var venueID = '';
  var endURL = '?client_id=NVT0H2AVTCVAS3AZM5M5ITUQ4Q1D05GA2LL0BW33OEVEPAFE&client_secret=BTEL02NGF4LMABLSNMYAKKLC43N0ZH0QUDZYB4H54Q3VSEDD&v=20130815';

  // Loop over allMarkers and initialize marker objects
  self.allMarkers().forEach(function(marker) {

    console.log(marker.venueID);

    marker = new google.maps.Marker({
      map: self.googleMap,
      Animation: google.maps.Animation.DROP,
      title: marker.title,
      position: {lat: marker.lat, lng: marker.lng}
    })

    console.log(marker.venueID);

    // Create infoWindow
    infoWindow = new google.maps.InfoWindow({
      content: null
    });

    // Click event listener for markers
    marker.addListener('click', function() {
      infoWindow.open(self.googleMap, marker);

      marker.setAnimation(google.maps.Animation.BOUNCE);
      window.setTimeout(function(){
        marker.setAnimation(null);
      }, 1450)

      $.getJSON(baseURL+marker.venueID+endURL, function(data){
        infoWindow.setContent(data.response.venue.name)
      });
    });

  });


};

ko.applyBindings( new viewModel() );

viewModel();
