//https://pixabay.com/api/?key=40435705-6f2aada23a4cf1fc16cb5f62b&q=yellow+flowers&image_type=photo
import axios from "axios";
import Notiflix from 'notiflix';

const form = document.querySelector(".search-form");
const input = document.querySelector("input");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".more");
const footer = document.querySelector("#footer");

const apiKey = "40435705-6f2aada23a4cf1fc16cb5f62b";
const apiUrl = "https://pixabay.com/api/";
var pageNumber = 1

form.addEventListener("submit", onSearch);
loadMore.addEventListener("click", onMore);

//Notiflix.Notify.success('Sol lucet omnibus');
async function onSearch(e) {
  pageNumber = 1;
  e.preventDefault(); // Не перезавантажувати сторінку після відправки форми
  gallery.innerHTML = "";
  updateUI();  
}
async function onMore(event) {
  pageNumber += 1;
  updateUI();
}

async function updateUI() {
  const url = `${apiUrl}?key=${apiKey}&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`;
  try {
    const response = await axios.get(url);
    // .then(function (response) {
    //   // handle success
    //     console.log(response);
    //     gallery.innerHTML ="qwerty";
    // })
    // .catch(function (error) {
    //   // handle error
    //   console.log(error);
    // })
    // .finally(function () {
    //   // always executed
    // });    
    gallery.insertAdjacentHTML("beforeend", generateHtml(response.data));

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    if (response.data.hits.length < 40) {
      if (response.data.hits.length > 0) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }
      footer.classList.add('hidden');
    }
    else {
      footer.classList.remove('hidden');
      if (pageNumber === 1) {
        console.log(response.data);
        Notiflix.Notify.success(`Hooray! We found ${response.data.total} images.`);
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}  

function generateHtml(data) {
  let html = "";
  data.hits.forEach(element => {
    html += `<div class="photo-card">
  <img src="${element.previewURL}" alt="${element.tags}" width=282 height=200 loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${element.likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${element.views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${element.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${element.downloads}
    </p>
  </div>
</div>`
  });
  return html;
}
