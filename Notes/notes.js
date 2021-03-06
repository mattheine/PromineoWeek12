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
    HouseService.getAllHouses().then((houses) => this.render(houses));
  }
  //first grab the app div and clear it
  static render(houses) {
    this.houses = houses;
    console.log(this.houses)
    $("#app").empty();
    //forloop to go over each house and rerenderDOM
    for (let house of houses) {
      $("#app").prepend(
        `<div id="${house._id}" class="card">
            <div class="card-header">
                 <h2>${house.name}</h2>
                 <button class="btn btn-danger" onclick = "DOMManager.deleteHouse('${house._id}')" >Delete </button>
            </div>
            <div class="card-body">
              <div class="card">
                <div class="row">
                  <div class="col-sm">
                  <input type="text" id="${house._id}-room-name" class="form-control"" placeholder="Room Name">
                  </div>
                  <div class="col-sm">
                  <input type="text" id="${house._id}-room-area" class="form-control"" placeholder="Room Area">
                  </div>
              </div>
              <button id="${house._id}-new-room" onclick= "DOMManager.addRoom('${house._id}')" class = "btn btn-primary form-control">Add</button>
            </div><br>
         </div>`
      );
      //nested loop to render each room inside each house
      for (let room of house.rooms) {
        $(`#${house._id}`)
          .find(".card-body")
          .append(
            `<p>
            <span id="name-${room._id}"><strong>Area: <strong> ${room.name}</span>
            <span id="area-${room._id}"><strong>Area: <strong> ${room.area}</span>
            <button class="btn btn-danger" onclick = "DOMManager.deleteRoom('${house._id}' , ${room._id}')">Delete Room</button>` 
          );
        }
      }
      console.log(houses);
    }
  
  //method to delete house on button click
  static deleteHouse(id) {
    HouseService.deleteHouse(id) //delete a house
      .then(() => {
        return HouseService.getAllHouses(); //http request to get all houses
      })
      .then((houses) => this.render(houses)); //re-render the page
  }
  //Method to Create New House
  static createHouse(name){
    HouseService.createHouse(new House(name))
    .then(() => {
      return HouseService.getAllHouses();
    })
  .then((houses) => this.render(houses));  
  }

  //method to add Room to house
  static addRoom(id){
    for (let house of this.houses){
      if(house._id == id){
        //push a new room to rooms array on the house we found
        house.rooms.push(new Room($(`#${house._id}-room-name`).value, $(`#${house._id}-room-area`).value));
        //send request to api to save the new data that represents this house
        HouseService.updateHouse(house)
          .then(() => {
            return HouseService.getAllHouses();
          })
          .then((houses) => this.render(houses));
      }
    }
  }


static deleteRoom(houseId, roomId){
  for (let house of this.houses){
    if (house._id == houseId){
      for (let room of house.rooms){
        if(room._id == roomId){
          house.rooms.splice(house.rooms.indexOr(room), 1);
          HouseService.updateHouse(house)
          .then(() => {
            return HouseService.getAllHouses();
          })
          .then((houses) => this.render(houses));
        }
      }
    }
  }
}
}





//RUNNING SCRIPT 

//grab new house create button --> event listener
$('#create-new-house').click(() => {
  DOMManager.createHouse($('#new-house-name').val());//creat House method and grab name from input -->reset input value
  $('#new-house-name').val("")
});

//render the DOM with all houses
DOMManager.getAllHouses();

//call script to run n button click
