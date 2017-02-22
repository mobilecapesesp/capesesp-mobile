var carteiraVirtual = function() {
    var service = dataService();

    var exibirCarteira = function(param) {
        $('#carteira_virtual').hide();
        $('#menu_carteira_lista').hide();
        $('#menu_carteira_det').css("display", "block");
        if (param == "carteira_lista_detalhe") {
            $('.carteira_lista_detalhe').css("display", 'block');
            $(".header-carteirinha").hide();
        }
    };

    var listarGrupoFamiliar = function() {
        $("#label_cart_list_ul").text("Selecione o Beneficiário:");
        var storage = window.sessionStorage;
        configURLLogin.dadosGrupoFamiliar.matricula = storage.getItem("matricula");
        configURLLogin.dadosGrupoFamiliar.token = storage.getItem("token");

        if (window.sessionStorage.getItem("tipo_dependente") == "T")
            service.chamadaGenericaAjax(configURLLogin.urlGrupoFamiliar, configURLLogin.dadosGrupoFamiliar, retornoGrupoFamiliar);
        else
            carteiraCtrl.listarTipoCarteira(window.sessionStorage.getItem("sequencial"));
    };

    var retornoGrupoFamiliar = function(responseParam) {
        var listaBen = responseParam.grupo_familiar.beneficiarios;

        $("#pageone .backBtn").hide();
        $("#pageone .homeBtn").show();

        $("#carteira_lista_ul").html("");
        $.each(listaBen, function(i, item) {
            var text = $("<li><a href='#' id='link" + i + "'></a></li>");
            if (i == 0)
                text.addClass("ui-first-child");
            else if (i == listaBen.length - 1)
                text.addClass("ui-last-child");
            $("#carteira_lista_ul").append(text);
            $("#link" + i).text(item.beneficiario.nome).click(function() {
                listarTipoCarteira(item.beneficiario.seq);
            }).addClass("ui-btn ui-btn-icon-right ui-icon-carat-r");
        });
    };

    //======================================================================================================================
    //======================================================================================================================
    //======================================================================================================================
    var listarTipoCarteira = function(sequencial) {
        $("#label_cart_list_ul").text("Selecione o Plano:");
        var storage = window.sessionStorage;
        storage.setItem("carteira-sequencial", sequencial);
        configURLLogin.dadosTipoCarteira.matricula = storage.getItem("matricula");
        configURLLogin.dadosTipoCarteira.token = storage.getItem("token");
        configURLLogin.dadosTipoCarteira.sequencial = sequencial;
        //Request
        service.chamadaGenericaAjax(configURLLogin.urlTipoCarteira, configURLLogin.dadosTipoCarteira, retornoTipoCarteira);
    };

    var retornoTipoCarteira = function(responseParam) {
        var planList = responseParam.planos;
        var storage = window.sessionStorage;
        var sequencial = storage.getItem("carteira-sequencial");

        $("#carteira_lista_ul").html("");
        $("#pageone .backBtn").show();
        $("#pageone .homeBtn").hide();
        $.each(planList, function(i, item) {
            var text = $("<li><a href='#' id='link" + i + "'></a></li>");
            if (i == 0)
                text.addClass("ui-first-child");
            else if (i == planList.length - 1)
                text.addClass("ui-last-child");
            $("#carteira_lista_ul").append(text);
            $("#link" + i).text(item.descricaoPlano.toUpperCase()).click(function() {
                storage.setItem("carteira-tipo", item.codigoCarteira);
                storage.setItem("carteira-registroANS", item.registroPlanoAns);
                listarDetalhesCarteira(sequencial);
            }).addClass("ui-btn ui-btn-icon-right ui-icon-carat-r");
        });
    };
    //======================================================================================================================
    //======================================================================================================================
    //======================================================================================================================


    var listarDetalhesCarteira = function(sequencial) {
        var storage = window.sessionStorage;
        configURLLogin.dadosCarteira.matricula = storage.getItem("matricula");
        configURLLogin.dadosCarteira.token = storage.getItem("token");
        configURLLogin.dadosCarteira.codAns = storage.getItem("carteira-registroANS");
        configURLLogin.dadosCarteira.sequencial = sequencial;
        service.chamadaGenericaAjax(configURLLogin.urlDetalhesCarteira, configURLLogin.dadosCarteira, retornoDetalheCarteira);
    };


    var retornoDetalheCarteira = function(responseParam) {
        var storage = window.sessionStorage;
        var planType = storage.getItem("carteira-tipo");
        var planANSCode = storage.getItem("carteira-registroANS");
        
        document.addEventListener("backbutton", carteiraCtrl.backCarteiraOnBackKeyDown, true);

        SetOrientation('landscape');
        $.mobile.changePage("carteira_virtual.html#pagetwo", { transition: "pop", changeHash: false });
        setTimeout(function() {
            $("#pagetwo").show();
        }, 500);
        $.mobile.loading("hide");

        $(".header-carteirinha").hide();
        $(".carteira_lista_detalhe").css("margin-top", "12.65%");
        $("#nome_usuario").text(responseParam.associado.nome);
        $("#mat_usuario").text(responseParam.associado.matricula.toString());
        $("#vinculo_usuario").text(responseParam.plano.vinculo);
        $("#uf_usuario").text(responseParam.plano.uf);
        $("#cns").text(responseParam.associado.cns);
        $("#plano_usuario").text(responseParam.plano.descricaoProduto);
        $("#nasc_usuario").text(responseParam.associado.dataNascimento);
        $("#acomodacao_usuario").text(responseParam.plano.acomodacao);
        $("#contrato").text(responseParam.plano.contrato);
        $("#abrangencia").text(responseParam.plano.abrangencia);
        $("#registro_ans").text(planANSCode);
        $("#cobertura").text(responseParam.plano.cobertura);
        $("#patrocinador").text(responseParam.plano.patrocinadorOriginal);
        $("#validade").text(responseParam.plano.validade);
        $(".disqueans--site").text(responseParam.ans.site);
        $(".disqueans--number").text(responseParam.ans.numeroTelefone);
        $("#observacoes").children().remove();
        $.each(responseParam.plano.mensagensCarencia, function(j, item) {
            var text = $("<h1 style='font-size:15px;'></h1>").text(item.mensagem);
            $("#observacoes").append(text);
        });
        var carteirinha_img = $(".carteirinha__frente--img");
        var carteirinha_frente = $("#pagetwo #carteirinha__frente");
        var showBackButton = $("#pagetwo #carteirinha__frente--action");

        carteirinha_frente.show();
        showBackButton.show();
        $(carteirinha_img).attr("hide", "");

        carteirinha_img.each(function() {
            if ($(this).hasClass(planType)) {
                $(this).removeAttr("hide");
            }
        });
    };

    var init = function() {
        var carteirinha_img = $(".carteirinha__frente--img");
        var carteirinha_frente = $("#pagetwo #carteirinha__frente");
        var showBackButton = $("#pagetwo #carteirinha__frente--action");

        $("#pagetwo").hide();

        $("#pagetwo, #carteirinha__frente, .carteirinha__frente--img, .carteirinha__verso").click(function() {
            var header = $(".header-carteirinha"),
                detalheCarteira = $(".carteira_lista_detalhe");
            header.toggle();
            if (header.css("display") == "none") {
                detalheCarteira.css("margin-top", "12.65%");
            } else {
                detalheCarteira.css("margin-top", "1%");
                $("#pagetwo").css("margin-top", "0");
            }
        });

        $("#carteirinha__verso").click(function() {
            if (carteirinha_frente.css("display") == "none") {
                carteirinha_frente.show();
                showBackButton.show();
                setTimeout(function() {
                    $(".header-carteirinha").show();
                }, 100);
            } else {
                carteirinha_frente.hide();
                showBackButton.hide();
            }
        });

        carteirinha_frente.show();
        showBackButton.show();
        showBackButton.click(function() {
            setTimeout(function() {
                $(".header-carteirinha").hide();
            }, 100);
            carteirinha_frente.hide();
            showBackButton.hide();
        })
    };

    var backCarteira = function() {
        $("#pagetwo").hide();
        setTimeout(function() {
            SetOrientation('portrait');
        }, 500);

        if (window.sessionStorage.getItem("tipo_dependente") == "T")
            $.mobile.changePage("carteira_virtual.html#pageone", { transition: "pop" });
        else
            $.mobile.changePage("carteira_virtual.html#pageone", { transition: "pop" });
        document.addEventListener("backbutton", onBackKeyDown, false);

        function onBackKeyDown() {
            if (window.sessionStorage.getItem("tipo_dependente") == "T") {
                $("#pagetwo").hide();
                setTimeout(function() {
                    navigator.app.backHistory();
                }, 500);
            } else {
                $("#pagetwo").hide();
                setTimeout(function() {
                    window.location.href = "index.html";
                }, 500);
            }
        }
    }

    var backCarteiraOnBackKeyDown = function() {
        if (window.sessionStorage.getItem("tipo_dependente") == "T") {
            $("#pagetwo").hide();
            setTimeout(function() {
                navigator.app.backHistory();
            }, 500);
        } else {
            $("#pagetwo").hide();
            setTimeout(function() {
                window.location.href = "index.html";
            }, 500);
        }
    }
    var backGrupoFamiliar = function() {
        $("#pagetwo").hide();

        SetOrientation('portrait');
        if (window.sessionStorage.getItem("tipo_dependente") == "T") {
            if ($("#label_cart_list_ul").text().substr(-6, 5) == "Plano") {
                carteiraCtrl.listarGrupoFamiliar();
            } else {
                window.location.href = "index.html";
            }
        } else {
            window.location.href = "index.html";
        }
    }

    return {
        init: init,
        exibirCarteira: exibirCarteira,
        listarGrupoFamiliar: listarGrupoFamiliar,
        listarDetalhesCarteira: listarDetalhesCarteira,
        //flipCarteira: flipCarteira,
        listarTipoCarteira: listarTipoCarteira,
        backCarteira: backCarteira,
        backGrupoFamiliar: backGrupoFamiliar,
        backCarteiraOnBackKeyDown: backCarteiraOnBackKeyDown,
    }
};

var carteiraCtrl = carteiraVirtual();

$(function() {
    document.addEventListener("backbutton", function(e) {
        SetOrientation('portrait');
        if ($.mobile.activePage.attr('id') != "pageone") {
            if (window.sessionStorage.getItem("tipo_dependente") == "T")
                window.location.href = "carteira_virtual.html";
            else
                window.location.href = "index.html";
        } else
            window.location.href = "index.html";
    });
    carteiraCtrl.init();
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == 'carteira_virtual' && 'carteira_lista_detalhe' == pair[1]) {
            carteiraCtrl.exibirCarteira('carteira_lista_detalhe');
        }
    }

    carteiraCtrl.listarGrupoFamiliar();
});