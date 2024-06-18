import React, {useEffect, useState} from 'react';

//Components
import Search from "./Search";
import UserContext from "./User";
import Navigation from "./Navigation";

//Styles
import '../css/App.css';

const {getAllUserRecipe, postRecipe, getAllRecipes} = require("../service/RecipeService");

function App() {
    const [saveStatus, setSaveStatus] = useState("Save Recipe");
    const [userRecipe, setUserRecipe] = useState("0");
    const [recipeCount, setRecipesCount] = useState("0");
    const [recipeData, setRecipeData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let userRecipeResponse = await getAllUserRecipe();
                setUserRecipe(userRecipeResponse.data.length);

                let allRecipesResponse = await getAllRecipes();
                if (Array.isArray(allRecipesResponse.data)) {
                    setRecipeData(allRecipesResponse.data);
                    setRecipesCount(allRecipesResponse.data.length);
                } else {
                    setRecipeData([]);
                }
            } catch (error) {
                setUserRecipe("Server Disconnected");
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log("Completed fetch from DB");
    }, [recipeData]);

    const [userData,setUserData] = useState({
        name : "Demo user",
        favorite_list : {},
        grocery_list : [],
        ingredient_list: {}
    });

    //Hide recipe add panel on button click
    function hideAddRecipeFrame() {
        const recipe_add_overlay = document.querySelector('#add_recipe_frame');
        recipe_add_overlay.style.display = 'none';
    }

    //On background(not panel) click, hide recipe add panel.
    function hideAddRecipePanelOnFrameClick(event) {
        //Ensures this event only works on background frame not panel.
        if (event.target === event.currentTarget) {
            const recipe_add_overlay = document.querySelector('#add_recipe_frame');
            recipe_add_overlay.style.display = 'none';
        }

        //disable scrolls
        const webBody = document.querySelector('body');
        webBody.style.overflow = "visible";
    }

    function createIngredientBlock(quantity, ingredient) {
        //Create quantity list
        let quantity_list = document.createElement('li');
        quantity_list.setAttribute("class", "quantity_list");
        quantity_list.textContent = quantity;

        //Create ingredient list
        let ingredient_list = document.createElement('li');
        ingredient_list.setAttribute("class", "ingredient_list");
        ingredient_list.textContent = ingredient;

        //Create remove btn
        let ingredient_rm_btn = document.createElement('button');
        ingredient_rm_btn.setAttribute("class", "ingredient_remove_btn");
        ingredient_rm_btn.setAttribute("type", "button");
        ingredient_rm_btn.setAttribute("onclick", "event.target.parentElement.remove()");

        //Create ingredient block
        let ingredient_block = document.createElement('div');
        ingredient_block.setAttribute("class", "ingredient_block");
        ingredient_block.appendChild(quantity_list);
        ingredient_block.appendChild(ingredient_list);
        ingredient_block.appendChild(ingredient_rm_btn);

        return ingredient_block;
    }

    /**
     * This does not save data to the db
     */
    function onAddIngredientEvent() {
        let quantity = document.querySelector("#ingredient_quantity_input").value;
        let ingredient = document.querySelector("#ingredient_list_input").value;
        const list = createIngredientBlock(quantity, ingredient);

        if (quantity !== "" && ingredient !== "") {
            const ul_list = document.querySelector("#ingredient_ul_list");
            ul_list.appendChild(list);
        } else {
            alert("Enter value.");
        }
    }

    function getRecipeJsonForm() {
        let name_input = document.querySelector("#recipe_name_input").value;
        let description_input = document.querySelector("#recipe_description_input").value;
        let ingredients = []

        //List of attributes
        let quantity_inputs = document.querySelectorAll(".quantity_list");
        let ingredient_inputs = document.querySelectorAll(".ingredient_list");

        for (let i = 0; i < quantity_inputs.length; i++) {
            let description = "" + quantity_inputs[i].textContent+ " " + ingredient_inputs[i].textContent;
            ingredients.push(description);
        }

        return {
            'name': name_input,
            'description': description_input,
            'image': "",
            'recipeYield': "",
            'cookTime': "",
            'prepTime': "",
            'ingredients': ingredients
        };
    }

    function emptyInputFields() {
        let name_input = document.querySelector("#recipe_name_input");
        let description_input = document.querySelector("#recipe_description_input");
        let quantity_input = document.querySelector("#ingredient_quantity_input");
        let ingredient_input = document.querySelector("#ingredient_list_input");
        let ingredient_list = document.querySelector("#ingredient_ul_list");
        name_input.value = "";
        description_input.value = "";
        quantity_input.value = "";
        ingredient_input.value = "";
        let child = ingredient_list.lastElementChild;
        while (child) {
            ingredient_list.removeChild(child);
            child = ingredient_list.lastElementChild;
        }
    }

    //When user clicks add user recipe button
    async function onAddUserRecipeEvent(event) {
        event.preventDefault();
        if (saveStatus === "Processing...") {
            alert("Still processing");
            return;
        }
        setSaveStatus("Processing...");

        //Post new recipe to the server
        let newRecipe = getRecipeJsonForm();
        postRecipe(newRecipe).then(resp => {
            alert("Recipe added");
            emptyInputFields();
        }).catch(err => {
            console.error(err);
            alert("Failed Adding Recipe: Server Error");
        });

        //Reset to the default label
        setSaveStatus("Save Recipe");

        //Update all user recipe
        getAllUserRecipe().then(resp => {
            setUserRecipe(resp.data);
        }).catch(err => {
            setUserRecipe("Server Disconnected");
            console.error(err);
        });
    }

    const ingredientDatalist = () => {
        let options = document.querySelectorAll("#ingredient_list option");
        if (options.length !== 0) {
            return;
        }

        let ingredient_list_div = document.querySelector("#ingredient_list");
        for (const [key, ingredient] of Object.entries(userData.ingredient_list)) {
            const option = document.createElement("option");
            option.value = ingredient;
            option.class = "ingredient_option";
            ingredient_list_div.appendChild(option);
        }
    }

    return (
        <UserContext.Provider value={userData}>
            <div>
                <div id="db_read_section">
                    <p id="user_recipe_count_text">
                        Found <span style={{color:"#8ca8da"}}>{userRecipe}</span>
                        &nbsp; user recipe(s) in DB
                    </p>
                    <p id="user_recipe_count_text">
                        Found <span style={{color:"#8ca8da"}}>{recipeCount}</span>
                        &nbsp; recipe(s) from the server
                    </p>
                </div>
                <Navigation user={userData} setRecipeCount={setRecipesCount} setRecipeData={setRecipeData}/>
                <h1 id="main_title">Recipe Finder</h1>
                <div id="add_recipe_frame" onClick={hideAddRecipePanelOnFrameClick}>
                    <form id="add_recipe_form" action="/add_recipe"  method="post">
                        <div id="add_recipe_panel">
                            <div className="top_bar">
                                <h2 id="main_title">Add Recipe</h2>
                                <button type="button" id="close" onClick={hideAddRecipeFrame}/>
                            </div>
                            <div className="input_field">
                                <div className="top_input_section">
                                    <div className="block_section">
                                        <label className="input_label">
                                            Name
                                        </label>
                                        <input id="recipe_name_input" className="input_section"/>
                                    </div>
                                    <div className="block_section">
                                        <label className="input_label">
                                            Description
                                        </label>
                                        <input id="recipe_description_input" className="input_section"/>
                                    </div>
                                </div>
                                <div className="bottom_input_section">
                                    <div className="label_bar">
                                        <label className="quantity_title"> Quantity </label>
                                        <label className="ingredient_title"> Ingredient </label>
                                    </div>
                                    <div id="ingredient_section">
                                        <ul id="ingredient_ul_list">
                                        </ul>
                                    </div>
                                    <h2>Add Ingredient</h2>
                                    <div className="block_section">
                                        <label className="input_label">
                                            Quantity
                                        </label>
                                        <input id="ingredient_quantity_input" className="input_section"/>
                                    </div>
                                    <div className="block_section">
                                        <label className="input_label">
                                            Ingredient
                                        </label>
                                        <input id="ingredient_list_input" className="input_section"
                                               list="ingredient_list"
                                               onChange={ingredientDatalist}
                                               defaultValue=""/>
                                        <datalist id="ingredient_list">
                                        </datalist>
                                    </div>
                                    <button id="add_ingredient_btn" type="button" onClick={onAddIngredientEvent}>
                                        Add Ingredient
                                    </button>
                                </div>
                                <button id="save_recipe_btn" type="submit" form="add_recipe_form" onClick={onAddUserRecipeEvent}>
                                    {saveStatus}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <Search userData={userData} setUserData={setUserData} recipeData={recipeData}/>
            </div>
        </UserContext.Provider>
    );
}

export default App;
