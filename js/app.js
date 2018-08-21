// Obtengo cada elemento
const overlay = document.getElementById('overlay');
const plants = document.getElementById('plants');
const garden = document.getElementById('garden');
const water = document.getElementById('water');
const poison = document.getElementById('poison');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
let selection;

// Objeto para los intervalos de tiempo para cada elemento
let intervals = {
  seedWeed: null,
  killWeed: null,
  growCarrots: null
};

let started = false;
const max = 25;

// Estado para la persistencia de datos
const state = {
  plants: [],
  garden: []
};

// Crear elementos a plantar
function createGardenElement(type) {
  const element = document.createElement('img');
  element.setAttribute('src', `images/${type}.svg`);
  element.setAttribute('width', '100%');
  element.setAttribute('class', type);
  return element;
}

function seedWeed() {
  // Posicion aleatoria 0-25 en la grilla
  let position = Math.floor(Math.random() * max);
  // Verifico si la posicion no esta ocupada por alguna planta o agua para colocar poison
  if (!state.plants[position] && state.garden[position] !== 'water') {
    let element = createGardenElement('weed');
    plants.children[position].innerHTML = '';
    plants.children[position].appendChild(element);
    state.plants[position] = 'weed';
  }
}

function killWeed() {
  /* Recorro el estado de plantas y verifico si hay weed  y en esa misma posicion
   en el garden hay poison para eliminar ambos
   */
  state.plants.forEach((plant, index) => {
    if (plant === 'weed' && state.garden[index] === 'poison') {
      state.plants[index] = undefined;
      state.garden[index] = undefined;
      plants.children[index].innerHTML = '';
      garden.children[index].innerHTML = '';
    }
  });
}

function growCarrots() {
  /* Recorro el estado de garden y verifico si hay agua en esa posicion para 
   colocar una zanahoria */
  state.garden.forEach((resource, index) => {
    if (resource === 'water') {
      state.garden[index] = undefined;
      garden.children[index].innerHTML = '';
      let element = createGardenElement('carrot');
      plants.children[index].innerHTML = '';
      plants.children[index].appendChild(element);
      state.plants[index] = 'carrot';
    }
  });
}

// Colocare el elemento seleccionado(Water o Poison) en la grilla(overlay)
overlay.addEventListener('click', (event) => {
  if (started && selection) {
    let position = parseInt(event.target.getAttribute('id'));
    if (!state.garden[position] &&
      (
        (selection === 'poison' && state.plants[position] === 'weed') ||
        (selection === 'water' && state.plants[position])
      )
    ){
      let element = createGardenElement(selection);
      garden.children[position].innerHTML = '';
      garden.children[position].appendChild(element);
      state.garden[position] = selection;
    }
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

// EVENTO INTERVALOS DE TIEMPO PARA CADA UNO DE LOS ELEMENTOS JUEGO EN MODO PLAY
play.addEventListener('click', (event) => {
  intervals.growCarrots = setInterval(growCarrots, 4000);
  intervals.seedWeed = setInterval(seedWeed, 1500);
  intervals.killWeed = setInterval(killWeed, 500);
  play.classList.add('selected');
  started = true;
});
 //  EVENTO INTERVALOS DE TIEMPO PARA CADA UNO DE LOS ELEMENTOS JUEGO EN MODO STOP
stop.addEventListener('click', (event) => {
  clearInterval(intervals.growCarrots);
  clearInterval(intervals.seedWeed);
  clearInterval(intervals.killWeed);
  play.classList.remove('selected');
  started = false;
});