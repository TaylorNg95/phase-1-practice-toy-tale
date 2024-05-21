let addToy = false;
let globalToys;
const baseUrl = 'http://localhost:3000/toys';
const displayDiv = document.querySelector('#toy-collection');
const newToyForm = document.querySelector('#add-toy-form');

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  renderToys();
});

document.querySelector('.add-toy-form').addEventListener('submit', postNewToy)

function postNewToy(){
  const newName = document.querySelectorAll('input')[0].value;
  const newImage = document.querySelectorAll('input')[1].value;
  let newLikes = 0;

  const newToy = {
    name: newName,
    image: newImage,
    likes: newLikes
  }

  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newToy)
  })
    .then(response => response.json())
    .then(data => console.log(data))
}

function renderToys(){
  clearToys()
  fetch(baseUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(toy => renderToy(toy));
      globalToys = data
    })
}

function clearToys(){
  displayDiv.innerHTML = '';
}

function renderToy(toy){
  const newDiv = document.createElement('div');
  const h2 = document.createElement('h2');
  const img = document.createElement('img');
  const p = document.createElement('p');
  const btn = document.createElement('button');

  newDiv.className = 'card';
  h2.textContent = toy.name;
  img.src = toy.image;
  img.className = 'toy-avatar';
  p.textContent = `${toy.likes} likes`;
  btn.className = 'like-btn';
  btn.textContent = 'like'
  btn.dataset.id = toy.id;
  btn.addEventListener('click', updateToy)
 
  newDiv.append(h2, img, p, btn);
  displayDiv.append(newDiv);
}

function updateToy(){
  const toyID = this.dataset.id
  const newLikes = parseInt(this.previousElementSibling.textContent.split(' ')[0]) + 1
  debugger;
  
  fetch(`${baseUrl}/${toyID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({likes: newLikes})
  })
    .then(response => response.json())
    .then(data => {
      const toyToChange = globalToys.find(toy => toy.id === data.id);
      toyToChange.likes++;
      renderToys()
    })
}