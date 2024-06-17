const express = require('express');
const Recipe = require("../models/Recipe");

const router = express.Router();
const logger = require('../util/LogManager').getLogger('RecipeRouter.js');

let RegularRecipe = Recipe.getRecipeModel();
let UserRecipe = Recipe.getUserRecipeModel();

//Post endpoint to write regular recipe data to DB
router.post('/recipe/addRecipe', async (req, res) => {
    try {
        const newRecipe = new RegularRecipe({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            recipeYield: req.body.recipeYield,
            cookTime: req.body.cookTime,
            prepTime: req.body.prepTime,
            ingredients: req.body.ingredients,
        });

        const existingRecipe = await RegularRecipe.findOne({ name: req.body.name });
        if(existingRecipe) {
            return res.status(400).send('A recipe with this name already exists.');
        }

        await newRecipe.save();
        return res.status(201).send(newRecipe);
    } catch (err) {
        logger.warn(err);
        return res.status(500).send(err);
    }
});

//Gets all regular recipe data
router.get('/recipe/getAllRecipes', async (req, res) => {
    try {
        const recipes = await RegularRecipe.find();
        res.status(200).json(recipes);
    } catch(err) {
        logger.warn('Failed to retrieve the Course List: ' + err);
        res.status(500).send(err);
    }
});

router.post('/recipe/addUserRecipe', async (req, res) => {
    try {
        const existingRecipe = await RegularRecipe.findOne({ name: req.body.name });
        if(existingRecipe) {
            return res.status(400).send('A recipe with this name already exists.');
        }

        const newRecipe = new UserRecipe({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            recipeYield: req.body.recipeYield,
            cookTime: req.body.cookTime,
            prepTime: req.body.prepTime,
            ingredients: req.body.ingredients,
        });

        await newRecipe.save();
        return res.status(201).send(newRecipe);
    } catch (err) {
        logger.error(err);
        return res.status(500).send(err);
    }
});

//Gets user recipe data
router.get('/recipe/getAllUserRecipe', async (req, res) => {
    try {
        const recipes = await UserRecipe.find();
        res.status(200).json(recipes);
    } catch(err) {
        logger.warn('Failed to retrieve the Course List: ' + err);
        res.status(500).send(err);
    }
});

module.exports = router;