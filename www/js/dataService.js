var dataService = function() {

    function chamadaGenericaAjax(urlParam, dataParam, callback, errorCallback, keepLoadAnimation) {
        $.mobile.loading("show");
        $.ajax({
            type: "POST",
            url: urlParam,
            data: JSON.stringify(dataParam),
            traditional: true,
            dataType: "json",
            contentType: "application/json",
            timeout: 30000,
            error: function () {
                $.mobile.loading("show");
                setTimeout(function(){runtimePopup("Erro", "Falha de comunicação. Tente novamente",false,errorCallback);
                	$.mobile.loading("hide");},1000);

            },
            success: function (response) {
                if(!keepLoadAnimation)
                    $.mobile.loading("hide");
                callback(response);
            },
            beforeSend: function () {
                $.mobile.loading("show");
            }
        });
    }

    return {
        chamadaGenericaAjax: chamadaGenericaAjax
    }
};
