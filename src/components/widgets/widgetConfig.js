import CocktailsByGlass from './Cocktails/CocktailsByGlass'
import CocktailsByIngredient from './Cocktails/CocktailsByIngredient'
import CocktailsByGlassSettings from './Cocktails/CocktailsByGlassSettings'
import CocktailsByIngredientSettings from './Cocktails/CocktailsByIngredientSettings'
import React from 'react'

const config = [
    {
        name: "Cocktails List By Ingredient",
        service: 'cocktail',
        heightGridSize: 6,
        color: '#FF8C00',
        component: <CocktailsByIngredient/>,
        settings: <CocktailsByIngredientSettings/>,
    },
    {
        name: "Cocktails List By Glass",
        service: 'cocktail',
        heightGridSize: 6,
        color: '#FF8C00',
        component: <CocktailsByGlass/>,
        settings: <CocktailsByGlassSettings/>,
    }
]

export default config