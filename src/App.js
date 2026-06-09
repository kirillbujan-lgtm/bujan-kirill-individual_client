import { useState } from 'react'
import { gql} from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import './App.css'


var GET_MOVIES 
var body	
var data_rule


function App() {
	const [count, setCount] = useState(0)
	const [movie_name, setMovie] = useState("Боевик")
	const [name, setName] = useState("Боевик")
	const [movie_year, setMovieYear] = useState(2008)
	const [year, setYear] = useState(2008)
	
	if (count == 0 || count == 3){
		GET_MOVIES = gql`
	query {
		movies{
			id,
			name,
			genres,
			year,
			actors,
			grade,
			description,
			url_muvie,
			url_poster
		}
	}
`
	
	}
	else if (count == 1){
		GET_MOVIES = gql`
	query {
		movies: moviesByYear(year: ${movie_year}){
			id,
			name,
			genres,
			year,
			actors,
			grade,
			description,
			url_muvie,
			url_poster
		}
	}
	`

	}
		
	else if (count == 2){
		 GET_MOVIES = gql`
	query MoviesByGenre($genre: String!){
		movies: moviesByGenre(genre: $genre){
				id,
				name,
				genres,
				year,
				actors,
				grade,
				description,
				url_muvie,
				url_poster
			}
		}
	`	
	
	}
	

	const {loading, error, data} = useQuery(GET_MOVIES,{variables: { genre: movie_name }})
	if(loading) return <p>Загрузка</p>
	if(error) return <p>Ошибка: {error.message}</p>
	


	function genre_log(g,m){
		if(g != m[0]){ 
			return (<a> , "{g}"</a>)} 
		else{
			return (<a>"{g}"</a>)}
	}
	
	function Full_screen(divId){
		document.getElementById(divId).setAttribute('class',"full_screen")
		document.getElementById("body_container").setAttribute('style',"display: none")
		document.getElementById("for_full_muvie").appendChild(document.getElementById(divId));
		document.getElementById("for_full_muvie").setAttribute('style',"display: block")
	}
	

	
	if(count==3){
		if(document.getElementsByClassName("full_screen").length!=0){
		document.getElementById("body_container").setAttribute('style',"display: block")
		document.getElementById("body_container").appendChild(document.getElementsByClassName("full_screen")[0]);
		document.getElementsByClassName("full_screen")[0].setAttribute('class',"standart")
		document.getElementById("for_full_muvie").setAttribute('style',"display: none")}
		
		data_rule=data.movies.filter((d) => d.name.includes(movie_name))
	}
	else {data_rule=data.movies}
	
		
	body = (data_rule.map((movie) => (
				<div key={movie.id} id={movie.id} className="standart">
					<form className="info_muvie">
					<img src={movie.url_poster}/>
					<h2>{movie.name} ({movie.year})</h2>
					<p>Актори: {movie.actors.map((g)=>(
						genre_log(g,movie.actors)	
					))}</p>
					<p>Жанр: {movie.genres.map((g)=>(
						genre_log(g,movie.genres)	
					))}</p>
					<p>Опис: {movie.description}</p>
					<p>Оцінка: {movie.grade}</p>
					</form>
					<button className="button" onClick={()=>Full_screen(movie.id)}>Дивитись</button>
					<iframe src={movie.url_muvie} title="YouTube video player" />
				</div>
			)))
	
	
	
	return(
	
	<div >
		<div id="search_engine">
			<button id="findall"className="button" onClick={() => {setCount(0)
																	document.location.reload()}}>Усі</button>
			<form id="forfind">
			<input type="text"  value={name} onChange={(e) => {e.preventDefault()
																setName(e.target.value)}} id="main_input"></input>
			<button className="button" onClick={() => {setCount(2)
									setMovie(name)}}>За жанром</button>
			<button className="button" onClick={(e) => {setCount(3) 
									e.preventDefault()
									setMovie(name)}}>За назвою</button>		
			</form>
			
			<form id="foryear">
			<input type="number" value={year} onChange={(e) => {e.preventDefault()
																setYear(e.target.value)}} min="0" max="2026" id="input_year"></input>
			<button className="button" onClick={() => {setCount(1)
									setMovieYear(year)}}>За роком</button>
			</form>
			
		</div>					
		<div id="body_container">
		{body}
		</div>
		<div id="for_full_muvie" style={{display: "none"}}>
		</div>
	</div>
			
	)
}

export default App
