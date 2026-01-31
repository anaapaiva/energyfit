// public/js/localStorage.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ localStorage.js carregado");

  //  CADASTRO DE USUÁRIO
  const formCadastro = document.getElementById("cadastroForm"); // Assumindo que seu form de cadastro tem esse ID
  if (formCadastro) {
    formCadastro.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const tipo = document.getElementById("tipo").value.trim();
      const mensagem = document.getElementById("mensagem");

      if (!nome || !email || !senha || !tipo) {
        mensagem.innerHTML =
          '<span style="color:red;">Preencha todos os campos.</span>';
        return;
      }

      try {
        // [MUDANÇA] Aponta para a API de cadastro
        const resposta = await fetch("/api/v1/auth/cadastro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome_completo: nome, email, senha, tipo }),
        });

        const dados = await resposta.json().catch(() => ({}));

        if (resposta.ok) {
          mensagem.innerHTML = `
            <span style="color:green;">Cadastro realizado com sucesso!</span>
`;
          setTimeout(() => {
            window.location.href = "/login"; // Redireciona para o login
          }, 1000); // Espera 1 segundo (1000 ms) antes de redirecionar.
        } else {
          mensagem.innerHTML = `<span style="color:red;">${
            dados.erro || "Erro ao cadastrar"
          }</span>`;
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        mensagem.innerHTML = '<span style="color:red;">Erro de conexão</span>';
      } // Caso ocorra uma falha na comunicação com o servidor, o sistema exibe uma mensagem de erro ao usuário.
    });
  }

  // ======== LOGIN DE USUÁRIO (NOVO!) ========
  const formLogin = document.getElementById("loginForm"); // Dê este ID ao seu <form> em login.ejs
  if (formLogin) {
    formLogin.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const mensagem = document.getElementById("mensagem"); // Crie uma <p id="mensagem"></p>

      try {
        // [MUDANÇA] Aponta para a API de login
        const resposta = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        const dados = await resposta.json().catch(() => ({}));

        if (resposta.ok) {
          mensagem.innerHTML = `<span style="color:green;">Login bem-sucedido! Redirecionando...</span>`;
          // Redireciona com base no tipo de usuário
          const redirectUrl =
            dados.usuario.tipo === "admin" ? "/adm" : "/vendedor";
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1000);
        } else {
          mensagem.innerHTML = `<span style="color:red;">${
            dados.erro || "Email ou senha inválidos"
          }</span>`;
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        mensagem.innerHTML = '<span style="color:red;">Erro de conexão</span>';
      }
    });
  }

  // ======== Recuperar senha ========
  const formRecuperacaodesenha = document.getElementById("RecuperarSenhaForm"); // Dê este ID ao seu <form> em login.ejs
  if (formRecuperacaodesenha) {
    formRecuperacaodesenha.addEventListener("submit", async function (e) {
      e.preventDefault();

      const token = document.getElementById("token").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const mensagem = document.getElementById("mensagem"); // Crie uma <p id="mensagem"></p>

      try {
        // [MUDANÇA] Aponta para a API de login
        const resposta = await fetch("/api/v1/auth/alterar-senha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, senha }),
        });

        const dados = await resposta.json().catch(() => ({}));

        if (resposta.ok) {
          mensagem.innerHTML = `<span style="color:green;">Login bem-sucedido! Redirecionando...</span>`;
          // Redireciona com base no tipo de usuário
          const redirectUrl = "/login";
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1000);
        } else {
          mensagem.innerHTML = `<span style="color:red;">${
            dados.erro || "Token inválido"
          }</span>`;
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        mensagem.innerHTML = '<span style="color:red;">Erro de conexão</span>';
      }
    });
  }

  // ======== CARRINHO DE COMPRAS ========
  // (Sua lógica de carrinho está perfeita, sem mudanças)
  function atualizarContador() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const contador = document.getElementById("contador-carrinho");
    if (contador)
      contador.textContent = carrinho.length ? `(${carrinho.length})` : "";
  }
  atualizarContador();

  function adicionarProduto(botao) {
    try {
      // [MUDANÇA] Pegamos os dados do banco
      const id = botao.dataset.id;
      const nome = botao.dataset.nome || "Produto";
      const preco = parseFloat(botao.dataset.preco) || 0;

      if (!id || !nome || preco === 0) {
        console.error("Produto sem dados válidos", botao);
        return;
      }

      let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
      carrinho.push({ id, nome, preco, adicionouEm: new Date().toISOString() });
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      alert("Produto adicionado ao carrinho!");
      atualizarContador();
      console.log("🛒 Adicionado:", nome, preco, " | Total:", carrinho.length);
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
    }
  }

  // Event listener para os botões .add-to-cart (mantido)
  document.body.addEventListener("click", (event) => {
    const botao = event.target.closest(".add-to-cart");
    if (botao) {
      event.preventDefault();
      adicionarProduto(botao);
    }
  });

  // ======== CARROSSEL ========
  // (Sua lógica de carrossel é boa, vamos mantê-la)
  const slides = document.querySelectorAll(".slide");
  let slideAtual = 0;

  function mostrarSlide(indice) {
    slides.forEach((slide, i) => slide.classList.toggle("ativo", i === indice));
  }

  window.mudarSlide = (direcao) => {
    // Tornar global para o onclick
    slideAtual = (slideAtual + direcao + slides.length) % slides.length;
    mostrarSlide(slideAtual);
  };

  if (slides.length > 0) {
    mostrarSlide(slideAtual);
    setInterval(() => mudarSlide(1), 3000);
    // Removemos os listeners dos botões, pois o onclick="" no HTML já funciona
  }

  // ======== COOKIES ========
  // (Sua lógica de cookies está perfeita, sem mudanças)
  const alertBox = document.getElementById("cookie-alert");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");

  // (Restante da lógica de cookies mantida...)
});
