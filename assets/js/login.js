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

document.querySelector("#formLogin").addEventListener("submit", async evt => {
    evt.preventDefault();
    let form = evt.path[0];
    let credential = form[0];
    let password = form[1];

    //let formData = new FormData(form);
    //formData = JSON.stringify(Object.fromEntries(formData));
    let url = `https://localhost:5001/api/Auth/${credential.value}/${password.value}`;
    // let header = [
    //     { headerName: 'Content-type', headerValue: "application/json;charset=UTF-8" },
    // ];
    let auth;
    try {
        credential.setAttribute("disabled", "");
        password.setAttribute("disabled", "");
        form[2].setAttribute("disabled", "");
        auth = await req(url, 'GET');
        createCookie("auth", JSON.stringify(auth), 5);
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