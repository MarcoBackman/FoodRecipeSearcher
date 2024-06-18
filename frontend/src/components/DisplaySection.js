import RecipeCard from "./RecipeCard";

//style
import '../css/DisplaySection.css';

//Display for search results
function DisplaySection(props) {

    let listOfRecipe = [];

    //Only displays searched result
    for (let i = 0; i < props.recipeList.length; i++) {
        listOfRecipe.push(<RecipeCard key={i}
                                      recipeList={props.recipeList}
                                      recipe={props.recipeList[i]}
                                      userData={props.userData}
                                      setUserData={props.setUserData}
                                      setSelectedRecipe={props.setSelectedRecipe}/>);
    }

    return (
        <div>
            <section className="displaySection">
                {listOfRecipe}
            </section>
        </div>
    );
}

export default DisplaySection;
