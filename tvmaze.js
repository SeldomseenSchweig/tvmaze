"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 *  'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/TheRoomMovie.jpg/220px-TheRoomMovie.jpg'
 */

async function getShowsByTerm(term) {
  

  // ADD: Remove placeholder & make request to TVMaze search shows API.
  
   const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
   const shows = res.data;
   const groupOfShows = []; /// Makes an empty array to hold the shows

   
   ///// Iterates through the shows and makes each group into an object
   for (let show of shows) 
      try{
        {
          
      groupOfShows.push(
        {
          id : show.show.id,
          name : show.show.name,
          summary : show.show.summary,
        image : show.show.image.medium
        }
      ) };
   } catch (error) {
     console.log( show.show.name + " has no image!")
     groupOfShows.push(
       {
        id : show.show.id,
        name : show.show.name,
        summary : show.show.summary,
        image: 'https://tinyurl.com/tv-missing'
       }    
     )
   } 
   console.log(groupOfShows)
  return groupOfShows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    // console.log(show.name)
    
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}"
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class=" btn-sm getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show); 
   }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  
  const shows = await getShowsByTerm(term);
  //console.log(shows);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
  
});
//I don't understand this
$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */


 async function getEpisodesOfShow(id) { 
   
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = res.data;
  
  const groupOfEpisodes = [];

  //Same code as the first function put episodes into a object
  
  for (let episode of episodes) 
       {
         
     groupOfEpisodes.push(
       {
         id : episode.id,
         name : episode.name,
         season : episode.season,
       number : episode.number
       }
     ) };
 
  console.log(groupOfEpisodes)
 return groupOfEpisodes;
}





// makes li and attach them to area
 function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
   for (let episode of episodes) { let $item = 
     $(`<li> ${episode.name} ( Season ${episode.season} Number ${episode.number}) </li>`);
     $episodesList.append($item);
     
   } 
   $("#episodes-area").show();
 }
