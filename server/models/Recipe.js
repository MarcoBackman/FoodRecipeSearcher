const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecipeSchema = new Schema({
    name: String,
    description: String,
    image: String,
    recipeYield: String,
    cookTime: String,
    prepTime: String,
    ingredients: [],
});

function getRecipeModel() {
    return mongoose.model("Recipe", RecipeSchema);
}

function getUserRecipeModel() {
    return mongoose.model("userRecipe", RecipeSchema);

}

module.exports = {getRecipeModel, getUserRecipeModel};

