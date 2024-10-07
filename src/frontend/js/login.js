function validateForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Validação simples apenas para teste
    if (username === "admin" && password === "admin") {
        alert("Login bem-sucedido!");
        // Redirecionar para a página principal após o login
        window.location.href = "index.html";
        return true;
    } else {
        alert("Nome de usuário ou senha incorretos.");
        return false;
    }
}
