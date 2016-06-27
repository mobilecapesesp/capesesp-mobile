$(function () {

    function GetButaoResolution() {
        var width = $(window).width();
        var height = $(window).height();
        var bigger = height > width ? height : width;
        return bigger/100 - (devicePixelRatio * (2.5)) - (devicePixelRatio/2);

    }

    function createHeaderButton(link, icon, position) {
        var zoomSize = GetButaoResolution();
        return $("<a href='" + link + "' style='zoom:" + zoomSize + "'" +
        "data-transition='pop' data-role='button' data-icon='" + icon + "' data-iconpos='notext' data-theme='a' data-inline='true' " +
        "class='" + icon + "-icone ui-icon-" + icon + " ui-btn-" + position + " ui-link ui-btn ui-btn-a ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all'></a>");
    }

    $("[data-capesesp-header]").each(function (i, e) {
        $(e).attr({"data-role": "header", "data-position": "fixed"}).addClass("header-mudado");

        if ($(e).attr("data-hide-home") == undefined)
            createHeaderButton("#", "home", "left").appendTo(e)
                .click(function () {
                    screen.lockOrientation('portrait');
                    if ($.mobile.activePage.attr("id") == "loginsistema")
                        history.go(0);
                    else
                        history.go(1 - history.length);
                });
		
		if ($(e).attr("data-show-back-left") != undefined)
            createHeaderButton("#", "back", "left").appendTo(e)
                .click(function () {
                   // screen.lockOrientation('portrait');
					//if (cordova.recheckScreenOrientation)
                   // cordova.recheckScreenOrientation(window.shouldRotateToOrientation, window.shouldRotateToOrientation);

                  if ($(e).attr("data-show-back-left") == "")
                    window.history.back(-1);
                else
                    window.location = $(e).attr("data-show-back");
                });

        if ($(e).attr("data-hide-info") == undefined)
            createHeaderButton("#", "info", "right").appendTo(e)
                .click(function () {
                    window.location = "index.html#moreinfo";
                });
        else if ($(e).attr("data-show-back") != undefined)
            createHeaderButton("#", "back", "right").appendTo(e).click(function () {
                //screen.lockOrientation('portrait');
                //if (cordova.recheckScreenOrientation)
                //    cordova.recheckScreenOrientation(window.shouldRotateToOrientation, window.shouldRotateToOrientation);

                if ($(e).attr("data-show-back") == "")
				 window.history.back(-1);
                  //  history.back(-1);
                else
				alert($(e).attr("data-show-back"));
                    window.location = $(e).attr("data-show-back");
            });

        if ($(e).attr("data-show-mapa") != undefined)
            createHeaderButton("javascript:" + $(e).attr("data-show-mapa"), "navigation", "right").appendTo(e);

        $("<h1>").html($(e).attr("data-capesesp-header")).appendTo(e);

        $(e).trigger('create');
    });

});