const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'API FROTALOG OK' });
});

// ================= CARGAS =================
app.get('/cargas', (req, res) => {
  res.json([
    {
      numcar: 12345,
      tipo: "TRANSBORDO",

      motorista_entrega: {
        external_id: 101,
        nome: "JOAO"
      },

      motorista_transbordo: {
        external_id: 202,
        nome: "CARLOS"
      },

      veiculo_principal: "ABC-1234",
      julietas: ["DEF-5678", "GHI-9999"]
    }
  ]);
});

// ================= ROMANEIO (JSON) =================
app.get('/cargas/:numcar/romaneio-view', (req, res) => {
  const numcar = req.params.numcar;

  const placa = "HNL8J25";
  const motorista = "VILMAR";
  const ajudante1 = "307-WAGNER";
  const ajudante2 = "425-RENE";

  const entregas = [
    { cliente: "DECIO COMERCIO", codcli: 10500, bairro: "ZONA RURAL", pallets: 12, itens: 30, peso: 91.090, volume: 0.122, creditos: 0 },
    { cliente: "MINIMERCADO ORNELAS", codcli: 10198, bairro: "PARQUE SAO JORGE", pallets: 12, itens: 2, peso: 5.200, volume: 0.123, creditos: 2 }
  ];

  let html = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial;
        margin:0;
        background:#f4f6f9;
      }

      .header {
        background:#3A209D;
        color:white;
        padding:15px;
        display:flex;
        justify-content:space-between;
        align-items:center;
      }

      .header-info {
        font-size:12px;
      }

      .header img {
        height:40px;
      }

      .container {
        padding:10px;
      }

      .linha {
        background:white;
        padding:8px;
        margin-bottom:6px;
        border-radius:6px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        font-size:12px;
      }

      .cliente {
        font-weight:bold;
      }

      .dados {
        display:flex;
        gap:10px;
      }

      .red {
        color:red;
        font-weight:bold;
      }
    </style>
  </head>

  <body>

    <div class="header">
      <div>
        <div><b>Carga:</b> ${numcar}</div>
        <div class="header-info">Placa: ${placa}</div>
        <div class="header-info">Motorista: ${motorista}</div>
        <div class="header-info">Ajud: ${ajudante1} / ${ajudante2}</div>
      </div>

      <div>
        <img src="https://cdn-icons-png.flaticon.com/512/1995/1995501.png">
      </div>
    </div>

    <div class="container">
  `;

  entregas.forEach(e => {
    html += `
      <div class="linha ${e.creditos > 0 ? 'red' : ''}">
        
        <div>
          <div class="cliente">${e.cliente}</div>
          <div>${e.bairro}</div>
        </div>

        <div class="dados">
          <span>📦 ${e.itens}</span>
          <span>🧱 ${e.pallets}</span>
          <span>⚖️ ${e.peso}</span>
          <span>📐 ${e.volume}</span>
        </div>

      </div>
    `;
  });

  html += `
    </div>
  </body>
  </html>
  `;

  res.send(html);
});
// ================= ENTREGAS =================
app.get('/entregas', (req, res) => {
  res.json([
    {
      numcar: 12345,
      seq_rota: 1,
      cliente: "SUPERMERCADO XYZ",
      endereco: "RUA A, 123",
      bairro: "CENTRO",
      cidade: "MONTE CARMELO",
      telefone: "34999999999",

      paletes: 3,
      valor_total: 1500.50,

      observacao: "ENTREGAR NO FUNDO"
    }
  ]);
});

// ================= TRANSBORDOS =================
app.get('/transbordos', (req, res) => {
  res.json([
    {
      numcar: 12345,

      cidade_origem: "UBERLANDIA",
      cidade_destino: "ARAGUARI",

      motorista_transbordo: {
        nome: "CARLOS"
      },

      motorista_entrega: {
        nome: "JOAO"
      },

      cavalo: "ABC-1234",
      julieta_1: "DEF-5678",
      julieta_2: "GHI-9999"
    }
  ]);
});

// ================= SERVIDOR =================
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});