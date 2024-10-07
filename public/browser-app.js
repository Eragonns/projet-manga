const URL = "/api/v1/mangas";

const fileFormDOM = document.querySelector(".file-form");
const containerDOM = document.querySelector(".container");
const btn = document.querySelector(".btn");

fileFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  btn.disabled = true;
  btn.textContent = "Envoi en cours...";
  const formData = new FormData(e.currentTarget);

  try {
    await axios.post(URL, formData);
    fetchProducts();
  } catch (error) {
    console.log(error);
  } finally {
    btn.disabled = false;
    btn.textContent = "Ajouter un produit";
  }
});

async function fetchProducts() {
  containerDOM.className = "";
  containerDOM.innerHTML = '<div class="loading"></div>';

  try {
    const {
      data: { products }
    } = await axios.get(URL);

    const productsDOM = products
      .map((product) => {
        return `<article class="product">
                  <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="img" 
                  />
                  <footer>
                    <p>${product.name}</p>
                    <span>$${product.price}</span>
                  </footer>
                </article>`;
      })
      .join("");
    containerDOM.innerHTML = productsDOM;
  } catch (error) {
    containerDOM.innerHTML = "";
    console.log(error);
  } finally {
    containerDOM.className = "container";
  }
}

fetchProducts();
