//https://webservicesh.capesesp.com.br/capesesp-apis-v1.1/ws/
var hostApi = "https://webservices.capesesp.com.br/";
var apiBaseUrl = hostApi + "capesesp-apis-v1.2/ws/";
var urlRedeCredenciada = apiBaseUrl + "redecredenciada/";

var configURLLogin = {
    iframesBaseUrl: "https://servicos.capesesp.com.br/",
    url: apiBaseUrl + "json/login",
    urlValidaToken: apiBaseUrl + "json/valida",
    urlRecuperaInformacoes: apiBaseUrl + "informacoes/recupera",
    urlGrupoFamiliar: apiBaseUrl + "carteira/listar",
    urlDetalhesCarteira: apiBaseUrl + "carteira/recupera",
    urlTipoCarteira: apiBaseUrl + "carteira/listarTipo",
    urlPlanos: urlRedeCredenciada + "planos",
    urlEstados: urlRedeCredenciada + "estados",
    urlMunicipios: urlRedeCredenciada + "municipios",
    urlTipoServico: urlRedeCredenciada + "tipo_servico",
    urlServico: urlRedeCredenciada + "servicos",
    urlDetalheCredenciado: urlRedeCredenciada + "detalhes",
    urlEndereco: apiBaseUrl + "georreferencia/endereco",
    urlListaCredenciados: urlRedeCredenciada + "lista_credenciados",
    token: "",
    tipo_dependente: "",
    titular: "",
    dadosValidaToken: { "token": "" },
    dadosEstados: { "codAns": "" },
    dadosCarteira: { "matricula": "", "sequencial": 1, "token": "", "codAns": 0 },
    dadosTipoCarteira: { "matricula": "", "sequencial": 1, "token": "" },
    dadosGrupoFamiliar: { "matricula": "", "token": "" },
    dadosMunicipio: { "siglaEstado": "", "codAns": "", "urgEmer": "" },
    dadosTipoServico: { "descMunicipio": "", "siglaEstado": "", "codAns": "", "urgEmer": "" },
    dadosServicos: { "codModalidade": "", "descMunicipio": "", "siglaEstado": "", "codAns": "", "urgEmer": "" },
    dadosDetalheCredenciado: { "cpfCnpj": "" },
    dadosEndereco: { "latitude": "", "longitude": "" },
    dadosGerais: {},
    codEspAtend: "",
    telaChamada: ""
};

var dadosLogin = {
    "matricula": "",
    "sequencial": "",
    "senha": ""
};
var dadosListaCredenciados = {
    "codAns": "",
    "urgEmer": "",
    "siglaEstado": "",
    "descMunicipio": "",
    "descBairro": "",
    "codModalidade": "",
    "codEspecialidade": "",
    "codTipoAtendimento": "",
    "nomePrestador": ""
};

function clone(stub, objtobecloned) {
    for (var attr in objtobecloned) {
        if (objtobecloned.hasOwnProperty(attr))
            stub[attr] = objtobecloned[attr];
    }
}

function testaNulo(param) {
    return param == null ? "" : param;
}

function listaNaoContemValor(lista, param) {
    for (var i = 0; i < lista.length; i++) {
        if (param == null || lista[i] == param)
            return false;
    }
    return true;
}

function listaContemValorFav(favList, cpf, seq) {
    if (favList) {
        for (var i = 0; i < favList.length; i++) {
            var favorito = favList[i];
            if (favorito.cpf == cpf && favorito.seq == seq)
                return true;
        }
    }
    return false;
}

function runtimePopup(header, message, notBack, callback) {

    var template = "<div data-role='popup' id='popupDialog' data-overlay-theme='a' data-theme='c' class='pop-up-tamanho ui-corner-all messagePopup'>" + "<div data-role='header' data-theme='a' class='pop-up-header ui-corner-top' >" + "<h1>" + header + "</h1>" + "</div>" + "<div data-role='content' data-theme='d' class='ui-corner-bottom ui-content' style = 'margin: 15px;'>" + "<h3 class='ui-title'>" + message + "</h3>" + "<a href='#' data-role='button' data-inline='true' data-rel='back' class = 'pop-up-botao1' > OK </a>" + "</div>";

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find(".closePopup").bind("tap", function(e) {
        $.mobile.activePage.find(".messagePopup").popup("close");
    });

    $.mobile.activePage.find(".messagePopup").popup();

    if (notBack) {
        $(".pop-up-botao1").click(function() {
            $("#popupDialog").popup("close");
        })
    }
    $.mobile.activePage.find(".messagePopup").popup("open").bind({
        popupafterclose: function() {
            $(this).unbind("popupafterclose").remove();
            if (callback)
                callback();
        }
    });
}

function runtimePopupCall(header, tel) {

    var template = "<div data-role='popup' id='popupDialog3' data-overlay-theme='a' data-theme='c' class='pop-up-tamanho ui-corner-all messagePopup'>" + "<div data-role='header' data-theme='a' class='pop-up-header ui-corner-top' id='title-operadora'>" + "<h1>" + header + "</h1>" + "</div>" + "<div data-role='content' data-theme='d' class='ui-corner-bottom ui-content' style = 'margin: 15px;'>" + "<div data-role='fieldcontain'  id='bairroFiltro' class='espaco input-no-padding'>" + "<input required placeholder='Ex: 21' type='text' id='dddinput' value='' class='espaco'>" + "</div>" + "<a href='#' data-role='button' data-inline='true' class = 'pop-up-botao-okinput' > OK </a>" + "</div>";


    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find(".closePopup").bind("tap", function(e) {
        $.mobile.activePage.find(".messagePopup").popup("close");
    });

    $.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
        popupafterclose: function() {
            $(this).unbind("popupafterclose").remove();
        }
    });

    $(".pop-up-botao-okinput").click(function() {
        if ($("#dddinput").val() != "") {
            $("#popupDialog3").popup("close");
            var ddd = $("#dddinput").val();
            setTimeout(function() {
                document.location.href = "tel: 0" + ddd + tel.trim();
            }, 500);
        }
    });
}

function runtimePopupConfirm(header, message, callback) {

    var template = "<div data-role='popup' id='popupDialog2' data-overlay-theme='a' data-theme='c' class='pop-up-tamanho ui-corner-all messagePopup'>" + "<div data-role='header' data-theme='a' class='pop-up-header ui-corner-top' >" + "<h1>" + header + "</h1>" + "</div>" + "<div data-role='content' data-theme='d' class='ui-corner-bottom ui-content' style = 'margin: 15px;'>" + "<h3 class='ui-title'>" + message + "</h3>" + "<a href='#' data-role='button' data-inline='true' class = 'pop-up-ok' > Sim </a>" + "<a href='#' data-role='button' data-inline='true' data-rel='back' class = 'pop-up-cancelar' > Não </a>" + "</div>";

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find(".closePopup").bind("tap", function(e) {
        $.mobile.activePage.find(".messagePopup").popup("close");
    });

    $.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
        popupafterclose: function() {
            $(this).unbind("popupafterclose").remove();
        }
    });
    $(".pop-up-ok").click(function() {
        $.mobile.activePage.find(".messagePopup").popup("close");
        if (callback)
            callback();
    });
}

function SetOrientation(orient) {
    screen.lockOrientation(orient);
    if (cordova.recheckScreenOrientation)
        cordova.recheckScreenOrientation(window.shouldRotateToOrientation, window.shouldRotateToOrientation);
}
