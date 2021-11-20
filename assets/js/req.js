let req = (url, method, formData = "", h = {}) => new Promise((resolve, reject) => {
    let xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            resolve(JSON.parse(this.responseText));
        } else if (this.readyState == 4 && this.status !== 200 && this.status !== 0) {
            reject(JSON.parse(this.responseText));
        } else if (this.readyState == 4 && this.status == 0) {
            console.log("Error: desconhecido, Resposta do servidor: " + url + ", não recebida.");
            reject("Error: desconhecido, Resposta do servidor não recebida.");
        }
    }
    xmlhttp.open(method, url, true);
    if (h.length > 0) {
        h.forEach(el => {
            xmlhttp.setRequestHeader(el.headerName, el.headerValue);
        });
    }
    //xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(formData);
});