$(document).ready(function () {
    cardapio.eventos.init();
});
// array que guarda os itens adicionados ao carrinho
var MEU_CARRINHO = [];

var cardapio = {

    eventos: {
        init: () => {
            // carrega o cardápio padrão (burgers)
            cardapio.metodos.obterItensCardapio();
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
                // mostra TODOS os badges (topo e botão de baixo)
                $(".badge-total-carrinho").removeClass('hidden');
            } else {
                // esconde TODOS os badges
                $(".badge-total-carrinho").addClass('hidden');
            }
            // atualiza o número exibido nos badges
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
                });
            } else {
                $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
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

        atualizarCarrinho: (id, qntd) => {
            let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
            MEU_CARRINHO[objIndex].qntd = qntd;
            cardapio.metodos.atualizarBadgeTotal();
        },
        // // mensagens de alerta
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
            <div class="col-3 mb-5">
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
                    <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
                </div>
            </div>`
    }
};

