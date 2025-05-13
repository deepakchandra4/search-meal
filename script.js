const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const mealContainer = document.querySelector('.meal-container');
const recipeDetailContent = document.querySelector('.recipe-detail-content');
const RecipeCloseBtn = document.querySelector('.Recipe-close-btn');

// Function to get recipes
const fetchRecipes = async (query) => {
    mealContainer.innerHTML = '<h2>Fetching Recipes...</h2>';
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        mealContainer.innerHTML = "";
        if (response.meals) {
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                // Adding event listener to recipe button
                button.addEventListener("click", () => {
                    openRecipePopup(meal);
                });

                mealContainer.appendChild(recipeDiv);
            });
        } else {
            mealContainer.innerHTML = '<h2>No results found. Try another search.</h2>';
        }
    } catch (error) {
        mealContainer.innerHTML = `
            <div class="error-container">
                <img src="https://cdn.vectorstock.com/i/1000x1000/16/09/website-error-404-page-not-found-vector-18761609.webp" alt="Error Image">
                <h2>Error in Fetching Recipes...</h2>
            </div>`;
    }
};

// function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

const openRecipePopup = (meal) => {
    recipeDetailContent.innerHTML = `
        <div class="recipeName">${meal.strMeal}</div>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">
            ${fetchIngredients(meal)}
        </ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>`;
    document.querySelector('.recipe-details').style.display = 'block';
};

RecipeCloseBtn.addEventListener('click', () => {
    document.querySelector('.recipe-details').style.display = 'none';
});

// Event listener for search form
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = searchBox.value.trim();
    if (searchTerm) {
        fetchRecipes(searchTerm);
    } else {
        // Show homepage content when no search term is entered
        mealContainer.innerHTML = `
            <div class="home-content">
                <h2>Welcome to Meal Explorer!</h2>
                <p>Find your next favorite dish by searching for a meal name above. Or explore our latest suggestions below!</p>
            </div>`;
    }
});
