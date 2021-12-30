/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

// Root endpoint: https://api.tvmaze.com/search/
// Search: /search/shows?q=:query
// Episodes: /shows/:id/episodes

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv"

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`, )

  let shows = res.data.map(result => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    }
  })
  return shows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image}">
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);
// fix image ^^ to show only if there's an image available. 
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const res2 = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

     let episodes = res2.data.map(episode => ({
       id: episode.id,
       name: episode.name, 
       season: episode.season,
       number: episode.number,
     }))
     return episodes;
  }
  // TODO: return array-of-episode-info, as described in docstring above

function populateEpisode(episodes) {
  const $episodeList = $("#episodes-list");
  $episodeList.empty();

  for (let episode of episodes) {
    let $item =$(
      `<li> ${episode.name} (season ${episode.season}, episode ${episode.number})
      </li>`
    )
    $episodeList.append($item)
  }
  $("episodes-area").show();
}

$("#shows-list").on("click", ".get-episodes", async function handleClick(evt){
  let showId = $(evt.target).closest(".show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisode(episodes)
})