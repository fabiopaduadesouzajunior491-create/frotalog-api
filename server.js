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
        MIN(W.NUMSEQENTREGA) AS SEQ,
        C.CODCLI,
        MAX(C.CLIENTE) AS CLIENTE,
        NVL(C.BAIRROENT, C.BAIRROCOB) AS BAIRRO,
        C.MUNICENT,
        COUNT(DISTINCT W.NUMPALETE) AS PALLETS,
        SUM(W.QT) AS ITENS,
        SUM(W.QT * A.PESOBRUTO) AS PESO,
        SUM(W.QT * A.VOLUME) AS VOLUME,
        (SELECT COUNT(F.LANCAMENTO)
         FROM FMCREDITOS F
         WHERE F.CODCLI = C.CODCLI
         AND F.STATUS = 'P'
         AND F.NUMCARENV = 0) AS CREDITOS
      FROM PCPEDC P
      JOIN PCCLIENT C ON C.CODCLI = P.CODCLI
      JOIN PCMOVENDPEND W ON W.NUMPED = P.NUMPED
      JOIN PCPRODUT A ON A.CODPROD = W.CODPROD
      WHERE P.NUMCAR = :NUMCAR
        AND W.NUMCAR = :NUMCAR
        AND W.DTESTORNO IS NULL
        AND P.DTCANCEL IS NULL
      GROUP BY
        C.CODCLI,
        NVL(C.BAIRROENT, C.BAIRROCOB),
        C.MUNICENT
      ORDER BY MIN(W.NUMSEQENTREGA)
      `,
      { NUMCAR: Number(numcar) }
    );

    await conn.close();

    return result.rows.map(e => ({
      seq: e[0],
      codcli: e[1],
      cliente: e[2],
      bairro: e[3],
      cidade: e[4],
      pallets: e[5] || 0,
      itens: e[6] || 0,
      peso: e[7] || 0,
      volume: e[8] || 0,
      creditos: e[9] || 0
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