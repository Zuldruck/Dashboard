import React from 'react'
import CocktailsByGlass from './Cocktails/CocktailsByGlass'
import CocktailsByIngredient from './Cocktails/CocktailsByIngredient'
import CocktailsByGlassSettings from './Cocktails/CocktailsByGlassSettings'
import CocktailsByIngredientSettings from './Cocktails/CocktailsByIngredientSettings'
import TeamsRanking from './Football/TeamsRanking'
import TeamsRankingSettings from './Football/TeamsRankingSettings'
import LiveScore from './Football/LiveScore'
import LiveScoreSettings from './Football/LiveScoreSettings'
import VeloMaggAvailability from './Open Data/VeloMaggAvailability'
import VeloMaggAvailabilitySettings from './Open Data/VeloMaggAvailabilitySettings'
import ParkingAvailability from './Open Data/ParkingAvailability'
import ParkingAvailabilitySettings from './Open Data/ParkingAvailabilitySettings'
import PopularRepo from './Github/PopularRepo'
import PopularRepoSettings from './Github/PopularRepoSettings'

const config = [
    {
        name: "Cocktails List By Ingredient",
        service: 'cocktail',
        heightGridSize: 8,
        widthGridSize: 4,        
        color: '#FF8C00',
        component: <CocktailsByIngredient/>,
        settings: <CocktailsByIngredientSettings/>,
    },
    {
        name: "Cocktails List By Glass",
        service: 'cocktail',
        heightGridSize: 8,
        widthGridSize: 4,        
        color: '#FF8C00',
        component: <CocktailsByGlass/>,
        settings: <CocktailsByGlassSettings/>,
    },
    {
        name: "Teams Ranking By League",
        service: 'football',
        heightGridSize: 8,
        widthGridSize: 8,        
        color: '#608038',
        component: <TeamsRanking />,
        settings: <TeamsRankingSettings/>,
    },
    {
        name: "Live Scores By League",
        service: 'football',
        heightGridSize: 6,
        widthGridSize: 4,        
        color: '#608038',
        component: <LiveScore />,
        settings: <LiveScoreSettings />,
    },
    {
        name: "Velo Magg Parks Availability",
        service: 'open_data',
        heightGridSize: 3,
        widthGridSize: 3,        
        color: '#73468D',
        component: <VeloMaggAvailability />,
        settings: <VeloMaggAvailabilitySettings />,
    },
    {
        name: "Parking Availability",
        service: 'open_data',
        heightGridSize: 3,
        widthGridSize: 3,        
        color: '#73468D',
        component: <ParkingAvailability />,
        settings: <ParkingAvailabilitySettings />,
    },
    {
        name: "Most Popular Repositories",
        service: 'github',
        heightGridSize: 8,
        widthGridSize: 4,        
        color: '#24292E',
        component: <PopularRepo />,
        settings: <PopularRepoSettings />,
    }
]

export default config