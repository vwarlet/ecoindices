function news() {
  var url = window.location.host;
  // Lista todas as notícias
  $.getJSON("https://"+url+"/rows/", function (rows) {
    var tamanhoPagina = 4;
    var pagina = 0;

    function paginar() {
      $("p").remove();
      for (var i = pagina * tamanhoPagina; i < rows.length && i < (pagina + 1) * tamanhoPagina; i++) {
        var p = document.createElement("p");
        var em = document.createElement("em");
        var strong = document.createElement("strong");
        var a = document.createElement("a");

        em.innerHTML = rows[i].data;
        strong.innerHTML = rows[i].titulo;
        a.innerHTML = rows[i].postagem;

        /* Formulario para excluir */
        var form = document.createElement("form");
        form.setAttribute("action", "/delete");
        form.setAttribute("method", "post");

        var input = document.createElement("input");
        input.setAttribute("value", rows[i].id);
        input.setAttribute("name", "id");
        input.setAttribute("hidden", "true");

        var button = document.createElement("button");
        button.classList.add("excluir");
        button.classList.add("btn");
        button.setAttribute("type", "submit");

        var excluir = document.createElement("i");
        excluir.setAttribute("class", "fas fa-trash-alt");

        /* Editar */
        var edit_a = document.createElement("a");
        edit_a.classList.add("editar");
        edit_a.classList.add("btn");
        edit_a.setAttribute("id", rows[i].id);
        edit_a.setAttribute("href","/admin/update_post.html?"+rows[i].id);

        var editar = document.createElement("i");  
        editar.setAttribute("class", "fas fa-edit");
        
        /* Appends */
        button.appendChild(excluir);
        edit_a.appendChild(editar);
        form.appendChild(input);
        form.appendChild(button);
        p.appendChild(form);
        p.appendChild(edit_a);
        p.appendChild(em);
        p.appendChild(strong);
        p.appendChild(document.createElement("br"));
        p.appendChild(a);
        p.appendChild(document.createElement("br"));

        document.getElementById("edit_noticias").appendChild(p);
       
      }

      $("#numeracao").text("Página " + (pagina + 1) + " de " + Math.ceil(rows.length / tamanhoPagina));

      $(".excluir").click(function () {
        console.log("clicou");
        var result = confirm(
          "Tem certeza que deseja excluir essa postagem inteira?"
        );
        if (result == true) {
          return true;
        } else {
          return false;
        }
      });

      
    }

    function ajustarBotoes() {
      $("#proximo").prop(
        "disabled",
        rows.length <= tamanhoPagina ||
        pagina >= Math.ceil(rows.length / tamanhoPagina) - 1
      );
      $("#anterior").prop(
        "disabled",
        rows.length <= tamanhoPagina || pagina == 0
      );
    }

    $(function () {
      $("#proximo").click(function () {
        if (pagina < rows.length / tamanhoPagina - 1) {
          pagina++;
          paginar();
          ajustarBotoes();
        }
      });
      $("#anterior").click(function () {
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


// Abre a postagem selecionada para edição
function editar(){
    var id = window.location.search;
    id = id.substring(id.indexOf("?")+1);
    var url = window.location.host;
    $.getJSON("https://"+url+"/rows/", function(rows){
      for(row in rows){
        if(rows[row].id == id){
          var t = document.getElementById('titulo');
          t.setAttribute("value", rows[row].titulo);
          var p = document.getElementById('postagem');
          p.value = rows[row].postagem;
          // saving and getting data ckeditor
        }
      }
		
	  });
}
