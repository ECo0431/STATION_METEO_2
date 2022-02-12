const TIME = document.querySelector("#time");
const TEMPERATURE = document.querySelector("#temperature");
const VILLE = document.querySelector("#ville");
const BOXIMAGEFOND = document.querySelector(".box-image-fond");
const LISTEVILLES = document.querySelector("#liste-villes");
const NOMDESVILLES = [
  "Nantes",
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Montpellier",
  "Strasbourg",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Reims",
  "Toulon",
  "Le Havre",
  "Grenoble",
  "Dijon",
  "Villeurbanne",
  "Saint-Denis",
  "Nîmes",
  "Clermont-Ferrand",
  "Le-Mans",
  "Aix-en-Provence",
  "Brest",
  "Tours",
  "Amiens",
  "Limoges",
  "Annecy",
  "Boulogne-Billancourt",
  "Perpignan",
  "Besançon",
  "Metz",
  "Orléans",
  "Rouen",
  "Argenteuil",
  "Montreuil",
  "Mulhouse",
  "Caen",
  "Nancy",
  "Saint-Paul",
  "Roubaix",
  "Tourcoing",
  "Nanterre",
  "Vitry-sur-Seine",
  "Créteil",
  "Avignon",
  "Poitiers",
  "Aubervilliers",
  "Dunkerque",
  "Aulnay-sous-Bois",
  "Colombes",
  "Asnires-sur-Seine",
  "Versailles",
  "Saint-Pierre",
  "Courbevoie",
  "Le-Tampon",
  "Cherbourg-en-Cotentin",
  "Fort-de-France",
  "Rueil-Malmaison",
  "Béziers",
  "Champigny-sur-Marne",
  "Pau",
  "La-Rochelle",
  "Saint-Maur-des-Fossés",
  "Cannes",
  "Calais",
  "Antibes",
  "Drancy",
  "Mamoudzou",
  "Ajaccio",
  "Mérignac",
  "Saint-Nazaire",
  "Colmar",
  "Issy-les-Moulineaux",
  "Noisy-le-Grand",
  "Évry-Courcouronnes",
  "Vénissieux",
  "Cergy",
  "Levallois-Perret",
  "Valence",
  "Bourges",
  "Pessac",
  "Cayenne",
  "Ivry-sur-Seine",
  "Quimper",
  "La-Seyne-sur-Mer",
  "Antony",
  "Villeneuve-d'Ascq",
  "Clichy",
  "Troyes",
  "Montauban",
  "Neuilly-sur-Seine",
  "Pantin",
  "Niort",
  "Chambry",
  "Sarcelles",
  "Le-Blanc-Mesnil",
  "Lorient",
];
const NOMDESVILLESTRIE = NOMDESVILLES.sort();
const FONDBLANCLOADER = document.querySelector("#fond-blanc");
const PRELOADER = document.querySelector("#preloader");
//Fonction qui arrondi
function round(num) {
  var m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}
// Fonction qui remplace les caractère avec accent avec un caractère sans accent
var rules = {
  a: "àáâãäå",
  A: "ÀÁÂ",
  e: "èéêë",
  E: "ÈÉÊË",
  i: "ìíîï",
  I: "ÌÍÎÏ",
  o: "òóôõöø",
  O: "ÒÓÔÕÖØ",
  u: "ùúûü",
  U: "ÙÚÛÜ",
  y: "ÿ",
  c: "ç",
  C: "Ç",
  n: "ñ",
  N: "Ñ",
};

function getJSONKey(key) {
  for (acc in rules) {
    if (rules[acc].indexOf(key) > -1) {
      return acc;
    }
  }
}

function replaceSpec(Texte) {
  regstring = "";
  for (acc in rules) {
    regstring += rules[acc];
  }
  reg = new RegExp("[" + regstring + "]", "g");
  return Texte.replace(reg, function (t) {
    return getJSONKey(t);
  });
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
      // let villeLocalise = "Montpellier";
      console.log("dataPosition " + dataPosition);
      console.log("villeLocalise " + villeLocalise);
      VILLE.innerHTML = `
      <p>${replaceSpec(villeLocalise)}</p>
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
          console.log("dataMeteo " + dataMeteo);
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

              console.log("lienReqJson " + lienReqJson);
              console.log("eval(lienReqJson) " + eval(lienReqJson));
              BOXIMAGEFOND.innerHTML = `
                <div style="background: url(${eval(
                  lienReqJson
                )}) no-repeat"class="image-fond"></div>
          `;
              //Liste déroulante
              LISTEVILLES.innerHTML = `
            <option value="">CHANGER DE VILLE</option>
              `;
              for (let i = 0; i < NOMDESVILLESTRIE.length; i++) {
                LISTEVILLES.innerHTML += `
                <option value="${NOMDESVILLESTRIE[i]}">${replaceSpec(
                  NOMDESVILLESTRIE[i]
                )}</option>
                `;
              }
              ///Fonction qui permet de récuperer la valeur des options du select à chaque changement d'options
              LISTEVILLES.addEventListener("change", (event) => {
                console.log(LISTEVILLES.value);
                villeLocalise = LISTEVILLES.value;
                console.log(villeLocalise);
                let villeLocaliseCaract = villeLocalise.replace(
                  /[^a-zA-Z ]/g,
                  ""
                );
                let villeLocaliseEsp = villeLocaliseCaract.split(" ").join("");
                console.log(villeLocaliseEsp);

                let lienReqJson = villeImage + villeLocaliseEsp;
                console.log(villeLocaliseEsp);
                console.log("lienReqJson " + lienReqJson);
                console.log("eval(lienReqJson) " + eval(lienReqJson));
                BOXIMAGEFOND.innerHTML = `
                  <div style="background: url(${eval(
                    lienReqJson
                  )}) no-repeat"class="image-fond"></div>
                `;
                VILLE.innerHTML = `
                <p>${replaceSpec(villeLocalise)}</p>
                `;

                fetch(
                  `https://api.openweathermap.org/data/2.5/weather?q=${villeLocaliseEsp}, France&APPID=6954cc39e1615bfa3d85718a62577874`
                )
                  .then((response) => {
                    return response.json();
                  })
                  .then((dataMeteo) => {
                    let kelvinToCelsius = dataMeteo.main.temp - 273.15; //Converti les kelvin en degré celcius
                    let ventMsToKm = dataMeteo.wind.speed * 3.495;
                    console.log("dataMeteo " + dataMeteo);
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
                  });
              });
            });
        });
    });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(Geo);
}
