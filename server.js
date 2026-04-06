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
  const entregas = getEntregas();

  // 🔥 TOTAL
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
      .header { background:#3A209D; color:white; padding:15px; }
      .container { padding:10px; }
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
        background:#fff;
        padding:10px;
        margin-top:10px;
        font-weight:bold;
        border-top:2px solid #000;
      }
    </style>
  </head>

  <body>

    <div class="header">
      <b>Carga ${numcar}</b>
    </div>

    <div class="container">
  `;

  entregas.forEach(e => {
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

  // 🔥 TOTAL (SEM MUDAR SUA ESTRUTURA)
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