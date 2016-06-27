var loginService = function () {
    var service = dataService();
    var storage = window.sessionStorage;
    var validarToken = function (param,titular) {
        var token = window.sessionStorage.getItem("token");
        configURLLogin.titular = titular;
        configURLLogin.telaChamada = param;
        if (token != null) {
            configURLLogin.dadosValidaToken.token = token;
            service.chamadaGenericaAjax(configURLLogin.urlValidaToken, configURLLogin.dadosValidaToken, retornoToken, true);
        }
        else {
            storage.setItem("key", "nao_logado");
            entrar(configURLLogin.telaChamada,titular);
        }

    };


    var retornoToken = function (responseParam) {
        storage.setItem("matricula", responseParam.associadoId.matricula);
        storage.setItem("sequencial", responseParam.associadoId.sequencial);
        if (responseParam.statusExecucao.mensagens.mensagem[0].codigo == "2")
            storage.setItem("key", "logado");
        else
            storage.setItem("key", "nao_logado");
        entrar(configURLLogin.telaChamada);
    };

    var entrar = function (param,titular) {
        var storage = window.sessionStorage;
        var value = storage.getItem("key");
        var tipoDependente =  storage.getItem("tipo_dependente");
        if (value != null && value.trim() != "" && value != "logado") {
            $.mobile.changePage("index.html#loginsistema", {transition: "pop", changeHash: false});
        }
        else
        {
            if(configURLLogin.titular && tipoDependente != "T")
            {
                $.mobile.loading("hide");
                runtimePopup("Aviso", "Somente o titular tem acesso a esta área", true,function(){
                    window.location.href = "index.html";
                });
            }
            else
                window.location.href = param;
        }

    };

    return {
        validarToken: validarToken
    }
};
