import React, { Component } from 'react'
import CocktailsByIngredient from './Cocktails/CocktailsByIngredient'
import CocktailsByGlass from './Cocktails/CocktailsByGlass'

export class ComponentWrapper extends Component {
    render() {
        return (
            <div>
                {
                    this.props.type === 'Cocktails List By Ingredient' ?
                    <CocktailsByIngredient style={this.props.style} {...this.props.settings}/> :

                    this.props.type === 'Cocktails List By Glass' ?
                    <CocktailsByGlass style={this.props.style} {...this.props.settings}/> :
                    
                    ''
                }
            </div>
        )
    }
}

export default ComponentWrapper
