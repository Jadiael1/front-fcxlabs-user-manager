function createCookie(name, value, minutes) {
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    let path = window.location.pathname.replace("login.html", "");
    document.cookie = name + "=" + value + expires + "; path=" + path;
}

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

var params = getSearchParameters();
if (params.user != undefined && params.password != undefined) {
    if (params.user.length > 0 && params.password.length > 0) {
        document.querySelector("#credential").value = params.user;
        document.querySelector("#password").value = params.password;
        let url = window.location.toString();
        let newURL = url.replace(`?user=${params.user}&password=${params.password}`, '');
        window.history.pushState('', '', newURL);
    }
}

document.querySelector("#formLogin").addEventListener("submit", async evt => {
    evt.preventDefault();
    let form = evt.target;
    let credential = form[0];
    let password = form[1];

    //let formData = new FormData(form);
    //formData = JSON.stringify(Object.fromEntries(formData));
    let url = `https://api-fcxlabs-usermanager.juvhost.com/api/Auth/${credential.value}/${password.value}`;
    // let header = [
    //     { headerName: 'Content-type', headerValue: "application/json;charset=UTF-8" },
    // ];
    let auth;
    try {
        credential.setAttribute("disabled", "");
        password.setAttribute("disabled", "");
        form[2].setAttribute("disabled", "");
        auth = await req(url, 'GET');
        createCookie("auth", JSON.stringify(auth), 15);
        credential.removeAttribute("disabled");
        password.removeAttribute("disabled");
        form[2].removeAttribute("disabled");
        window.location.href = "./dash.html";
    } catch (e) {
        alert("Falha ao realizar Login");
        credential.removeAttribute("disabled");
        password.removeAttribute("disabled");
        form[2].removeAttribute("disabled");
    }


    /*
    let auth = rd.filter((u, i) => (u.login === credential.value && u.password === password.value && u.status === true));
    if(auth.length > 0){
        createCookie("auth", "true", 5);
        window.location.href = "./dash.html";
    }else{
        alert("Erro ao fazer login");
    }
    */
});