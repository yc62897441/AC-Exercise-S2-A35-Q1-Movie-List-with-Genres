(function () {
  // 各種常數，選取element
  // get movies api const
  const BASE_URL = "https://movie-list.alphacamp.io/"
  const INDEX_URL = BASE_URL + "api/v1/movies"
  const POSTER_URL = BASE_URL + "posters/"
  const data = []

  // template movies const
  const dataPanel = document.getElementById('data-panel')

  // template modal const
  const modalTitle = document.getElementById('show-movie-title')
  const movieImage = document.getElementById('show-movie-image')
  const movieDate = document.getElementById('show-movie-date')
  const modalDescription = document.getElementById('show-movie-description')

  // search bar const
  const searchForm = document.querySelector("#search-form")

  // pagination const
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  // card_listTransition const
  const card_listTransition = document.querySelector(".card_listTransition")

  // classification const
  const classification = document.querySelector("#classification")
  const classification_list = {
    "0": "All",
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }

  // get movies api
  axios.get(INDEX_URL)
    .then(function (response) {
      data.push(...response.data.results)
      getTotalPages(data)
      getPageData(1, data)
    })
    .catch(function (error) {
      console.log(error)
    })


  // 渲染版型 displayDataList 或是 displayDataList_list
  // template movies displayDataList
  function displayDataList(data) {
    let innerContent = ``
    for (item of data) {
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
      <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
      `
    }
    dataPanel.innerHTML = innerContent
  }

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


  // 新增最愛電影
  // template modal and add fovorite movie
  {
    dataPanel.addEventListener('click', function (event) {
      if (event.target.matches(".btn-show-movie")) {
        showMovie(event.target.dataset.id)
      } else if (event.target.matches(".btn-add-favorite")) {
        addFavoriteItem(event.target.dataset.id)
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

  // add fovorite movie function addFavoriteItem(id)
  // add fovorite movies list to localStorage, then operated in "favorite.js" to template fovorite movies
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem("favoriteMovies", JSON.stringify(list))
  }

  // 搜尋功能
  // search bar
  {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault()
      let input = searchForm.children[0].value.toLowerCase()
      let results = data.filter(movie => movie.title.toLowerCase().includes(input))
      console.log("results:", results)
      getTotalPages(results)
      getPageData(1, results)
    })
  }

  // 分頁功能
  // pagination
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = `
    <li class="page-item">
      <a class="page-link" href="#">Previous</a>
    </li>
    `
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>  
      `
    }
    pageItemContent += `
    <li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>
    `
    pagination.innerHTML = pageItemContent
  }

  // pagination: get <a>s'pagNum
  pagination.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      dataPanel.dataset.page = event.target.dataset.page
      getPageData(event.target.dataset.page)
    }
  })

  // pagination: compute pageData and display
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)

    // 依據目前版型是網格或列表(cardOn與否)來渲染版型
    if (card_listTransition.classList.contains("cardOn")) {
      displayDataList(pageData)
    } else if (!(card_listTransition.classList.contains("cardOn"))) {
      displayDataList_list(pageData)
    }
  }

  // 切換網格或列表
  // card_listTransition
  {
    card_listTransition.addEventListener("click", function (event) {
      if (event.target.classList.contains("fa-th")) {
        if (!(card_listTransition.classList.contains("cardOn"))) {
          card_listTransition.classList.add("cardOn")
          let pageNum = dataPanel.dataset.page
          getPageData(pageNum)
        }
      } else if (event.target.classList.contains("fa-bars")) {
        if (card_listTransition.classList.contains("cardOn")) {
          card_listTransition.classList.remove("cardOn")
          let pageNum = dataPanel.dataset.page
          getPageData(pageNum)
        }
      }
    })
  }

  // 分類清單
  // build classification list aside
  {
    let innerContent = ``
    let index = 0

    for (let key in classification_list) {
      let value = classification_list[key]
      innerContent += `<li class="list-group-item" data-index="${index}">${value}</li>`
      index = index + 1
    }

    classification.children[0].innerHTML = innerContent
    classification.children[0].children[0].classList.add("active")
  }

  {
    classification.addEventListener("click", function (event) {
      if (event.target.tagName === "LI") {
        // button.classList -> remove "active" and add "active"
        for (let i = 0; i < event.target.parentElement.children.length; i++) {
          event.target.parentElement.children[i].classList.remove("active")
        }
        event.target.classList.add("active")

        // filter and show certain classification movies
        if (event.target.innerHTML === "All") {
          getTotalPages(data)
          getPageData(1, data)
        } else {
          let classification_index = Number(event.target.dataset.index)
          let certain_classification_movies_data = []

          for (let i = 0; i < data.length; i++) {
            if (data[i]["genres"].includes(classification_index)) {
              certain_classification_movies_data.push(data[i])
            }
          }
          getTotalPages(certain_classification_movies_data)
          getPageData(1, certain_classification_movies_data)
        }
      }
    })
  }

})()



