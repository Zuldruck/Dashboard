import React, { Component } from 'react'
import CocktailsByIngredient from './Cocktails/CocktailsByIngredient'
import CocktailsByGlass from './Cocktails/CocktailsByGlass'
import TeamsRanking from './Football/TeamsRanking'
import LiveScore from './Football/LiveScore'
import VeloMaggAvailability from './Open Data/VeloMaggAvailability'
import ParkingAvailability from './Open Data/ParkingAvailability'
import PopularRepo from './Github/PopularRepo'
import GithubProfile from './Github/GithubProfile'
import SpotifyPlayer from './Spotify/SpotifyPlayer'
import EpitechRanking from './Intra Epitech/EpitechRanking'
import EpitechBinomes from './Intra Epitech/EpitechBinomes'
import EpitechModules from './Intra Epitech/EpitechModules'
import DeezerPlayer from "./Deezer/DeezerPlayer"

export class ComponentWrapper extends Component {

    shouldComponentUpdate = (nextProps) => {
        return nextProps.settings !== this.props.settings
    }

    render() {
        return (
            <div style={{
                height: '100%',
            }}>
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

                    this.props.type === 'Github Profile' ?
                    <GithubProfile style={this.props.style} {...this.props.settings}/> :

                    this.props.type === 'Spotify Player' ?
                    <SpotifyPlayer style={this.props.style} {...this.props.settings}/> :

                    this.props.type === 'GPA Ranking' ?
                    <EpitechRanking style={this.props.style} {...this.props.settings}/> :

                    this.props.type === "User's Top Binomes" ?
                    <EpitechBinomes style={this.props.style} {...this.props.settings}/> :

                    this.props.type === "User's Year Modules" ?
                    <EpitechModules style={this.props.style} {...this.props.settings}/> :

                    this.props.type === 'Deezer Player' ?
                    <DeezerPlayer style={this.props.style} {...this.props.settings}/> :
                    
                    ''
                }
            </div>
        )
    }
}

export default ComponentWrapper
