// <div id="sidebar">
//     <h1>Property Window</h1>
//
//     <p>A responsive sidebar plugin for for <a href="http://leafletjs.com/">Leaflet</a>, a JS library for interactive
//         maps.</p>
//
//     <p><b>Click on the marker to show the sidebar again when you've closed it.</b></p>
//
//     <p>Other examples:</p>
//
//     <p className="lorem">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
//         tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et j
//         usto duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
//         sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
//         invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo
//         duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
//
// </div>





// js
var sidebar = L.control.sidebar('sidebar', {
            closeButton: true,
            position: 'right'
        });
        map.addControl(sidebar);

        setTimeout(function () {
            sidebar.show();
        }, 500);

        var marker2 = L.marker([lat, lng]).addTo(map).on('click', function () {
            sidebar.toggle();
        });

        map.on('click', function () {
            sidebar.hide();
        })

        sidebar.on('show', function () {
            console.log('Sidebar will be visible.');
        });

        sidebar.on('shown', function () {
            console.log('Sidebar is visible.');
        });

        sidebar.on('hide', function () {
            console.log('Sidebar will be hidden.');
        });

        sidebar.on('hidden', function () {
            console.log('Sidebar is hidden.');
        });

        L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
            console.log('Close button clicked.');
        });


        //minimap
var miniMap = new L.Control.MiniMap(osm, {toggleDisplay: true}).addTo(map);