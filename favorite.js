(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = JSON.parse(localStorage.getItem('favoriteMovies'))

  // template movies const
  const dataPanel = document.getElementById('data-panel')

  // template modal const
  const modalTitle = document.getElementById('show-movie-title')
  const movieImage = document.getElementById('show-movie-image')
  const movieDate = document.getElementById('show-movie-date')
  const modalDescription = document.getElementById('show-movie-description')

  // search bar const
  const searchForm = document.querySelector("#search-form")

  // card_listTransition const
  const card_listTransition = document.querySelector(".card_listTransition")

  // template movies
  function displayDataList(data) {
    let innerContent = ``
    data.forEach(item => {
      innerContent += `
      <div class="col-sm-3">
        <div class="card mb-2">
          <img class="card-img-top" src="${POSTER_URL}${item.image}" alt="Card image cap">
          <div class="card-body movie-item-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#show-movie-modal"
      data-id="${item.id}">More</button>
      <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
      `
    });
    dataPanel.innerHTML = innerContent
  }
  displayDataList(data)

  // template movies displayDataList_list
  function displayDataList_list(data) {
    let innerContent = ``
    for (item of data) {
      innerContent += `
          <div class="list">
            <div>
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="list-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
              data-bs-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
          `
    }
    dataPanel.innerHTML = innerContent
  }

  // template modal and remove fovorite movie
  {
    dataPanel.addEventListener('click', function (event) {
      if (event.target.matches(".btn-show-movie")) {
        showMovie(event.target.dataset.id)
      } else if (event.target.matches(".btn-remove-favorite")) {
        removeFavoriteItem(event.target.dataset.id)
      }
    })
  }

  // template modal function showMovie(id)
  function showMovie(id) {
    const url = INDEX_URL + id
    axios.get(url)
      .then((response) => {
        const data = response.data.results

        modalTitle.innerHTML = `${data.title}`
        movieImage.innerHTML = `<img src="${POSTER_URL}${data.image}" alt="">`
        movieDate.innerHTML = `${data.release_date
          }`
        modalDescription.innerHTML = `${data.description
          }`
      })
      .catch((error) => { console.log(error) })
  }

  // remove fovorite movie function removeFavoriteItem (id)
  function removeFavoriteItem(id) {
    // find movie by id
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return

    // remove movie and update localStorage
    data.splice(index, 1)
    localStorage.setItem("favoriteMovies", JSON.stringify(data))

    // repaint dataList
    displayDataList(data)
  }

  // search bar
  {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault()
      let input = searchForm.children[0].value
      let results = data.filter(movie => movie.title.toLowerCase().includes(input))
      displayDataList(results)
    })
  }


})()