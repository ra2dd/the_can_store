const selectedCategory = document.querySelector('#category');
const searchString = document.querySelector('#search-term');
const button = document.querySelector('button');
const main = document.querySelector('main');
let lastCategory = "undefined";;
let lastSearch = "undefined";


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

async function fetchImage(url)
{
    try
    {
        const response = await fetch(url);

        if(!response.ok)
        {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return response.blob();
    }

    catch (error)
    {
        console.error(`Could not get an product image ${error}`);
    }
}

function displayProducts(products)
{
    const category = selectedCategory.value.toLowerCase().trim();
    const search = searchString.value.toLowerCase().trim();

    if(lastCategory === category && lastSearch === search)
    {
        console.log("Category and search term is the same, all displayed products stay the same");
        searchString.value = "";
        return true;
    }

    while(main.firstChild)
    {
        main.firstChild.remove();
    }

    const selectedProducts = productSelection(products, category, search);
    for (const product of selectedProducts)
    {
        const url = `images/${product.image}`;

        const imagePromise = fetchImage(url);
        imagePromise.then((blob) =>
        {
            const newSection = document.createElement('section');
            const newHeading = document.createElement('h3');
            const newImage = document.createElement('img');
            const newPara = document.createElement('p');

            newHeading.textContent = `${product.name}`;
            newImage.setAttribute('src', url);
            newPara.textContent = `${product.type}: ${product.price}`;
            newSection.setAttribute('class', product.type);

            newSection.appendChild(newHeading);
            newSection.appendChild(newImage);
            newSection.appendChild(newPara);
            main.appendChild(newSection);    
        });    
    }
}


function productSelection(products, category, search)
{
    if(category !== 'all')
    {
        products = products.filter(product => product.type === category);
    }

    if(search !== '')
    {
        products = products.filter(product => product.name.includes(search));
    }
    
    searchString.value = "";
    lastCategory = category;
    lastSearch = search;

    return products;
}


button.addEventListener('click', (event) =>
{
    //event.stopImmediatePropagation();

    console.log("finished calculations");
    const promise = fetchProducts();
    promise.then((data) => displayProducts(data));
});

//button.click();

