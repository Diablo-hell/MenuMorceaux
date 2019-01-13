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

// ajout des 7 jours de la semaine dans le visuel du menu.
for(u=0;u<7;u++)
{
	$("#TabMenuSemaine").append(''+
						'<div id="Col' + jours[u] + '" class="ccc ColJour">'+
							'<div class="jour ccc">' + jours[u] + ' </br> ' + date + '</div>'+
							'<div class="ConteneurMidiSoir cet">'+
								'<div class="MidiSoir">Midi</div>'+
								'<div class="repasMidiSoir ccc">'+
									'<div class="rbc" ></div>'+
									'<div class="ccc addPlatDiv">'+
										'<button class="addPlatBtn"> + </button>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="ConteneurMidiSoir cet">'+
								'<div class="MidiSoir">Soir</div>'+
								'<div class="repasMidiSoir ccc">'+
									'<div class="rbc" ></div>'+
									'<div class="ccc addPlatDiv">'+
										'<button class="addPlatBtn"> + </button>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<textarea class="notes" placeholder="notes..."></textarea>'+
						'</div>');
}

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
		$(".coursesObj").hide();
		
		$(tab).show();
}
showTabclass(".menuObj");
/* *************** Fin Initialisation *************** */
/* ************************************************** */


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

// affichage du bouton "+" lorsuqu'on passe au dessus d'un jour de la semaine avec un plat
$(".ConteneurMidiSoir").hover(
	function(evt){ // hover IN function
		if($(this).attr("plein")== null)
			{ $(this).find(".addPlatBtn").show(); }
	},
	function(evt){ // hover OUT function
		$(this).find(".addPlatBtn").hide();
	})
// boutons "+" cachés par défaut
$(".addPlatBtn").hide();

// affichage de la sélection de plats sur appui sur "+"
$(".repasMidiSoir .addPlatBtn").click(function(evt){ // hover IN function
	selectionPlat($(this).parents(".repasMidiSoir").find("div:first-child"));
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
})

platHoverInHandler = 
	function(evt){ // hover IN function
		evt.stopPropagation();
		$(this).find(".removePlatBtn").show();
	};
platHoverOutHandler = 
	function(evt){ // hover OUT function
		evt.stopPropagation();
		$(this).find(".removePlatBtn").hide();
	};
	
removePlatBtnClickHandler = 
	function(evt){ // hover OUT function
		evt.stopPropagation();
		$(this).parents(".plat").remove();
	};
/* *************** Fin Section Menu *************** */
/* ************************************************ */


/* ********************************************************** */
/* *************** Section sélection de Plats *************** */
selectionPlat=function(elt)
{// on reconstruit à chaque fois les calbacks pour que le plat choisi soit bien envoyé dans le jour demandé.
	showTabclass(".platsObj");
	
	/* callback click sur les plats */
	$("#listePlatsFavoris  .platSelect").unbind("click");
	$("#listePlatsFavoris  .platSelect *").unbind("click");
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
		if($(last_select).hasClass("platSelect"))
		{
			showTabclass(".menuObj");
			$(elt).append('<div class="plat">'+
							$(last_select).find("th:nth-child(2)").html()+
							$(last_select).find("th:first-child").html()+
							'<button class="removePlatBtn"> &times </button>'+
						'</div>');
			$(elt).find(".removePlatBtn").hide();
			$(".plat").hover(platHoverInHandler , platHoverOutHandler);
			$(".removePlatBtn").click(removePlatBtnClickHandler);
		}
	})
	
	$("#mainQuittButton").unbind("click");
	$("#mainQuittButton").click(function(){
		showTabclass(".menuObj");
	})
	
}
/* *************** Fin Section sélection de Plats *************** */
/* ************************************************************** */

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