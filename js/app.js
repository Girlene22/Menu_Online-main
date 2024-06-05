//quando o documento for carregado e validado então começamos a carregar os metodos e funções
$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {

};

cardapio.eventos = {

    init: () => {

    }

}

cardapio.metodos = {
    //metodo usado para obter a lista de itens do cardapio
    obterItensCardapio: () => {

        var filtro = MENU['burgers'];
        console.log(filtro);

        //funciona como um foreach do javascript
        $.each(filtro,(i, e) => {

        })

    },
}


cardapio.tamplates = {

    //adicionei aspas invertidas para possibilitar a quebra de linha no js

    item:
    `
        <div class="col-3 mb-5">
            <div class="card card-item">
                <div class="img-produto">
                    <img src="img/cardapio/burguers/burger-au-poivre-kit-4-pack.3ca0e39b02db753304cd185638dad518.jpg"/>
                </div>
                    <p class="title-produto text-center mt-4">
                        <b>Nome do produto</b>
                    </p>
                    <p class="price-produto text-center ">
                        <b>R$35,00</b>
                    </p>
                <div class="add-carrinho">
                    <span class="btn-menos"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens">0</span>
                    <span class="btn-mais"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>

                </div>
            </div>
        </div>
        `
                        
}