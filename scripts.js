//Obter Locais
const getLocais = async () => {
  let url = 'http://127.0.0.1:5000/locais';
  var localSelect = document.getElementById('local');

  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.locais.forEach(item => {
        var option = document.createElement("option");
        option.value = item.id;
        option.text = item.nome;
        localSelect.appendChild(option);
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

getLocais()

//Obter Reservas
const getReservas = async () => {
  let url = 'http://127.0.0.1:5000/reservas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      limparTabela()
      data.reservas.forEach(item => insertList(item.id, item.data, item.nome_pessoa, item.local))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

getReservas()

// limpar tabelas após atualizar dados
function limparTabela(){
  var table = document.getElementById('reservasTable');

  var linhas = table.rows.length;

  if (linhas > 1) {
    for (var i = 1; i < linhas; i++) {
      table.deleteRow(i);
    }
  }
}

// inserir dados na tabela
const insertList = (id, data, nome_pessoa, local) => {
  //converter data para exibição correta do dia
  var dataConvertida = new Date(data)
  dataConvertida.setDate(dataConvertida.getDate() + 1)

  var reserva = [dataConvertida.toLocaleDateString(), nome_pessoa, local]
  var table = document.getElementById('reservasTable');
  var row = table.insertRow();

  for (var i = 0; i < reserva.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = reserva[i];
  }

  insertButton(id, row.insertCell(-1))
}

//inserir botão de remoção de reservas
const insertButton = (id, parent) => {
  var html = "<button id=\""+id+"\" onClick=\"removerReserva('"+id+"')\">Remover</button>"
  parent.innerHTML = html;

}
//Inserir Reservas
const reservarEspaco = () => {
  let nome_pessoa = document.getElementById("nomePessoa").value;
  let data = document.getElementById("selecioneData").value;
  let local = document.getElementById("local").value;

  if (nome_pessoa === '') {
    alert("Escreva o nome de quem deseja realizar a reserva!");
  } else if (data === '' || new Date(data) <= new Date()) {
    alert("Selecione uma data de reserva maior que a data de hoje!");
  } else if (local === -1) {
    alert("Selecione o local da reserva!");
  } else {
    postItem(data, nome_pessoa, local)
  }
}

// adicionar novas reservas
const postItem = async (data, nome_pessoa, local_id) => {
  const formData = new FormData();
  formData.append('data', data);
  formData.append('nome_pessoa', nome_pessoa);
  formData.append('local_id', local_id);

  let url = 'http://127.0.0.1:5000/reserva';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      if(data.message === undefined) {
        console.log(data)
        alert("Reserva adicionada em nome de: " + data.nome_pessoa)
        location.reload()
      }
      else {
        alert("Error: " + data.message)
      }
    })
    .catch((error) => {
      console.log(error)
    });
}

//remover Reservas
const removerReserva = (id) => {
  if (confirm("Você tem certeza?")) {
    deleteItem(id)
    alert("Removido!")
    location.reload()
  }
}

//função para deletar um item da lista do servidor via requisição DELETE
const deleteItem = (id) => {
  let url = 'http://127.0.0.1:5000/reserva?id=' + id;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}