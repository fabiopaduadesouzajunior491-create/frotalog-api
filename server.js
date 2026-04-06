const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'API FROTALOG OK' });
});

// ================= DADOS BASE (SIMULA SELECT) =================
function getEntregas() {
  return [
    {
      codcli: 10500,
      cliente: "DECIO COMERCIO",
      bairro: "ZONA RURAL",
      cidade: "MONTE CARMELO",
      seq: 1,
      pallets: 12,
      itens: 30,
      peso: 91.090,
      volume: 0.122,
      creditos: 0,
      lat: -18.724,
      lng: -47.491
    },
    {
      codcli: 10198,
      cliente: "MINIMERCADO ORNELAS",
      bairro: "PARQUE SAO JORGE",
      cidade: "MONTE CARMELO",
      seq: 2,
      pallets: 5,
      itens: 2,
      peso: 5.200,
      volume: 0.123,
      creditos: 2,
      lat: -18.720,
      lng: -47.480
    }
  ];
}

// ================= CARGAS =================
app.get('/cargas', (req, res) => {
  res.json([
    {
      numcar: 12345,
      tipo: "TRANSBORDO",
      motorista_entrega: { external_id: 101, nome: "JOAO" },
      motorista_transbordo: { external_id: 202, nome: "CARLOS" },
      veiculo_principal: "ABC-1234",
      julietas: ["DEF-5678", "GHI-9999"]
    }
  ]);
});

// ================= ROMANEIO =================
app.get('/cargas/:numcar/romaneio-view', (req, res) => {
  const numcar = req.params.numcar;

  const placa = "QNU5479";
  const motorista = "LEONILDO";
  const ajudante1 = "2017-TERCEIROS1";
  const ajudante2 = "553-NATANAEL";
  const data = "06/04/2026";
  const box = "20";

  let entregas = getEntregas();

  // ORDEM CORRETA
  entregas.sort((a, b) => a.seq - b.seq);

  // TOTAIS
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
  padding-right:120px; /* 🔥 espaço pra logo */
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

      .motoristas {
        margin-top:10px;
        display:flex;
        gap:20px;
        font-size:13px;
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

.box-linha {
  font-weight:bold;
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
  <div></div> <!-- vazio pra manter alinhamento -->
</div>

    <div class="linha-motoristas">
  <div class="lado-esquerdo">
    <span>Motorista: ${motorista || 'NÃO DEFINIDO'}</span>
    <span>Ajudante 1: ${ajudante1}</span>
    <span>Ajudante 2: ${ajudante2}</span>
  </div>

  <div class="box-linha">
    BOX: ${box}
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
// ================= ENTREGAS (APP) =================
app.get('/entregas', (req, res) => {
  const entregas = getEntregas();

  res.json(entregas);
});

// ================= TRANSBORDOS =================
app.get('/transbordos', (req, res) => {
  res.json([
    {
      numcar: 12345,
      cidade_origem: "UBERLANDIA",
      cidade_destino: "ARAGUARI",
      motorista_transbordo: { nome: "CARLOS" },
      motorista_entrega: { nome: "JOAO" },
      cavalo: "ABC-1234"
    }
  ]);
});

// ================= SERVIDOR =================
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando');
});