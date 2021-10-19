/* ********************************************** */
/* *************** Initialisation *************** */
var calendrier=[];	

calendrier["01-11-18"] = {};

var modeleSemaine = {};
modeleSemaine.dateLundi="181030";
modeleSemaine.repas=[];

calendrier["01-11-18"] = modeleSemaine;	
console.log("calendrier test : " + calendrier["01-11-18"].dateLundi);

jours = ["Lundi","Mardi","Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

$("#headBar #titreMenu").show();
$("#headBar #titrePlats").hide();
$("#headBar #titreCourses").hide();
$("#headBar #mainQuittButton").hide();

var date="7 Juillet";

var NB_MAX_ELTS_REPAS = 2;
var firstMenuLoaded = false;

// *****************************************************************************
// Génération de la liste des plats à partir du fichier JSON demandé au serveur.
function getListePlats()
{
	$.ajax({
		type:"GET",
		url:"plats/plats.json",
		success:function(data,successStr)
		{
			$("#listePlatsFavoris tr:not(.platSelectPatern)").remove();
			console.log("JSON des plats correctement chargé");
			for(plat in data)
			{
				var nouveauPlat = $("#listePlatsFavoris  .platSelectPatern").clone();
				nouveauPlat.removeClass("platSelectPatern");
				nouveauPlat.attr("id",plat);
				nouveauPlat.find(".imgPlat").append($('<img src="plats/'+data[plat].pict+'">'));
				nouveauPlat.find(".nomPlat").text(data[plat].nom);
				
				var listeIngredients = $("<ul></ul>");
				var N_MAX_INGREDIENTS = 4;
				var uLim = Math.min(N_MAX_INGREDIENTS ,data[plat].ingredients.length);
				for(var u=0; u< uLim ;u++)
				{
					listeIngredients.append("<li>"+data[plat].ingredients[u]+"</li>");
				}
				if(data[plat].ingredients.length>N_MAX_INGREDIENTS)
				{
					var extraIngredients = "";
					for(var u=N_MAX_INGREDIENTS-1; u< data[plat].ingredients.length ;u++)
					{
						extraIngredients+=("-"+data[plat].ingredients[u]+"\n");
					}
					$(listeIngredients.find("li")[N_MAX_INGREDIENTS-1]).html("...").attr("title",extraIngredients);
				}
				nouveauPlat.find(".ingredientsPlat").html(listeIngredients);
				
				$("#listePlatsFavoris").append(nouveauPlat);
			}
					
			$("#listePlatsFavoris  .platSelect").unbind("dblclick");
			$("#listePlatsFavoris  .platSelect *").unbind("dblclick");
			$("#listePlatsFavoris  .platSelect").dblclick(platSelectOnDblClick);
			$("#listePlatsFavoris  .platSelect").unbind("click");
			$("#listePlatsFavoris  .platSelect *").unbind("click");
			$("#listePlatsFavoris  .platSelect").click(platSelectOnclick);
			
			if(!firstMenuLoaded)
			{
				chargerMenuSemaine(displayedDate);
				firstMenuLoaded = true;
			}
			
		},
		error:function(jqxhr,data){console.log("errror : " + data);}
	});
};
getListePlats();
// *****************************************************************************

// *******************************************************
// ajout des 7 jours de la semaine dans le visuel du menu.
for(u=0;u<7;u++)
{
	$("#TabMenuSemaine").append(''+
						'<div id="Col' + jours[u] + '" nJour = ' + u + ' class="ccc ColJour">'+
							'<div class="jour ccc">' + jours[u] + ' </br> ' + date + '</div>'+
							'<div class="ConteneurMidiSoir midi cet">'+
								'<div class="midiSoir">Midi</div>'+
								'<div class="repasMidiSoir ccc" nb_elts = 0>'+
									'<div class="csc" ></div>'+
									'<div class="ccc addPlatDiv">'+
										'<button class="addPlatBtn"> + </button>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="ConteneurMidiSoir soir cet">'+
								'<div class="midiSoir">Soir</div>'+
								'<div class="repasMidiSoir ccc" nb_elts = 0>'+
									'<div class="csc" ></div>'+
									'<div class="ccc addPlatDiv">'+
										'<button class="addPlatBtn"> + </button>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<textarea class="notes" placeholder="notes..."></textarea>'+
						'</div>');
}
// *******************************************************

function getWeekNumber(d1) {
    // Copy date so don't modify original
    var d = new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
};

var  displayedDate = getWeekNumber(new Date());

function viderMenu()
{
	var repas = $("#TabMenuSemaine .repasMidiSoir div:first-child");
	for(var u=0; u<repas.length; u++)
	{
		$(repas[u]).html("");
	}
};

function chargerMenuSemaine(date)
{
	$.ajax(
	{
		type:"GET",
		url:"menus/"+date[0]+".json",
		loadToDate : date,
		success:function(jsonFileData,successStr)
		{
			$("#annee").text(this.loadToDate[0]);
			$("#numSemaine").text(this.loadToDate[1]);
			$("#DivMenuSemaine").attr("annee",this.loadToDate[0]);
			$("#DivMenuSemaine").attr("semaine",this.loadToDate[1]);
			
			if(jsonFileData[this.loadToDate[1]] == null)
				return ;
			
			console.log("JSON du menu correctement chargé");
			viderMenu();
			for(var u = 0; u<7;u++ )
			{
				var day = $("#TabMenuSemaine>div:nth-child("+(u+1)+")");
				
				if(jsonFileData[this.loadToDate[1]][u].midi != null)
				{
					var file_thisDayMidi = jsonFileData[this.loadToDate[1]][u].midi;
					for(var v=0; v<file_thisDayMidi.length;v++ )
						ajoutPlatRepas(day.find(".midi .repasMidiSoir>div:first-child()"),file_thisDayMidi[v]);
				}
				if(jsonFileData[this.loadToDate[1]][u].soir != null)
				{
					var file_thisDaySoir = jsonFileData[this.loadToDate[1]][u].soir;
					for(var v=0; v<file_thisDaySoir.length;v++ )
						ajoutPlatRepas(day.find(".soir .repasMidiSoir>div:first-child()"),file_thisDaySoir[v]);
				}
			}
			
			$(".removePlatBtn").click(removePlatBtnClickHandler);
		},
		error:function(jqxhr,data){console.log("errror : " + data);}
		
	});
};


// évènement de click par défaut => un élément sans effet déselectionne le dernier élément.
last_select=null
$("*").click(function(evt){
	evt.stopPropagation();
	// un-select last selected object
	$(last_select).css("border-width","");
	$(last_select).css("border-color","");
	$(last_select).css("border-style","");
	$(last_select).css("border-radius","");
	last_select=null;
	
})

//sélection de la section à afficher
showTabclass = function(tab)
{
		$(".menuObj").hide();
		$(".platsObj").hide();
		$(".nouveauPlat").hide();
		$(".coursesObj").hide();
		
		$(tab).show();
}
showTabclass(".menuObj");

var socket = io.connect(window.location.href);

/* *************** Fin Initialisation *************** */
/* ************************************************** */

// Websocket
socket.on('message', function(message) {
        console.log('Le serveur a un message pour vous : ' + message);
    })

/* ******************************************** */
/* *************** Section Menu *************** */

/* callback click dans les cases conteneurMidiSoir */
$(".ConteneurMidiSoir").unbind("click");
$(".ConteneurMidiSoir *").unbind("click");
$(".ConteneurMidiSoir").click(function(evt){
	evt.stopPropagation();
	$(last_select).css("border-width","");
	$(last_select).css("border-color","");
	$(last_select).css("border-style","");
	$(last_select).css("border-radius","");
	
	$(this).css("border-width","3px");
	$(this).css("border-color","blue");
	$(this).css("border-style","solid");
	$(this).css("border-radius","8px");
	
	console.log("click vu");
	
	if($(last_select).attr("id")=="boutonAjoutPlat")
	{
		selectionPlat($(this).find(".repasMidiSoir > div:first-child()"));
	}
	
	last_select=this;
})

// affichage de la sélection de plats sur appui sur "+"
$(".repasMidiSoir .addPlatBtn").click(function(evt){
	selectionPlat($(this).parents(".repasMidiSoir").find(">div:first-child"));
})


// callback click sur ajout de plats 
$("#boutonAjoutPlat").prop("onclick", null).off("click");
$("#boutonAjoutPlat *").prop("onclick", null).off("click");
$("#boutonAjoutPlat").click(function(evt){
	evt.stopPropagation();
	if($(last_select).hasClass("ConteneurMidiSoir") )
	{
		selectionPlat($(last_select).find(".repasMidiSoir > div:first-child()"));
	} 
	else
	{
		$(this).css("border-width","3px");
		$(this).css("border-color","orange");
		$(this).css("border-style","solid");
		last_select=this;
	}
});

// callback click sur gestion plats 
$("#gestionPlats").prop("onclick", null).off("click");
$("#gestionPlats *").prop("onclick", null).off("click");
$("#gestionPlats").click(function(evt){
	showTabclass(".platsObj");
	$("#sectionPlats #platsOkButton").attr("disabled",1);
	$("#mainQuittButton").unbind("click");
	$("#mainQuittButton").click(function(){
		$("#sectionPlats #platsOkButton").removeAttr("disabled");
		showTabclass(".menuObj");
	});
});
	
removePlatBtnClickHandler =  function(evt){
		evt.stopPropagation();
		updateRepasEltCount($(this), -1);
		$(this).parents(".plat").remove();
		
			sendMenuToServer();
	};

updateRepasEltCount = function(repas, increment)
{
	if( !(repas.hasClass("repasMidiSoir")) )
	{	repas = repas.parents(".repasMidiSoir"); }

	repas.attr("nb_elts",Number(repas.attr("nb_elts")) + increment);
	
	if(Number(repas.attr("nb_elts")) >= NB_MAX_ELTS_REPAS ) 
		{repas.attr("plein",true); }
	else
		{repas.removeAttr("plein"); }
}

function sendMenuToServer()
{
	var nouveauMenu = [];
	for(var u=0; u<7; u++)
	{
		var midi=[];
		var platsMidi = $("#TabMenuSemaine>div:nth-child(" + (u+1) + ") .midi .repasMidiSoir .plat");
		for(var v=0; v<platsMidi.length;v++)
			midi.push(platsMidi[v].id)
		
		var soir=[];
		var platsSoir = $("#TabMenuSemaine>div:nth-child(" + (u+1) + ") .soir .repasMidiSoir .plat");
		for(var v=0; v<platsSoir.length;v++)
			soir.push(platsSoir[v].id)
		
		
		nouveauMenu[u] = { // la numération des nth-child commence à 1
			midi : midi , 
			soir : soir
		}
	}

	var menuJq = $("#DivMenuSemaine");

	toto = nouveauMenu;
	console.log("envoi du nouveau menu !");

	$.ajax({
	  type: "POST",
	  url: "/menu",
	  data: JSON.stringify({[menuJq.attr("annee")]:{[menuJq.attr("semaine")]:nouveauMenu}}),
	  contentType: "application/json"
	});
};
/* *************** Fin Section Menu *************** */
/* ************************************************ */


/* ********************************************************** */
/* *************** Section sélection de Plats *************** */

var lastPlatSelect;

function ajoutPlatRepas(repasJq, idPlat)
{
	showTabclass(".menuObj");
	var platJq = $("#sectionPlats #"+idPlat);
	$(repasJq).append('<div class="plat" id = "' + $(platJq).attr("id") + '" >'+
					$(platJq).find("th:first-child").html()+
					"<span>" + $(platJq).find("th:nth-child(2)").html() + "</span>" + 
					'<button class="removePlatBtn"> &times </button>'+
				'</div>');
	updateRepasEltCount($(repasJq), +1);
};
	

selectionPlat=function(repas)
{// on reconstruit à chaque fois les calbacks pour que le plat choisi soit bien envoyé dans le jour demandé.
	showTabclass(".platsObj");
	
	$("#platsOkButton").unbind("click");
	$("#platsOkButton").click(function(){
		if(lastPlatSelect!=null)
		{	
			if($(lastPlatSelect).hasClass("platSelect"))
			{
				var idPlat = $(lastPlatSelect).attr("id");
				ajoutPlatRepas(repas, idPlat);
				$(".removePlatBtn").click(removePlatBtnClickHandler);
				
				
			}
			sendMenuToServer();
		}
	});
	
	$("#mainQuittButton").unbind("click");
	$("#mainQuittButton").click(function(){
		showTabclass(".menuObj");
	});
	
};

	
/* callback click sur les plats */
platSelectOnDblClick = function(evt){
	evt.stopPropagation();
	if(!$("#platsOkButton").attr("disabled"))
		$("#platsOkButton").trigger("click");
};

platSelectOnclick = function(evt){
	evt.stopPropagation();
	if(lastPlatSelect){
		$(lastPlatSelect).css("border-width","");
		$(lastPlatSelect).css("border-color","");
		$(lastPlatSelect).css("border-style","");
		$(lastPlatSelect).css("border-radius","");
	}
	
	$(this).css("border-width","3px");
	$(this).css("border-color","orange");
	$(this).css("border-style","solid");
	$(this).css("border-radius","8px");
	
	lastPlatSelect=this;
};

deletePlatHandler = function(){
	
	var plat = $(lastPlatSelect).attr("id");
	
	$.ajax({
	  type: "POST",
	  url: "/plat",
	  data: JSON.stringify({deletePlat:{nom:plat}}),
	  contentType: "application/json",
	  complete : function(){$("#mainQuittButton").click();getListePlats();}
	});
};
$("#supprimerPlatButton").unbind("click");
$("#supprimerPlatButton").click(deletePlatHandler);
/* *************** Fin Section sélection de Plats *************** */
/* ************************************************************** */

/* ***************************************************** */
/* *************** Section nouveau Plats *************** */
$("#nouveauPlatButton").click(function(evt){
	showTabclass(".nouveauPlat");
});

$('#sectionNouveauPlat .newInput input').keyup(function(e) {
	if(e.keyCode == 13) // KeyCode de la touche entrée
	{
		str = $(this).val();
		var texte=$("<div>"+str[0].toUpperCase() + str.substr(1)+"</div>");
		var div=$($(this).parent().clone().removeClass("newInput"));
		div.append(texte).find("input").remove();
		$(this).parents("#commentaires, #ingredients").find(".newInput").before(div);
		$(this).val(null);
	}
}); 

$('#platPict #selectPlatPict').change(function(e) {
	
	var img = $(this).parents("#platPict").find("img");
	img.removeClass("defaultImg");
	
	var file = $(this).prop('files')[0];
	// Check if the file is an image.
	if (file.type && !file.type.startsWith('image/')) {
		console.log('File is not an image.', file.type, file);
		return;
	}

	const reader = new FileReader();
	reader.addEventListener('load', (event) => {
		img.attr("src", event.target.result);
	});
	reader.readAsDataURL(file);
});

$("#creerPlatBtn").click(sendNewPLatToServer);


function sendNewPLatToServer()
{
	var nouveauPlat = {};
	nouveauPlat.nom = replaceSpecialChar($("#sectionNouveauPlat #nomPlat input").val());
	nouveauPlat.pict = getImgData64($("#sectionNouveauPlat #platPict img:not(.defaultImg)")[0]).replace(/^data:image\/png;base64,/,"");
	nouveauPlat.ingredients = [];
	var ingredients = $("#sectionNouveauPlat #ingredients>div:not(.newInput)>div:not(.puce)");
	for(var u=0;u<ingredients.length;u++)
	{
		nouveauPlat.ingredients[u]=$(ingredients[u]).html();
	}

	console.log("envoi du nouveau plat !");

	$.ajax({
	  type: "POST",
	  url: "/plat",
	  data: JSON.stringify({newPlat:nouveauPlat}),
	  contentType: "application/json",
	  complete : function(){$("#mainQuittButton").click();getListePlats();}
	});
};

var getImgData64 = function(img)
{
	if(!img)
		return "";
	
	$("html body").append('<canvas id="getImgData64Canvas" style="display:none"></canvas>');
	
	var c = document.querySelector('#getImgData64Canvas');
	c.height = img.naturalHeight;
	c.width = img.naturalWidth;
	var ctx = c.getContext('2d');

	ctx.drawImage(img, 0, 0);
	var base64String = c.toDataURL();
	$("#getImgData64Canvas").remove();
	return base64String
};

replaceSpecialChar = function(str)
{
	var accent = [
		/[\300-\306]/g, /[\340-\346]/g, // A, a
		/[\310-\313]/g, /[\350-\353]/g, // E, e
		/[\314-\317]/g, /[\354-\357]/g, // I, i
		/[\322-\330]/g, /[\362-\370]/g, // O, o
		/[\331-\334]/g, /[\371-\374]/g, // U, u
		/[\321]/g, /[\361]/g, // N, n
		/[\307]/g, /[\347]/g, // C, c
	];
	var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

	for(var i = 0; i < accent.length; i++){
		str = str.replace(accent[i], noaccent[i]);
	}

	return str;
	
}
/* *************** Fin Section nouveau Plats *************** */
/* ********************************************************* */

//setTimeout(function(){showTabclass(".nouveauPlat");},300);

/* Generation des classes flex */
/*
dir=[["r","c"],["row","column"]];
justify=[["s","e","c","b","a","v"],["start","end","center","space-between","space-around","space-evenly"]];
align=[["s","e","c","t"],["flex-start","flex-end","center","stretch"]];
for(u=0;u<2;u++)
	for(v=0;v<6;v++)
		for(w=0;w<4;w++)
		{
			console.log("."+dir[0][u]+justify[0][v]+align[0][w]+"{"+
							"\tflex-direction: " + dir[1][u]+";"+
							"\tjustify-content: " + justify[1][v]+";"+
							"\talign-items: " + align[1][w]+";"+
							"}");
		}*/