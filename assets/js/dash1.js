(async () => {
    let el = "";
    el = `
    <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">Nome</th>
            <th scope="col">Login</th>
            <th scope="col">Email</th>
            <th scope="col">Telefone</th>
            <th scope="col">Aniversario</th>
            <th scope="col">Nome Da Mãe</th>
            <th scope="col">Status</th>
        </tr>
    </thead>
    <tbody>`;
    let tableUsers = document.querySelector("#tableUsers");
    let url = "https://api-fcxlabs-usermanager.juvhost.com/api/Users";
    let header = [
        { headerName: 'Content-type', headerValue: "application/json;charset=UTF-8" },
    ];
    let rd = await req(url, 'GET', "", header);
    rd.forEach(u => {
        el += `
            <tr>
                <th scope="row">${u.id}</th>
                <td>${u.name}</td>
                <td>${u.login}</td>
                <td>${u.email}</td>
                <td>${u.telephone}</td>
                <td>${u.birth_date}</td>
                <td>${u.mother_name}</td>
                <td>${u.status}</td>
            </tr>
        `;
    });

    el += `</tbody>`;

    tableUsers.innerHTML = el;

})();