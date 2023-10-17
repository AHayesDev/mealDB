import React, { useState } from "react";
import "./App.scss";
import Card from "./components/Card";

const App = () => {
  const [main, setMain] = useState("");
  const [amount, setAmount] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const setMainIngredient = (event) => {
    event.preventDefault();
    if (ingredients.length === 0) {
      fetch(`https://themealdb.com/api/json/v1/1/filter.php?i=${main}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data) {
            setDishes(data);
            const newItems = { main, amount };
            setIngredients([newItems]);
          }
          setMain("");
          setAmount("");
        });
    } else {
      const found = ingredients.some(
        (ing) => ing.main.toUpperCase() === main.toUpperCase()
      );
      if (!found) {
        const newItems = { main, amount };
        setIngredients([...ingredients, newItems]);
        setMain("");
        setAmount("");
      }
    }
  };

  const fetchDishData = async () => {
    let urllist = [];
    for (let i = 0; i < dishes?.meals?.length; i++) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dishes.meals[i].idMeal}`
      );
      const json = await response.json();

      const tempRows = [];
      let canAdd = true;

      if (json)
        for (let i = 1; i < 20; i++) {
          if (
            `${json.meals[0][`strIngredient${i}`]}` &&
            `${json.meals[0][`strIngredient${i}`]}`
          ) {
            if (
              ingredients.some(
                (ing) =>
                  ing.main.toUpperCase() ===
                    `${json.meals[0][`strIngredient${i}`]}`.toUpperCase() &&
                  ing.amount.toUpperCase() ===
                    `${json.meals[0][`strMeasure${i}`]}`.toUpperCase()
              )
            ) {
              `${json.meals[0][`strIngredient${i}`]}` &&
                tempRows.push({
                  id: i,
                  name: `${json.meals[0][`strIngredient${i}`]}`,
                  value: `${json.meals[0][`strMeasure${i}`]}`,
                });
            } else {
              console.log(
                `${json.meals[0][`strIngredient${i}`]}`.toUpperCase()
              );
              canAdd = false;
              break;
            }
          }
        }

      json.ingredients = tempRows;
      console.log(json);
      if (canAdd) {
        urllist = [...urllist, json];
        setRecipes(urllist);
      }
    }
    console.log(recipes);
  };

  const clearIngredients = () => {
    setMain("");
    setIngredients([]);
    setDishes([]);
    setRecipes([]);
  };

  return (
    <div>
      <h1>Main Ingredient</h1>
      <form onSubmit={setMainIngredient}>
        <input
          type="text"
          value={main}
          placeholder="Ingredient"
          onChange={(e) => setMain(e.target.value)}
        />
        <input
          type="text"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add main ingredient</button>
      </form>
      <button onClick={clearIngredients}>Clear Ingredients</button>

      {ingredients.length > 0 && (
        <ul className="recipeList">
          {ingredients?.map((item, index) => (
            <li key={index} className="ingredient">
              {item.main}: {item.amount}
            </li>
          ))}
        </ul>
      )}

      <button type="submit" onClick={fetchDishData}>
        Find Recipes
      </button>

      <ul>
        {recipes?.map((item, index) => (
          <li key={index}>
            <Card
              mealName={item.meals[0].strMeal}
              mealImg={item.meals[0].strMealThumb}
              mealInstructions={item.meals[0].strInstructions}
              mealIngredients={item.ingredients}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
