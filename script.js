const tabuleiro = document.querySelector("#gameBoard");
const ctx = tabuleiro.getContext("2d");
const textoPontuacao = document.querySelector("#scoreText");
const botaoReiniciar = document.querySelector("#resetBtn");
const larguraJogo = tabuleiro.width;
const alturaJogo = tabuleiro.height;
const corFundo = "white";
const corCobra = "#59ac77";
const tamanhoUnidade = 25;
const tamanhoCabeca = tamanhoUnidade * 1.3;
const offset = (tamanhoCabeca - tamanhoUnidade) / 2;

const imgCabeca = new Image();
imgCabeca.src = "assets/cobrinha.png";

const imgComida = new Image();
imgComida.src = "assets/comidinha.png";

let rodando = false;
let velX = tamanhoUnidade;
let velY = 0;
let comidaX;
let comidaY;
let pontuacao = 0;
let cobra = [
    {x: tamanhoUnidade * 4, y: 0},
    {x: tamanhoUnidade * 3, y: 0},
    {x: tamanhoUnidade * 2, y: 0},
    {x: tamanhoUnidade, y: 0},
    {x: 0, y: 0}
];

window.addEventListener("keydown", mudarDirecao);
botaoReiniciar.addEventListener("click", reiniciarJogo);

iniciarJogo();

function iniciarJogo(){
    rodando = true;
    textoPontuacao.textContent = pontuacao;
    criarComida();
    proximoFrame();
}

function proximoFrame(){
    if(rodando){
        setTimeout(()=>{
            limparTabuleiro();
            desenharComida();
            moverCobra();
            desenharCobra();
            verificarFimDeJogo();
            proximoFrame();
        }, 75);
    }
    else{
        mostrarFimDeJogo();
    }
}

function limparTabuleiro(){
    ctx.fillStyle = corFundo;
    ctx.fillRect(0, 0, larguraJogo, alturaJogo);
}

function criarComida(){
    function posicaoAleatoria(min, max){
        return Math.round((Math.random() * (max - min) + min) / tamanhoUnidade) * tamanhoUnidade;
    }
    comidaX = posicaoAleatoria(0, larguraJogo - tamanhoUnidade);
    comidaY = posicaoAleatoria(0, alturaJogo - tamanhoUnidade);
}

function desenharComida(){
    if (imgComida.complete) {
        ctx.drawImage(imgComida, comidaX, comidaY, tamanhoUnidade, tamanhoUnidade);
    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(comidaX, comidaY, tamanhoUnidade, tamanhoUnidade);
    }
}

function moverCobra(){
    const cabeca = {
        x: cobra[0].x + velX,
        y: cobra[0].y + velY
    };
    cobra.unshift(cabeca);

    if(cobra[0].x === comidaX && cobra[0].y === comidaY){
        pontuacao += 1;
        textoPontuacao.textContent = pontuacao;
        criarComida();
    } else {
        cobra.pop();
    }
}

function desenharCobra() {
    ctx.beginPath();
    ctx.moveTo(
        cobra[0].x + tamanhoUnidade / 2,
        cobra[0].y + tamanhoUnidade / 2
    );

    for (let i = 1; i < cobra.length; i++) {
        const parte = cobra[i];
        ctx.lineTo(
            parte.x + tamanhoUnidade / 2,
            parte.y + tamanhoUnidade / 2
        );
    }

    ctx.strokeStyle = corCobra;
    ctx.lineWidth = tamanhoUnidade;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    const cabeca = cobra[0];
    if (imgCabeca.complete) {
        ctx.drawImage(
            imgCabeca,
            cabeca.x - offset,
            cabeca.y - offset,
            tamanhoCabeca,
            tamanhoCabeca
        );
    }
}

function mudarDirecao(evento){
    evento.preventDefault();
    const tecla = evento.keyCode;
    const ESQUERDA = 37;
    const CIMA = 38;
    const DIREITA = 39;
    const BAIXO = 40;

    const indoCima = (velY === -tamanhoUnidade);
    const indoBaixo = (velY === tamanhoUnidade);
    const indoDireita = (velX === tamanhoUnidade);
    const indoEsquerda = (velX === -tamanhoUnidade);

    switch(true){
        case (tecla === ESQUERDA && !indoDireita):
            velX = -tamanhoUnidade;
            velY = 0;
            break;
        case (tecla === CIMA && !indoBaixo):
            velX = 0;
            velY = -tamanhoUnidade;
            break;
        case (tecla === DIREITA && !indoEsquerda):
            velX = tamanhoUnidade;
            velY = 0;
            break;
        case (tecla === BAIXO && !indoCima):
            velX = 0;
            velY = tamanhoUnidade;
            break;
    }
}

function verificarFimDeJogo(){
    switch(true){
        case (cobra[0].x < 0):
        case (cobra[0].x >= larguraJogo):
        case (cobra[0].y < 0):
        case (cobra[0].y >= alturaJogo):
            rodando = false;
            break;
    }

    for(let i = 1; i < cobra.length; i++){
        if(cobra[i].x === cobra[0].x && cobra[i].y === cobra[0].y){
            rodando = false;
        }
    }
}

function mostrarFimDeJogo(){
    ctx.font = "50px 'Montserrat'";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("MOMO VEI PODI", larguraJogo / 2, alturaJogo / 2);
    rodando = false;
}

function reiniciarJogo(){
    pontuacao = 0;
    velX = tamanhoUnidade;
    velY = 0;
    cobra = [
        {x: tamanhoUnidade * 4, y: 0},
        {x: tamanhoUnidade * 3, y: 0},
        {x: tamanhoUnidade * 2, y: 0},
        {x: tamanhoUnidade, y: 0},
        {x: 0, y: 0}
    ];
    iniciarJogo();
}