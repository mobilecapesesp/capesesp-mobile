var carteiraVirtual = function () {
	var service = dataService();

	var exibirCarteira = function (param) {
		$('#carteira_virtual').hide();
		$('#menu_carteira_lista').hide();
		$('#menu_carteira_det').css("display", "block");
		if (param == "carteira_lista_detalhe") {
			$('.carteira_lista_detalhe').css("display", 'block');
			$(".header-carteirinha").hide();
		}
	};

	var listarGrupoFamiliar = function () {
		$("#label_cart_list_ul").text("Selecione o Beneficiário:");
		var storage = window.sessionStorage;
		configURLLogin.dadosGrupoFamiliar.matricula = storage.getItem("matricula");
		configURLLogin.dadosGrupoFamiliar.token = storage.getItem("token");
		service.chamadaGenericaAjax(configURLLogin.urlGrupoFamiliar, configURLLogin.dadosGrupoFamiliar, retornoGrupoFamiliar);
	};

	var retornoGrupoFamiliar = function (responseParam) {
		var listaBen = responseParam.grupo_familiar.beneficiarios;

		$.each(listaBen, function (i, item) {
			var text = $("<li><a href='#' id='link" + i + "'></a></li>");
			if (i == 0)
				text.addClass("ui-first-child");
			else if (i == listaBen.length - 1)
				text.addClass("ui-last-child");

			$("#carteira_lista_ul").append(text);
			$("#link" + i).text(item.beneficiario.nome).click(function () {
				listarDetalhesCarteira(item.beneficiario.seq)
			}).addClass("ui-btn ui-btn-icon-right ui-icon-carat-r");
		});
	};

	var listarDetalhesCarteira = function (sequencial) {
		var storage = window.sessionStorage;
		configURLLogin.dadosCarteira.matricula = storage.getItem("matricula");
		configURLLogin.dadosCarteira.token = storage.getItem("token");

		configURLLogin.dadosCarteira.sequencial = sequencial;
		service.chamadaGenericaAjax(configURLLogin.urlDetalhesCarteira, configURLLogin.dadosCarteira, retornoDetalheCarteira);
	};


	var retornoDetalheCarteira = function (responseParam) {
		SetOrientation('landscape');
		$.mobile.changePage("carteira_virtual.html#pagetwo", {transition: "pop", changeHash: false});

		$.mobile.loading("hide");

		$(".header-carteirinha").hide();
		$(".carteira_lista_detalhe").css("margin-top", "12.65%");
		$("#pagetwo").css("margin-top","2em");
		$("#nome_usuario").text(responseParam.nome);
		$("#mat_usuario").text(responseParam.matricula.toString());
		$("#vinculo_usuario").text(responseParam.vinculo);
		$("#plano_usuario").text(responseParam.plano);
		$("#nasc_usuario").text(responseParam.data_nascimento);
		$("#acomadacao_usuario").text(responseParam.acomodacao);
		$("#uf_usuario").text(responseParam.uf);
		$("#observacoes").children().remove();
		$.each(responseParam.mensagens_carteira, function (j, item) {
			var text = $("<h1 style='font-size:15px;'></h1>").text(item.mensagem);
			$("#observacoes").append(text);
		});
	};
    //
    //var flipCarteira = function (verso) {
    //
    //
    //    $(".carteira_lista_detalhe").css("margin-top", "12.65%");
    //    if (verso)
    //        $.mobile.changePage("#carteirinhaverso", {changeHash: false, transition: "slide"});
    //    else
    //        $.mobile.changePage("#pagetwo", {changeHash: false, transition: "slide"});
    //};

    var init = function () {
    	$("#pagetwo, #carteirinhaverso").click(function () {
    		var header = $(".header-carteirinha"),
    		detalheCarteira = $(".carteira_lista_detalhe");
    		header.toggle();
    		if (header.css("display") == "none")
    		{
    			detalheCarteira.css("margin-top", "12.65%");
    			$("#pagetwo").css("margin-top","2em");
    		}
    		else
    		{
    			detalheCarteira.css("margin-top", "1%");
    			$("#pagetwo").css("margin-top","0");
    		}
    	});
    };

    var backCarteira = function(){
    	SetOrientation('portrait');
    	if(window.sessionStorage.getItem("tipo_dependente") == "T")
    		
    		$.mobile.changePage("carteira_virtual.html#pageone", {transition: "pop"});
    	else
    		window.location.href = "index.html";
    	document.addEventListener("backbutton", onBackKeyDown, false);

    	function onBackKeyDown() {
    		if(window.sessionStorage.getItem("tipo_dependente") == "T")
    			navigator.app.backHistory();
    		else
    			window.location.href = "index.html";
    		
    	}
    }

    return {
    	init: init,
    	exibirCarteira: exibirCarteira,
    	listarGrupoFamiliar: listarGrupoFamiliar,
    	listarDetalhesCarteira: listarDetalhesCarteira,
        //flipCarteira: flipCarteira,
        backCarteira: backCarteira
    }
};

var carteiraCtrl = carteiraVirtual();

$(function () {
	document.addEventListener("backbutton", function(e) {
		SetOrientation('portrait');
		if($.mobile.activePage.attr('id') != "pageone")
		{
			if(window.sessionStorage.getItem("tipo_dependente") == "T")
				window.location.href = "carteira_virtual.html";
			else
				window.location.href = "index.html";
		}
		else
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
	if(window.sessionStorage.getItem("tipo_dependente") == "T")
		carteiraCtrl.listarGrupoFamiliar();
	else
		carteiraCtrl.listarDetalhesCarteira(window.sessionStorage.getItem("sequencial"));

});