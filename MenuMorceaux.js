
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
$("#sectionPlats").hide();

for(u=0;u<7;u++)
{
	$("#TabMenuSemaine").append(''+
						'<div id="Col' + jours[u] + '" class="ccc ColJour">'+
							'<div class="jour ccc">' + jours[u] + '</div>'+
							'<div class="ConteneurMidiSoir">'+
								'<div class="MidiSoir">Midi</div>'+
								'<div class="repasMidiSoir"></div>'+
							'</div>'+
							'<div class="ConteneurMidiSoir">'+
								'<div class="MidiSoir">Soir</div>'+
								'<div class="repasMidiSoir"></div>'+
							'</div>'+
							'<div class="notes"><p>notes</p></div>'+
						'</div>');
}

last_select=null
$("*").click(function(evt){
	evt.stopPropagation();
	// un-select last selected object
	$(last_select).css("border-width","");
	$(last_select).css("border-color","");
	$(last_select).css("border-style","");
	$(last_select).css("border-radius","");
	console.log("default click vu");
	last_select=null
	
})

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
	
	if($(last_select).attr("id")=="boutonFavoris")
	{
		selectionPlat(this);
	}
	
	last_select=this;
})


/* callback click dans les cases conteneurMidiSoir */
$("#boutonFavoris").prop("onclick", null).off("click");
$("#boutonFavoris *").prop("onclick", null).off("click");
$("#boutonFavoris").click(function(evt){
	evt.stopPropagation();
	if($(last_select).hasClass("ConteneurMidiSoir") )
	{
		selectionPlat(last_select);
	}
	else
	{
		$(this).css("border-width","3px");
		$(this).css("border-color","orange");
		$(this).css("border-style","solid");
		last_select=this;
	}
})

selectionPlat=function(elt)
{
	showTabclass(".platsObj");
	
	$("#platsOkButton").unbind("click");
	$("#platsOkButton").click(function(){
		showTabclass(".menuObj");
		$(elt).find(".repasMidiSoir").append("gratin de limaces</br>");
	})
	
	$("#mainQuittButton").unbind("click");
	$("#mainQuittButton").click(function(){
		showTabclass(".menuObj");
	})
	
}

showTabclass = function(tab)
{
		$(".menuObj").hide();
		$(".platsObj").hide();
		$(".coursesObj").hide();
		
		$(tab).show();
}
/* Generation des classes flex */

/*
dir=[["r","c"],["row","column"]];
justify=[["s","e","c","b","a","v"],["start","end","center","space-between","space-around","space-evenly"]];
align=[["s","e","c","t"],["start","end","center","stretch"]];
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