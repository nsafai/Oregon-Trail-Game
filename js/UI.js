/* eslint-disable no-undef */
// UI.js

class UI {
  constructor() {
    this.percentComplete = 0;
  }

  notify(message, type) {
    document.getElementById('updates-area').innerHTML = `<div class="update-${type}">Day ${Math.ceil(this.caravan.day)}: ${message}</div> ${document.getElementById('updates-area').innerHTML}`;
  }

  refreshStats() {
    // Destructure some objects for easy access
    const {
      day, users, devs, servers, soylent, money, bounties,
    } = this.caravan;
    const { ceil, floor } = Math;

    // modify the dom
    document.getElementById('stat-day').innerHTML = `${ceil(day)}`; // Math.ceil(this.caravan.day);
    document.getElementById('stat-users').innerHTML = `${floor(users)}`;
    document.getElementById('stat-devs').innerHTML = `${devs}`;
    document.getElementById('stat-servers').innerHTML = `${servers}`;
    document.getElementById('stat-soylent').innerHTML = `${ceil(soylent)}`;
    document.getElementById('stat-money').innerHTML = `$${money}`;
    document.getElementById('stat-bounties').innerHTML = `${bounties}`;

    // update progress bar
    this.percentComplete = (users / OregonH.FINAL_USERS) * 100;
    console.log(`${this.percentComplete}%`);
    document.getElementById('myBar').style.width = `${this.percentComplete}%`;
  }

  showAttack(bounties, gold, eventData) {
    const attackDiv = document.getElementById('attack');
    attackDiv.classList.remove('hidden');

    const descriptionHeader = document.getElementById('event-description-atk');
    descriptionHeader.innerHTML = eventData.text;

    // keep properties
    this.bounties = bounties;
    this.gold = gold;

    // show bounties
    document.getElementById('attack-description').innerHTML = `Pay off cost: ${bounties} hacker bounties`;

    // init once
    if (!this.attackInitiated) {
      // payoff
      document.getElementById('payoff').addEventListener('click', this.payoff.bind(this));

      // shut servers down
      document.getElementById('shutdown').addEventListener('click', this.shutDownServers.bind(this));

      this.attackInitiated = true;
    }
  }

  payoff() {
    // console.log('Pay Off!');
    console.log(this);

    const { bounties, gold } = this;

    // check we can afford it
    if (bounties > OregonH.Game.caravan.bounties) {
      this.notify('Not enough hacker bounties in the bank', 'negative');
      return false;
    }

    // purchase went through, update # of bounties left in the 'bank'
    OregonH.Game.caravan.bounties -= bounties;


    // damage can be 0 to 2 * bounties
    const damage = Math.ceil(Math.max(0, bounties * 2 * Math.random() - this.caravan.bounties));

    // check there are survivors
    if (damage < OregonH.Game.caravan.devs) {
      OregonH.Game.caravan.devs -= damage;
      OregonH.Game.caravan.money += gold;
      this.notify(`${damage} devs quit for lack of stability and security`, 'negative');
      this.notify(`Investors reward you with $${gold} for defeating the hacker threat`);
    } else {
      OregonH.Game.caravan.devs = 0;
      this.notify('Everybody quit after the payoff', 'negative');
    }

    // resume journey
    document.getElementById('attack').classList.add('hidden');
    this.game.resumeJourney();
  }

  // shutdown servers to counter hackers
  shutDownServers() {
    // console.log('runway!')

    const { bounties } = this;

    // damage can be 0 to bounties / 2
    const damage = Math.ceil(Math.max(0, bounties * Math.random() / 2));

    // check there are survivors
    if (damage < this.caravan.devs) {
      this.caravan.devs -= damage;
      this.notify(`${damage} security devs quit in shame`, 'negative');
    } else {
      this.caravan.devs = 0;
      this.notify('Everybody died running away', 'negative');
    }

    // remove event listener
    // document.getElementById('shutDown').removeEventListener('click', this.shutDown);

    // resume journey
    document.getElementById('attack').classList.add('hidden');
    this.game.resumeJourney();
  }

  showShop(products, eventData) {
    // get shop area
    const shopDiv = document.getElementById('shop');
    shopDiv.classList.remove('hidden');

    const descriptionHeader = document.getElementById('event-description-shop');
    descriptionHeader.innerHTML = eventData.text;

    // init the shop just once
    if (!this.shopInitiated) {
      // event delegation
      shopDiv.addEventListener('click', (e) => {
        // what was clicked
        const target = e.target || e.src;

        // exit button
        if (target.tagName === 'BUTTON') {
          // resume journey
          shopDiv.classList.add('hidden');
          this.game.resumeJourney();
        } else if (target.tagName === 'DIV' && target.className.match(/product/)) {
          this.buyProduct({
            item: target.getAttribute('data-item'),
            qty: target.getAttribute('data-qty'),
            price: target.getAttribute('data-price'),
          });
        }
      });
      this.shopInitiated = true;
    }

    // clear existing content
    const prodsDiv = document.getElementById('prods');
    prodsDiv.innerHTML = '';

    // show products
    let product;
    for (let i = 0; i < products.length; i += 1) {
      product = products[i];
      prodsDiv.innerHTML += `<div class="product" data-qty="${product.qty}" data-item="${product.item}" data-price="${product.price}">${product.qty} ${product.item} - $${product.price}</div>`;
    }
  }

  // buy product
  buyProduct(product) {
    // check we can afford it
    if (product.price > this.caravan.money) {
      this.notify('Not enough money', 'negative');
      return false;
    }

    this.caravan.money -= product.price;

    this.caravan[product.item] += +product.qty;

    this.notify(`Bought ${product.qty} x ${product.item}`, 'positive');

    // update visuals
    this.refreshStats();
    return true;
  }
}

OregonH.UI = new UI();
