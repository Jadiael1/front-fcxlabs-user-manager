document.querySelector("#formUserQuery").addEventListener("submit", async evt => {
    evt.preventDefault();

    let form = evt.target;

    let formData = new FormData(form);

    formData = Object.fromEntries(formData);

    //remove posição vazias
    for (let i = 0; i < Object.values(formData).length; i++) {
        if (Object.values(formData)[i] == "") {
            delete formData[Object.keys(formData)[i]];
            i--;
        }
    }

    let header = [
        { headerName: 'Content-type', headerValue: "application/json;charset=UTF-8" },
    ];

    formData = JSON.stringify(formData);
    let url = "https://api-fcxlabs-usermanager.juvhost.com/api/query";
    let data;
    try {
        data = await req(url, "POST", formData, header);
    } catch (e) {
        alert("Error ao buscar usuarios\nError: " + e);
    }

    if (data.length > 0) {
        document.getElementById("formUserQuery").style.display = "none";
        let el = "";

        el = `
        <thead>
            <tr>
                <th scope="col">id</th>
                <th scope="col">Nome</th>
                <th scope="col">Login</th>
                <th scope="col">Email</th>
                <th scope="col">Telefone</th>
                <th scope="col">Aniversario</th>
                <th scope="col">Nome Da Mãe</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>`;
        data.forEach((u, k) => {
            let objUser = btoa(JSON.stringify(data[k]));
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
                    <td>`;
            if (!u.status)
                el += `<button type="submit" onclick="activeUser('${objUser}', this)" class="btn btn-primary btn-sm">Ativar</button>`;
            el += `<button type="submit" onclick="removeUser('${objUser}', this)" class="btn btn-danger btn-sm">Deletar</button>
                <button type="submit" onclick="showModal('${objUser}', this)" class="btn btn-info btn-sm">Editar</button>
                    </td >
                </tr >
            `;
        });
        el += `</tbody > `;
        document.querySelector("#tableUsers").innerHTML = el;

        setTimeout(() => {
            $(document).ready(function () {
                $('#tableUsers').DataTable({
                    "pagingType": "full_numbers",
                    "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]]
                });
                document.querySelector("#tableUsers_last").click();
            });
            document.querySelector("#newSearch").style.display = "";
            document.querySelector("#btnExportExcel").style.display = "";
            document.querySelector("#btnExportPDF").style.display = "";
            document.querySelector("#btnExportWORD").style.display = "";
            document.querySelector("#btnNewUser").style.display = "";
        }, 120);

    } else {
        console.log("Não há usuarios para essa pesquisa");
    }
});

function modal(user, el) {
    user = JSON.parse(atob(user));
    let modalEl = document.createElement("div");
    modalEl.classList.add("modal", "fade");
    modalEl.id = `editUser-${user.id}`;
    modalEl.setAttribute("tabindex", "-1");
    modalEl.setAttribute("aria-labelledby", `editUser-${user.id}`);
    modalEl.setAttribute("aria-hidden", "true");
    let update_at = new Date().toISOString();
    let el1 = `
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="editUser-${user.id}">${user.login}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">


        <form id="updateuser" onSubmit="return editUser(this);">
            <div class="row"> 
                <div class="mb-3 col-6">
                    <label for="inputName1" class="form-label">Nome</label>
                    <input type="text" class="form-control" value="${user.name}" id="inputName1" name="name" aria-describedby="nameHelp" required>
                    <div id="nameHelp" class="form-text">Digite seu novo nome</div>
                </div>

                <div class="mb-3 col-6">
                    <label for="inputLogin1" class="form-label">Login</label>
                    <input type="text" class="form-control" value="${user.login}" id="inputLogin1" name="login" aria-describedby="loginHelp" required>
                    <div id="loginHelp" class="form-text">Digite seu novo login</div>
                </div>

                <div class="mb-3 col-6">
                    <label for="inputPassword" class="form-label">Senha</label>
                    <input type="password" class="form-control" value="${user.password}" id="inputPassword" name="password" aria-describedby="passwordHelp" required>
                    <div id="passwordHelp" class="form-text">Digite sua nova senha</div>
                </div>

                <div class="mb-3 col-6">
                    <label for="inputPasswordConfirmation" class="form-label">Conrme sua senha</label>
                    <input type="password" class="form-control" value="${user.password}" id="inputPasswordConfirmation" aria-describedby="passwordConfirmationHelp" required>
                    <div id="passwordConfirmationHelp" class="form-text">Confirme sua nova senha</div>
                </div>

                <div class="mb-3 col-6">
                    <label for="inputEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" value="${user.email}" id="inputEmail" name="email" aria-describedby="emailHelp" required>
                    <div id="emailHelp" class="form-text">Informe seu novo email</div>
                </div>

                <div class="mb-3 col-6">
                    <label for="inputTelphone" class="form-label">Telefone</label>
                    <input type="text" class="form-control" value="${user.telephone}" id="inputTelphone" name="telephone" aria-describedby="telHelp" required>
                    <div id="telHelp" class="form-text">Informe seu novo telefone</div>
                </div>

                <div class="mb-3 col-6">
                    <label for="inputBirthDate" class="form-label">Data de aniversario</label>
                    <input type="date" class="form-control" value="${new Date(user.birth_date).toISOString().split('T')[0]}" id="inputBirthDate" name="birth_date" aria-describedby="birthDateHelp" required>
                    <div id="birthDateHelp" class="form-text">Informe a data de seu nascimento</div>
                </div>

                <div class="mb-3 col-6">
                    <label for="inputMotherName" class="form-label">Nome da mãe</label>
                    <input type="text" class="form-control" value="${user.mother_name}" id="inputMotherName" name="mother_name" aria-describedby="motherNameHelp" required>
                    <div id="motherNameHelp" class="form-text">Informe o novo nome da sua mãe</div>
                </div>

                <input type="hidden" name="id" value="${user.id}" required>
                <input type="hidden" name="status" value="${user.status}" required>
                <input type="hidden" name="created_at" value="${user.created_at}" required>
                <input type="hidden" name="updated_at" value="${update_at}" required>
                
            </div>
        </form>

            
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="closeModal" data-bs-dismiss="modal">Close</button>
            <button type="submit" form="updateuser" class="btn btn-primary">Atualizar</button>
        </div>
        </div>
    </div>
    `;
    modalEl.innerHTML = el1;
    let referenceNode = document.querySelector("#btnNewUser");
    //insert after
    referenceNode.parentNode.insertBefore(modalEl, referenceNode.nextSibling);

    let myModal = new bootstrap.Modal(modalEl, {
        keyboard: true,
        focus: true,
        backdrop: 'static'
    })
    myModal.show();

    modalEl.addEventListener('hidden.bs.modal', function (event) {
        myModal.dispose();
    })
}

function showModal(user, el) {
    modal(user, el);
}

function editUser(form) {
    let formData = new FormData(form);
    formData = Object.fromEntries(formData);
    let header = [
        { headerName: 'accept', headerValue: "*/*" },
        { headerName: 'Content-Type', headerValue: "application/json" }
    ];
    let url = "https://api-fcxlabs-usermanager.juvhost.com/api/Users/" + formData.id;

    formData.id = parseInt(formData.id, 10);
    formData.status = JSON.parse(formData.status.toLowerCase());

    formData = JSON.stringify(formData);
    req(url, "PUT", formData, header);
    setTimeout(() => {
        document.querySelector("#closeModal").click();
    }, 1000);
    return false;
}

function activeUser(user, el) {
    user = JSON.parse(atob(user));
    let header = [
        { headerName: 'accept', headerValue: "*/*" },
        { headerName: 'Content-Type', headerValue: "application/json" }
    ];
    let url = "https://api-fcxlabs-usermanager.juvhost.com/api/Users/" + user.id;
    let obj = {
        "id": user.id,
        "name": user.name,
        "login": user.login,
        "password": user.password,
        "email": user.email,
        "telephone": user.telephone,
        "birth_date": user.birth_date,
        "mother_name": user.mother_name,
        "status": true,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    };
    obj = JSON.stringify(obj);
    req(url, "PUT", obj, header);
    el.parentElement.parentElement.children[7].innerText = "true"
    el.remove();
}

function removeUser(user, el) {
    user = JSON.parse(atob(user));

    //let url = "https://api-fcxlabs-usermanager.juvhost.com/api/Users/" + id;
    let header = [
        { headerName: 'accept', headerValue: "*/*" },
        { headerName: 'Content-Type', headerValue: "application/json" }
    ];
    //req(url, "DELETE", "", header);

    let url = "https://api-fcxlabs-usermanager.juvhost.com/api/Users/" + user.id;

    let obj = {
        "id": user.id,
        "name": user.name,
        "login": user.login,
        "password": user.password,
        "email": user.email,
        "telephone": user.telephone,
        "birth_date": user.birth_date,
        "mother_name": user.mother_name,
        "status": false,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    };
    obj = JSON.stringify(obj);
    req(url, "PUT", obj, header);

    el.parentElement.parentElement.remove();
}

document.querySelector("#newSearch").addEventListener("click", evt => {
    evt.preventDefault();
    $('#tableUsers').DataTable().destroy();
    document.querySelector("#newSearch").style.display = "none";
    document.querySelector("#tableUsers").innerHTML = ``;
    document.getElementById("formUserQuery").style.display = "";
    document.getElementById("btnExportExcel").style.display = "none";
    document.getElementById("btnExportPDF").style.display = "none";
    document.getElementById("btnExportWORD").style.display = "none";
    document.getElementById("btnNewUser").style.display = "none";

});

document.querySelector("#btnExportExcel").addEventListener("click", evt => {
    evt.preventDefault();

    let downloadLink;
    let dataType = 'application/vnd.ms-excel';
    let tableSelect = document.getElementById("tableUsers");
    let tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    let filename = "tableData";

    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        let blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();

        setTimeout(() => {
            downloadLink.remove();
        }, 2000);
    }
});

document.querySelector("#btnExportPDF").addEventListener("click", evt => {
    html2canvas(document.getElementById('tableUsers'), {
        onrendered: function (canvas) {
            var data = canvas.toDataURL();
            var docDefinition = {
                content: [{
                    image: data,
                    width: 500
                }]
            };
            pdfMake.createPdf(docDefinition).download("Table.pdf");
        }
    });
});

document.querySelector("#btnExportWORD").addEventListener("click", evt => {
    evt.preventDefault();
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";
    var html = preHtml + document.getElementById("tableUsers").innerHTML + postHtml;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    let filename = "tableData";
    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

    // Specify file name
    filename = filename ? filename + '.doc' : 'document.doc';

    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = url;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();

        setTimeout(() => {
            downloadLink.remove();
        }, 2000);
    }

    document.body.removeChild(downloadLink);

});

document.querySelector("#btnNewUser").addEventListener("click", evt => {
    evt.preventDefault();
    window.location.href = "./register.html";
});