const oracledb = require('oracledb');
const express = require('express');
const { getConnection } = require('./db/oracle');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= TESTE API =================
app.get('/', (req, res) => {
  res.json({ message: 'API FROTALOG OK' });
});

// ================= ORACLE (FORMATO DO HTML ANTIGO) =================
async function getEntregasOracle(numcar) {
  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `
     SELECT 
  C.CODCLI,
  C.CLIENTE
FROM PCCLIENT C
WHERE ROWNUM <= 10,
      { NUMCAR: Number(numcar) }
    );

    await conn.close();

    return result.rows.map(e => ({
  seq: 1,
  codcli: e[0],
  cliente: e[1],
  bairro: "TESTE",
  cidade: "TESTE",
  pallets: 0,
  itens: 0,
  peso: 0,
  volume: 0,
  creditos: 0
    }));

  } catch (err) {
    console.error("Erro Oracle:", err);
    return [];
  }
}

// ================= ROMANEIO (SEU HTML ORIGINAL) =================
app.get('/cargas/:numcar/romaneio-view', async (req, res) => {
  const numcar = req.params.numcar;

  const placa = "QNU5479";
  const motorista = "LEONILDO";
  const ajudante1 = "2017-TERCEIROS1";
  const ajudante2 = "553-NATANAEL";
  const data = "06/04/2026";
  const box = "20";

  let entregas = await getEntregasOracle(numcar);

  entregas.sort((a, b) => a.seq - b.seq);

  let totalItens = 0;
  let totalPeso = 0;
  let totalVolume = 0;

  entregas.forEach(e => {
    totalItens += e.itens;
    totalPeso += e.peso;
    totalVolume += e.volume;
  });

  let html = `
  <html>
  <head>
    <style>
      body { font-family: Arial; margin:0; background:#f4f6f9; }

      .header {
        background:#3A209D;
        color:white;
        padding:15px;
        padding-right:120px;
        position:relative;
      }

      .data {
        font-size:11px;
        position:absolute;
        top:5px;
        left:10px;
      }

      .titulo {
        text-align:center;
        font-size:22px;
        font-weight:bold;
      }

      .linha-topo {
        display:grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items:center;
        margin-top:5px;
      }

      .carga {
        font-size:18px;
        font-weight:bold;
        text-align:left;
      }

      .placa {
        text-align:center;
        font-size:14px;
      }

      .box {
        text-align:right;
        font-size:14px;
      }

      .linha-motoristas {
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-top:10px;
        font-size:13px;
      }

      .lado-esquerdo {
        display:flex;
        gap:20px;
      }

      .logo {
        position:absolute;
        right:10px;
        top:10px;
        height:90px;
      }

      .container { padding:10px; }

      .cidade {
        background:black;
        color:white;
        padding:5px;
        margin-top:10px;
        font-weight:bold;
      }

      .linha {
        background:white;
        border-radius:6px;
        padding:10px;
        margin-bottom:6px;
        display:grid;
        grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
        font-size:12px;
      }

      .text-left { text-align:left; }
      .text-center { text-align:center; }

      .red { color:red; font-weight:bold; }

      .total {
        background:white;
        padding:10px;
        margin-top:10px;
        font-weight:bold;
        border-top:2px solid #000;
        text-align:right;
      }
    </style>
  </head>

  <body>

    <div class="header">

      <div class="data">Data: ${data}</div>

      <div class="titulo">
        ROTEIRO DE ENTREGAS DO CARREGAMENTO
      </div>

      <div class="linha-topo">
        <div class="carga">Carga: ${numcar}</div>
        <div class="placa">Placa: ${placa}</div>
        <div class="box">BOX: ${box}</div>
      </div>

      <div class="linha-motoristas">
        <div class="lado-esquerdo">
          <span>Motorista: ${motorista || 'NÃO DEFINIDO'}</span>
          <span>Ajudante 1: ${ajudante1}</span>
          <span>Ajudante 2: ${ajudante2}</span>
        </div>
      </div>

      <img class="logo" src="https://raw.githubusercontent.com/fabiopaduadesouzajunior491-create/Foto-LogoFmartins/254a5c44e3b1060d1953d4d7215012af1b015942/caminh%C3%A3o.png">

    </div>

    <div class="container">
  `;

  let ultimaCidade = "";

  entregas.forEach(e => {

    if (e.cidade !== ultimaCidade) {
      html += `<div class="cidade">${e.cidade}</div>`;
      ultimaCidade = e.cidade;
    }

    html += `
      <div class="linha ${e.creditos > 0 ? 'red' : ''}">
        <div class="text-left">${e.codcli} - ${e.cliente}</div>
        <div class="text-left">${e.bairro}</div>
        <div class="text-center">${e.pallets}</div>
        <div class="text-center">${e.itens}</div>
        <div class="text-center">${e.peso.toFixed(3)}</div>
        <div class="text-center">${e.volume.toFixed(3)}</div>
      </div>
    `;
  });

  html += `
    <div class="total">
      TOTAL: ${entregas.length} entregas | 
      ${totalItens} itens | 
      ${totalPeso.toFixed(2)} kg | 
      ${totalVolume.toFixed(3)} m³
    </div>
  `;

  html += `
    </div>
  </body>
  </html>
  `;

  res.send(html);
});

// ================= SERVIDOR =================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});