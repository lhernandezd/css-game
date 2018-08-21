// Obtengo cada elemento
const overlay = document.getElementById('overlay');
const plants = document.getElementById('plants');
const garden = document.getElementById('garden');
const water = document.getElementById('water');
const poison = document.getElementById('poison');
let selection;

// Crear elementos a plantar
function createGardenElement(type) {
  const element = document.createElement('img');
  element.setAttribute('src', `images/${type}.svg`);
  element.setAttribute('width', '100%');
  element.setAttribute('class', type);
  return element;
}

// Colocare el elemento seleccionado(Water o Poison) en la grilla(overlay)
overlay.addEventListener('click', (event) => {
  if (selection) {
    let position = parseInt(event.target.getAttribute('id'));
    let element = createGardenElement(selection); 
    garden.children[position].innerHTML = '';
    garden.children[position].appendChild(element);
  }
});

// Seleccion de botones
water.addEventListener('click', (event) => {
  selection = 'water';
  water.classList.add('selected');
  poison.classList.remove('selected');
});

poison.addEventListener('click', (event) => {
  selection = 'poison';
  poison.classList.add('selected');
  water.classList.remove('selected');
});
