// Função para capturar eventos
function capturaEventos(obj, evt, fn) {
	// Verifica se o objeto suporta addEventListener
	if(obj.addEventListener){
		obj.addEventListener(evt, fn, true);
	} 
	// Adiociona attachEvent da Microsoft
	else {
		var evento = 'on' + evt;
		obj.attachEvent(evento, fn);
	}
}
// Cancela evento
function cancelaEvento(evt){
	// Verifica se o evento suporta stopPropagation
	if(evt.stopPropagation) {
		// Aplica-se para Firefox, Chrome e demais
		evt.stopPropagation();
		evt.preventDefault();
	} else {
		// Aplica-se para IEs antigos
		evt.cancelBubble = true;
		evt.returnValue = false;
	}
}
// Função para capturar a requisição XMLHttpRequest
function verificaXmlHttp() {
	// Uma variável sem valor
	var xmlhttp;
	// Verifica se suporta XMLHttpRequest
	if (window.XMLHttpRequest) {
		// Adiciona o valor à variável
		xmlhttp = new XMLHttpRequest();
	} else {
		// Adiciona ActiveXObject da Microsoft 
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	// Retorna o valor
	return xmlhttp;
}


page = 1;
max_pages = 0;

// Mostra a página anterior
function previousPage(){
	if(page > 1) page--;
	console.log(page);
	reloadPages();
}

// Mostra a próxima pagina
function nextPage(){
	if(page < max_pages) page++;
	console.log(page);
	reloadPages();
}

// Captura evento load da página
capturaEventos(window, 'load', function(evt){
	// Localiza o link com id "a"
	//var a = document.getElementById('a');
	
	// Captura o evento de clique neste link
	//capturaEventos(a, 'click', function(evt){
		
	//});

	reloadPages(evt);
});


// Funcao para separar a página atual do resto da array
function paginacao(array, reg_per_page, page_number){
  --page_number;
  return array.slice(page_number * reg_per_page, (page_number + 1) * reg_per_page);
}

function reloadPages(evt){
	var xmlhttp = verificaXmlHttp();

		// Verifica os estados da requisição
		xmlhttp.onreadystatechange = function(){
			// Verifica se a página foi carregada corretamente
			if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				var dadosJSON;
				try {
					dadosJSON = JSON.parse(xmlhttp.responseText);
				} catch(e) {
					eval("dadosJSON = (" + xmlhttp.responseText + ");");
				}

				// Localiza nossa div dentro do HTML
				var div = document.getElementById('texto');
				var div2 = document.getElementById('visto');

				recommendation = dadosJSON.data.recommendation;
				// total de paginas
				max_pages = Math.ceil((recommendation.length) / 4);

				// registros por pagina
				reg_per_page = 4;
				// total de registros
				total_reg = recommendation.length;

				// separa a pagina atual do resto da array
				array_paginada = paginacao(recommendation, 4, page);

				// limpa o conteudo para uma nova pagina
				div.innerHTML = "";
				div2.innerHTML = "<div class='bloco'><img src='"+dadosJSON.data.reference.item.imageName+"'><div class='descricao'><a href='"+dadosJSON.data.reference.item.detailUrl+"' target='_black'>"+dadosJSON.data.reference.item.name.substr(0,60)+"..."+"</a><span class='preco_antigo'>"+dadosJSON.data.reference.item.oldPrice+"</span><span class='valores'>Por: <span class='preco maior'>"+dadosJSON.data.reference.item.price+"</span> "+dadosJSON.data.reference.item.productInfo.paymentConditions+"</span></div></div>";

				var toAdd = document.createDocumentFragment();

                for(var block in array_paginada){
                	

                	block_business_id = array_paginada[block].businessId;
                   	block_name = array_paginada[block].name.substr(0,60)+"...";
                   	block_img = array_paginada[block].imageName;
                   	block_detail_link = array_paginada[block].detailUrl;
                   	block_price = array_paginada[block].price;
                   	block_old_price = array_paginada[block].oldPrice;
                   	block_old_price = (block_old_price == null) ? "" : "De: "+block_old_price;
                   	block_payment = array_paginada[block].productInfo.paymentConditions;

                   	var bloco = document.createElement("DIV");
                   	bloco.className = "bloco";
                   	bloco.innerHTML = '<img src="'+block_img+'"> <div class="descricao"><a href="'+block_detail_link+'" target="_black">'+block_name+'</a><span class="preco_antigo">'+block_old_price+'</span><span class="valores">Por: <span class="preco maior">'+block_price+'</span> ou <span class="preco">'+block_payment+'</span> sem juros</span> </div>';

                   	toAdd.appendChild(bloco);

                }
                div.appendChild(toAdd);			
			}
		}
		
		// Abre a requisição com o método e url
		xmlhttp.open('GET', 'assets/js/dados.json', true);
		// Modifica o MimeType da requisição
        /*
        xmlhttp.setRequestHeader( 'Access-Control-Allow-Origin', '*');
        xmlhttp.setRequestHeader( 'Content-Type', 'application/json' );*/
      
      
        xmlhttp.setRequestHeader('Access-Control-Allow-Headers', '*');
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
		// Envia os valores
		xmlhttp.send(null);
		
		// Checagem para os IEs antigos
		var evento = evt ? evt.preventDefault() : window.event;
		// Cancela o evento
		// cancelaEvento(evento);
}