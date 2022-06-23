//create the basic block -the house
class House {
  constructor(name) {
    this.name = name;
    this.rooms = [];
  }

  //method to add a room for  a house
  addRoom(name, area) {
    this.rooms.push(new Room(name.area));
  }
}

//Creating the rooms with a name and an area
class Room {
  constructor(name, area) {
    this.name = name;
    this.area = area;
  }
}

//how to send the http request
class HouseService {
  //root url for all endpoints on api
  static url = "https://ancient-taiga-31359.herokuapp.com/api/houses";

  static getAllHouses() {
    //returns all houses from above url
    return $.get(this.url);
  }

  static getHouse(id) {
    //will retrieve a specefic house from api
    return $.get(this.url + `/${id}`);
  }

  //will take an instanc eof our house class then an array
  static createHouse(house) {
    return $.post(this.url, house);
  }

  //ajax put request to update a house
  static updateHouse(house) {
    return $.ajax({
      url: this.url + `/${house._id}`,
      dataType: "json",
      data: JSON.stringify(house),
      contentTyoe: "application/json",
      type: "PUT",
    });
  }

  //using AJAX delete a house by its ID
  static deleteHouse(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

//creating a DOM manager class to re-render the dom each time we create a new class
class DOMManager {
  static houses;
  //calls house services to request info and renders it to the DOM
  static getAllHouses() {
    HouseService.getAllHouses().then((houses => this.render(houses)));
  }
  //first grab the app div and clear it
  static render(houses) {
    this.houses = houses;
    $("#app").empty();
    //forloop to go over houses and rerenderDOM
    for (let house of houses) {
      $("#app").append(
        `<div id="${house._id}" class="card">
            <div class="card-header">
                 <h2>${house.name}</h2>
                 <button class="btn btn-danger" onclick = "DOMManager.deleteHouse('${house._id}')" >Delete </button>
            </div>
         </div>`
      );
    }
    console.log(houses);
  }
}

DOMManager.getAllHouses();
