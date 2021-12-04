document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('UpdateCartCount', cartCountUpdate, false);

    readExistingItemsInCart();

    displayItemsInCart();
});

function cartCountUpdate(data) {
    document.querySelector('#count').innerText = data.detail;
}


function updateCartCount(cartCount) {
    const event = new CustomEvent('UpdateCartCount', { detail: cartCount });
    document.dispatchEvent(event);
}

function readExistingItemsInCart() {
    const ls = storageHelper();
    const currentCart = ls.get('cart') || [];
    const cartCount = currentCart.reduce((sum, curr) => sum+curr.quantity, 0);

    updateCartCount(cartCount)
}

function storageHelper() {
    const storage = window.localStorage;

    return {
        get: (key) => {
            const data = storage.getItem(key);
            if (data) {
                return JSON.parse(data)
            }
        },
        set: (key, data) => {
            storage.setItem(key, JSON.stringify(data))

            //update cart count
        }
    }
}

function deleteItem(cartID) {
    const ls = storageHelper();
    const currentCart = ls.get('cart') || [];

    const idxToRemove = currentCart.findIndex(item => item.cartID === cartID)
    currentCart.splice(idxToRemove, 1);

    ls.set('cart', currentCart);

    //updates display after delete
    displayItemsInCart();
}

function proceedToCheckout() {
    const ls = storageHelper();
    const currentCart = ls.get('cart') || [];

    fetch('/checkout', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(currentCart)
    })
    // fetch('/checkout')
    .then((res) => {
        if(res.ok) {
            return res.json()
        }
        else {
            return new Error(res)
        }
    })
    .then((res) => {
        console.log("Success", res)
        window.location.href = '/checkout'
    })
    .catch(err => {
        console.log("Error", err)
    })

}


function displayItemsInCart() {
    const ls = storageHelper();
    const currentCart = ls.get('cart');
    const checkoutLink = $("header .btn-success");

    const cartWrapper = $('.cart-wrapper')
    if (currentCart && currentCart.length){
        checkoutLink.show();
 
        $(cartWrapper).html('');
        currentCart.forEach(item => {
            const qualityLabel = quality.find(i => i.value === item.quality);
            const typeLabel = types.find(i => i.value === item.type);
            const cartItem = `
                <div class="item-wrapper">
                    <img src=${item.selectedImg} />
                    <div class="details">
                        <label class="option">Quality:</label><label class="selected">${qualityLabel.name}</label>
                        <br>
                        <label class="option">Type:</label><label class="selected">${typeLabel.name}</label>
                        <br>
                        <label class="option">Quantity:</label><label class="selected">${item.quantity}</label>
                        <br>
                        ${
                            item.glossy
                            ? `<label class="option">Glossy:</label><input type="checkbox" checked disabled class="selected" />
                                <br>    
                              `
                            
                            : ''
                        }
                        <a type="button" class="btn btn-danger" onclick="deleteItem(${item.cartID})">Delete from cart</a>
                        <br>
                    </div>
                    <div class="price">Price: ${item.price}
                    ${
                        item.glossy
                            ? '<div class="price-additional">Additional $2 will be added at checkout (Glossy finish) </div>'
                            : ''

                    }
                    </div>
                    
                </div>
                <hr>
            `
            cartWrapper.append(cartItem)

        })
        
    }
    else {
        checkoutLink.hide()
        cartWrapper.html('Your cart is empty')
    }

}


