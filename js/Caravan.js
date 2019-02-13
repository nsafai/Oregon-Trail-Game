/* eslint-disable no-undef */
// Caravan.js

// eslint-disable-next-line no-var
// var OregonH = OregonH || {};

OregonH.Game = {};
OregonH.Caravan = {};

// ----------------------------------------

class Caravan {
  constructor(stats) {
    this.init(stats);
  }

  init({ day, users, devs, soylent, servers, money, bounties }) {
    this.day = day;
    this.users = users;
    this.devs = devs;
    this.soylent = soylent;
    this.servers = servers;
    this.money = money;
    this.bounties = bounties;

    // for (let key in stats) {
    //   this[key] = stats[key]
    // }
  }

  updateWeight() {
    let droppedSoylent = 0;
    let spentBounties = 0;

    // how much can the caravan carry
    this.capacity = this.servers * OregonH.SERVER_LOAD + this.devs * OregonH.WEIGHT_PER_PERSON;

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
  }

  updateUsers() {
    // the closer to capacity, the slower
    const diff = this.capacity - this.weight;
    const speed = OregonH.SLOW_SPEED + diff / this.capacity * OregonH.FULL_SPEED;
    this.users += speed;
  }

  consumeSoylent() {
    this.soylent -= this.devs * OregonH.SOYLENT_PER_PERSON;

    if (this.soylent < 0) {
      this.soylent = 0;
    }
  }
}

// // initiate the game
// OregonH.Game.init = function init() {
//   // setup caravan
//   this.caravan = new Caravan({
//     day: 0,
//     users: 0,
//     devs: 30,
//     soylent: 80,
//     servers: 2,
//     money: 300,
//     bounties: 2,
//   });
// };

// // init game
// OregonH.Game.init();
