const TIME = document.querySelector("#time");
const TEMPERATURE = document.querySelector("#temperature");
const VILLE = document.querySelector("#ville");
const BOXIMAGEFOND = document.querySelector(".box-image-fond");

//Fonction qui arrondi
function round(num) {
  var m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}
//Fonction qui éxécute functionTime toutes les secondes
setInterval(functionTime, 1000);

function functionTime() {
  let time = new Date().toLocaleTimeString();
  TIME.innerHTML -= `
  <p>${time}</p>
  `;
  TIME.innerHTML += `
  <p class="txt-time">${time}</p>
  `;
}
//Fonction qui localise et permet d'obptenir la longitude et l'altitude
function Geo(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  //Fonction qui permet d'obtenir le nom de la ville
  fetch(
    `https://api-adresse.data.gouv.fr/search/?q=1&lat=${latitude}&lon=${longitude}`
  )
    .then((response) => {
      return response.json();
    })
    .then((dataPosition) => {
      let villeLocalise = dataPosition.features[0].properties.city;

      // let valeurListeDeroulante = VILLELISTEDEROULANTE.options[1].value;
      // let villeLocalise = valeurListeDeroulante;
      console.log(dataPosition);
      console.log(villeLocalise);
      VILLE.innerHTML = `
      <p>${villeLocalise}</p>
`;
      //Fonction qui permet d'avoir la météo
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${villeLocalise}, France&APPID=6954cc39e1615bfa3d85718a62577874`
      )
        .then((response) => {
          return response.json();
        })
        .then((dataMeteo) => {
          let kelvinToCelsius = dataMeteo.main.temp - 273.15; //Converti les kelvin en degré celcius
          let ventMsToKm = dataMeteo.wind.speed * 3.495;
          console.log(dataMeteo);
          console.log(dataMeteo.main.temp);
          console.log("Température " + kelvinToCelsius + "°");
          console.log(dataMeteo.wind.speed);
          TEMPERATURE.innerHTML = `      
          <div class="box-temp-vent">
            <p class="temp">${parseInt(kelvinToCelsius)}°</p>
            <div class="trait"></div>
            <p class="vent">${parseInt(
              ventMsToKm
            )}</p><p class="kmh">vent<br>km/h</p>
          </div>
          `;
          fetch(`lien_images_villes_de_france.json`)
            .then((response) => {
              return response.json();
            })
            .then((dataImagesVilles) => {
              let villeImage = "dataImagesVilles.villes[0].";
              let villeLocaliseCaract = villeLocalise.replace(
                /[^a-zA-Z ]/g,
                ""
              ); //Supprime les caractère spéciaux
              let villeLocaliseEsp = villeLocaliseCaract.split(" ").join(""); //retire les espaces
              let lienReqJson = villeImage + villeLocaliseEsp;

              console.log(dataImagesVilles.villes[0].Paris);
              console.log(lienReqJson);
              console.log(eval(lienReqJson));
              BOXIMAGEFOND.innerHTML = `
                <div style="background: url(${eval(
                  lienReqJson
                )}) no-repeat"class="image-fond"></div>
          `;
            });
        });
    });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(Geo);
}
