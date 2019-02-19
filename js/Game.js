/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// Game.js

// eslint-disable-next-line no-var

class Game {
  constructor() {
    this.init();
  }

  init() {
    // reference ui
    this.ui = new UI();

    // reference event manager
    this.eventManager = new Event(eventTypes);

    // setup caravan
    this.caravan = new Caravan({
      day: 0,
      users: 0,
      devs: 30,
      soylent: 500,
      servers: 2,
      money: 300,
      bounties: 2,
    });

    // pass references (dependency injection)
    // set up caravan references (dependency injection)
    this.caravan.ui = this.ui;
    this.caravan.eventManager = this.eventManager;

    // set up UI references (dependency injection)
    this.ui.game = this;
    this.ui.caravan = this.caravan;
    this.ui.eventManager = this.eventManager;

    // set up event references (dependency injection)
    this.eventManager.game = this;
    this.eventManager.caravan = this.caravan;
    this.eventManager.ui = this.ui;

    // begin adventure!
    this.startJourney();
  }

  // start the journey and time starts running
  startJourney() {
    this.gameActive = true;
    this.previousTime = null;
    this.ui.notify('A tiny company starts up with $ from Sand Hill Rd', 'positive');

    this.step();
  }

  // game loop
  step(timestamp) {
    // starting, setup the previous time for the first time
    if (!this.previousTime) {
      this.previousTime = timestamp;
      this.updateGame();
    }

    // time difference
    const progress = timestamp - this.previousTime;

    // game update
    if (progress >= OregonH.GAME_SPEED) {
      this.previousTime = timestamp;
      this.updateGame();
    }

    // we use "bind" so that we can refer to the context "this" inside of the step method
    if (this.gameActive) window.requestAnimationFrame(this.step.bind(this));
  }

  updateGame() {
    // day update
    this.caravan.day += OregonH.DAY_PER_STEP;

    // soylent consumption
    this.caravan.consumeSoylent();

    // game over no soylent
    if (this.caravan.soylent === 0) {
      document.getElementById('stat-soylent').innerHTML = '0';
      this.ui.notify('Your caravan starved to death', 'negative');
      this.gameActive = false;
      return;
    }

    // update progress
    this.caravan.updateUsers();

    // show stats
    this.ui.refreshStats();

    // check if everyone died
    if (this.caravan.devs <= 0) {
      this.caravan.devs = 0;
      this.ui.notify('Everyone died', 'negative');
      this.gameActive = false;
      return;
    }

    // check win game
    if (this.caravan.users >= OregonH.FINAL_USERS) {
      this.ui.notify('You have returned home!', 'positive');
      this.gameActive = false;
      return;
    }

    // random events
    if (Math.random() <= OregonH.EVENT_PROBABILITY) {
      this.eventManager.generateEvent();
    }
  }

  pauseJourney() {
    this.gameActive = false;
  }

  resumeJourney() {
    this.gameActive = true;
    this.step();
  }
}
