// Caravan.js

// eslint-disable-next-line no-var
var OregonH = OregonH || {};

// constants
OregonH.WEIGHT_PER_OX = 20;
OregonH.WEIGHT_PER_PERSON = 2;
OregonH.SOYLENT_WEIGHT = 0.6;
OregonH.bounties_WEIGHT = 5;
OregonH.GAME_SPEED = 800;
OregonH.DAY_PER_STEP = 0.2;
OregonH.SOYLENT_PER_PERSON = 0.02;
OregonH.FULL_SPEED = 5;
OregonH.SLOW_SPEED = 3;
OregonH.FINAL_USERS = 1000;
OregonH.EVENT_PROBABILITY = 0.15;
OregonH.ENEMY_bounties_AVG = 5;
OregonH.ENEMY_GOLD_AVG = 50;

OregonH.Game = {};
OregonH.Caravan = {};

OregonH.Caravan.init = function init(stats) {
  this.day = stats.day;
  this.users = stats.users;
  this.devs = stats.devs;
  this.soylent = stats.soylent;
  this.servers = stats.servers;
  this.money = stats.money;
  this.bounties = stats.bounties;
};

// initiate the game
OregonH.Game.init = function init() {
  // setup caravan
  this.caravan = OregonH.Caravan;
  this.caravan.init({
    day: 0,
    users: 0,
    devs: 30,
    soylent: 80,
    servers: 2,
    money: 300,
    bounties: 2,
  });
};

// init game
OregonH.Game.init();

// update weight and capacity
OregonH.Caravan.updateWeight = function updateWeight() {
  let droppedSoylent = 0;
  let spentBounties = 0;

  // how much can the caravan carry
  this.capacity = this.servers * OregonH.WEIGHT_PER_OX + this.devs * OregonH.WEIGHT_PER_PERSON;

  // how much weight do we currently have
  this.weight = this.soylent * OregonH.SOYLENT_WEIGHT + this.bounties * OregonH.bounties_WEIGHT;

  // drop things behind if it's too much weight
  // assume bounties get dropped before soylent
  while (this.bounties && this.capacity <= this.weight) {
    this.bounties -= 1;
    this.weight -= OregonH.bounties_WEIGHT;
    spentBounties += 1;
  }

  if (spentBounties) {
    this.ui.notify(`Spent ${spentBounties} hacker bounties as bonuses to retain devs who considered joining Fortune 100 companies`, 'negative');
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

// update covered users
OregonH.Caravan.updateUsers = function updateUsers() {
  // the closer to capacity, the slower
  const diff = this.capacity - this.weight;
  const speed = OregonH.SLOW_SPEED + diff / this.capacity * OregonH.FULL_SPEED;
  this.users += speed;
};

// soylent consumption
OregonH.Caravan.consumeSoylent = function consumeSoylent() {
  this.soylent -= this.devs * OregonH.SOYLENT_PER_PERSON;

  if (this.soylent < 0) {
    this.soylent = 0;
  }
};
