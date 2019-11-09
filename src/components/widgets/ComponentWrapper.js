import React, { Component } from 'react'
import CocktailsByIngredient from './Cocktails/CocktailsByIngredient'
import CocktailsByGlass from './Cocktails/CocktailsByGlass'
import TeamsRanking from './Football/TeamsRanking'
import LiveScore from './Football/LiveScore'
import VeloMaggAvailability from './Open Data/VeloMaggAvailability'
import ParkingAvailability from './Open Data/ParkingAvailability'
import PopularRepo from './Github/PopularRepo'

export class ComponentWrapper extends Component {
    render() {
        return (
            <div>
                {
                    this.props.type === 'Cocktails List By Ingredient' ?
                    <CocktailsByIngredient style={this.props.style} {...this.props.settings}/> :

                    this.props.type === 'Cocktails List By Glass' ?
                    <CocktailsByGlass style={this.props.style} {...this.props.settings}/> :
                    
                    this.props.type === 'Teams Ranking By League' ?
                    <TeamsRanking style={this.props.style} {...this.props.settings}/> :

                    this.props.type === 'Live Scores By League' ?
                    <LiveScore style={this.props.style} {...this.props.settings}/> :

                    this.props.type === 'Velo Magg Parks Availability' ?
                    <VeloMaggAvailability style={this.props.style} {...this.props.settings}/> :

                    this.props.type === 'Parking Availability' ?
                    <ParkingAvailability style={this.props.style} {...this.props.settings}/> :

                    this.props.type === 'Most Popular Repositories' ?
                    <PopularRepo style={this.props.style} {...this.props.settings}/> :
                    
                    ''
                }
            </div>
        )
    }
}

export default ComponentWrapper
