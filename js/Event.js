// Event.js

// eslint-disable-next-line no-var
var OregonH = OregonH || {};

OregonH.Event = {};

OregonH.Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'devs',
    value: -3,
    text: 'Soylent was expired. Dev casualties: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'devs',
    value: -4,
    text: 'Flu outbreak. Casualties: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'soylent',
    value: -10,
    text: 'Devs stayed up late playing video games. Soylent lost: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'SaaS company charges you $',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'servers',
    value: -1,
    text: 'Servers crashed. Devs that quit: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'soylent',
    value: 20,
    text: 'Found wild soylent mix and a creek. Soylent added: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'soylent',
    value: 20,
    text: 'Amazon delivery. Soylent added: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'servers',
    value: 1,
    text: 'Found wild servers. New servers: ',
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop. Would you like to buy something?',
    products: [
      { item: 'soylent', qty: 20, price: 50 },
      { item: 'servers', qty: 1, price: 200 },
      { item: 'bounties', qty: 2, price: 50 },
      { item: 'devs', qty: 5, price: 80 },
    ],
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop. Would you like to buy something?',
    products: [
      { item: 'soylent', qty: 30, price: 50 },
      { item: 'servers', qty: 1, price: 200 },
      { item: 'bounties', qty: 2, price: 20 },
      { item: 'devs', qty: 10, price: 80 },
    ],
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Smugglers sell various goods. Would you like to buy something?',
    products: [
      { item: 'soylent', qty: 20, price: 60 },
      { item: 'servers', qty: 1, price: 300 },
      { item: 'bounties', qty: 2, price: 80 },
      { item: 'devs', qty: 5, price: 60 },
    ],
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Hackers are hacking you. What will you do?',
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Hackers are hacking you. What will you do?',
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Hackers are hacking you. What will you do?',
  },
];

OregonH.Event.generateEvent = function generateEvent() {
  // pick random one
  const eventIndex = Math.floor(Math.random() * this.eventTypes.length);
  const eventData = this.eventTypes[eventIndex];

  // events that consist in updating a stat
  if (eventData.type === 'STAT-CHANGE') {
    this.stateChangeEvent(eventData);
  } else if (eventData.type === 'SHOP') {
    // shops
    // pause game
    this.game.pauseJourney();

    // notify user
    this.ui.notify(eventData.text, eventData.notification);

    // prepare event
    this.shopEvent(eventData);
  } else if (eventData.type === 'ATTACK') {
    // attacks
    // pause game
    this.game.pauseJourney();

    // notify user
    this.ui.notify(eventData.text, eventData.notification);

    // prepare event
    this.attackEvent(eventData);
  }
};

OregonH.Event.stateChangeEvent = function stateChangeEvent(eventData) {
  // can't have negative quantities
  if (eventData.value + this.caravan[eventData.stat] >= 0) {
    this.caravan[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};

OregonH.Event.shopEvent = function shopEvent(eventData) {
  // number of products for sale
  const numProds = Math.ceil(Math.random() * 4);

  // product list
  const products = [];
  let j;
  let priceFactor;

  for (let i = 0; i < numProds; i += 1) {
    // random product
    j = Math.floor(Math.random() * eventData.products.length);

    // multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();

    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      price: Math.round(eventData.products[j].price * priceFactor),
    });
  }

  this.ui.showShop(products, eventData);
};

// prepare an attack event
OregonH.Event.attackEvent = function attackEvent(eventData) {
  const bounties = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_bounties_AVG);
  const gold = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_GOLD_AVG);

  this.ui.showAttack(bounties, gold, eventData);
};
