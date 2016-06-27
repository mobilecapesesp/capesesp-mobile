function abrirWebview(titulo, url, usesLogin, back, titular, orientation) {
    var authService = loginService();
    localStorage.currentWebviewTittle = titulo;
    localStorage.currentWebviewUrl = url;
    localStorage.currentWebviewUsesToken = usesLogin;
    localStorage.currentWebviewOrientation = orientation;
    localStorage.currentWebviewBack = back;


    if (usesLogin)
        authService.validarToken("webview.html",titular);
    else
    {
        $.mobile.loading("show");
        var urlIframe = configURLLogin.iframesBaseUrl + localStorage.currentWebviewUrl;
        $.get(urlIframe).success(function(){
            window.location.href = "webview.html";
        }).error(function(){
            $.mobile.loading("hide");
            runtimePopup("Erro", "Falha de comunicação. Tente novamente",false);
        })
    }
}

function webviewOnDeviceReady() {
    //Screen orientation não foi carregado
    if (!screen.lockOrientation)
        return;

    switch (localStorage.currentWebviewOrientation) {
        case '':
        case 'undefined':
        return;
        case 'free':
        screen.unlockOrientation();
        break;
        default:
        screen.lockOrientation(localStorage.currentWebviewOrientation);
        break;
    }

    $("#webviewContainer").css("margin-top","14%");
    $("#webviewContainer").css("height","75%");

    if(localStorage.currentWebviewOrientation.indexOf("portrait") != -1)
    {
        $("#webviewContainer").css("margin-top","20%");
        $("#webviewContainer").css("height","100%");
    }

    localStorage.currentWebviewOrientation = "";

    if (cordova.recheckScreenOrientation)
        cordova.recheckScreenOrientation(window.shouldRotateToOrientation, window.shouldRotateToOrientation);

}


function initializeWebview() {
    $.mobile.loading("show");
    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
        navigator.app.backHistory();
    }


    var storage = window.sessionStorage;
    var urlIframe = configURLLogin.iframesBaseUrl + localStorage.currentWebviewUrl;
    if(JSON.parse(localStorage.currentWebviewBack))
        $(".back-webview").css("display","");
    $(".ui-title").html(localStorage.currentWebviewTittle);

    if (localStorage.currentWebviewUsesToken && storage.getItem("token")) {
        urlIframe += "?token=" + storage.getItem("token");
    }

    var webviewIframe = $("<iframe>").attr({src: urlIframe,width: "100%", seamless: ""})
    .appendTo("#webviewContainer");
    webviewIframe.height((screen.height - webviewIframe.position().top) + "px");

    $("iframe").on("load",function(){
        $.mobile.loading("hide");
    });


    localStorage.currentWebviewTittle = localStorage.currentWebviewUrl = localStorage.currentWebviewUsesToken = "";


}

$(function () {
    $("a[data-webview-tittle]").click(function () {
        var e = $(this);
        abrirWebview(
            e.attr("data-webview-tittle"),
            e.attr("data-webview-url"),
            e.attr("data-webview-requires-login") != undefined,
            e.attr("data-webview-back") != undefined,
            e.attr("data-webview-titular") != undefined,
            e.attr("data-webview-orientation"));
    });
});