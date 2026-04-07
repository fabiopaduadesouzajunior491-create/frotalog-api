const oracledb = require('oracledb');
const express = require('express');
const { getConnection } = require('./db/oracle');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= TESTE API =================
app.get('/', (req, res) => {
  res.json({ message: 'API FROTALOG OK' });
});

// ================= ORACLE =================
async function getEntregasOracle(numcar) {
  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `
      SELECT 
        (SELECT COUNT(F.LANCAMENTO) 
         FROM FMCREDITOS F 
         WHERE F.CODCLI = C.CODCLI 
         AND F.STATUS = 'P' 
         AND F.NUMCARENV = 0) AS CREDITOS,
        C.MUNICENT,
        NVL(C.BAIRROENT, C.BAIRROCOB) AS BAIRRO,
        MIN(W.NUMSEQENTREGA) AS SEQ,
        C.CODCLI,
        MAX(C.CLIENTE) AS CLIENTE,
        SUM(W.QT) AS QTDE,
        SUM(W.QT * A.PESOBRUTO) AS PESO,
        SUM(W.QT * A.VOLUME) AS VOLUME
      FROM PCPEDC P
      JOIN PCCLIENT C ON C.CODCLI = P.CODCLI
      JOIN PCMOVENDPEND W ON W.NUMPED = P.NUMPED
      JOIN PCPRODUT A ON A.CODPROD = W.CODPROD
      WHERE P.NUMCAR = :NUMCAR
        AND W.NUMCAR = :NUMCAR
        AND W.DTESTORNO IS NULL
        AND P.DTCANCEL IS NULL
      GROUP BY
        C.MUNICENT,
        NVL(C.BAIRROENT, C.BAIRROCOB),
        C.CODCLI
      ORDER BY MIN(W.NUMSEQENTREGA)
      `,
      { NUMCAR: Number(numcar) }
    );

    await conn.close();

    const cidades = {};
    const totalGeral = {
      entregas: 0,
      itens: 0,
      peso: 0,
      volume: 0
    };

    result.rows.forEach(e => {
      const creditos = e[0];
      const cidade = e[1];
      const bairro = e[2];
      const seq = e[3];
      const codcli = e[4];
      const cliente = e[5];
      const itens = e[6];
      const peso = e[7];
      const volume = e[8];

      if (!cidades[cidade]) {
        cidades[cidade] = {
          cidade,
          entregas: [],
          totais: { entregas: 0, itens: 0, peso: 0, volume: 0 }
        };
      }

      cidades[cidade].entregas.push({
        seq,
        codcli,
        cliente,
        bairro,
        itens,
        peso,
        volume,
        creditos
      });

      cidades[cidade].totais.entregas += 1;
      cidades[cidade].totais.itens += itens;
      cidades[cidade].totais.peso += peso;
      cidades[cidade].totais.volume += volume;

      totalGeral.entregas += 1;
      totalGeral.itens += itens;
      totalGeral.peso += peso;
      totalGeral.volume += volume;
    });

    return {
      cidades: Object.values(cidades),
      totalGeral
    };

  } catch (err) {
    console.error("Erro Oracle:", err);
    return { cidades: [], totalGeral: { entregas: 0, itens: 0, peso: 0, volume: 0 } };
  }
}

// ================= ROMANEIO =================
app.get('/cargas/:numcar/romaneio-view', async (req, res) => {
  const numcar = req.params.numcar;

  const data = await getEntregasOracle(numcar);

  let html = `
  <html>
  <body style="font-family: Arial; margin:0;">
  
  <div style="background:#4b2ca3;color:white;padding:10px;">
    <div><b>Carga: ${numcar}</b></div>
    <div style="text-align:center;font-size:20px;">
      <b>ROTEIRO DE ENTREGAS DO CARREGAMENTO</b>
    </div>
  </div>
  `;

  data.cidades.forEach(c => {
    html += `
    <div style="background:black;color:white;padding:6px;margin-top:10px;">
      <b>${c.cidade}</b>
    </div>
    `;

    c.entregas.sort((a, b) => a.seq - b.seq);

    c.entregas.forEach(e => {

      const cor = e.creditos > 0 ? 'red' : 'black';

      html += `
      <div style="display:flex;justify-content:space-between;padding:6px;border-bottom:1px solid #ddd;color:${cor};">
        <div style="width:40%;">
          ${e.codcli} - ${e.cliente}
        </div>
        <div style="width:20%;">${e.bairro}</div>
        <div style="width:10%;text-align:center;">${e.itens}</div>
        <div style="width:15%;text-align:right;">${e.peso.toFixed(2)}</div>
        <div style="width:15%;text-align:right;">${e.volume.toFixed(3)}</div>
      </div>
      `;
    });

    html += `
    <div style="text-align:right;font-weight:bold;padding:6px;background:#eee;">
      TOTAL: ${c.totais.entregas} entregas | 
      ${c.totais.itens} itens | 
      ${c.totais.peso.toFixed(2)} kg | 
      ${c.totais.volume.toFixed(3)} m³
    </div>
    `;
  });

  html += `
  <div style="text-align:right;font-weight:bold;padding:10px;font-size:18px;">
    TOTAL GERAL: ${data.totalGeral.entregas} entregas | 
    ${data.totalGeral.itens} itens | 
    ${data.totalGeral.peso.toFixed(2)} kg | 
    ${data.totalGeral.volume.toFixed(3)} m³
  </div>
  `;

  html += `</body></html>`;

  res.send(html);
});

// ================= SERVIDOR =================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});