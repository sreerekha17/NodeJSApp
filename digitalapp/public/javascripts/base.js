const types = [
    {
        name: 'Hard Copy',
        value: 'hard-copy'
    },{
        name: 'Poster',
        value: 'poster'
    },
    {
        name: 'Coffee Mug',
        value: 'mug'
    },{
        name: 'T-Shirt',
        value: 'tshirt'
    }
];

const quality = [
    {
        name: 'Good',
        value: 'good'
    },
    {
        name: 'Very Good',
        value: 'vgood'
    },
    {
        name: 'Excellent',
        value: 'excellent'
    }
];


const pricingConfig = {
    'hard-copy': [
        {
            quality: 'good',
            price: 8.99
        },
        {
            quality: 'vgood',
            price: 9.99
        },
        {
            quality: 'excellent',
            price: 10.99
        }],
    'poster': [
        {
            quality: 'good',
            price: 9.99
        },
        {
            quality: 'vgood',
            price: 10.99
        },
        {
            quality: 'excellent',
            price: 11.99
        }],
    'mug': [
        {
            quality: 'good',
            price: 10.99
        },
        {
            quality: 'vgood',
            price: 11.99
        },
        {
            quality: 'excellent',
            price: 12.99
        }],
    'tshirt': [
        {
            quality: 'good',
            price: 11.99
        },
        {
            quality: 'vgood',
            price: 12.99
        },
        {
            quality: 'excellent',
            price: 13.99
        }],
    
};


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

$().ready( () => {
    $('footer').html(
        `
        <section>
            <div> © 2021 DigOceanGallery.com, Inc. All rights reserved. </div>
            <div>
                <a> Terms </a>
                <a> Privacy </a>
                <a> CA Privacy </a>
                <a> Copyright </a>
                <a> Cookies</a>
            </div>
        </section>
        `
    );
    document.addEventListener('UpdateCartCount', cartCountUpdate, false);

    readExistingItemsInCart()

})


