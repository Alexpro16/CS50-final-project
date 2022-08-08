const API_KEY = 'api_key=8145168dac92c17486a6c3a122558649';
const BASE_URL = 'https://api.themoviedb.org/3';
const PERSONIMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/person?'+API_KEY;
const person_URL = BASE_URL + '/person/popular?'+API_KEY + '&pages=500';

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

const back_to_top = document.getElementById('back-to-top');
back_to_top.addEventListener('click', () => {
  form.scrollIntoView({behavior : 'smooth'})
})

getPerson(person_URL);

function getPerson(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(person_data => {
        console.log(person_data.results)
        if(person_data.results.length !== 0){
            showPerson(person_data.results);
            currentPage = person_data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = person_data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else if(currentPage == 1){
                prev.classList.add('disabled');
                next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }

            form.scrollIntoView({behavior : 'smooth'})

        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }

    })

}

function showPerson(person_data) {
  main.innerHTML = '';

  person_data.forEach(person => {
      const {name, popularity, profile_path, id} = person;
      const personElement = document.createElement('div');
      personElement.classList.add('person');
      personElement.innerHTML = `
           <img src="${profile_path? PERSONIMG_URL+profile_path: "http://via.placeholder.com/1080x1580" }" alt="${name}">

          <div class="person-info">
              <h3 id="${person.id}">${name}</h3>
              <span class="${person_getColor(popularity)}">${popularity}</span>
          </div>

      `

      main.appendChild(personElement);

      document.getElementById(person.id).addEventListener('click', () => {
        console.log(person.id)
        openNav(person)
  })
})
}

const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/person/'+id+'?'+API_KEY).then(res => res.json()).then(actorData => {
    console.log(actorData);
    if(actorData){
      document.getElementById("myNav").style.width = "100%";
      var content = `
      <h1 class="no-results">${actorData.name}</h1>
      <div class="container">
          <div id="con_1">
              <ul id="film-info">
                  <li>Occupation: ${actorData.known_for_department}</li>
                  <li>Birth Date: ${actorData.birthday}</li>
                  <li>Bircdthplace: ${actorData.place_of_birth}</li>
                  <li>Popularity: ${actorData.popularity}</li>
                  <li>Homepage: ${actorData.homepage}</li>
                  <li></li>
              </ul>
          </div>
          <div id="con_2"></div>
          <div id="con_3">
              <img src="${actorData.profile_path? PERSONIMG_URL+actorData.profile_path: "http://via.placeholder.com/1080x1580" }" alt="${actorData.name}">
          </div>
      </div>
      <h1 class="no-results">Biography:</h1>
      <p id="bio">${actorData.biography}</p>

      `
      overlayContent.innerHTML = content;
      }else{
        overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
      }
    })
  }

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');

  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')

    }else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show')
    }
  })

  dots.forEach((dot, indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active')
    }
  })
}

function person_getColor(popularity) {
  if(popularity>= 240){
      return 'green'
  }else if(popularity >= 180){
      return "lime"
  }else if(popularity >= 120){
    return "yellow"
  }else if(popularity >= 60){
    return "orange"
  }else{
      return 'red'
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  if(searchTerm) {
      getPerson(searchURL+'&query='+searchTerm)
  }else{
    getPerson(person_URL);
  }

})

prev.addEventListener('click', () => {
if(prevPage > 0){
  person_pageCall(prevPage);
}
})

next.addEventListener('click', () => {
if(nextPage <= totalPages){
  person_pageCall(nextPage);
}
})

function person_pageCall(page){
let urlSplit = lastUrl.split('?');
let queryParams = urlSplit[1].split('&');
let key = queryParams[queryParams.length -1].split('=');
if(key[0] != 'page'){
  let url = lastUrl + '&page='+page
  getPerson(url);
}else{
  key[1] = page.toString();
  let a = key.join('=');
  queryParams[queryParams.length -1] = a;
  let b = queryParams.join('&');
  let url = urlSplit[0] +'?'+ b
  getPerson(url);
}
}