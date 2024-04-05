import "./index.css";
import { useState } from "react";
import Swal from "sweetalert2";
import usuarioService from "../../services/usuario-service";

function Login() {
    const [email, setEmail] = useState("admin@admin.com");
    const [senha, setSenha] = useState("123456");

    const handleAutenticar = () => {
        if (!email || !senha) {
            Swal.fire({
                icon: 'error',
                text: "Os campos de e-mail e senha são obrigatórios"
            });
        } else {
            // Call autenticar function from usuarioService
            usuarioService.autenticar(email, senha)
                .then(response => {
                    // Handle successful authentication
                    console.log("Authentication successful:", response);
                    usuarioService.salvarToken(response.data.token);
                    usuarioService.salvarUsuario(response.data.usuario);
                    window.location ="/"
                    // Optionally, you can redirect the user to another page
                })
                .catch(erro => {
                    // Handle authentication error
                    console.error("Authentication error:", erro);
                    // Display error message to the user
                    Swal.fire({
                        icon: 'error',
                        text: "Erro ao autenticar usuário. Por favor, tente novamente."
                    });
                });
        }
    };

    return (
        <>


            <div className="box-login">
                <div className="título-login">
                    <h1> Login</h1>
                </div>

                <div className="grupo">
                    <label htmlFor="email">E-mail:</label> <br />
                    <input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="grupo">
                    <label htmlFor="senha">Senha:</label> <br />
                    <input
                        id="senha"
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                <div className="esqueci-minha-senha">
                    <a href="#">Esqueci minha senha</a>
                </div>

                <button id="btn-entrar" onClick={handleAutenticar}>Entrar</button>
                <button id="btn-criar">Criar Cadastro</button>
            </div>
        </>
    );
}

export default Login;


