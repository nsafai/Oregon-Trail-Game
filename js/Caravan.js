// Caravan.js

// eslint-disable-next-line no-var
var OregonH = OregonH || {};

// constants
OregonH.WEIGHT_PER_OX = 20;
OregonH.WEIGHT_PER_PERSON = 2;
OregonH.FOOD_WEIGHT = 0.6;
OregonH.FIREPOWER_WEIGHT = 5;
OregonH.GAME_SPEED = 800;
OregonH.DAY_PER_STEP = 0.2;
OregonH.FOOD_PER_PERSON = 0.02;
OregonH.FULL_SPEED = 5;
OregonH.SLOW_SPEED = 3;
OregonH.FINAL_DISTANCE = 1000;
OregonH.EVENT_PROBABILITY = 0.15;
OregonH.ENEMY_FIREPOWER_AVG = 5;
OregonH.ENEMY_GOLD_AVG = 50;

OregonH.Game = {};
OregonH.Caravan = {};

OregonH.Caravan.init = function init(stats) {
  this.day = stats.day;
  this.distance = stats.distance;
  this.crew = stats.crew;
  this.food = stats.food;
  this.oxen = stats.oxen;
  this.money = stats.money;
  this.firepower = stats.firepower;
};

// initiate the game
OregonH.Game.init = function init() {
  // setup caravan
  this.caravan = OregonH.Caravan;
  this.caravan.init({
    day: 0,
    distance: 0,
    crew: 30,
    food: 80,
    oxen: 2,
    money: 300,
    firepower: 2,
  });
};

// init game
OregonH.Game.init();

// update weight and capacity
OregonH.Caravan.updateWeight = function updateWeight() {
  let droppedFood = 0;
  let droppedGuns = 0;

  // how much can the caravan carry
  this.capacity = this.oxen * OregonH.WEIGHT_PER_OX + this.crew * OregonH.WEIGHT_PER_PERSON;

  // how much weight do we currently have
  this.weight = this.food * OregonH.FOOD_WEIGHT + this.firepower * OregonH.FIREPOWER_WEIGHT;

  // drop things behind if it's too much weight
  // assume guns get dropped before food
  while (this.firepower && this.capacity <= this.weight) {
    this.firepower -= 1;
    this.weight -= OregonH.FIREPOWER_WEIGHT;
    droppedGuns += 1;
  }

  if (droppedGuns) {
    this.ui.notify(`Left ${droppedGuns} guns behind`, 'negative');
  }

  while (this.food && this.capacity <= this.weight) {
    this.food -= 1;
    this.weight -= OregonH.FOOD_WEIGHT;
    droppedFood += 1;
  }

  if (droppedFood) {
    this.ui.notify(`Left ${droppedFood} food provisions behind`, 'negative');
  }
};

// update covered distance
OregonH.Caravan.updateDistance = function updateDistance() {
  // the closer to capacity, the slower
  const diff = this.capacity - this.weight;
  const speed = OregonH.SLOW_SPEED + diff / this.capacity * OregonH.FULL_SPEED;
  this.distance += speed;
};

// food consumption
OregonH.Caravan.consumeFood = function consumeFood() {
  this.food -= this.crew * OregonH.FOOD_PER_PERSON;

  if (this.food < 0) {
    this.food = 0;
  }
};
