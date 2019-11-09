import React, { Component } from 'react'
import CocktailsByIngredient from './Cocktails/CocktailsByIngredient'
import CocktailsByGlass from './Cocktails/CocktailsByGlass'
import TeamsRanking from './Football/TeamsRanking'
import LiveScore from './Football/LiveScore'

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
                    
                    ''
                }
            </div>
        )
    }
}

export default ComponentWrapper
