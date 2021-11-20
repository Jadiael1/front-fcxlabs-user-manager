document.querySelector("#formUserQuery").addEventListener("submit", async evt => {
    evt.preventDefault();

    let form = evt.path[0];

    let formData = new FormData(form);

    /*
    //remove posição vazias
    for(var pair of formData.entries()) {
        if(pair[1] == ""){
            formData.delete(pair[0]);
        }
     }
     */
    let header = [
        { headerName: 'Content-type', headerValue: "application/json;charset=UTF-8" },
    ];

    formData = JSON.stringify(Object.fromEntries(formData));
    let url = "https://localhost:5001/api/query";
    let data;
    try {
        data = await req(url, "POST", formData, header);
        console.log(data);
    } catch (e) {
        alert("Error ao buscar usuarios\nError: " + e);
    }


});

/*

{
    "user": "string",
    "login": "string",
    "status": 0,
    "birthDayInitial": "2021-11-20T02:09:52.506Z",
    "birthDayLast": "2021-11-20T02:09:52.506Z",
    "firstRegistration": "2021-11-20T02:09:52.506Z",
    "lastRegistration": "2021-11-20T02:09:52.506Z",
    "initialUpdate": "2021-11-20T02:09:52.506Z",
    "lastUpdate": "2021-11-20T02:09:52.506Z",
    "ageGroup": 0
  }


  {
      "user":"asdasd",
      "login":"asdasdasd",
      "status":"0",
      "birthDayInitial":"2021-01-01",
      "birthDayLast":"2021-11-19",
      "firstRegistration":"2021-01-01",
      "lastRegistration":"2021-11-19",
      "initialUpdate":"2021-01-01",
      "lastUpdate":"2021-11-19",
      "ageGroup":"1"
    }

*/