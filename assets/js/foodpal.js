document.getElementById('startApp').addEventListener('click', () => {
    document.getElementById('home').style.display = 'none';
    document.getElementById('preferences').style.display = 'block';
});

const SPOONACULAR_API_KEY = '02124e85c8fb45dea420aa38c105d8c4';

let userPreferences = { diet: '', intolerances: '' };

document.getElementById('savePreferences').addEventListener('click', () => {
    const diet = document.getElementById('dietSelect').value;
    const intolerances = document.getElementById('intolerancesInput').value;

    userPreferences = { diet, intolerances };

    document.getElementById('preferences').style.display = 'none';
    document.getElementById('recipeSearch').style.display = 'block';
});

document.getElementById('searchRecipes').addEventListener('click', () => {
    const selectedCuisine = document.getElementById('cuisineSelect').value;

    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&cuisine=${selectedCuisine}&diet=${userPreferences.diet}&intolerances=${userPreferences.intolerances}&number=5`)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.results);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
});

function displayRecipes(recipes) {
    const resultsDiv = document.getElementById('recipeResults');
    resultsDiv.innerHTML = recipes.map(recipe => `
    <div class="recipeCard">
      <h3>${recipe.title}</h3>
      <button onclick="viewRecipe(${recipe.id})">View Details</button>
    </div>
  `).join('');
}

function viewRecipe(recipeId) {
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const recipeTitle = data.title;
            const ingredients = data.extendedIngredients;

            const detailsDiv = document.getElementById('recipeDetails');
            detailsDiv.style.display = 'block';
            detailsDiv.innerHTML = `
                <h2>${recipeTitle}</h2>
                <h3>Ingredients:</h3>
                <ul>
                    ${ingredients.map(ing => `<li>${ing.name}: ${ing.amount} ${ing.unit}</li>`).join('')}
                </ul>
                <h3>Instructions:</h3>
                <ol>
                    ${data.analyzedInstructions[0]?.steps.map(step => `<li>${step.step}</li>`).join('') || '<p>No instructions available.</p>'}
                </ol>
                <button onclick='navigateToOrderPage("${recipeTitle}", ${JSON.stringify(ingredients)})'>Order Ingredients</button>
            `;
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
        });
}

// Simplify the ingredient data to only include 'name' and 'amount + unit'
function simplifyIngredients(ingredients) {
    return ingredients.map(ingredient => ({
        name: ingredient.name,
        amount: `${ingredient.amount} ${ingredient.unit}`.trim()
    }));
}

// Redirect to order page with simplified ingredient data
function navigateToOrderPage(recipeTitle, ingredients) {
    const simplifiedIngredients = simplifyIngredients(ingredients);
    const encodedIngredients = encodeURIComponent(JSON.stringify(simplifiedIngredients));
    const orderPageUrl = `FoodpalOrder.html?title=${encodeURIComponent(recipeTitle)}&ingredients=${encodedIngredients}`;
    window.location.href = orderPageUrl;
}

// Categorize and display order confirmation
function simulateOrder(recipeTitle, ingredients) {
    const categories = {
        Pantry: ['flour', 'sugar', 'salt', 'oil'],
        Dairy: ['milk', 'butter', 'cheese'],
        Produce: ['tomato', 'onion', 'potato', 'avocado', 'cilantro'],
        Meat: ['chicken', 'beef', 'pork'],
    };

    const categorizedIngredients = {};

    ingredients.forEach(ingredient => {
        let category = 'Other';
        Object.keys(categories).forEach(key => {
            if (categories[key].some(item => ingredient.name.toLowerCase().includes(item))) {
                category = key;
            }
        });

        if (!categorizedIngredients[category]) {
            categorizedIngredients[category] = [];
        }
        categorizedIngredients[category].push(`${ingredient.name}: ${ingredient.amount}`);
    });

    const orderSection = document.getElementById('orderSection');
    orderSection.style.display = 'block';
    orderSection.innerHTML = `
    <h3>Order Successful!</h3>
    <p>Your ingredients for "${recipeTitle}" are on their way.</p>
    <h3>Items Ordered:</h3>
    ${Object.keys(categorizedIngredients).map(category => `
      <h4>${category}</h4>
      <ul>${categorizedIngredients[category].map(item => `<li>${item}</li>`).join('')}</ul>
    `).join('')}
    <a href="https://mock-tracking-url.com" target="_blank">Track Your Order</a>
  `;
}
