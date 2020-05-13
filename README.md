# Dashboard
Dashboard is a web app which allow the users to connect to several services and create widgets linked to them.

## Summary

 - [How to implement a service ?](#service)
 - [How to implement a widget ?](#widget)
 - [Available Services](#services)
 - [Available Widgets](#widgets)
 - [Documentation](#documentation)

## <a name="service"></a>How to implement a service ?

### Add the service icon to the public directory

> Ex : public/spotify.svg

### Add your service to the available services

Components/ServiceCard.js :

```js
const  types  = [{
		type:  'spotify',
		color:  '#1DB954',
		title:  'Spotify',
		icon:  'spotify.svg',
	},{
		type:  'deezer',
		color:  '#191919',
		title:  'Deezer',
		icon:  'spotify.svg',
	}, {
		type:  'epitech',
		color:  '#0F6AB3',
		title:  'Intranet Epitech',
		icon:  'epitech.svg'
	}
]
```

## <a name="widget"></a>How to implement a widget ?

### Add it to the widget config

components/widgets/widgetConfig.js:

```js
const config = [
	{
		name:  "Cocktails List By Ingredient",
		service:  'cocktail',
		heightGridSize:  8,
		widthGridSize:  4,
		color:  '#FF8C00',
		component:  <CocktailsByIngredient/>,
		settings:  <CocktailsByIngredientSettings/>,
	},
	{
		name:  "Teams Ranking By League",
		service:  'football',
		heightGridSize:  8,
		widthGridSize:  8,
		color:  '#608038',
		component:  <TeamsRanking  />,
		settings:  <TeamsRankingSettings/>,
	}
]
```
 > Don't forget to create the widget component

## <a name="services"></a>Available Services: (7)

- Github
- Intranet Epitech
- Spotify
- Cocktail
- Football
- Open Data Montpellier
- Deezer

## <a name="widgets"></a>Available Widgets: (13)

- Popular repo by languages (Github)
- Card of your followers ot track them (Github)
- Ranking by city (Intra)
- Your Grade by modules (Intra)
- Your favorites collaborators (Intra)
- Player by user playlist (Spotify)
- Player by user playlist (Deezer)
- Cocktails by an ingredient chosen (Cocktail)
- Cocktails by a specific glasses (Cocktail)
- Ranking by league (Football)
- Live matches & score (Football)
- VeloMagg availability (Open data Mpl)
- Car Parking availability (Open Data Mpl)

## <a name="documentation"></a>Documentation: (POSTMAN)

https://documenter.getpostman.com/view/6531176/SW18wuro?version=latest%
