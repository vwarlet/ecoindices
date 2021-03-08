// CEP
$("#cep-button").click(function(){
  var cep = $("#cep-input").val();
      
  $.getJSON("https://cep.awesomeapi.com.br/:format/:"+cep, function(result){
      var address = result.address;
      var city = result.city;
      var state = result.state;
      document.getElementById("cep").innerHTML = address+", "+city+" - "+state+""; 
  });
  //document.getElementById("cep").innerHTML = "CEP Inválido!"  
});


// Moedas
$.getJSON("https://economia.awesomeapi.com.br/json/all", function(result){
  var dolar = result.USD.bid;
  dolar = Math.round(dolar * 100) / 100;
  
  dolar = dolar.toString().replace(".", ",");
  
  var euro = result.EUR.bid;
  euro = Math.round(euro * 100) / 100;
  euro = euro.toString().replace(".", ",");
  // Se o último dígito for 0 (implícito), terá 3 algarismos 'X,X', então adiciona 0 no final
  if(dolar.length == 3)
    document.querySelector(".dolar").innerHTML = 'R$ '+dolar+'0';
  else 
    document.querySelector(".dolar").innerHTML = 'R$ '+dolar;
  if(euro.length == 3)
    document.querySelector(".euro").innerHTML = 'R$ '+euro+'0';
  else
    document.querySelector(".euro").innerHTML = 'R$ '+euro;
});


// Taxa Selic
$.getJSON("https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json", function(result){
  var len = result.length;
  //var count = Object.keys(result).length;
  document.querySelector(".selic").innerHTML = result[len-1].valor+'% a.a.';
  //console.log(result[count-1]);
});


// Navegação entre as páginas
function paginas(){
  $("#page").load("main.html");
  
  $(".main").click(function() {
    $("#page").load("main.html");
  });

  $(".indices").click(function(){
    $("#page").load("indices_eco.html");
  });

  $(".news").click(function(){
      $("#page").load("news.html");
  });

  $(".debit").click(function(){
    $("#page").load("debit_indices.html");
  });

  $(".sobre").click(function(){
    $("#page").load("about.html");
  });
  /*
  $(".admin").click(function() {
    $("#page").load("/admin/manager.html");
  });
  */
}


// Renderiza do JSON as Últimas Notícias
function ultimas(){
  var url = window.location.host;
  $.getJSON("https://"+url+"/rows/", function(rows){
    for(row = rows.length-1; row > rows.length-5; row--) {
        var p = document.createElement('p');  
        var em = document.createElement('em');
        var strong = document.createElement('strong');
        var a = document.createElement('a');
  
        em.innerHTML = rows[row].data;
        strong.innerHTML = rows[row].titulo;
        a.innerHTML = rows[row].postagem;
  
        p.classList.add('p');
  
        p.appendChild(em);
        p.appendChild(strong);
        p.appendChild(document.createElement("br"));
        p.appendChild(a);
        p.appendChild(document.createElement("br"));
  
        document.getElementById('ultimas').appendChild(p); 
    }
  });
  
  
  $(".more_news").click(function(){
    $("#page").load("news.html");
  });
  }


// Carregar a página de notícias
function news(){
var url = window.location.host;
$.getJSON("https://"+url+"/rows/", function(rows){

  var tamanhoPagina = 5;
  var pagina = 0;

  function paginar() {
      $('p').remove();
      for (var i = pagina * tamanhoPagina; i < rows.length && i < (pagina + 1) *  tamanhoPagina; i++) {//for(row = rows.length-1; row >= 0; row--) {
          var p = document.createElement('p');  
          var em = document.createElement('em');
          var strong = document.createElement('strong');
          var a = document.createElement('a');

          em.innerHTML = rows[i].data;
          strong.innerHTML = rows[i].titulo;
          a.innerHTML = rows[i].postagem;

          p.classList.add('p');

          p.appendChild(em);
          p.appendChild(strong);
          p.appendChild(document.createElement("br"));
          p.appendChild(a);
          p.appendChild(document.createElement("br"));

          document.getElementById('noticias').appendChild(p); 
      }
      $('#numeracao').text('Página ' + (pagina + 1) + ' de ' + Math.ceil(rows.length / tamanhoPagina));
  }

  function ajustarBotoes() {
      $('#proximo').prop('disabled', rows.length <= tamanhoPagina || pagina >= Math.ceil(rows.length / tamanhoPagina) - 1);
      $('#anterior').prop('disabled', rows.length <= tamanhoPagina || pagina == 0);
  }

  $(function() {
      $('#proximo').click(function() {
          if (pagina < rows.length / tamanhoPagina - 1) {
              pagina++;
              paginar();
              ajustarBotoes();
          }
      });
      $('#anterior').click(function() {
          if (pagina > 0) {
              pagina--;
              paginar();
              ajustarBotoes();
          }
      });
      paginar();
      ajustarBotoes();
  });

});

}


// Carregar a página de íncides econômicos
function indices(){
  var url = window.location.host;
  $.getJSON("https://"+url+"/indices/", function(rows){

    for(row in rows){
        var p = document.createElement('p');  
        p.innerHTML = rows[row];
        document.getElementById('indices').appendChild(p); 
    }       
});
}
