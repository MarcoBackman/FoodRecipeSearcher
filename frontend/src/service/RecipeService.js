import axios from 'axios';

async function postRecipe(newRecipe) {
    return await axios.post('/api/recipe/addRecipe', newRecipe);
}

async function getAllUserRecipe() {
    return await axios.get('/api/recipe/getAllUserRecipe');
}

async function getAllRecipes() {
    return await axios.get('/api/recipe/getAllRecipes');
}

export {postRecipe, getAllUserRecipe, getAllRecipes};