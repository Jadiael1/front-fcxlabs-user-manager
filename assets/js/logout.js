document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelector("#btnLogout").addEventListener("click", evt => {
        evt.preventDefault();
        let path = window.location.pathname.replace("login.html", "");
        path = window.location.pathname.replace("dash.html", "");
        document.cookie = `auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
        window.location.href = "./login.html";
    });
});
