const menu = document.getElementById("menu");
const popularItens = document.getElementById("popular-Itens");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const footerTotal = document.getElementById("total-footer");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

const acaiModal = document.getElementById("myModal");
const closeModalAcai = document.getElementById("closeModal");
let cart = [];

cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
    document.body.classList.add("overflow-hidden");
    setTimeout(function () {
        cartModal.classList.remove("translate-y-full");
    }, 100);
});

cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
        document.body.classList.remove("overflow-hidden");
    }
})
closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none"
    document.body.classList.remove("overflow-hidden");
})
popularItens.addEventListener("click", (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        const category = parentButton.getAttribute("data-category");
        if(name != 'Montagem'){
        addToCart(name, price)
        }
        if(name == 'Montagem' && category == 'Acai'){
            acaiModal.style.display = "flex";
        }
    }
});

closeModalAcai.addEventListener("click", () => {
    acaiModal.style.display = "none"
})

menu.addEventListener("click", (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
});


function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity += 1;
        return;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }

    updateCartModal()
}

function updateCartModal() {
    cartItemsContainer.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
          <div class="flex items-center justify-between gap-2 p-4 rounded-md shadow-sm hover:shadow-lg transition duration-300">
            <div class="flex items-center">
            <p>${item.quantity} x</p>
            <p  class="font-medium">${item.name}</p>
            </div>   
                 
            <div class="flex items-center justify-center gap-2">
            <p class="font-medium ">${item.price.toFixed(2)}</p>
            <button class="remove-btn-item text-red-600" data-name="${item.name}">
             <i class=" fa fa-circle-minus  text-lg text-red-500"></i> 
            </button>
            </div>     
        </div>        
        `;

        total += item.price * item.quantity
        cartItemsContainer.appendChild(cartItemElement)
    })
    cartTotal.textContent = total.toLocaleString("pt-BR",{ 
        style: "currency",
        currency: "BRL"
    })
    cartCounter.innerText = cart.length;
    footerTotal.textContent = total.toLocaleString("pt-BR",{ 
        style: "currency",
        currency: "BRL"
    })

}

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn-item") || event.target.closest(".remove-btn-item")){
        const name = event.target.closest(".remove-btn-item").getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal()
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
    
})


//finalizar pedido
checkoutBtn.addEventListener("click", () => {

     const isOpen = checkHourRestaurant();

     if(!isOpen){
        Toastify({
            text: "Ops o restaurante está fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "#ef4444",
            },}).showToast();
         return;
     }

    if(cart.length === 0 ) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar o pedido para api WHATS
      const intro = `
    Olá, Point do Açaí,

    Gostaria de fazer um pedido do cardápio digital. Segue a lista dos itens que desejo:
`;

    const cartItems = cart.map((item) => {
        return `
        - Item: ${item.name}
        - Quantidade: ${item.quantity}
        - Preço unitário: R$${item.price.toFixed(2)}
    `;
    }).join("\n");

    const messageContent = `${intro}\n${cartItems}
    Total: ${cartTotal.textContent} 
    Endereço: ${addressInput.value}`;
    const message = encodeURIComponent(messageContent);

    const phone = "48996627446";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    addressInput.value = ""
    updateCartModal();
})

function checkHourRestaurant(){
    const data = new Date()
    const hora = data.getHours();
    return hora >= 11 && hora < 22;

}

const spanItem = document.getElementById("date-span")
const isOpen = checkHourRestaurant();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}


function initMap() {
    let clienteInput = addressInput.value; 
    
    const enderecoCliente = clienteInput; 
    
    const service = new google.maps.DistanceMatrixService();
    
    const enderecoDestino = "R. Eng. Loja, 11 - Próspera, Criciúma - SC, 88813-335";
    
    const request = {
      origins: [enderecoCliente],
      destinations: [enderecoDestino],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };
    
    service.getDistanceMatrix(request).then((response) => {
      const distanciaMetros = response.rows[0].elements[0].distance.value;
      const distanciaKm = distanciaMetros / 1000;
      const taxaEntrega = distanciaKm * 2;
    
       const tEntrega = document.getElementById("cal-rota");
       tEntrega.innerHTML = `A taxa de entrega é de R$ ${taxaEntrega.toFixed(2)}.`;
    });
  }
