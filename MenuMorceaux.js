
var calendrier=[];	

calendrier["01-11-18"] = {};

var modeleSemaine = {};
modeleSemaine.dateLundi="181030";
modeleSemaine.repas=[];

calendrier["01-11-18"] = modeleSemaine;	
console.log("calendrier test : " + calendrier["01-11-18"].dateLundi);

jours = ["Lundi","Mardi","Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

$("#titreMenu").show();
$("#titrePlats").hide();
$("#titreCourses").hide();

for(u=0;u<7;u++)
{
	$("#TabMenuSemaine").append(''+
						'<div id="Col' + jours[u] + '" class="ccc ColJour">'+
							'<div class="jour ccc">' + jours[u] + '</div>'+
							'<div class="ConteneurMidiSoir">'+
								'<div class="MidiSoir">Midi</div>'+
							'</div>'+
							'<div class="ConteneurMidiSoir">'+
								'<div class="MidiSoir">Soir</div>'+
							'</div>'+
							'<div class="notes"><p>notes</p></div>'+
						'</div>');
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