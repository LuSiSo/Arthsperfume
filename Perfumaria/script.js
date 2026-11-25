
// ===================================
// 1. ELEMENTOS DO HTML
// ===================================

const formulario = document.getElementById("form-perfume");
const listaPerfumes = document.getElementById("lista-perfumes");
const pesquisa = document.getElementById("pesquisa");


// ===================================
// 2. CARREGAR DADOS
// ===================================

let perfumes = JSON.parse(localStorage.getItem("perfumes")) || [];


// ===================================
// 3. SALVAR DADOS
// ===================================

function salvarDados() {
    localStorage.setItem("perfumes", JSON.stringify(perfumes));
}


// ===================================
// 4. CADASTRAR PERFUME
// ===================================

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const marca = document.getElementById("marca").value;
    const volume = document.getElementById("volume").value;
    const preco = document.getElementById("preco").value;
    const descricao = document.getElementById("descricao").value;
    const fragrantica = document.getElementById("fragrantica").value;
    const arquivo = document.getElementById("imagem").files[0];

    if (!arquivo) {
        alert("Selecione uma fotografia!");
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function() {

        const perfume = {
            id: Date.now(),
            nome: nome,
            marca: marca,
            volume: volume,
            preco: Number(preco),
            descricao: descricao,
            fragrantica: fragrantica,
            imagem: leitor.result
        };

        perfumes.push(perfume);

        salvarDados();
        mostrarPerfumes();

        formulario.reset();

        alert("Perfume cadastrado com sucesso!");

    };

    leitor.readAsDataURL(arquivo);

});


// ===================================
// 5. EXIBIR PERFUMES
// ===================================

function mostrarPerfumes(filtro = "") {

    listaPerfumes.innerHTML = "";

    const resultado = perfumes.filter(function(perfume) {

        return (
            perfume.nome.toLowerCase().includes(filtro.toLowerCase()) ||
            perfume.marca.toLowerCase().includes(filtro.toLowerCase())
        );

    });

    resultado.forEach(function(perfume) {

        const card = document.createElement("div");
        card.classList.add("card-perfume");

        const imagem = document.createElement("img");
        imagem.src = perfume.imagem;
        imagem.alt = perfume.nome;
        imagem.title = "Clique para divulgar";

        imagem.addEventListener("click", function() {
            copiarDivulgacao(perfume);
        });

        const titulo = document.createElement("h3");
        titulo.textContent = perfume.nome;

        const marca = document.createElement("p");
        marca.textContent = perfume.marca;

        const preco = document.createElement("p");
        preco.textContent = perfume.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("btn-excluir");

        botaoExcluir.addEventListener("click", function() {
            excluirPerfume(perfume.id);
        });

        card.appendChild(imagem);
        card.appendChild(titulo);
        card.appendChild(marca);
        card.appendChild(preco);
        card.appendChild(botaoExcluir);

        listaPerfumes.appendChild(card);

    });

}


// ===================================
// 6. GERAR TEXTO DE DIVULGAÇÃO
// ===================================

function gerarDivulgacao(perfume, linkAmazon) {

    const preco = perfume.preco.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    return `*${perfume.nome} (${perfume.volume}ml)*

-${perfume.descricao}

📎${linkAmazon}
💰R$${preco}!!!!!!!`;

}


// ===================================
// 7. COPIAR DIVULGAÇÃO
// ===================================

async function copiarDivulgacao(perfume) {

    const linkAmazon = prompt("Cole o link promocional da Amazon:");

    if (linkAmazon === null) return;

    if (!linkAmazon.trim()) {
        alert("Você precisa inserir o link promocional!");
        return;
    }

    const texto = gerarDivulgacao(perfume, linkAmazon.trim());

    try {

        await navigator.clipboard.writeText(texto);

        alert("Divulgação copiada com sucesso!");

    } catch (erro) {

        alert("Não foi possível copiar. Verifique se está usando HTTPS ou localhost.");

    }

}


// ===================================
// 8. COMPARTILHAR DIVULGAÇÃO
// ===================================

async function compartilharPerfume(perfume) {

    const linkAmazon = prompt("Cole o link promocional da Amazon:");

    if (linkAmazon === null) return;

    if (!linkAmazon.trim()) {
        alert("Você precisa inserir o link promocional!");
        return;
    }

    const texto = gerarDivulgacao(perfume, linkAmazon.trim());

    if (navigator.share) {

        try {

            await navigator.share({
                title: perfume.nome,
                text: texto
            });

        } catch (erro) {

            if (erro.name !== "AbortError") {
                alert("Não foi possível compartilhar.");
            }

        }

    } else {

        copiarDivulgacaoComTexto(texto);

    }

}


// ===================================
// 9. CÓPIA ALTERNATIVA
// ===================================

async function copiarDivulgacaoComTexto(texto) {

    try {

        await navigator.clipboard.writeText(texto);
        alert("Texto copiado!");

    } catch (erro) {

        alert("Não foi possível copiar.");

    }

}


// ===================================
// 10. EXCLUIR PERFUME
// ===================================

function excluirPerfume(id) {

    const confirmar = confirm("Deseja excluir este perfume?");

    if (!confirmar) return;

    perfumes = perfumes.filter(function(perfume) {
        return perfume.id !== id;
    });

    salvarDados();
    mostrarPerfumes();

}


// ===================================
// 11. PESQUISAR PERFUMES
// ===================================

pesquisa.addEventListener("input", function() {

    mostrarPerfumes(pesquisa.value);

});


// ===================================
// 12. INICIAR CATÁLOGO
// ===================================

mostrarPerfumes();
