document.querySelector("#formUserQuery").addEventListener("submit", async evt => {
    evt.preventDefault();

    let form = evt.path[0];

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
    let url = "https://localhost:5001/api/query";
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
            el += `<button type="submit" onclick="removeUser('${objUser}', this)" class="btn btn-danger btn-sm">remove</button>
                <button type="submit" onclick="editUser('${objUser}', this)" class="btn btn-info btn-sm">Edit</button>
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
        }, 120);

    } else {
        console.log("Não há usuarios para essa pesquisa");
    }
});

function editUser(user, el) {
    user = JSON.parse(atob(user));
    let header = [
        { headerName: 'accept', headerValue: "*/*" },
        { headerName: 'Content-Type', headerValue: "application/json" }
    ];
    let url = "https://localhost:5001/api/Users/" + user.id;
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

function activeUser(user, el) {
    user = JSON.parse(atob(user));
    let header = [
        { headerName: 'accept', headerValue: "*/*" },
        { headerName: 'Content-Type', headerValue: "application/json" }
    ];
    let url = "https://localhost:5001/api/Users/" + user.id;
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

    //let url = "https://localhost:5001/api/Users/" + id;
    let header = [
        { headerName: 'accept', headerValue: "*/*" },
        { headerName: 'Content-Type', headerValue: "application/json" }
    ];
    //req(url, "DELETE", "", header);

    let url = "https://localhost:5001/api/Users/" + user.id;

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