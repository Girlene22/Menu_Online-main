//quando o documento for carregado e validado então começamos a carregar os metodos e funções
$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {

};

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos = {
    //metodo usado para obter a lista de itens do cardapio
    obterItensCardapio: (categoria = 'burgers') => {

        var filtro = MENU[categoria];
        console.log(filtro);

        //limpa os itens listados da categoria atual para listar os itens da próxima categoria selecionada
        $("#itensCardapio").html('')
        //funciona como um foreach do javascript
        $.each(filtro,(i, e) => {
            //substitui o itemn atual pelas imagens do cardápio
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace`.`,`,`)


            $("#itensCardapio").append(temp)

        })

        //remove o botão ativo 
        $(".container-menu a").removeClass('active');
        //seta o menu para ativo
        $("#menu-"+ categoria).addClass('active');
    },
}


cardapio.templates = {

    //adicionei aspas invertidas para possibilitar a quebra de linha no js

    item:
    `
        <div class="col-3 mb-5">
            <div class="card card-item">
                <div class="img-produto">
                    <img src="\${img}"/>
                </div>
                    <p class="title-produto text-center mt-4">
                        <b>\${nome}</b>
                    </p>
                    <p class="price-produto text-center ">
                        <b>R$\${preco}</b>
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