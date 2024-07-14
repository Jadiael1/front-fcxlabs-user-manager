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

document.querySelector("#resetCredentialForm").addEventListener("submit", async evt => {
    evt.preventDefault();
    let form = evt.target;
    let credential = form[0];

    //let formData = new FormData(form);
    //formData = JSON.stringify(Object.fromEntries(formData));

    let url = `https://api-fcxlabs-usermanager.juvhost.com/api/Auth/${credential.value}`;
    // let header = [
    //     { headerName: 'Content-type', headerValue: "application/json;charset=UTF-8" },
    // ];
    let auth;
    try {
        auth = await req(url, 'GET');
        createCookie("auth", JSON.stringify(auth), 5);
        document.querySelector("#newPW").innerHTML = `<div class="alert alert-primary" role="alert">Anote sua nova senha: ${auth.password}</div>`;
        alert("Senha Alterada Com Sucesso");
    } catch (e) {
        alert("Não foi possivel alterar sua senha.\nError: " + e);
    }
    //
});