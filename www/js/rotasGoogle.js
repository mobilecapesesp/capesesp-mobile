var map,
    currentPosition,
    directionsDisplay,
    directionsService,
    lats = [];

var rotasGoogle = function () {
    var lngs = [];
    var cpfs = [];
    var seqs = [];
    var calcularRota = false;
    var latHist = "";
    var lngHist = "";
    var targetDestination;
    var storage = window.sessionStorage;
    var mypos;
    var address;

    function initialize(lat, lon, useAddress) {
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsService = new google.maps.DirectionsService();

        if(!useAddress) {
            currentPosition = new google.maps.LatLng(lat, lon);
            generateMap(lat, lon);
        }
        else
        {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function (results) {
                currentPosition = new google.maps.LatLng(results[0].geometry.location.k, results[0].geometry.location.B);
                generateMap(lat, lon);
            });
        }
    }

    function generateMap(lat, lon){

        var mapBounds = new google.maps.LatLngBounds();

        map = new google.maps.Map(document.getElementById('map_canvas'), {
            center: currentPosition,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        directionsDisplay.setMap(map);

        var infoWindow = new google.maps.InfoWindow(), marker, i;
        if (!calcularRota) {
            if (lat !== "0.0" && lon !== "0.0") {
                var currentPositionMarker = new google.maps.Marker({
                    position: currentPosition,
                    map: map,
                    title: "Current position",
                    icon: 'http://maps.gstatic.com/mapfiles/markers2/icon_green.png'
                });


                google.maps.event.addListener(currentPositionMarker, 'click', (function (currentPositionMarker, i) {
                    return function () {
                        infoWindow.setContent("Sua localização");
                        infoWindow.open(map, currentPositionMarker);
                    }
                })(currentPositionMarker, i));

                mapBounds.extend(currentPosition);

                mypos = currentPositionMarker;
            }
        }

        for (var i = 0; i < lats.length; i++) {
            if (lats[i] <= 5.35 && lats[i] >= -33.8 && lngs[i] >= -74.2 && lngs[i] <= -34.6) {
                latHist = lats[i];
                lngHist = lngs[i];
                var p = new google.maps.LatLng(lats[i], lngs[i]);
                targetDestination = p;
                if (!calcularRota) {
                    var marker = new google.maps.Marker({
                        position: p,
                        map: map,
                        title: "Localização"
                    });


                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            var element = "<a href=\"#\" onclick=\"javascript:window.location.href='rede_credenciada.html?parammapa=mapa&cpf=" + cpfs[i] + "&seq=" + seqs[i] + "' \"><img src='img/pesquisar.jpg' alt='Home' width='35' height='40'></a>Detalhes do Credenciado";
                            infoWindow.setContent(element);
                            infoWindow.open(map, marker);
                        }
                    })(marker, i));
                }
                mapBounds.extend(p);
            }

        }
        map.fitBounds(mapBounds);

        if (calcularRota)
            calculateRoute();

        $.mobile.loading("hide");
        setInterval(function () {
            resizeMap(map)
        }, 500);

        setTimeout(function () {
            map.fitBounds(mapBounds);
        }, 1000);

    }

    function resizeMap(map) {
        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
    }

    function locError(error) {
        $.mobile.loading("hide");
        initialize("1.0", "1.0", true);
    }

    function locSuccess(position) {
        if (lats.length > 0 && lngs.length > 0) {
            initialize(position.coords.latitude, position.coords.longitude, false);
        }
    }

    function calculateRoute() {
        if (currentPosition && currentPosition != '' && targetDestination && targetDestination != '') {
            var request = {
                origin: currentPosition,
                destination: targetDestination,
                travelMode: google.maps.DirectionsTravelMode["DRIVING"]
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setPanel(document.getElementById("directions"));
                    directionsDisplay.setDirections(response);

                    $("#results").show();
                }
                else {
                    $("#results").hide();
                }
            });
        }
        else {
            $("#results").hide();
        }
    }

    function init(calcRota) {
        $.mobile.changePage("#basic-map");
        $("#directions").children().remove();
        $("#map_canvas").children().remove();
        calcularRota = generateRota;

        if (storage.getItem("lats"))
            lats = JSON.parse(storage.getItem("lats"));
        if (storage.getItem("lngs"))
            lngs = JSON.parse(storage.getItem("lngs"));
        if (storage.getItem("cpfs"))
            cpfs = JSON.parse(storage.getItem("cpfs"));
        if (storage.getItem("seqs"))
            seqs = JSON.parse(storage.getItem("seqs"));
        if (storage.getItem("address"))
            address = storage.getItem("address");

        $.mobile.loading("show");
        navigator.geolocation.getCurrentPosition(locSuccess, locError, {timeout: 5000});

        $(document).on('click', '#directions-button', function (e) {
            e.preventDefault();
            calculateRoute();
        });
    }

    return {
        init: init,
        mypos: mypos
    }
}
