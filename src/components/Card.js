import React from "react";
import "./Card.scss";

const Card = (props) => {
  return (
    <div className="card">
      <div className="top">
        <h2 className="name">{props.mealName}</h2>
        <img src={props.mealImg} alt={props.mealName} />
      </div>
      <div className="bottom">
        <p>{props.mealInstructions}</p>
        <ul className="recipeList">
          {props.mealIngredients?.map((item, index) => (
            <li key={index} className="ingredient">
              {item.name}
              {item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Card;
