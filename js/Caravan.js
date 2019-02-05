// Caravan.js

// eslint-disable-next-line no-var
var OregonH = OregonH || {};

// constants
OregonH.WEIGHT_PER_OX = 20;
OregonH.WEIGHT_PER_PERSON = 2;
OregonH.SOYLENT_WEIGHT = 0.6;
OregonH.HACKERBOUNTIES_WEIGHT = 5;
OregonH.GAME_SPEED = 800;
OregonH.DAY_PER_STEP = 0.2;
OregonH.SOYLENT_PER_PERSON = 0.02;
OregonH.FULL_SPEED = 5;
OregonH.SLOW_SPEED = 3;
OregonH.FINAL_DISTANCE = 1000;
OregonH.EVENT_PROBABILITY = 0.15;
OregonH.ENEMY_HACKERBOUNTIES_AVG = 5;
OregonH.ENEMY_GOLD_AVG = 50;

OregonH.Game = {};
OregonH.Caravan = {};

OregonH.Caravan.init = function init(stats) {
  this.day = stats.day;
  this.distance = stats.distance;
  this.devs = stats.devs;
  this.soylent = stats.soylent;
  this.servers = stats.servers;
  this.money = stats.money;
  this.hackerbounties = stats.hackerbounties;
};

// initiate the game
OregonH.Game.init = function init() {
  // setup caravan
  this.caravan = OregonH.Caravan;
  this.caravan.init({
    day: 0,
    distance: 0,
    devs: 30,
    soylent: 80,
    servers: 2,
    money: 300,
    hackerbounties: 2,
  });
};

// init game
OregonH.Game.init();

// update weight and capacity
OregonH.Caravan.updateWeight = function updateWeight() {
  let droppedSoylent = 0;
  let droppedBounties = 0;

  // how much can the caravan carry
  this.capacity = this.servers * OregonH.WEIGHT_PER_OX + this.devs * OregonH.WEIGHT_PER_PERSON;

  // how much weight do we currently have
  this.weight = this.soylent * OregonH.SOYLENT_WEIGHT + this.hackerbounties * OregonH.HACKERBOUNTIES_WEIGHT;

  // drop things behind if it's too much weight
  // assume hackerbounties get dropped before soylent
  while (this.hackerbounties && this.capacity <= this.weight) {
    this.hackerbounties -= 1;
    this.weight -= OregonH.HACKERBOUNTIES_WEIGHT;
    droppedBounties += 1;
  }

  if (droppedBounties) {
    this.ui.notify(`Left ${droppedBounties} hacker bounties behind because of excess weight`, 'negative');
  }

  while (this.soylent && this.capacity <= this.weight) {
    this.soylent -= 1;
    this.weight -= OregonH.SOYLENT_WEIGHT;
    droppedSoylent += 1;
  }

  if (droppedSoylent) {
    this.ui.notify(`Left ${droppedSoylent} soylent provisions stolen by hackers`, 'negative');
  }
};

// update covered distance
OregonH.Caravan.updateDistance = function updateDistance() {
  // the closer to capacity, the slower
  const diff = this.capacity - this.weight;
  const speed = OregonH.SLOW_SPEED + diff / this.capacity * OregonH.FULL_SPEED;
  this.distance += speed;
};

// soylent consumption
OregonH.Caravan.consumeSoylent = function consumeSoylent() {
  this.soylent -= this.devs * OregonH.SOYLENT_PER_PERSON;

  if (this.soylent < 0) {
    this.soylent = 0;
  }
};
