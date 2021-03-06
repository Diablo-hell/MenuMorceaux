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

date="7 Juillet";

var NB_MAX_ELTS_REPAS = 2;

// *****************************************************************************
// Génération de la liste des plats à partir du fichier JSON demandé au serveur.
$.ajax({
	type:"GET",
	url:"plats/plats.json",
	success:function(data,successStr)
	{
		console.log("JSON des plats correctement chargé");
		for(plat in data.plats)
		{
			var nouveauPlat = $("#listePlatsFavoris  .platSelectPatern").clone();
			nouveauPlat.removeClass("platSelectPatern");
			nouveauPlat.attr("id",data.plats[plat].nom.replace(/\s/g,"_"));
			nouveauPlat.find(".imgPlat").append($('<img src="plats/'+data.plats[plat].pict+'">'));
			nouveauPlat.find(".nomPlat").text(data.plats[plat].nom);
			
			$("#listePlatsFavoris").append(nouveauPlat);
		}
		
		chargerMenuSemaine(displayedDate);
	},
	error:function(jqxhr,data){console.log("errror : " + data);}
});
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
			for(var u = 0; u<7;u++ )
			{
				var day = $("#TabMenuSemaine>div:nth-child("+(u+1)+")");
				
				if(jsonFileData[this.loadToDate[1]][u].midi != null)
					ajoutPlatRepas(day.find(".midi .repasMidiSoir>div:first-child()"),jsonFileData[this.loadToDate[1]][u].midi);
				if(jsonFileData[this.loadToDate[1]][u].soir != null)
					ajoutPlatRepas(day.find(".soir .repasMidiSoir>div:first-child()"),jsonFileData[this.loadToDate[1]][u].soir);
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


// callback click sur ajoutde plats 
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
		nouveauMenu[u] = { // la numération des nth-child commence à 1
			midi : $("#TabMenuSemaine>div:nth-child(" + (u+1) + ") .midi .repasMidiSoir .plat").attr("id") , 
			soir : $("#TabMenuSemaine>div:nth-child(" + (u+1) + ") .soir .repasMidiSoir .plat").attr("id")
		}
	}

	var menuJq = $("#DivMenuSemaine");

	toto = nouveauMenu;
	console.log("envoi du nouveau menu !");

	$.ajax({
	  type: "POST",
	  url: "/api",
	  data: JSON.stringify({[menuJq.attr("annee")]:{[menuJq.attr("semaine")]:nouveauMenu}}),
	  contentType: "application/json"
	});
};
/* *************** Fin Section Menu *************** */
/* ************************************************ */


/* ********************************************************** */
/* *************** Section sélection de Plats *************** */


function ajoutPlatRepas(repasJq, idPlat)
{
	showTabclass(".menuObj");
	var platJq = $("#sectionPlats #"+idPlat.replace(/\s/g,"_"));
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
	
	/* callback click sur les plats */
	$("#listePlatsFavoris  .platSelect").unbind("click");
	$("#listePlatsFavoris  .platSelect *").unbind("click");
	$("#listePlatsFavoris  .platSelect").unbind("dblclick");
	$("#listePlatsFavoris  .platSelect *").unbind("dblclick");
	$("#listePlatsFavoris  .platSelect").click(function(evt){
		evt.stopPropagation();
		try{
			$(last_select).css("border-width","");
			$(last_select).css("border-color","");
			$(last_select).css("border-style","");
			$(last_select).css("border-radius","");
		}catch(e){}
		
		$(this).css("border-width","3px");
		$(this).css("border-color","orange");
		$(this).css("border-style","solid");
		$(this).css("border-radius","8px");
		
		last_select=this;
	})
	$("#listePlatsFavoris  .platSelect").dblclick(function(evt){
		evt.stopPropagation();
		$("#platsOkButton").trigger("click");
	})
	
	$("#platsOkButton").unbind("click");
	$("#platsOkButton").click(function(){
		if(last_select!=null)
		{	
			if($(last_select).hasClass("platSelect"))
			{
				var idPlat = $(last_select).attr("id");
				ajoutPlatRepas(repas, idPlat);
				$(".removePlatBtn").click(removePlatBtnClickHandler);
				
				
			}
			sendMenuToServer();
		}
	})
	
	$("#mainQuittButton").unbind("click");
	$("#mainQuittButton").click(function(){
		showTabclass(".menuObj");
	})
	
}
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
		var div=$($(this).parent().clone());
		div.append(texte).find("input").remove();
		$(this).parents("#commentaires, #ingrédients").find(".newInput").before(div);
		$(this).val(null);
	}
}); 

$('#platPict #selectPlatPict').change(function(e) {
	console.log("fichier ! ");
	
	var img = $(this).parents("#platPict").find("img");
	img.removeClass("defautImg");
	
	var file = $(this).prop('files')[0];
	// Check if the file is an image.
	if (file.type && !file.type.startsWith('image/')) {
		console.log('File is not an image.', file.type, file);
		return;
	}

	const reader = new FileReader();
	reader.addEventListener('load', (event) => {
		console.log("event.target.result");
		console.log(event.target.result);
		img.attr("src", event.target.result);
	});
	reader.readAsDataURL(file);
}); 
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