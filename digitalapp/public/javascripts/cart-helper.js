
/**
 * 
 * currently unused
 */

function cartCountUpdate(data) {
    document.querySelector('#count').innerText = data.detail;
}


function updateCartCount(cartCount) {
    const event = new CustomEvent('UpdateCartCount', { detail: cartCount });
    document.dispatchEvent(event);
}

function readExistingItemsInCart() {
    const ls = storageHelper();
    const currentCart = ls.get('cart');
    const newCart = [];

    if (currentCart){
        currentCart.forEach(item => newCart.push(item))
    }

    updateCartCount(newCart.length)
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

function updateCart() {
    document.addEventListener('DOMContentLoaded', () => {

        document.addEventListener('UpdateCartCount', cartCountUpdate, false);
    
        readExistingItemsInCart();
    });
}

export  {
    updateCart,
    storageHelper,
    readExistingItemsInCart,
}