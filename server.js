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
  const ajudante1 = "WAGNER";
  const ajudante2 = "RENE";

  const entregas = [
    { seq: 1, cliente: "DECIO COMERCIO", bairro: "ZONA RURAL", pallets: 12, itens: 30, peso: 91, creditos: 0 },
    { seq: 2, cliente: "MINIMERCADO ORNELAS", bairro: "PARQUE SAO JORGE", pallets: 5, itens: 10, peso: 30, creditos: 2 }
  ];

  let html = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial;
        font-size: 12px;
        margin: 10px;
      }
      .header {
        border-bottom: 2px solid black;
        margin-bottom: 10px;
        padding-bottom: 5px;
      }
      .title {
        text-align: center;
        font-weight: bold;
        font-size: 16px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid black;
        padding: 4px;
        text-align: left;
      }
      th {
        background: #eee;
      }
      .red {
        color: red;
        font-weight: bold;
      }
    </style>
  </head>

  <body>

    <div class="header">
      <div class="title">ROMANEIO DE ENTREGA</div>
      <br>
      <b>Carga:</b> ${numcar} &nbsp;&nbsp;
      <b>Placa:</b> ${placa} <br>
      <b>Motorista:</b> ${motorista} <br>
      <b>Ajudantes:</b> ${ajudante1} / ${ajudante2}
    </div>

    <table>
      <tr>
        <th>Seq</th>
        <th>Cliente</th>
        <th>Bairro</th>
        <th>Pallet</th>
        <th>Itens</th>
        <th>Peso</th>
      </tr>
  `;

  entregas.forEach(e => {
    html += `
      <tr class="${e.creditos > 0 ? 'red' : ''}">
        <td>${e.seq}</td>
        <td>${e.cliente}</td>
        <td>${e.bairro}</td>
        <td>${e.pallets}</td>
        <td>${e.itens}</td>
        <td>${e.peso}</td>
      </tr>
    `;
  });

  html += `
    </table>

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