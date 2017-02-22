var mainController = function () {
    var service = dataService();
    var auth = loginService();
    var init = function () {
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            AndroidFullScreen.immersiveMode();
            screen.lockOrientation('portrait');
            if (cordova.recheckScreenOrientation)
                cordova.recheckScreenOrientation(window.shouldRotateToOrientation, window.shouldRotateToOrientation);
        }

        $("#header-info").click(function () {
            if(window.sessionStorage.getItem("key") != "logado")
                $(".header-logout").hide();
            else
                $(".header-logout").show();
            setTimeout(function(){
                $.mobile.loading("show");
                service.chamadaGenericaAjax(configURLLogin.urlRecuperaInformacoes, configURLLogin.dadosVazio, retornoRecuperaInformacoes,function(){
                    window.location.href='index.html'
                });
            },500);
        });

        $("#login").on("input", function (e) {
            var lastVal = $(this).data("lastval");
            if ($(this).data("lastval") != $(this).val() &&
                (/^[0-9]+$/.test($(this).val()) || $(this).val() == "")) {
                $(this).data("lastval", $(this).val());
            }
            else
                $(this).val(lastVal);
        });
    };


    var logar = function () {
        var login = $("#login").val(), senha = $("#senha").val();
        if (!login || !senha)
            runtimePopup("Login", "Favor informar Matrícula e Senha", true);
        if (login.length <= 2)
            runtimePopup("Login", "Matrícula ou senha inválida", true);
        else
            loginUsuario(login, senha);
    };

    var loginUsuario = function (usuario, senha) {
        var usuarioSEmEspaco = usuario.trim();
        var seq = usuarioSEmEspaco.slice(-2);
        var login = usuarioSEmEspaco.slice(0,-2);
        dadosLogin.matricula = login;
        dadosLogin.sequencial = seq;
        dadosLogin.senha = senha;
        dadosLogin.uuid = device.uuid;
        service.chamadaGenericaAjax(configURLLogin.url, dadosLogin, retornoLoginUsuario);
    };


    var retornoLoginUsuario = function (responseParam) {
        var storage = window.sessionStorage;
        $.each(responseParam.statusExecucao.mensagens.mensagem, function (i, item) {
            if (item.codigo == 2) {
                configURLLogin.token = responseParam.token;
                configURLLogin.tipo_dependente = responseParam.tipo_dependente;
                storage.setItem("key", "logado");
                storage.setItem("matricula", dadosLogin.matricula);
                storage.setItem("sequencial", dadosLogin.sequencial);
                storage.setItem("token", configURLLogin.token);
                storage.setItem("tipo_dependente", configURLLogin.tipo_dependente);
                $.mobile.loading("show");

                if(configURLLogin.titular && configURLLogin.tipo_dependente != "T")
                {
                    $.mobile.loading("hide");
                    runtimePopup("Aviso", "Somente o titular tem acesso a esta área", true,function(){
                        window.location.href = "index.html";
                    });
                }
                else
                    window.location.href = configURLLogin.telaChamada;
            } else
            runtimePopup("Login", item.mensagem);
        });
};

var redirectRedeCredenciada = function () {
    $.mobile.loading("show");
    window.location.href = "rede_credenciada.html";

};

var CarregarInformacoes = function (url) {
    window.location.href = url;
}


var retornoRecuperaInformacoes = function (response) {
    var storage = window.sessionStorage;
    storage.setItem("infoGeral",JSON.stringify(response));
    setTimeout(function(){
        $.mobile.loading("hide");
    },500);
    window.location.href="index.html#moreinfo";
}

var logout = function(){
    runtimePopupConfirm("Logout", "Deseja fazer logout da aplicação?",function(){
        var storage = window.sessionStorage;
        storage.removeItem("key");
        storage.removeItem("matricula");
        storage.removeItem("token");
        storage.removeItem("tipo_dependente");
        window.location.href = "index.html"
    });
}

return {
    init: init,
    logar: logar,
    auth: auth,
    redirectRedeCredenciada: redirectRedeCredenciada,
    CarregarInformacoes: CarregarInformacoes,
    retornoRecuperaInformacoes: retornoRecuperaInformacoes,
    logout:logout
}
};

var mainCtrl = mainController();

$(function () {

    if(window.sessionStorage.getItem("key") != "logado")
        $(".header-logout").hide();
    else
        $(".header-logout").show();
    
    document.addEventListener("backbutton", onBackKeyDown, false);

    var initialScreenSize = window.innerHeight;
    window.addEventListener("resize", function () {
        if (window.innerHeight < initialScreenSize) {
            $("footer").hide();
        } else {
            $("footer").show();
        }
    });


    function onBackKeyDown(e) {
        if($.mobile.activePage.attr('id') == "pageone") {
            e.preventDefault();
            navigator.app.exitApp();
        }
        else
            window.location.href="index.html";

    }

    mainCtrl.init();
});