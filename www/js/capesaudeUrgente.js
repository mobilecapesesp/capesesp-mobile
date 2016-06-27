var capesaudeUrgente = function () {
    var service = dataService();

    var init = function () {
        $.mobile.loading("hide");

        $("#numero-capesaude").html(JSON.parse(window.sessionStorage.getItem("infoGeral")).capesaudeUrgente.telefone.numero);
        document.addEventListener("backbutton", onBackKeyDown, false);

        function onBackKeyDown() {
            navigator.app.backHistory();
        }
    };

    var call = function () {
        document.location.href = "tel:" + $("#numero-capesaude").text();
    };

    return {
        init: init,
        call: call
    }
};

var capesaudeUrgCtrl = new capesaudeUrgente();

$(function () {
    capesaudeUrgCtrl.init();
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        screen.lockOrientation('portrait');
        if (cordova.recheckScreenOrientation)
            cordova.recheckScreenOrientation(window.shouldRotateToOrientation, window.shouldRotateToOrientation);
    }
});