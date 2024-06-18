import React, {useState} from "react";
import {MdFavoriteBorder, MdOutlineFavorite} from "react-icons/md";
import {AiOutlineCloseCircle} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import { refineData, identifyFavIcon, identifyFavSate } from "./RecipeCard";

//Style
import '../css/ViewRecipe.css';

//This is a functional component to view detailed recipe.
function ViewRecipe(props) {
    let cardData = props.recipe;
    let userGrocery = props.userData.grocery_list;
    let favoriteList = props.userData.favorite_list;
    let navigate = useNavigate();

    const [icon, setIcon] = useState(identifyFavIcon(cardData.name, favoriteList));
    const [state, setState] = useState(identifyFavSate(cardData.name, favoriteList));

    //change icon and statement on fav button click
    function onFavClickHandler(props) {
        //if in favorite list
        if (cardData.name in favoriteList) {
            delete favoriteList[cardData.name];
            setIcon(<MdFavoriteBorder/>);
            setState("Add to favorite");
        } else { //if not in favorite list
            favoriteList[cardData.name] = cardData;
            setIcon(<MdOutlineFavorite/>);
            setState("Remove from favorite");
        }
    }

    function addGrocery(ingredient) {
        userGrocery.push(ingredient);
    }

    function removeGrocery(ingredient) {
        let index = userGrocery.indexOf(ingredient);
        if (index !== -1) {
            userGrocery.splice(index, 1);
        }
    }

    function CreateIngredientList(ingredients) {
        const listItems = ingredients.map((ingredient) =>
            <li key={ingredient.toString()}>
                {ingredient}
                <button onClick={() => addGrocery(ingredient)}>+</button>
                <button onClick={() => removeGrocery(ingredient)}>-</button>
            </li>
        );
        return (<ul> {listItems} </ul>);
    }

    //Make cardData and refine Data as useState
    return (
        <article className="full_recipe_card">
            <AiOutlineCloseCircle className="closeBtn" onClick={(e) => {navigate(-1)}}/>
            <img className="full_recipe_img" src={cardData.image}/>
            <h1 className="full_recipe_name">
                {refineData(cardData).recipe_name} Recipe
            </h1>
            <div className="full_card_summary">
                <div className="full_summary_line">
                    <p className="full_summary_cat">
                        Cook Time:&nbsp;
                    </p>
                    <p>
                        {refineData(cardData).cook_time}
                    </p>
                </div>
                <div className="full_summary_line">
                    <p className="full_summary_cat">
                        Prep Time:&nbsp;
                    </p>
                    <p>
                        {refineData(cardData).prep_time}
                    </p>
                </div>
                <div className="full_summary_line">
                    <p className="full_summary_cat">
                        Yield:&nbsp;
                    </p>
                    <p>
                        {refineData(cardData).recipe_yield}
                    </p>
                </div>
            </div>
            <div className="description_section">
                <p>
                    {cardData.description}
                </p>
            </div>
            <div className="ingredients_section">
                <p>Ingredients</p>
                {CreateIngredientList(cardData.ingredients)}
            </div>
            <div className="button_section">
                <button type="button"  className="add_favorite" name="add_favorite"
                        onClick={() => onFavClickHandler({props})}>
                    {icon}
                    {state}
                </button>
            </div>
        </article>
    );
}

export default ViewRecipe;