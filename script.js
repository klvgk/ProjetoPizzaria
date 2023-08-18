//Array do Carrinho;
let cart = [];
//Variável da quantidade de pizzas a serem selecionadas;
let modalQt = 1;

//Identificação do tipo da pizza;
let modalKey = 0;

//Função com a finalidade de retornar um elemento, resume o document.querySelector/document.querySelectorAll;
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//Listagem das Pizzas;
pizzaJson.map((item, index) => {
    //O cloneNode(true) clona o item pizzaItem do HTML e todo seu conteúdo;
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //Ao clicar na pizza vai abrir a janela de seleção;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        //Bloquear a ação padrão do item, que é atualizar a tela. "Prevenir ação Padrão";
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;
        modalKey = key;

        //Preenche os elementos na tela de seleção de pizza;
        c('.pizzaBig img').innerHTML = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        //        c('.pizzaInfo--size.selected').classList.remove('selected');

        //Preenche os elementos de tamanho da pizza, na tela de seleção da pizza;
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {

            if (sizeIndex == 2) {
                size.classList.add('selected');
            };

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        //Faz a transição de opacidade para mostrar a janela de seleção na tela;
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    //Preencher as informações em pizza-item;
    c('.pizza-area').append(pizzaItem);

});

//Eventos do MODAL;
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        c('.pizzaWindowArea').style.display = 'none';

    }, 500)
};

//Ao clicar no botão de Cancelar do Modal do Desktop, ou, Voltar do Modal Mobile, ele fecha o modal;
cs('pizzaInfo--cancelButton, pizzaInfo--cancelMobileButton').forEach(item => {
    item.addEventListener('click', () => {
        closeModal();
    });
});

//Ações de aumentar ou diminuir quantidade de pizza;
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    };
});
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//Mudança de seleção do modal de tamanho da pizza;
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//Adição do pedido ao carrinho;
c('.pizzaInfo--addButton').addEventListener('click', () => {


    //Qual o tamanho;
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    //Identificador para agrupar os tipos+tamanhos de pizza iguais no carrinho;
    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    /*
    Verifica se o identificador do item é igual o identificador de algum item do carrinho,
    e adiciona o item ao carrinho;
    */
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt,
        });
    }

    updateCart();
    closeModal();
});

//Mostra o carrinho no mobile;
c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0 ){
        c('aside').style.left = 0;
    };

});

//Fecha o carrinho no mobile;
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

//Atualiza o carrinho;
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    
    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            };

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })
            c('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}