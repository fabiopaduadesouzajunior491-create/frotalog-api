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

// ================= ROMANEIO VIEW (HTML) =================
app.get('/cargas/:numcar/romaneio-view', (req, res) => {
  const numcar = req.params.numcar;

  const placa = "HNL8J25";
  const motorista = "VILMAR";
  const ajudante1 = "307-WAGNER";
  const ajudante2 = "425-RENE";

  const entregas = [
    { codcli: 10500, cliente: "DECIO COMERCIO", bairro: "ZONA RURAL", pallets: 12, itens: 30, peso: 91.090, volume: 0.122, creditos: 0 },
    { codcli: 10198, cliente: "MINIMERCADO ORNELAS", bairro: "PARQUE SAO JORGE", pallets: 12, itens: 2, peso: 5.200, volume: 0.123, creditos: 2 }
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
      }

      .header-top {
        display:flex;
        justify-content:space-between;
        align-items:center;
      }

      .titulo {
        font-size:20px;
        font-weight:bold;
      }

      .sub {
        font-size:13px;
      }

      .logo {
        height:50px;
      }

      .container {
        padding:10px;
      }

      .linha {
        background:white;
        border-radius:6px;
        padding:10px;
        margin-bottom:6px;
        display:grid;
        grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
        align-items:center;
        font-size:12px;
      }

      .cliente {
        font-weight:bold;
      }

      .bairro {
        text-align:center;
      }

   .text-left {
  text-align: left;
}

.text-center {
  text-align: left;
}

      .red {
        color:red;
        font-weight:bold;
      }

      .col-header {
        font-weight:bold;
        padding:5px 10px;
        display:grid;
        grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
        font-size:12px;
      }

    </style>
  </head>

  <body>

    <div class="header">
      <div class="header-top">
        <div>
          <div class="titulo">Carga ${numcar}</div>
          <div class="sub">Placa: ${placa}</div>
          <div class="sub">Motorista: ${motorista}</div>
          <div class="sub">Ajud: ${ajudante1} / ${ajudante2}</div>
        </div>

        <img class="logo" src="https://raw.githubusercontent.com/fabiopaduadesouzajunior491-create/Foto-LogoFmartins/b1135004c387367383a8550d0e005737dee48236/Gemini_Generated_Image_xysmojxysmojxysm.png">
      </div>
    </div>

    <div class="container">

      <div class="col-header">
        <div>Cliente</div>
        <div>Bairro</div>
        <div>Pallet</div>
        <div>Itens</div>
        <div>Peso</div>
        <div>Vol</div>
      </div>
  `;

  entregas.forEach(e => {
    html += `
      <div class="linha ${e.creditos > 0 ? 'red' : ''}">

        <div>
          <div class="cliente">${e.codcli} - ${e.cliente}</div>
        </div>

        <div class="bairro text-left">${e.bairro}</div>

<div class="text-center">${e.pallets}</div>
<div class="text-center">${e.itens}</div>
<div class="text-center">${e.peso.toFixed(3)}</div>
<div class="text-center">${e.volume.toFixed(3)}</div>

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
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando');
});