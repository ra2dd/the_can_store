const selectedCategory = document.querySelector('#category');
const searchString = document.querySelector('#search-term');
const button = document.querySelector('button');
const main = document.querySelector('main');


async function fetchProducts()
{
    try
    {
        const response = await fetch('products.json');

        if(!response.ok)
        {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    }

    catch (error)
    {
        console.error(`Could not get products: ${error}`);
    }
}

function displayProducts(products)
{
    while(main.firstChild)
    {
        main.firstChild.remove();
    }

    const selectedProducts = productSelection(products);
    for (const product of selectedProducts)
    {
        const newSection = document.createElement('section');
        const newPara = document.createElement('p');
        newPara.textContent = `${product.name}, ${product.type}: ${product.price}`;
        newSection.appendChild(newPara);
        main.appendChild(newSection);        
    }
}


function productSelection(products)
{
    const category = selectedCategory.value.toLowerCase().trim();
    const search = searchString.value.toLowerCase().trim();
    searchString.value = "";

    if(category !== 'all')
    {
        products = products.filter(product => product.type === category);
    }

    if(search !== '')
    {
        products = products.filter(product => product.name.includes(search));
    }
    
    return products;
}


button.addEventListener('click', (event) =>
{
    const promise = fetchProducts();
    promise.then((data) => displayProducts(data));
});

//button.click();

