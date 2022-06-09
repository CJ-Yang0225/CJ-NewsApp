import '@/styles/index.scss';

class Person {
  constructor(name) {
    this.name = name;
  }
}

const me = new Person('CJ');

document.getElementById('app').innerHTML = `Hello Webpack5! I'm ${me.name}`;
