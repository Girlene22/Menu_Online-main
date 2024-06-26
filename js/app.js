$(document).ready(function () {
    cardapio.eventos.init();
});

var MEU_CARRINHO = [];

var cardapio = {

    eventos: {
        init: () => {
            cardapio.metodos.obterItensCardapio();
        }
    },

    metodos: {
        obterItensCardapio: (categoria = 'burgers', vermais = false) => {
            var filtro = MENU[categoria];
            console.log(filtro);

            if (!vermais) {
                $("#itensCardapio").html('');
                $("#btnVerMais").removeClass('hidden');
            }
            
            $.each(filtro, (i, e) => {
                let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
                    .replace(/\${nome}/g, e.name)
                    .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, e.id);

                if (vermais && i >= 8 && i < 12) {
                    $("#itensCardapio").append(temp);
                }

                if (!vermais && i < 8) {
                    $("#itensCardapio").append(temp);
                }
            });

            $(".container-menu a").removeClass('active');
            $("#menu-" + categoria).addClass('active');
        },

        verMais: () => {
            var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
            cardapio.metodos.obterItensCardapio(ativo, true);

            $("#btnVerMais").addClass('hidden');
        },

        diminuirQuantidade: (id) => {
            let qntdAtual = parseInt($("#qntd-" + id).text());

            if (qntdAtual > 0) {
                $("#qntd-" + id).text(qntdAtual - 1);
            }
        },

        aumentarQuantidade: (id) => {
            let qntdAtual = parseInt($("#qntd-" + id).text());
            $("#qntd-" + id).text(qntdAtual + 1);
        }
    },

    adicionarAoCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];
            let filtro = MENU[categoria];
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                } else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }

                $("#qntd-" + id).text(0);
            }
        }
        //atualiza os badge totais dos botões "Meu Carrinho"
        atualizarBadgeTotal: () => {

            var total = 0;

            $.each(MEU_CARRINHO, (i, e) => {
                total += e.qntd
            })

            if (total > 0){

                $(".botao-carrinho")

            }else{

            }

        }

    },

    templates: {
        item: `
            <div class="col-3 mb-5">
                <div class="card card-item" id="\${img}">
                    <div class="img-produto">
                        <img src="\${img}"/>
                    </div>
                    <p class="title-produto text-center mt-4">
                        <b>\${nome}</b>
                    </p>
                    <p class="price-produto text-center">
                        <b>R$\${preco}</b>
                    </p>
                    <div class="add-carrinho">
                        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                        <span class="add-numero-itens" id="qntd-\${id}">0</span>
                        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                        <span class="btn btn-add" onclick="cardapio.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                    </div>
                </div>
            </div>
        `
    }
};


