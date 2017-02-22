var generateRota;

var rotas = rotasGoogle();
$(function() {
    $.mobile.loading("show");
    var initialScreenSize = window.innerHeight;
    window.addEventListener("resize", function() {
        if (window.innerHeight < initialScreenSize)
            $("footer").hide();
        else
            $("footer").show();
    });
    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown(e) {
        if ($.mobile.activePage.attr('id') == "pageone") {
            redesCtrl.performTabBack();
            e.preventDefault();
        } else
            navigator.app.backHistory();
    }

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        $.mobile.loading("show");
        screen.lockOrientation('portrait');
        if (cordova.recheckScreenOrientation)
            cordova.recheckScreenOrientation(window.shouldRotateToOrientation, window.shouldRotateToOrientation);
        $("#tabs").tabs();
        redesCtrl.AtivarTab(0, [1, 2, 3]);
        $("#bairro").on("input", function(e) {
            var lastVal = $(this).data("lastval");
            if ($(this).data("lastval") != $(this).val() &&
                (/^[a-zA-Z\s]+$/.test($(this).val()) || $(this).val() == "")) {
                $(this).data("lastval", $(this).val());
            } else
                $(this).val(lastVal);
        });
    }

    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var cpf = "",
        seq = "";
    var chamarListarDetalhe = false;
    for (var i = 0; i < vars.length; i++) {

        var pair = vars[i].split("=");
        if (pair[0] == 'parammapa' && pair[1] == 'mapa')
            chamarListarDetalhe = true;
        if (pair[0] == 'cpf')
            cpf = pair[1];
        if (pair[0] == 'seq')
            seq = pair[1];
    }
    if (chamarListarDetalhe && cpf != "" && seq != "") {
        $('#rede_credenciada').css("display", 'none');
        redesCtrl.listarDetalhe(cpf, seq);
    } else
        redesCtrl.listarPlanos();


    redesCtrl.HideButaoBusca();

});

Array.prototype.remove = function(value) {
    var idx = this.indexOf(value);
    if (idx != -1) {
        return this.splice(idx, 1); // The second parameter is the number of elements to remove.
    }
    return false;
};

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}


