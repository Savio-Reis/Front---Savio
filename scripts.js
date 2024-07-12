//Selecionar Marca
const getMarcas = async () => {
  let url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas';
  var marcaSelect = document.getElementById('marca');

  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(item => {
        var option = document.createElement("option");
        option.value = item.codigo;
        option.text = item.nome;
        marcaSelect.appendChild(option);
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

getMarcas()

//Obter Veículos
const getVeículos = async () => {
  let url = 'http://127.0.0.1:5000/veiculos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      limparTabela()
      data.veiculos.forEach(item => insertList(item.marca, item.modelo, item.data_fabricacao, item.valor, item.codigo_fipe))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

getVeículos()



// limpar tabelas após atualizar dados
function limparTabela() {
  var table = document.getElementById('veiculosTable');

  var linhas = table.rows.length;

  if (linhas > 1) {
    for (var i = 1; i < linhas; i++) {
      table.deleteRow(i);
    }
  }
}

//Selecionar Modelo
function getModelos() {
  var marcaSelect = document.getElementById('marca');
  let url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/' + marcaSelect.value + '/modelos';
  var modeloSelect = document.getElementById('modelo');

  while (modeloSelect.firstChild) {
    modeloSelect.removeChild(modeloSelect.firstChild);
  }

  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.modelos.forEach(item => {
        var option = document.createElement("option");
        option.value = item.codigo;
        option.text = item.nome;
        modeloSelect.appendChild(option);
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });

}

//Selecionar Ano
function getAno() {
  var marcaSelect = document.getElementById('marca');
  var modeloSelect = document.getElementById('modelo');
  let url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/' + marcaSelect.value + '/modelos/' + modeloSelect.value + '/anos';
  var anoSelect = document.getElementById('ano');

  while (anoSelect.firstChild) {
    anoSelect.removeChild(anoSelect.firstChild);
  }

  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(item => {
        var option = document.createElement("option");
        option.value = item.codigo;
        option.text = item.nome;
        anoSelect.appendChild(option);
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });

}

//buscar veiculo
function getBusca() {
  var marcaSelect = document.getElementById('marca');
  var modeloSelect = document.getElementById('modelo');
  var anoSelect = document.getElementById('ano');

  let url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/' + marcaSelect.value + '/modelos/' + modeloSelect.value + '/anos/' + anoSelect.value;

  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      let url = 'http://127.0.0.1:5000/veiculo/' + data.CodigoFipe;

      fetch(url, {
        method: 'get',
      })
        .then((response) => response.json())
        .then((veiculo) => {
          if (veiculo.id == undefined) {
            postItem(data.Marca, data.Modelo, data.AnoModelo, data.Valor, data.CodigoFipe);
            insertList(data.Marca, data.Modelo, data.AnoModelo, data.Valor, data.CodigoFipe)
          }
          else {
            alert("Veículo com mesmo código Fipe já inserido!");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    })
    .catch((error) => {
      console.error('Error:', error);
    });

}

// inserir informações no banco de dados
const postItem = async (marca, modelo, data_fabricacao, valor, codigoFipe) => {
  const formData = new FormData();
  formData.append('marca', marca);
  formData.append('modelo', modelo);
  formData.append('data_fabricacao', data_fabricacao);
  formData.append('valor', valor);
  formData.append('codigo_fipe', codigoFipe);

  let url = 'http://127.0.0.1:5000/veiculo';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === undefined) {
        console.log("Veículo adiocionado")
      }
      else {
        alert("Error: " + data.message)
      }
    })
    .catch((error) => {
      console.log(error)
    });
}

// inserir dados na tabela
const insertList = (marca, modelo, ano, valor, codigoFipe) => {
  var veiculo = [marca, modelo, ano, valor, codigoFipe]
  var table = document.getElementById('veiculosTable');
  var row = table.insertRow();

  for (var i = 0; i < veiculo.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = veiculo[i];
  }


  // Inserir botão Editar
  var editCell = row.insertCell(veiculo.length); {
    var editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.onclick = function () {
      editRow(row);
    };
    editCell.appendChild(editButton);

    // Inserir botão Remover
    var removeCell = row.insertCell(veiculo.length + 1);
    var removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.onclick = function () {
      table.deleteRow(row.rowIndex);
      deleteItem(row.cells[4].textContent)
    };
    removeCell.appendChild(removeButton);
  }
}

const deleteItem = (id) => {
  let url = 'http://127.0.0.1:5000/veiculo?codigo_fipe=' + id;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Função para editar uma linha
function editRow(row) {
  // Abrir o modal
  var modal = document.getElementById('editModal');
  modal.style.display = 'block';

  // Preencher os campos de seleção com os dados da linha
  var marcaSelect = document.getElementById('editMarca');
  var modeloSelect = document.getElementById('editModelo');
  var anoSelect = document.getElementById('editAno');

  // Limpar os campos de seleção
  marcaSelect.innerHTML = '';
  modeloSelect.innerHTML = '';
  anoSelect.innerHTML = '';

  // Obter marcas e preencher o campo de seleção
  fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas', {
    method: 'get',
  }) 
    .then((response) => response.json())
    .then((data) => {
      data.forEach(item => {
        var option = document.createElement("option");
        option.value = item.codigo;
        option.text = item.nome;
        marcaSelect.appendChild(option);
      });

      // Selecionar a marca atual
      marcaSelect.value = row.cells[0].textContent;

      if (marcaSelect.valeu === undefined)
        return;

      // Obter modelos da marca selecionada
      getModelosEdit().then(() => {
        // Selecionar o modelo atual
        modeloSelect.value = row.cells[1].textContent;

        // Obter anos do modelo selecionado
        getAnoEdit().then(() => {
          // Selecionar o ano atual
          anoSelect.value = row.cells[2].textContent;
        });
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  // Marcar a linha como sendo editada
  row.classList.add('editing');
}

const putItem = async (marca, modelo, data_fabricacao, valor, codigoFipe, codigoFipeAnterior) => {
  const formData = new FormData();
  formData.append('marca', marca);
  formData.append('modelo', modelo);
  formData.append('data_fabricacao', data_fabricacao);
  formData.append('valor', valor);
  formData.append('codigo_fipe', codigoFipe);
  formData.append('codigo_fipe_anterior', codigoFipeAnterior)

  let url = 'http://127.0.0.1:5000/veiculo';
  fetch(url, {
    method: 'put',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === undefined) {
        console.log("Veículo atualizado")
      }
      else {
        alert("Error: " + data.message)
      }
    })
    .catch((error) => {
      console.log(error)
    });
}

// Função para obter modelos no modal de edição
function getModelosEdit() {
  var marcaSelect = document.getElementById('editMarca');

  let url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/' + marcaSelect.value + '/modelos';
  var modeloSelect = document.getElementById('editModelo');

  while (modeloSelect.firstChild) {
    modeloSelect.removeChild(modeloSelect.firstChild);
  }

  return fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.modelos.forEach(item => {
        var option = document.createElement("option");
        option.value = item.codigo;
        option.text = item.nome;
        modeloSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Função para obter anos no modal de edição
function getAnoEdit() {
  var marcaSelect = document.getElementById('editMarca');
  var modeloSelect = document.getElementById('editModelo');
  let url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/' + marcaSelect.value + '/modelos/' + modeloSelect.value + '/anos';
  var anoSelect = document.getElementById('editAno');

  while (anoSelect.firstChild) {
    anoSelect.removeChild(anoSelect.firstChild);
  }

  return fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(item => {
        var option = document.createElement("option");
        option.value = item.codigo;
        option.text = item.nome;
        anoSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Fechar o modal ao clicar no botão de fechar
var modal = document.getElementById('editModal');
var span = document.getElementsByClassName('close')[0];
span.onclick = function () {
  modal.style.display = 'none';
}

// Fechar o modal ao clicar fora dele
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Função para salvar as alterações
function saveChanges() {
  var marcaSelect = document.getElementById('editMarca');
  var modeloSelect = document.getElementById('editModelo');
  var anoSelect = document.getElementById('editAno');

  let url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/' + marcaSelect.value + '/modelos/' + modeloSelect.value + '/anos/' + anoSelect.value;

  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      // Atualizar a linha da tabela com os novos valores
      var row = document.querySelector('.editing');
      row.cells[0].textContent = data.Marca;
      row.cells[1].textContent = data.Modelo;
      row.cells[2].textContent = data.AnoModelo;
      row.cells[3].textContent = data.Valor;

      codigoFipeAnterior = row.cells[4].textContent;
      row.cells[4].textContent = data.CodigoFipe;

      putItem(data.Marca, data.Modelo, data.AnoModelo, data.Valor, data.CodigoFipe, codigoFipeAnterior)
    })
    .catch((error) => {
      console.error('Error:', error);
    });


  // Fechar o modal
  modal.style.display = 'none';

  // Remover a classe de edição
  row.classList.remove('editing');
}

