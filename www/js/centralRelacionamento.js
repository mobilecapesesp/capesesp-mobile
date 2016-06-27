var centralRelacionamento = function () {

    var service = dataService();

    var retornoRecuperaInformacoes = function () {

        var responseParam = JSON.parse(window.sessionStorage.getItem("infoGeral"));
        $("#descricao").text(responseParam.centralRelacionamento.descricao);

        $.each(responseParam.centralRelacionamento.cabecalhos.cabecalho, function (i, item) {
            var text = $("<B></B><br/>").text(item.descricao);
            $("#cabecalho").append(text);
        });

        var text = $("<B></B><br/>").text(responseParam.centralRelacionamento.telefone.numero);
        $("#cabecalho").append(text);
		
        $.each(responseParam.centralRelacionamento.servicos.informacoes, function (j, item) {
            var text = $("<li></li>").text(item.informacao);
            $("#central_relacionamento_ul").append(text);
        });
    };

    var init = function () {
        $(document).ready(function () {
            $.mobile.loading("hide");
            retornoRecuperaInformacoes();
        });
        document.addEventListener("backbutton", onBackKeyDown, false);

        function onBackKeyDown() {
            navigator.app.backHistory();
        }
    };


    return {
        init: init
    }
};

var centralRelCtrl = new centralRelacionamento();

$(function () {
    centralRelCtrl.init();
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        screen.lockOrientation('portrait');
        if (cordova.recheckScreenOrientation)
            cordova.recheckScreenOrientation(window.shouldRotateToOrientation, window.shouldRotateToOrientation);
    }
});