var redesCredenciadas = function() {
    var service = dataService();
    var useGps = false;

    var listarPlanos = function() {
        service.chamadaGenericaAjax(configURLLogin.urlPlanos, configURLLogin.dadosVazio, retornoPlanos,
            function() {
                window.localtion.href = "index.html"
            },
            true);
    };

    function HideButaoBusca() {
        $("#botaoBusca").hide();
        $("#botaoBusca").removeAttr("onclick");
    }

    function call() {
        //if (navigator.userAgent.indexOf("Android") == -1)
        //    runtimePopupCall("Escolha a operadora", $("#telCredenciado").val());
        //else
        document.location.href = "tel:" + $("#telCredenciado").val();
    }

    function preencheCombo(label, valor, comboID) {
        var x = $("#" + comboID);
        x.removeAttr("disabled");
        var option = "<option value='" + valor + "'>" + label + "</option";
        x.append(option);
    }

    function limpaCombo(comboID) {
        var x = $("#" + comboID);
        x.children("option").remove();

        var option = "<option value='0'>Selecione um item</option>";
        x.append(option);
        x[0].selectedIndex = 0;
        x.trigger("change");
    }

    function selecionaItemCombo(comboID) {
        var x = $("#" + comboID);
        x.selectedIndex = "0";
        x.trigger("change")
    }

    var retornoPlanos = function(responseParam) {
        var tamLista = responseParam.planos.length;
        $.each(responseParam.planos, function(i, item) {

            var el = $("<li><a href='#' class='li-tab ui-btn ui-btn-icon-right ui-icon-carat-r' >" + item.plano.descricao + "</a></li>");
            if (i == 0)
                el.addClass("ui-first-child");
            else if (i == tamLista - 1)
                el.addClass("ui-last-child");
            el.find("a").click(function(e) {
                sessionStorage.setItem("planoSelecionado", JSON.stringify(item.plano));
                listarEstados(e.target, item.plano.codigoANS, item.plano.exibeUrgEmer);
            });

            $("#planosList").append(el);

            $(".planos-redes").css("overflow-y", "scroll")
        });
        var hideLoad = setInterval(function() {
            $.mobile.loading("hide");
        }, 500);
        setTimeout(function() {
            clearInterval(hideLoad);
        }, 3000);
    };

    function AtivarTab(index, disableds, click) {
        if (disableds.length != 0)
            HideButaoBusca();
        if (index == 0)
            $("#header-back").hide();
        else
            $("#header-back").show();
        $.each($(".tab-capesesp"), function(c, v) {
            $(v).parent("li").removeClass("tab-selected")
        });
        $("#tabs").tabs("option", {
            "selected": index,
            "disabled": disableds
        });
        if (!click)
            $('#tab' + index).trigger('click');


        $("#tab" + index).parent().addClass("tab-selected");
    }


    // funções de Listagens
    function listarEstados(obj, plano, urgEmer) {
        $(".plano-selecionado").removeClass("plano-selecionado");
        $(obj).addClass("plano-selecionado");

        configURLLogin.dadosEstados.codAns = plano;

        configURLLogin.dadosEstados.urgEmer = "N";
        if (urgEmer == true)
            configURLLogin.dadosEstados.urgEmer = "S";

        service.chamadaGenericaAjax(configURLLogin.urlEstados, configURLLogin.dadosEstados, retornoEstados);
    }

    function retornoEstados(responseParam) {
        limpaCombo("estadoList");
        limpaCombo("municipioList");
        $("#prosseguir1").hide();
        $("#bairro").val("");
        dadosListaCredenciados.descMunicipio = "";
        dadosListaCredenciados.descBairro = "";

        $.each(responseParam.estados, function(i, item) {
            preencheCombo(item.descricao, item.sigla, "estadoList");
        });
        selecionaItemCombo("estadoList");

        if (responseParam.estados.length == 0) {
            runtimePopup("Rede Credenciada", "Não há estados para o plano selecionado");
            return;
        }

        $("#municipioList").attr("disabled", "disabled");


        AtivarTab(1, [2, 3]);
    }

    function listarMunicipio(estado) {
        if (estado != "0") {
            var planData = JSON.parse(sessionStorage.getItem("planoSelecionado"));
            configURLLogin.dadosMunicipio.siglaEstado = estado;
            configURLLogin.dadosMunicipio.codAns = planData.codigoANS;
            configURLLogin.dadosMunicipio.urgEmer = "N";
            if (planData.exibeUrgEmer == true)
                configURLLogin.dadosMunicipio.urgEmer = "S";
            service.chamadaGenericaAjax(configURLLogin.urlMunicipios, configURLLogin.dadosMunicipio, retornoMunicipios);
        }
    }

    function retornoMunicipios(responseParam) {
        limpaCombo("municipioList");
        $("#prosseguir1").hide();
        $("#bairro").val("");
        if (!useGps) {
            dadosListaCredenciados.descMunicipio = "";
            dadosListaCredenciados.descBairro = "";
        } else
            useGps = false;

        $.each(responseParam.municipios, function(i, item) {
            preencheCombo(item.municipio, item.municipio, "municipioList");
        });
        selecionaItemCombo("municipioList");

        if (responseParam.municipios.length == 0 && $('#estadoList').val() > 0) {
            runtimePopup("Rede Credenciada", "Não há municípios para o plano selecionado");
            return;
        }

        var muniEl = $("#municipioList");
        if ($("#tipoServicoDiv").css("display") == "none") {
            muniEl.removeAttr("onchange").bind("change", function() {
                listarServico('1')
            });
            $("#servicoList").removeAttr("disabled");
        } else {
            muniEl.removeAttr("onchange");
            muniEl.bind("change", function() {
                if (isEstadoSelected()) {
                    $(prosseguir1).show().focus().unbind('click').click(function() {
						$(".esp-servico").css("display", "none");
						listarTipoServico(this.value);
                        window.sessionStorage.setItem("address", $("#estadoList-button span").text().trim() + "," + $("#municipioList-button span").text().trim() + $("#bairro").val().trim() + ", Brasil")
                    })
                }

            });
        }

        if (dadosListaCredenciados.descMunicipio) {
            $("#municipioList").val(dadosListaCredenciados.descMunicipio).selectmenu('refresh', true);
            $("#municipioList").trigger("change");
            if (dadosListaCredenciados.descBairro)
                $("#bairro").val(dadosListaCredenciados.descBairro);
        }

    }

    function isEstadoSelected() {
        if ($("#estadoList option:selected").val() == "0" || $("#municipioList option:selected").val() == "0")
            return false;
        return true;
    }


    function listarServico(modalidade, callback) {
        configURLLogin.dadosServicos.codAns = configURLLogin.dadosEstados.codAns;
        configURLLogin.dadosServicos.urgEmer = configURLLogin.dadosEstados.urgEmer;
        configURLLogin.dadosServicos.siglaEstado = configURLLogin.dadosMunicipio.siglaEstado;
        configURLLogin.dadosServicos.descMunicipio = $("#municipioList").val();
        configURLLogin.dadosServicos.codModalidade = modalidade;
        if (callback)
            service.chamadaGenericaAjax(configURLLogin.urlServico, configURLLogin.dadosServicos,
                function(response) {
                    retornoServico(response);
                    callback();
                });
        else
            service.chamadaGenericaAjax(configURLLogin.urlServico, configURLLogin.dadosServicos, retornoServico);
    }


    function retornoServico(responseParam) {
        limpaCombo("servicoList");

        var vazio = true;
        var modalidade = configURLLogin.dadosServicos.codModalidade;
        $.each(responseParam.servicos, function(i, item) {
            vazio = false;
            preencheCombo(item.descricao, item.codigo, "servicoList");
        });
        if (vazio && $('#tiposervicoList').val() > 0 && modalidade != "05") {
            runtimePopup("Rede Credenciada", "Não há serviços para o plano selecionado");
            return;
        }
        if (!vazio && modalidade != "05") {
            $("#servicoLabel").text(responseParam.label);
            $("#servicoDiv").css("display", "block");
        }
        if (vazio && modalidade == "05") {
            $("#prosseguir2").show();
            $("#botaoBusca").unbind('click').click(function() {
                listarCredenciados()
            });
            $("#botaoBusca").show();
        }
        configURLLogin.codEspAtend = responseParam.codigo;

        var elServList = $("#servicoList");


        if (elServList.val())
            elServList.removeAttr("disabled");
        if (!vazio)
            $(".esp-servico").css("display", "");
        else
            $(".esp-servico").css("display", "none");
        if (isServicoSelected()) {
            $(prosseguir2).focus().unbind('click').click(function() {

                AtivarTab(3, []);

                $("#botaoBusca").show();

                $("#botaoBusca").unbind('click').click(function() {
                    listarCredenciados();
                });
            })

        }
    }


    function listarTipoServico() {
        if (!isEstadoSelected())
            return;
        var planData = JSON.parse(sessionStorage.getItem("planoSelecionado"));
        configURLLogin.dadosTipoServico.descMunicipio = $("#municipioList").val();
        configURLLogin.dadosTipoServico.siglaEstado = configURLLogin.dadosMunicipio.siglaEstado;
        configURLLogin.dadosTipoServico.codAns = planData.codigoANS;
        configURLLogin.dadosTipoServico.urgEmer = "N";
        if (planData.exibeUrgEmer == true)
            configURLLogin.dadosTipoServico.urgEmer = "S";
        service.chamadaGenericaAjax(configURLLogin.urlTipoServico, configURLLogin.dadosTipoServico, retornoTipoServico);
    }

    function retornoTipoServico(responseParam) {
        limpaCombo("tiposervicoList");
        $("#prosseguir2").hide();
        dadosListaCredenciados.codEspecialidade = "";
        $.each(responseParam.modalidades, function(i, item) {
            preencheCombo(item.descricao, item.codigo, "tiposervicoList");
        });

        if (responseParam.modalidades.length == 0 && $('#estadoList').val() > 0) {
            runtimePopup("Rede Credenciada", "Não há serviços para o plano selecionado");
            return;
        }
        selecionaItemCombo("tiposervicoList");

        $("#servicoList").attr({ disabled: "disabled" });
        AtivarTab(2, [3]);

    }

    function isServicoSelected() {
        if ($("#tiposervicoList option:selected").val() == "0")
            return false;
        else
            return true;
    }

    function checkIfSpecialityIsNull(select) {
        console.log(select);
    }

    function selecionarEspecialidade(param) {
        var x = $("#tipoServicoDiv");

        if (param != "0") {
            $("#prosseguir2").show();
        }

        if ((x.css("display") == "block" && $("#tiposervicoList").find("option:selected").val() == "0") || $("#servicoList option:selected").val() == "0" || $(".esp-servico").css("display") == "none")
            return;

        $("#botaoBusca").unbind('click').click(function() {
            AtivarTab(3, []);
            listarCredenciados();
        });
        $("#botaoBusca").show();

        if (configURLLogin.codEspAtend == "especialidade") {
            dadosListaCredenciados.codEspecialidade = pad(param, 8);
            dadosListaCredenciados.codTipoAtendimento = "";
        } else if (configURLLogin.codEspAtend == "atendimento") {
            dadosListaCredenciados.codEspecialidade = "";
            dadosListaCredenciados.codTipoAtendimento = param;
        }
    }

    function listarCredenciados(semBairro) {
        dadosListaCredenciados.codAns = configURLLogin.dadosEstados.codAns;
        dadosListaCredenciados.urgEmer = configURLLogin.dadosEstados.urgEmer;
        dadosListaCredenciados.siglaEstado = configURLLogin.dadosMunicipio.siglaEstado;
        dadosListaCredenciados.descMunicipio = configURLLogin.dadosTipoServico.descMunicipio;
        dadosListaCredenciados.descBairro = semBairro ? "" : $("#bairro").val().toUpperCase();
        dadosListaCredenciados.codModalidade = configURLLogin.dadosServicos.codModalidade;
        dadosListaCredenciados.nomePrestador = $("#prestador").val();
        service.chamadaGenericaAjax(configURLLogin.urlListaCredenciados, dadosListaCredenciados, retornoListaCredenciados);
    }


    function retornoListaCredenciados(responseParam) {
        if (responseParam.credenciados.length == 0 && dadosListaCredenciados.descBairro) {
            window.localStorage.setItem("buscaBairroSemOcorrencia", "true");
            listarCredenciados(true);
            return;
        }
        if (responseParam)
            window.localStorage.setItem("listaCred", JSON.stringify(responseParam));
        var ultimosCredenciados = JSON.parse(window.localStorage.getItem("listaCred"));
        $("#rotaLista").show();
        $.mobile.changePage("#credeciadosList");
        $("#lista-wrapper").children().remove();
        var buscaBairroSemOcorrencia = window.localStorage.getItem("buscaBairroSemOcorrencia");
        if (buscaBairroSemOcorrencia && responseParam.credenciados.length > 0) {
            window.localStorage.removeItem("buscaBairroSemOcorrencia");
            var errorMsgsssss = "<h1 style='color:black;font-size:medium;text-align: center'>A busca pelo bairro " + $("#bairro").val() + " não retornou nenhum resultado válido. Seguem os demais prestadores de serviços do município especificado.</h1>";
            $("#lista-wrapper").append(errorMsgsssss)
        }
        var vazio = true;

        $("input[name='lats']").remove();
        $("input[name='lngs']").remove();
        $("input[name='cpfs']").remove();
        $("input[name='seqs']").remove();
        $.each(ultimosCredenciados.credenciados, function(i, item) {
            vazio = false;
            var credDiv = $("<div class='lista-pai'></div>")
                .attr({ id: "" + item.cpfCnpj })
                .appendTo("#lista-wrapper").unbind('click')
                .click(function() {
                    listarDetalhe(item.cpfCnpj, item.sequencial);
                });

            $("<h3>").html(item.nome).appendTo(credDiv);

            var telefones = "";

            $.each(item.telefones, function(j, obj) {
                telefones += "(" + obj.ddd + ")" + obj.fixo + ",  ";
            });

            var telefonesClean = telefones.trim();
            $("<div class='lista-descricao numberonly'>").html(item.bairro + "<br/>" + telefones.substring(0, telefonesClean.length - 1) + "<span></span>").appendTo(credDiv);

            var lat = $("<input type='hidden' name='lats'>").attr({ value: "" + item.georreferenciamento.lat });
            var lng = $("<input type='hidden' name='lngs'>").attr({ value: "" + item.georreferenciamento.lng });
            var cpf = $("<input type='hidden' name='cpfs'>").attr({ value: "" + item.cpf_cnpj });
            var seq = $("<input type='hidden' name='seqs'>").attr({ value: "" + item.sequencial });

            $("#listaClinicas").append(lat);
            $("#listaClinicas").append(lng);
            $("#listaClinicas").append(cpf);
            $("#listaClinicas").append(seq);
        });

        $("#listaClinicas").trigger("create");

        if (vazio) {
            $("#mapaLista").hide();
            var errorMsgsssss = $("<h1 style='color:black;font-size:medium;text-align: center'>Não foi encontrado nenhum credenciado com a seleção anterior</h1>");
            $("#lista-wrapper").append(errorMsgsssss)
        } else
            $("#mapaLista").show();

    }

    function listarDetalhe(cpf, seq) {
        cpf = cpf.replace("/", "").replace("-", "").replace(".", "").replace(".", "");
        $("#cpfCredenciado").val(cpf);
        $("#seqCredenciado").val(seq);
        configURLLogin.dadosDetalheCredenciado.cpfCnpj = cpf;
        configURLLogin.dadosDetalheCredenciado.sequencial = seq;
        service.chamadaGenericaAjax(configURLLogin.urlDetalheCredenciado, configURLLogin.dadosDetalheCredenciado, retornoDetalheCredenciado);
    }


    var RemoveTableRow = function(handler) {
        var tr = handler.closest('tr');
        tr.fadeOut(400, function() {
            tr.remove();
        });
    };

    function convertDate(date) {
        var numbers = date.split('-');
        if (date.substr(2, 1) == "/")
            return date;
        return numbers[2] + "/" + numbers[1] + "/" + numbers[0];
    }

    function retornoDetalheCredenciado(responseParam) {
        $.mobile.changePage("#exibeCredenciados");
        $("#esp").text("");
        var favoritos = JSON.parse(window.localStorage.getItem("favoritos"));
        var valorCpf = $("#cpfCredenciado").val();
        var valorSeq = $("#seqCredenciado").val();

        if (listaContemValorFav(favoritos, valorCpf, valorSeq)) {
            $(".detalhes-favoritar").text("Favoritado");
            $(".detalhes-favotiarimg").attr("src", "img/favoritoy.png");
            $("#detalhes-favoritar").removeAttr('onclick').unbind('click').click(function() {
                apagarFavorito($("#cpfCredenciado").val(), $("#seqCredenciado").val(), true);
            });

        } else {
            $(".detalhes-favoritar").text("Favoritar");
            $(".detalhes-favotiarimg").attr("src", "img/favoritog.png");
            $("#detalhes-favoritar").removeAttr('onclick').unbind('click').click(function() {
                gravarCredenciadoFavorito();
            });
        }
        $("#nome").text(testaNulo(responseParam.credenciados.nomeFantasia));
        if ($("#nome").text() == "") {
            $("#nome").text(testaNulo(responseParam.credenciados.razaoSocial));
            if ($("#nome").text() == "") {
                RemoveTableRow($("#nome"));
            }
        }
        $("#crm").html(testaNulo(responseParam.credenciados.registroConselho.descricao) + " " + testaNulo(responseParam.credenciados.registroConselho.registro) + "<span style='color:white !important'>.</span>");
        if ($("#crm").text() == "") {
            RemoveTableRow($("#crm"));
        }
        $("#endereco").text(testaNulo(responseParam.credenciados.endereco.logradouro) + " " + testaNulo(responseParam.credenciados.endereco.numero));
        if ($("#endereco").text() == "") {
            RemoveTableRow($("#endereco"));
        }
        $("#bairro_clinica").text(testaNulo(responseParam.credenciados.endereco.bairro));
        if ($("#bairro_clinica").text() == "") {
            RemoveTableRow($("#bairro_clinica"));
        }

        $("#estado").text(testaNulo(responseParam.credenciados.endereco.estado));
        if ($("#estado").text() == "") {
            RemoveTableRow($("#estado"));
        }

        $("#municipio").text(testaNulo(responseParam.credenciados.endereco.municipio));
        if ($("#municipio").text() == "") {
            RemoveTableRow($("#municipio"));
        }
        var cepString = responseParam.credenciados.endereco.cep.toString().trim();
        $("#cep").html(testaNulo(cepString) + "<span style='color:white !important'>.</span>");
        if ($("#cep").text() == "") {
            RemoveTableRow($("#cep"));
        }
        if (cepString.length == 8)
            $("#cep").html(cepString.substring(0, 5) + "-" + cepString.substring(5, 8));

        if (responseParam.credenciados.telefones != null && responseParam.credenciados.telefones.length > 0) {
            var objeto = responseParam.credenciados.telefones[0];
            var x = document.getElementById("telCredenciado");
            x.value = objeto.ddd + "" + objeto.fixo;
            x.value = x.value.substring(1);
        }
        var tel = "";
        $.each(responseParam.credenciados.telefones, function(i, item) {
            tel += "(" + item.ddd + ")" + item.fixo + " ";
        });
        $("#tel").html(tel + "<span style='color:white !important'>.</span>");
        if ($("#tel").text() == "") {
            RemoveTableRow($("#tel"));
        }
        $("#site").text(testaNulo(responseParam.credenciados.site));
        if ($("#site").text() == "") {
            RemoveTableRow($("#site"));
        }
        $("#estab").text(testaNulo(responseParam.credenciados.tipoEstabelecimento));
        if ($("#estab").text() == "") {
            RemoveTableRow($("#estab"));
        }
        $("#atualizado").text(testaNulo(convertDate(responseParam.credenciados.ultimaAlteracao)));
        if ($("#atualizado").text() == "") {
            RemoveTableRow($("#atualizado"));
        }

        function fillEspecialization() {
            for (var i = 0; i < responseParam.credenciados.especialidades.length; i++) {
                var espItem = responseParam.credenciados.especialidades[i].especialidade;
                var text = $("#esp").text().concat(espItem);
                if ((i + 1) != responseParam.credenciados.especialidades.length) {
                    text = text.concat(", ");
                } else {
                    text = text.concat(" ");
                }

                $("#esp").text(text);
            }
            //$("#esp").text(testaNulo(responseParam.credenciados.especialidades));
            if ($("#esp").text() == "") {
                RemoveTableRow($("#esp"));
            }
        }
        fillEspecialization();

        $("#lat").text(testaNulo(responseParam.credenciados.endereco.georreferenciamento.lat));
        $("#lng").text(testaNulo(responseParam.credenciados.endereco.georreferenciamento.lng));
        $("#imgQualifi").children().remove();
        $.each(responseParam.credenciados.qualificacao, function(j, obj) {
            var qualif = $("<img src='img/" + obj.codEntidade + ".png' alt='Home' width='18' height='20'>");
            $("#imgQualifi").append(qualif);
        });
    }

    function listarFavoritos() {
        $.mobile.changePage("#favList");
        $("#listaFav").children().remove();
        var storage = window.localStorage;
        var favoritos = JSON.parse(storage.getItem("favoritos"));

        if (favoritos && favoritos.length > 0) {
            for (var i = 0; i < favoritos.length; i++) {
                listarFavoritosServico(favoritos[i]);
            }
        } else
            exibeMensagemFavVazio("Não há favoritos cadastrados");

    }

    function listarFavoritosServico(favorito) {
        var itemFavorito = $("<div>")
            .attr("data-role", "collapsible")
            .appendTo("#listaFav")
            .click(function(e) {
                if ($(e.target).text() != "Remover")
                    listarDetalhe(favorito.cpf, favorito.seq);

            });

        $("<h3>").html(favorito.nome).appendTo(itemFavorito);

        var telefones = favorito.telefones;

        $("<div>").html(favorito.bairro + "<br/>" + telefones).appendTo(itemFavorito);

        $("<a href='#' data-role='button' data-inline='true' data-icon='delete' data-position='right' style='color:white' >Remover</a>")
            .appendTo(itemFavorito)
            .click(function(e) {
                apagarFavorito(favorito.cpf, favorito.seq);
            });
        $("#listaFav").trigger("create");
    }

    function geo_error(error) {
        $.mobile.loading("hide");
        switch (error.code) {
            case 0:
                runtimePopup("Localização", "Ocorreu um erro ao tentar obter a sua localização");
                break;
            case 1:
                runtimePopup("Localização", "Aplicação não tem autorização para obter a sua localização");
                break;
            case 2:
                runtimePopup("Localização", "A sua localização está indisponivel no momento");
                break;
            case 3:
                runtimePopup("Localização", "Ocorreu um erro ao tentar obter a sua localização");
                break;
            default:
                runtimePopup("Localização", "Não foi possível obter a sua localização");
        }
    }

    function obterEndereco() {
        $.mobile.loading("show");
        navigator.geolocation.getCurrentPosition(geo_success, geo_error, { timeout: 10000, enableHighAccuracy: true });
    }

    function geo_success(position) {
        configURLLogin.dadosEndereco.latitude = position.coords.latitude;
        configURLLogin.dadosEndereco.longitude = position.coords.longitude;
        useGps = true;
        service.chamadaGenericaAjax(configURLLogin.urlEndereco, configURLLogin.dadosEndereco, retornoEndereco);
    }

    function retornoEndereco(responseParam) {
        if (responseParam.statusExecucao.executadoCorretamente) {
            var pos = responseParam.posicionamento.endereco;
            $("#estadoList").val(pos.estado.sigla).selectmenu('refresh', true);
            $("#estadoList").change(function() {
                dadosListaCredenciados.siglaEstado = pos.estado.sigla;
                dadosListaCredenciados.descMunicipio = pos.municipio;
                dadosListaCredenciados.descBairro = pos.bairro;
            });
            $("#estadoList").trigger("change");
        } else
            runtimePopup("Obter posição", "Erro na obtenção da posição, favor preencher manualmente.")

    }

    function exibeMensagemRetornoVazio(param) {
        $.mobile.changePage("#credeciadosList");

        var textDiv = $("<div class='listadiv' id='avisoRetornoVazio'></div>");
        $("#lista-wrapper").append(textDiv);
        $("#avisoRetornoVazio").text(param);
    }

    function exibeMensagemFavVazio(param) {
        $.mobile.changePage("#favList");

        var textDiv = $("<div class='listadiv' id='avisoRetornoVazioFav'></div>");
        $("#listaFav").append(textDiv);
        $("#avisoRetornoVazioFav").text(param);
    }

    function gravarCredenciadoFavorito() {
        var valorCpf = $("#cpfCredenciado").val(),
            valorSeq = $("#seqCredenciado").val(),
            storage = window.localStorage;

        if (valorCpf && valorSeq) {
            var favoritos = JSON.parse(storage.getItem("favoritos"));
            if (!favoritos)
                favoritos = [];
            var novoFavorito = {
                nome: $("#nome").text(),
                cpf: valorCpf,
                seq: valorSeq,
                telefones: $("#tel").text().replace(".", "").trim(),
                bairro: $("#bairro_clinica").text()
            };
            if (listaContemValorFav(favoritos, valorCpf, valorSeq))
                runtimePopup("Favorito", "Favorito já gravado");
            else {
                favoritos.push(novoFavorito);
                storage.setItem("favoritos", JSON.stringify(favoritos));
                runtimePopup("Favorito", "Favorito gravado com sucesso");
                $(".detalhes-favoritar").text("Favoritado");
                $(".detalhes-favotiarimg").attr("src", "img/favoritoy.png");
                $("#detalhes-favoritar").removeAttr('onclick').unbind('click').click(function() {
                    apagarFavorito($("#cpfCredenciado").val(), $("#seqCredenciado").val(), true);
                });
            }
        }
    }

    function apagarFavorito(cpf, seq, notRedirect) {

        function apagarFavoritoCallback() {
            var storage = window.localStorage;
            var favoritos = JSON.parse(storage.getItem("favoritos"));
            var favAux = favoritos;
            if (favoritos != null && favoritos.length > 0) {
                for (var i = 0; i < favoritos.length; i++) {
                    if (favoritos[i].cpf == cpf && favoritos[i].seq == seq)
                        favAux.splice(i, 1);
                }
            }
            favoritos = favAux;

            storage.setItem("favoritos", JSON.stringify(favoritos));

            if (!notRedirect)
                listarFavoritos();
            else {
                $(".detalhes-favoritar").text("Favoritar");
                $(".detalhes-favotiarimg").attr("src", "img/favoritog.png");
                $("#detalhes-favoritar").removeAttr('onclick').unbind('click').click(function() {
                    gravarCredenciadoFavorito();
                });
                var listaFavsColap = $(".ui-collapsible-content a");
                for (var i = 0; i < listaFavsColap.length; i++) {
                    if ($(listaFavsColap[i]).attr("data-cpf") == $("#cpfCredenciado").val()) {
                        $(listaFavsColap[i]).parents(".ui-collapsible").remove();
                        var textDiv = $("<div class='listadiv' id='avisoRetornoVazioFav'></div>");
                        $("#listaFav").append(textDiv);
                        $("#avisoRetornoVazioFav").text("Não há favoritos cadastrados");
                    }
                }

            }
        }

        runtimePopupConfirm("Remover favorito", "Deseja remover este favorito?", apagarFavoritoCallback);
    }

    function obterRota() {
        var lat = $("#lat").text();
        var lng = $("#lng").text();
        if (lat <= 5.35 && lat >= -33.8 && lng >= -74.2 && lng <= -34.6) {
            var lats = [];
            var lngs = [];

            lats[0] = lat;
            lngs[0] = lng;

            var storage = window.sessionStorage;

            storage.setItem("lats", JSON.stringify(lats));
            storage.setItem("lngs", JSON.stringify(lngs));
            $.mobile.loading("show");
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'http://maps.google.com/maps/api/js?v=3&sensor=false&callback=rotas.init';
            document.body.appendChild(script);
            generateRota = true;

        } else {
            runtimePopup("Erro", "Não foi possivel obter a rota.");
        }
    }


    function obterMapaRedeCredenciada() {
        var paramLat = document.getElementsByName("lats");
        var paramLng = document.getElementsByName("lngs");
        var paramCpf = document.getElementsByName("cpfs");
        var paramSeq = document.getElementsByName("seqs");

        var lat_aux = [],
            long_aux = [],
            cpf_aux = [],
            seq_aux = [];
        var j = 0;

        var lats = [],
            lngs = [],
            cpfs = [],
            seqs = [];

        for (var i = 0; i < paramLat.length; i++) {
            if (paramLat[i].value <= 5.35 && paramLat[i].value >= -33.8 && paramLng[i].value >= -74.2 && paramLng[i].value <= -34.6) { // so vai mapear os valores dentro do BRASIL
                lat_aux[j] = paramLat[i].value;
                long_aux[j] = paramLng[i].value;
                cpf_aux[j] = paramCpf[i].value;
                seq_aux[j] = paramSeq[i].value;
                j++;
            }
        }
        for (var i = 0; i < lat_aux.length; i++) {
            if (listaNaoContemValor(lats, lat_aux[i]))
                lats[i] = lat_aux[i];
            if (listaNaoContemValor(lngs, long_aux[i]))
                lngs[i] = long_aux[i];
            if (listaNaoContemValor(cpfs, cpf_aux[i]))
                cpfs[i] = cpf_aux[i];
            seqs[i] = seq_aux[i];
        }

        var storage = window.sessionStorage;
        storage.setItem("lats", JSON.stringify(lats));
        storage.setItem("lngs", JSON.stringify(lngs));
        storage.setItem("cpfs", JSON.stringify(cpfs));
        storage.setItem("seqs", JSON.stringify(seqs));
        $.mobile.loading("show");
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://maps.google.com/maps/api/js?v=3&sensor=false&callback=rotas.init';
        document.body.appendChild(script);
        generateRota = false;
    }

    var performTabBack = function() {

        var tabs = [1, 2, 3];

        var tabAnterior = parseInt($("#tabs div[aria-expanded=true]").attr("aria-labelledby").substring("3") - 1);
        if (tabAnterior >= 0) {
            AtivarTab(tabAnterior, tabs.filter(function(x) {
                return x > tabAnterior
            }));
        } else
            window.location.href = "index.html";
    };


    return {
        listarPlanos: listarPlanos,
        listarFavoritos: listarFavoritos,
        listarMunicipio: listarMunicipio,
        listarTipoServico: listarTipoServico,
        listarServico: listarServico,
        listarDetalhe: listarDetalhe,
        checkIfSpecialityIsNull: checkIfSpecialityIsNull,
        selecionarEspecialidade: selecionarEspecialidade,
        call: call,
        obterEndereco: obterEndereco,
        gravarCredenciadoFavorito: gravarCredenciadoFavorito,
        obterRota: obterRota,
        obterMapaRedeCredenciada: obterMapaRedeCredenciada,
        performTabBack: performTabBack,
        AtivarTab: AtivarTab,
        retornoListaCredenciados: retornoListaCredenciados,
        HideButaoBusca: HideButaoBusca

    }
};

var redesCtrl = redesCredenciadas();
