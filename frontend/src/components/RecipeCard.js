import { MdOutlineFavorite, MdFavoriteBorder } from 'react-icons/md';
import { GrView } from 'react-icons/gr';
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

//style
import '../css/recipeCard.css';

//Given example: PT30M, PT1H, PT1H30M
function convertTime(rawData) {
    //Remove PT first
    let hours_taken = false;
    let hour = "00";
    let min = "00";
    let data = rawData.replace("PT", "");
    let str = "";
    //iterate Until 'H' and 'M'
    for (let i = 0; i < data.length; i++) {
        if (data[i] === 'H' && !hours_taken) {
            if (str.length === 1) {
                hour = "0" + str;
                str = "";
            } else if (str.length === 2) {
                hour = str;
                str = "";
            }
            hours_taken = true;
            continue;
        }

        if (data[i] === 'M') {
            if (str.length === 1) {
                min = "0" + str;
            } else if (str.length === 2) {
                min = str;
            }
        }
        str += data[i];
    }
    return "" + hour + ":" + min;
}

export function refineData(cardData) {
    let recipe_name = cardData.name.replace("&amp;", "&")
        .replace("&gt;", ">")
        .replace("&lt;", "<")
        .replace("&quot;", '"');

    let cook_time = "N/A", prep_time = "N/A", recipe_yield = "N/A";

    if (cardData.cookTime !== "") {
        cook_time = convertTime(cardData.cookTime);
    }

    if (cardData.prepTime !== "") {
        prep_time = convertTime(cardData.prepTime);
    }

    if (cardData.recipeYield !== "") {
        recipe_yield = cardData.recipeYield;
    }
    return {
        recipe_name: recipe_name,
        cook_time: cook_time,
        prep_time : prep_time,
        recipe_yield: recipe_yield};
}

//initial fav icon load
export function identifyFavIcon(recipeName, favorite_list) {
    if (recipeName in favorite_list) {
        return <MdOutlineFavorite/>;
    } else { //if not in favorite list
        return <MdFavoriteBorder/>;
    }
}

//initial fav state load
export function identifyFavSate(recipeName, favorite_list) {
    if (recipeName in favorite_list) {
        return ("Remove from favorite");
    } else { //if not in favorite list
        return ("Add to favorite");
    }
}

function RecipeCard(props) {
    //set navigation
    let cardData = props.recipe;
    let refinedData = refineData(cardData);
    let userFavorite = props.userData.favorite_list;

    const [icon, setIcon] = useState(identifyFavIcon(cardData.name, userFavorite));
    const [state, setState] = useState(identifyFavSate(cardData.name, userFavorite));

    //On input change, rerender state
    useEffect(() => {
        setIcon(identifyFavIcon(cardData.name, userFavorite));
        setState(identifyFavSate(cardData.name, userFavorite));
    },[props.recipeList, props.userData.favorite_list]);

    let navigate = useNavigate();

    //Switch view on clicking detailed view button
    function onViewClickHandler(e) {
        e.preventDefault();
        props.setSelectedRecipe(cardData);
        navigate('/viewRecipe', {userData : props.userData,
                                 recipe : props.recipe});
    }

    //change icon and statement on fav button click
    function onFavClickHandler(e) {
        e.preventDefault();
        //if in favorite list
        if (cardData.name in userFavorite) {
            delete userFavorite[cardData.name];
            setIcon(<MdFavoriteBorder/>);
            setState("Add to favorite");
        } else { //if not in favorite list
            userFavorite[cardData.name] = cardData;
            setIcon(<MdOutlineFavorite/>);
            setState("Remove from favorite");
        }
    }

    return (
        <article className="recipe_card">
            <img className="recipe_img"
                 src={cardData.image}
                 onError={(e)=>{e.target.onerror = null; e.target.src='./defaultFood.png'}}>

            </img>
            <h1 className="recipe_name">
                {refinedData.recipe_name}
            </h1>
            <div className="card_summary">
                <div className="summary_line">
                    <p className="summary_cat">
                        Cook Time:&nbsp;
                    </p>
                    <p>
                        {refinedData.cook_time}
                    </p>
                </div>
                <div className="summary_line">
                    <p className="summary_cat">
                        Prep Time:&nbsp;
                    </p>
                    <p>
                        {refinedData.prep_time}
                    </p>
                </div>
                <div className="summary_line">
                    <p className="summary_cat">
                        Yield:&nbsp;
                    </p>
                    <p>
                        {refinedData.recipe_yield}
                    </p>
                </div>
            </div>
            <div className="button_section">
                <button type="button" className="view_detail" name="view_detail"
                        onClick={onViewClickHandler}>
                    <GrView/> View Recipe
                </button>
                <button type="button"  className="add_favorite" name="add_favorite"
                        onClick={onFavClickHandler}>
                    {icon}
                    {state}
                </button>
            </div>
        </article>
    )
}

export default RecipeCard;
