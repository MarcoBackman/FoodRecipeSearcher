import React, {useState} from 'react';

//style
import '../css/Navigation.css';
import {getAllRecipes} from "../service/RecipeService";

const {postRecipe} = require("../service/RecipeService")

//contains GroceryList and Users
function Navigation(props){
    let groceryList = props.user.grocery_list;
    let favoriteList = props.user.favorite_list;
    let selectedUser = props.user.name;
    let setRecipeCount = props.setRecipeCount;
    let setRecipeData = props.setRecipeData;

    const[dropDownGroList, setGroList] = useState([]);
    const[dropDownFavList, setFavList] = useState([]);
    const[dbText, dbPostStatus] = useState("Populate to DB");

    function displayAddPanel() {
        const recipe_add_overlay = document.querySelector('#add_recipe_frame');
        recipe_add_overlay.style.display = 'block';

        //disable scrolls
        const webBody = document.querySelector('body');
        webBody.style.overflow = "hidden";
    }

    function refreshGrocery(e) {
        let list = [];
        for (let i = 0; i <groceryList.length; i++) {
            list.push(groceryList[i]);
        }
        setGroList(list);
    }

    function refreshFavorite(e) {
        let list = [];

        for (const [, value] of Object.entries(favoriteList)) {
            list.push(value.name);
        }
        setFavList(list);
    }

    //Remove on select
    function onGrocerySelect(e) {
        const select = document.querySelector('#grocery_btn');
        let selectedItem = select.value;
        let index = groceryList.indexOf(selectedItem);
        if (index !== -1) {
            console.log("Deleted");
            groceryList.splice(index, 1);
        }
        select.value = "DEFAULT";
    }

    function onFavSelect(e) {
        const select = document.querySelector('#favorite_btn');
        let selectedRecipe = select.value;
        if(selectedRecipe in favoriteList) {
            delete favoriteList[selectedRecipe];
        }
        select.value = "DEFAULT";
    }

    //Post single request to DB
    async function handlePost(singleRecipe) {
        await postRecipe(singleRecipe)
            .then((res) => {
                console.log("Added recipe to DB: ", res);
                return true;
            })
            .catch(err => {
                console.warn(err);
                return false;
            });
    }

    //Fetch local json file
    async function onClickPopulateDB() {
        dbPostStatus("Populating...");
        let response = await fetch("/recipes.json")
            .then((res) => res.json())
            .catch(err => {
                // Handle Error Here
                dbPostStatus("DB post error.");
                alert("Error while posting request");
                console.error(err);
                return false;
            });

        if (response !== false) {
            let count = 0;
            let promises = [];
            response.map((singleRecipe) => {
                if (count < 782 ){
                    promises.push(handlePost(singleRecipe));
                    ++count;
                }
            });

            // wait for all promises to resolve/reject
            try {
                await Promise.all(promises);
                // All handlePost were successful
                dbPostStatus("DB post complete.");
            } catch (err) {
                // At least one handlePost failed
                dbPostStatus("DB post error.");
                console.error(err);
            }
        }

        response = await getAllRecipes();
        if (response) {
            setRecipeCount(response.data.length);
            setRecipeData(response.data);
        }
    }

    //Prevent default submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        await onClickPopulateDB();
    }

    return (
        <nav className="nav_bar">
            <form id="populate_db_form" action="/api/populate_db"  method="post"/>
            <button id="populate_btn" className="nav_button" type="submit"
                    form="populate_db_form" value="Submit" onClick={handleSubmit}>
                {dbText}
            </button>
            <button id="add_recipe_btn" className="nav_button" onClick={displayAddPanel}>
                Add Recipe
            </button>
            <select id="grocery_btn" className="nav_button" defaultValue={'DEFAULT'} onClick={refreshGrocery}
                    onChange={onGrocerySelect}>
                <option value='DEFAULT' hidden>Grocery List</option>
                {dropDownGroList.map(item => {
                    return <option className="gro_options" value={item}>{item}</option>
                })}
            </select>
            <select id='favorite_btn' className="nav_button" defaultValue={'DEFAULT'} onClick={refreshFavorite} onChange={onFavSelect}>
                <option value='DEFAULT' hidden>Favorite List</option>
                {dropDownFavList.map(item => {
                    return <option className="fav_options" key={item} value={item}>{item}</option>
                })}
            </select>
            <p id="user_welcome">Welcome, {selectedUser}</p>
        </nav>
    )
}

export default Navigation;
