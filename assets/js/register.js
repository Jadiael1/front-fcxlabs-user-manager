document.querySelector("#formRegister").addEventListener("submit", async evt => {
    evt.preventDefault();
    let form = evt.target;
    let formData = new FormData(form);
    formData = Object.fromEntries(formData);
    let header = [
        { headerName: 'accept', headerValue: "text/plain" },
        { headerName: 'Content-Type', headerValue: "application/json; charset=utf-8" }
    ];
    let getPAram = `user=${formData.login}&password=${formData.password}`;
    formData = JSON.stringify(formData);
    
    let url = "https://api-fcxlabs-usermanager.juvhost.com/api/Users";
    let data;
    try {
        data = await req(url, "POST", formData, header);
        window.location.href = "./login.html?"+getPAram;
    }catch(e){
        alert("Error ao realizar cadastro!\npossiveis causas: login e email já estão cadastrados em nossa base de dados.");
    }
})