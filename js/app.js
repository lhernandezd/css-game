const plants = document.getElementById('plants');
const garden = document.getElementById('garden');

let selection;
// Objeto para los intervalos de tiempo para cada elemento
let intervals = {
  seedWeed: null,
  killWeed: null,
  growCarrots: null
};

let started = false;
let points = 0;
const max = 25;

// Estado para la persistencia de datos
let state = {};

$(document).keypress(event => {
  event.preventDefault();
  switch (String.fromCharCode(event.charCode).toLowerCase()) {
    case 'a':
      $('#water').click();
      break;
    case 's':
      $('#poison').click();
      break;
    case 'p':
      $('#play').click();
      break;
    case 'o':
      $('#stop').click();
      break;
  }
});

// Crear elementos a plantar
function createGardenElement(type) {
  const element = document.createElement('img');
  $(element)
    .attr('src', `images/${type}.svg`)
    .attr('width', '100%')
    .attr('class', type);
  return element;
}

function seedWeed() {
  // Posicion aleatoria 0-25 en la grilla
  let position = Math.floor(Math.random() * max);
  // Verifico si la posicion no esta ocupada por alguna planta o agua para colocar poison
  if (!state.plants[position] && state.garden[position] !== 'water') {
    let element = createGardenElement('weed');
    $(plants.children[position]).html(element);
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
      $(plants.children[index]).html('');
      $(garden.children[index]).html('');
      points += 1;
      drawPoints();
    }
  });
}

function growCarrots() {
  /* Recorro el estado de garden y verifico si hay agua en esa posicion para 
   colocar una zanahoria */
  state.garden.forEach((resource, index) => {
    if (resource === 'water') {
      state.garden[index] = undefined;
      $(garden.children[index]).html('');
      let element = createGardenElement('carrot');
      $(plants.children[index]).html(element);
      state.plants[index] = 'carrot';
    }
  });
}

function drawPoints() {
  $('#score').html(points);
}

function draw() {
  Object.getOwnPropertyNames(state).forEach(layer => {
    state[layer].forEach(function (item, index) {
      if (item) {
        let element = createGardenElement(item);
        $(`#${layer} .plot:nth-child(${index+1})`).html(element);
      }
    });
  });
}

$('#overlay').click((event) => {
  if (started) {
    let position = parseInt($(event.target).attr('id'));
    if (state.plants[position] === 'carrot') {
      state.plants[position] = undefined;
      $(plants.children[position]).html('');
      points += 2;
      drawPoints();
    } else {
      if (selection && !state.garden[position] &&
        ((selection === 'poison' && state.plants[position] === 'weed') ||
          (selection === 'water' && !state.plants[position]))
      ) {
        let element = createGardenElement(selection);
        $(garden.children[position]).html(element);
        state.garden[position] = selection;
      }
    }
  }
});

$('.resources .control').click(function (event) {
  selection = $(this).attr('id');
  $('.resources .control').removeClass('selected');
  $(this).addClass('selected');
});

$('#play').click(function (event) {
  const localState = localStorage.getItem('state');
  if (localState) {
    state = JSON.parse(localState);
  } else {
    state = {
      plants: [],
      garden: []
    };
  }
  draw();
  intervals.growCarrots = setInterval(growCarrots, 4000);
  intervals.seedWeed = setInterval(seedWeed, 1500);
  intervals.killWeed = setInterval(killWeed, 500);
  $(this).addClass('selected');
  started = true;
});

$('#stop').click(function (event) {
  clearInterval(intervals.growCarrots);
  clearInterval(intervals.seedWeed);
  clearInterval(intervals.killWeed);
  $('#play').removeClass('selected');
  started = false;
  localStorage.setItem('state', JSON.stringify(state));
});