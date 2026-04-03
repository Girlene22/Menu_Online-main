$(document).ready(function () {
    cardapio.eventos.init();
});
// array que guarda os itens adicionados ao carrinho
var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;

var CELULAR_EMPRESA = '5587999782324';

var cardapio = {

    eventos: {
        init: () => {
            // carrega o cardápio padrão (burgers)
            cardapio.metodos.obterItensCardapio();
            cardapio.metodos.carregarBotaoLigar();
            cardapio.metodos.carregarBotaoWhasApp();
            cardapio.metodos.carregarBotaoReserva();

            
            
        }
    },

    metodos: {
        // busca os itens do cardápio pela categoria
        obterItensCardapio: (categoria = 'burgers', vermais = false) => {
            var filtro = MENU[categoria];
            // se NÃO for "ver mais", limpa o cardápio
            if (!vermais) {
                $("#itensCardapio").html('');
                $("#btnVerMais").removeClass('hidden');
            }
            // percorre os itens da categoria
            $.each(filtro, (i, e) => {
                let temp = cardapio.templates.item
                    .replace(/\${img}/g, e.img)
                    .replace(/\${nome}/g, e.name)
                    .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, e.id);


                // controla botão ativo do menu
                if (vermais && i >= 8 && i < 12) {
                    $("#itensCardapio").append(temp);
                }

                if (!vermais && i < 8) {
                    $("#itensCardapio").append(temp);
                }
            });
            // controla botão ativo do menu
            $(".container-menu a").removeClass('active');
            $("#menu-" + categoria).addClass('active');
        },
        // botão "ver mais"
        verMais: () => {
            var ativo = $(".container-menu a.active")
                .attr('id')
                .split('menu-')[1];

            cardapio.metodos.obterItensCardapio(ativo, true);
            $("#btnVerMais").addClass('hidden');
        },
        // diminui quantidade do item
        diminuirQuantidade: (id) => {
            let qntdAtual = parseInt($("#qntd-" + id).text());
            if (qntdAtual > 0) {
                $("#qntd-" + id).text(qntdAtual - 1);
            }
        },
         // aumenta quantidade do item
        aumentarQuantidade: (id) => {
            let qntdAtual = parseInt($("#qntd-" + id).text());
            $("#qntd-" + id).text(qntdAtual + 1);
        },
        // soma a quantidade total de itens no carrinho
        atualizarBadgeTotal: () => {
    var total = 0;
    $.each(MEU_CARRINHO, (i, e) => {
        total += e.qntd;
    });

    // se tiver itens no carrinho
    if (total > 0) {
        $(".badge-total-carrinho").removeClass('hidden');
        $(".botao-carrinho").removeClass('hidden'); // MOSTRA botão sacola
    } else {
        $(".badge-total-carrinho").addClass('hidden');
        $(".botao-carrinho").addClass('hidden'); // ESCONDE botão sacola
    }

    $(".badge-total-carrinho").html(total);
},

        // abrir a modal de carrinho

        abrirCarrinho: (abrir) => {
            if (abrir) {
                $("#modalCarrinho").removeClass('hidden');
                cardapio.metodos.carregarCarrinho();
            } else {
                $("#modalCarrinho").addClass('hidden');
            }
        },

         //Altera os textos e exibe os botões das etapas
        carregarEtapa: (etapa) => {
            if (etapa == 1) {
                $("#lblTituloEtapa").text('Seu carrinho:');
                $("#itensCarrinho").removeClass("hidden");
                $("#localEntrega").addClass("hidden");
                $("#resumoCarrinho").addClass("hidden");
                $(".etapa").removeClass('active');
                $(".etapa1").addClass('active');
                $("#btnEtapaPedido").removeClass("hidden");
                $("#btnEtapaEndereco").addClass("hidden");
                $("#btnEtapaResumo").addClass("hidden");
                $("#btnVoltar").addClass("hidden");
            }
            if (etapa == 2) {
                $("#lblTituloEtapa").text('Endereço de entrega:');
                $("#itensCarrinho").addClass("hidden");
                $("#localEntrega").removeClass("hidden");
                $("#resumoCarrinho").addClass("hidden");
                $(".etapa").removeClass('active');
                $(".etapa1, .etapa2").addClass('active');
                $("#btnEtapaPedido").addClass("hidden");
                $("#btnEtapaEndereco").removeClass("hidden");
                $("#btnEtapaResumo").addClass("hidden");
                $("#btnVoltar").removeClass("hidden");
            }
            if (etapa == 3) {
                $("#lblTituloEtapa").text('Resumo do pedido:');
                $("#itensCarrinho").addClass("hidden");
                $("#localEntrega").addClass("hidden");
                $("#resumoCarrinho").removeClass("hidden");
                $(".etapa").removeClass('active');
                $(".etapa1, .etapa2, .etapa3").addClass('active');
                $("#btnEtapaPedido").addClass("hidden");
                $("#btnEtapaEndereco").addClass("hidden");
                $("#btnEtapaResumo").removeClass("hidden");
                $("#btnVoltar").removeClass("hidden");
            }
        },

        // Botão de voltar etapa

        voltarEtapa: () => {
            let etapa = $(".etapa.active").length;
            cardapio.metodos.carregarEtapa(etapa - 1);
        },

        carregarCarrinho: () => {
            cardapio.metodos.carregarEtapa(1);

            if (MEU_CARRINHO.length > 0) {
                $("#itensCarrinho").html('');
                $.each(MEU_CARRINHO, (i, e) => {
                    let temp = cardapio.templates.itensCarrinho
                        .replace(/\${img}/g, e.img)
                        .replace(/\${nome}/g, e.name)
                        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                        .replace(/\${id}/g, e.id)
                        .replace(/\${qntd}/g, e.qntd);

                    $("#itensCarrinho").append(temp);

                    //ultimo item
                    if((i + 1) == MEU_CARRINHO.length){
                        cardapio.metodos.carregarValores();
                    }
                });
            } else {
                $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
                cardapio.metodos.carregarValores();
            }
        },

        diminuirQuantidadeCarrinho: (id) => {
            let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
            if (qntdAtual > 1) {
                $("#qntd-carrinho-" + id).text(qntdAtual - 1);
                cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
            } else {
                cardapio.metodos.removerItemCarrinho(id);
            }
        },

        aumentarQuantidadeCarrinho: (id) => {
            let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
            $("#qntd-carrinho-" + id).text(qntdAtual + 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
        },

        removerItemCarrinho: (id) => {
            MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
            cardapio.metodos.carregarCarrinho();
            cardapio.metodos.atualizarBadgeTotal();
        },
        //atualiza o botão carrinho com a quantidade atual
        atualizarCarrinho: (id, qntd) => {
            let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
            MEU_CARRINHO[objIndex].qntd = qntd;
            cardapio.metodos.atualizarBadgeTotal();
            //atualiza os valores ($) totais do carrinho
            cardapio.metodos.carregarValores();
        },
            

        // carrega os valores de subtotal, valor da entrega e valor total da compra
        carregarValores: () => {

                VALOR_CARRINHO = 0;

                $("#lblSubtotal").text('R$0,00');
                $("#lblValorEntrega").text('+ R$0,00');
                $("#lblValorTotal").text('R$0,00');

                $.each(MEU_CARRINHO, (i, e) => {

                    VALOR_CARRINHO += parseFloat(e.price * e.qntd);

                    if((i + 1) == MEU_CARRINHO.length) {
                        $("#lblSubtotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.',',')}`);
                        $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`);
                        $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}`);
                    }

                })
        },

        //carregar a etapa endereços
        carregarEndereco: () => {

            if (MEU_CARRINHO.length <= 0) {

                cardapio.metodos.mensagem('Seu carrinho está vazio!')
                return;
            }
            cardapio.metodos.carregarEtapa(2);
        },

        //API Via CEP

        buscarCep: () => {
            
            //tira todo espaço e os caracteres inseridos pelo usuario como pontos e traços, deixando apenas os números.
            var cep = $("#textCEP").val().trim().replace(/\D/g, '');

            if (cep != "") {
                //expressão regular para validar o cep
                var validacep = /^[0-9]{8}$/;

                if (validacep.test(cep)){

                    //chama a API do Via CEP
                    $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                        //verifica se o cep foi encontrado, caso não seja, pede pra o usuario digitar manualmente
                        if (!("erro" in dados)){

                        //atualizar os campos com os valores retornados
                        $("#textEndereco").val(dados.logradouro);
                        $("#textBairro").val(dados.bairro);
                        $("#textCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#textNumero").focus();

                        }else{
                            cardapio.metodos.mensagem('CEP não encontrado, por favor, preencha as informações manualmente');
                            $("#textEndereco").focus();
                        }
                    })

                }else{
                    cardapio.metodos.mensagem('O formato do CEP inserido é inválido!');
                    $("#textCEP").focus();
                }

            }else{
                cardapio.metodos.mensagem('Informe o CEP, por favor');
                $("#textCEP").focus();
            }

        },

        //validação antes de seguir para a etapa 3

        resumoPedido: () => {

            let cep = $("#textCEP").val().trim();
            let endereco = $("#textEndereco").val().trim();
            let bairro = $("#textBairro").val().trim();
            let cidade = $("#textCidade").val().trim();
            let uf = $("#ddlUf").val().trim();
            let numero = $("#textNumero").val().trim();
            let complemento = $("#textComplemento").val().trim();

            if(cep.length <= 0){
                cardapio.metodos.mensagem('Informe o CEP, por favor');
                $("#textCEP").focus();
                return;
            }
            if(endereco.length <= 0){
                cardapio.metodos.mensagem('Informe o endereco, por favor');
                $("#textEndereco").focus();
                return;
            }
            if(bairro.length <= 0){
                cardapio.metodos.mensagem('Informe o bairro, por favor');
                $("#textBairro").focus();
                return;
            }
            if(cidade.length <= 0){
                cardapio.metodos.mensagem('Informe a cidade, por favor');
                $("#textCidade").focus();
                return;
            }
            if(uf.length == "-1"){
                cardapio.metodos.mensagem('Informe a UF, por favor');
                $("#ddlUf").focus();
                return;
            }
            if(numero.length <= 0){
                cardapio.metodos.mensagem('Informe o numero, por favor');
                $("#textNumero").focus();
                return;
            }

            MEU_ENDERECO = {

                cep: cep,
                endereco: endereco,
                bairro: bairro,
                cidade: cidade,
                uf: uf,
                numero: numero,
                complemento: complemento
            }

            cardapio.metodos.carregarEtapa(3);
            cardapio.metodos.carregarResumo();
            

        },

        carregarResumo: () => {

            $("#listaItensResumo").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemResumo
                        .replace(/\${img}/g, e.img)
                        .replace(/\${nome}/g, e.name)
                        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                        .replace(/\${qntd}/g, e.qntd)

                $("#listaItensResumo").append(temp);

            });

            $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
            $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

            cardapio.metodos.finalizarPedido();


        },
            //atualiza o botão do link do whatsapp
        finalizarPedido: () => {

            if(MEU_CARRINHO.length > 0 && MEU_ENDERECO != null){
                var texto = 'Olá, gostaria de fazer um pedido:';
                texto += `\n*Itens do Pedido:*\n\n\${itens}`;
                texto += '\n*Endereço de Entrega:*';
                texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
                texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
                texto += `\n\n*Total(com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

                var itens = '';

                $.each(MEU_CARRINHO, (i, e) => {
                    itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                    //ultimo item
                    if ((i + 1) == MEU_CARRINHO.length){

                        texto = texto.replace(/\${itens}/g, itens);

                    //converte a URL
                        let encode = encodeURI(texto);
                        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                        $("#btnEtapaResumo").attr('href', URL);
                    }

                })

            }

        },

        carregarBotaoReserva: () => { 

            var texto = 'Olá, gostaria de fazer uma *reserva*:';

            let encode = encodeURI(texto);
            let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

            $("#btnReserva").attr('href', URL);

        },

        carregarBotaoLigar: () => {

            $("btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

        },

        carregarBotaoWhasApp: () => { 

            var texto = '';

            let encode = encodeURI(texto);
            let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

            $(".btnWhatsApp").attr('href', URL);

        },
        

        

        abrirDepoimento: (depoimento) => {

            $("#depoimento-1").addClass('hidden');
            $("#depoimento-2").addClass('hidden');
            $("#depoimento-3").addClass('hidden');

            $("#btnDepoimento-1").removeClass('active');
            $("#btnDepoimento-2").removeClass('active');
            $("#btnDepoimento-3").removeClass('active');

            $("#depoimento-" + depoimento).removeClass('hidden');
            $("#btnDepoimento-" + depoimento).addClass('active');


        },


        // mensagens de alerta
        mensagem: (texto, cor = 'red', tempo = 3500) => {
            let id = Math.floor(Date.now() * Math.random()).toString();
            let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;
            $("#container-mensagens").append(msg);
            setTimeout(() => {
                $("#msg-" + id).removeClass('fadeInDown').addClass('fadeOutUp');
                setTimeout(() => { $("#msg-" + id).remove(); }, 800);
            }, tempo);
        }
    },

    adicionarAoCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        if (qntdAtual > 0) {
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];
            let filtro = MENU[categoria];
            let item = $.grep(filtro, e => e.id == id);

            if (item.length > 0) {
                let existe = $.grep(MEU_CARRINHO, e => e.id == id);
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex(obj => obj.id == id);
                    MEU_CARRINHO[objIndex].qntd += qntdAtual;
                } else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }
                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0);
                cardapio.metodos.atualizarBadgeTotal();
            }
        }
    },
     // TEMPLATES HTML
    templates: {
        item: `
            <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
                <div class="card card-item" id="produto-\${id}">
                    <div class="img-produto"><img src="\${img}"/></div>
                    <p class="title-produto text-center mt-4"><b>\${nome}</b></p>
                    <p class="price-produto text-center"><b>R$ \${preco}</b></p>
                    <div class="add-carrinho">
                        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')">-</span>
                        <span class="add-numero-itens" id="qntd-\${id}">0</span>
                        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')">+</span>
                        <span class="btn btn-add" onclick="cardapio.adicionarAoCarrinho('\${id}')">
                            <i class="fa fa-shopping-bag"></i>
                        </span>
                    </div>
                </div>
            </div>`,

        itensCarrinho: `
            <div class="col-12 item-carrinho">
                <div class="img-produto"><img src="\${img}"/></div>
                <div class="dados-produto">
                    <p class="title-produto"><b>\${nome}</b></p>
                    <p class="price-produto"><b>R$ \${preco}</b></p>
                </div>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')">-</span>
                    <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')">+</span>
                    <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
                </div>
            </div>`,

        itemResumo: `<div class="col-12 item-carrinho resumo">
                                <div class="img-produto-resumo"> <img src="\${img}"/>
                                </div>
                                <div class="dados-produto">
                                    <p class="title-produto-resumo"> <b>\${nome}</b> </p>
                                    <p class="price-produto-resumo"> <b>R$ \${preco}</b> </p>
                                </div>
                                <p class="quantidade-produto-resumo"> x <b>\${qntd}</b> </p>
                            </div>`
    }
};

