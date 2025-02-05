const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const mealContainer = document.querySelector('.meal-container');
const recipeDetailContent = document.querySelector('.recipe-detail-content');
const RecipeCloseBtn = document.querySelector('.Recipe-close-btn');

//Function to get recipes
const fetchRecipes = async (query) => {
    mealContainer.innerHTML = '<h2>Fetching Recipes...</h2>';
    try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    mealContainer.innerHTML="";
    response.meals.forEach(meal => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    recipeDiv.innerHTML = `
    <img src="${meal.strMealThumb}">
    <h3>${meal.strMeal}</h3>
    <p><span>${meal.strArea}</span>Dish</p>
    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
    `
    const button = document.createElement('button');
    button.textContent = "View Recipe"
    recipeDiv.appendChild(button);

    //Adding eventlishener to recipe button
    button.addEventListener("click",()=>{
        openRecipePopup(meal);
    })

    mealContainer.appendChild(recipeDiv);
    });
   } catch (error) {
    mealContainer.innerHTML = `
        <div class="error-container">
            <img src="https://cdn.vectorstock.com/i/1000x1000/16/09/website-error-404-page-not-found-vector-18761609.webp" alt="Error Image">
            <h2>Error in Fetching Recipes...</h2>
        </div>`;
   }
}

// function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
        for(let i=1; i<=20; i++){
            const ingredient = meal[`strIngredient${i}`];
            if(ingredient){
                const measure = meal[`strMeaures${i}`];
                ingredientsList += `<li>${measure} ${ingredient}</li>`
            }
            else{
                break;
            }
        }
        return ingredientsList;
    }


const openRecipePopup = (meal) => {
    recipeDetailContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredents:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>`

    recipeDetailContent.parentElement.style.display = "block";
}

RecipeCloseBtn.addEventListener('click', () =>{
    recipeDetailContent.parentElement.style.display = "none";
})

searchBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if(!searchInput) {
        mealContainer.innerHTML = `<h2>Type the meal in the search box...</h2>`
        return;
    }
    fetchRecipes(searchInput);
})