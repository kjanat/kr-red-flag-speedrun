import type { Scenario } from '$lib/types';
import { validateScenarioBank } from './validate';

export const scenarios: readonly Scenario[] = [
	// ========== INTERN (classic, obvious) ==========
	{
		id: 'i01',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Man, 34, peracuut ergste hoofdpijn ooit, nekstijf en braken na inspanning.',
		verdict: 'alarm',
		explanation:
			'Thunderclap-hoofdpijn + meningeale prikkeling: subarachnoidale bloeding tot bewezen tegendeel. Direct spoeddiagnostiek.',
	},
	{
		id: 'i02',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation:
			'Vrouw, 28, recidiverende unilaterale bonzende hoofdpijn met misselijkheid en fotofonofobie, volledig herstel tussendoor.',
		verdict: 'safe',
		explanation: 'Klassiek migrainepatroon zonder rode vlaggen. Geen acute spoedindicatie.',
	},
	{
		id: 'i03',
		difficulty: 'intern',
		category: 'vascular',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Vrouw, 67, nieuwe temporaalhoofdpijn, kaakclaudicatio en kortdurend wazig zien.',
		verdict: 'alarm',
		explanation:
			'Nieuwe hoofdpijn >50 jaar met kaakclaudicatio en visusklachten: denk aan arteriitis temporalis met risico op blindheid.',
	},
	{
		id: 'i04',
		difficulty: 'intern',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Man, 72, plotse hartkloppingen met hypotensie 85/55 en bijna-syncope.',
		verdict: 'alarm',
		explanation: 'Hartkloppingen met hemodynamische instabiliteit is een alarmsignaal. Urgente beoordeling vereist.',
	},
	{
		id: 'i05',
		difficulty: 'intern',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Vrouw, 66, duizelig en bradycard 34/min tijdens palpitaties.',
		verdict: 'alarm',
		explanation: 'Symptomatische bradycardie <40/min past bij ernstige geleidingsstoornis.',
	},
	{
		id: 'i06',
		difficulty: 'intern',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Man, 25, losse overslagen in rust, geen dyspneu, geen syncope, sport normaal.',
		verdict: 'safe',
		explanation: 'Geisoleerde extrasystolen zonder alarmsymptomen zijn vaak benigne.',
	},
	{
		id: 'i07',
		difficulty: 'intern',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Man, 23, pijn van navel naar rechteronderbuik, koorts 38.1C en defense.',
		verdict: 'alarm',
		explanation: 'Migrerende pijn + koorts + peritoneale prikkeling past bij appendicitis.',
	},
	{
		id: 'i08',
		difficulty: 'intern',
		category: 'obstetric',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Vrouw, 31, 7 weken amenorroe, onderbuikpijn, vaginaal bloedverlies en schouderpijn.',
		verdict: 'alarm',
		explanation: 'Denk aan extra-uteriene graviditeit met risico op inwendige bloeding.',
	},
	{
		id: 'i09',
		difficulty: 'intern',
		category: 'vascular',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Man, 76, acute buik-rugpijn, hypotensief en pulserende bovenbuikmassa.',
		verdict: 'alarm',
		explanation: 'Ruptuur of lekkend AAA tot bewezen tegendeel. Tijdkritische spoed.',
	},
	{
		id: 'i10',
		difficulty: 'intern',
		category: 'infectious',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Vrouw, 19, 24 uur buikkrampen met diarree en braken, vitaal stabiel, geen defense.',
		verdict: 'safe',
		explanation: 'Ongecompliceerde gastro-enteritis zonder acute buiktekens.',
	},
	{
		id: 'i11',
		difficulty: 'intern',
		category: 'vascular',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Man, 58, eenzijdig warm pijnlijk gezwollen onderbeen na lange vlucht.',
		verdict: 'alarm',
		explanation: 'Klinisch verdacht voor DVT met risico op longembolie.',
	},
	{
		id: 'i12',
		difficulty: 'intern',
		category: 'cardiac',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Vrouw, 74, beiderzijds enkeloedeem, orthopneu en gestuwde halsvenen.',
		verdict: 'alarm',
		explanation: 'Combinatie past bij gedecompenseerd hartfalen.',
	},
	{
		id: 'i13',
		difficulty: 'intern',
		category: 'vascular',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Vrouw, 52, chronisch beiderzijds enkeloedeem met varices, geen dyspneu.',
		verdict: 'safe',
		explanation: 'Typisch patroon van chronische veneuze insufficiëntie zonder acute rode vlag.',
	},
	{
		id: 'i14',
		difficulty: 'intern',
		category: 'obstetric',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Zwangere, 33 weken, nieuw oedeem met hoofdpijn, visusklachten en hypertensie.',
		verdict: 'alarm',
		explanation: 'Verdacht voor pre-eclampsie. Obstetrische urgentie.',
	},
	{
		id: 'i15',
		difficulty: 'intern',
		category: 'infectious',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 83, acuut fluctuante verwardheid met koorts en desorientatie.',
		verdict: 'alarm',
		explanation: 'Delier met mogelijke infectieuze oorzaak vereist snelle medische evaluatie.',
	},
	{
		id: 'i16',
		difficulty: 'intern',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 24, acuut verward met auditieve hallucinaties en paranoide wanen.',
		verdict: 'alarm',
		explanation: 'Acuut verward psychotisch beeld met mogelijk gevaar vraagt urgente beoordeling.',
	},
	{
		id: 'i17',
		difficulty: 'intern',
		category: 'psychiatric',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Vrouw, 38, maanden werkstress met vergeetachtigheid en concentratieverlies, volledig georienteerd.',
		verdict: 'safe',
		explanation: 'Stressgerelateerde cognitieve klachten zonder tekenen van delier of acute somatische ontregeling.',
	},
	{
		id: 'i18',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Man, 79, geleidelijke vergeetachtigheid over 2 jaar, geen acute verandering.',
		verdict: 'safe',
		explanation: 'Chronisch cognitief beloop past eerder bij dementieel proces dan acute pathologie.',
	},
	{
		id: 'i19',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Man, 68, recent hoofdtrauma gevolgd door snelle cognitieve achteruitgang.',
		verdict: 'alarm',
		explanation: 'Recent trauma + snelle achteruitgang: denk aan subduraal hematoom.',
	},
	{
		id: 'i20',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Vrouw, 71, geheugenklachten met nieuw krachtsverlies rechterarm.',
		verdict: 'alarm',
		explanation: 'Focale neurologische uitval bij cognitieve klacht is altijd alarm.',
	},

	// ========== ANIOS (subtler, atypical) ==========
	{
		id: 'a01',
		difficulty: 'anios',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation:
			'Vrouw, 67, aanvalsgewijs snelle hartkloppingen met bijna-syncope bij traplopen, broer overleden op 42 jaar.',
		verdict: 'alarm',
		explanation: 'Palpitaties met bijna-syncope en familiaire plotse dood is hoog-risico ritmestoornisprofiel.',
	},
	{
		id: 'a02',
		difficulty: 'anios',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Man, 27, korte palpitaties na energiedrank, geen syncope of dyspneu, klachtenvrij tussendoor.',
		verdict: 'safe',
		explanation: 'Uitlokkingsgebonden benigne palpitaties zonder alarmsignalen.',
	},
	{
		id: 'a03',
		difficulty: 'anios',
		category: 'vascular',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Vrouw, 74, nieuwe unilaterale hoofdpijn met kaakclaudicatio en visusdaling.',
		verdict: 'alarm',
		explanation: 'Sterk verdacht voor arteriitis temporalis met visusrisico.',
	},
	{
		id: 'a04',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation:
			'Vrouw, 33, al jaren hetzelfde aura-migrainepatroon: geleidelijke scintillaties gevolgd door bonzende hoofdpijn.',
		verdict: 'safe',
		explanation: 'Stereotiep, onveranderd patroon zonder nieuwe rode vlaggen.',
	},
	{
		id: 'a05',
		difficulty: 'anios',
		category: 'respiratory',
		sourceTopic: 'Enkeloedeem',
		presentation:
			'Vrouw, 31, 12 dagen postpartum, eenzijdig pijnlijk gezwollen kuit met plots dyspnoe en pleuritische pijn.',
		verdict: 'alarm',
		explanation: 'Postpartum DVT-signalen met acute dyspnoe passen bij trombo-embolie en vragen spoed.',
	},
	{
		id: 'a06',
		difficulty: 'anios',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Man, 76, AF in VG, plots hevige diffuse buikpijn met weinig drukpijn.',
		verdict: 'alarm',
		explanation: 'Pijn buiten proportie bij AF: denk aan mesenteriale ischemie.',
	},
	{
		id: 'a07',
		difficulty: 'anios',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation:
			'Vrouw, 29, recidiverende krampende buikpijn met opgeblazen gevoel, beter na ontlasting, geen rode vlaggen.',
		verdict: 'safe',
		explanation: 'Past bij functionele darmklachten zonder acuut gevaarspatroon.',
	},
	{
		id: 'a08',
		difficulty: 'anios',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 24, acuut verward en wantrouwend, hoort stemmen met opdrachten.',
		verdict: 'alarm',
		explanation: 'Acute psychose met veiligheidsrisico vereist crisisbeoordeling.',
	},
	{
		id: 'a09',
		difficulty: 'anios',
		category: 'psychiatric',
		sourceTopic: 'Vergeetachtigheid',
		presentation:
			'Vrouw, 30, vergeetachtigheid en concentratieproblemen bij werkstress, geen psychose, geen suicidaliteit.',
		verdict: 'safe',
		explanation:
			'Niet-acute stressgerelateerde cognitieve klachten zonder directe veiligheids- of somatische alarmsignalen.',
	},
	{
		id: 'a10',
		difficulty: 'anios',
		category: 'pediatric',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Kind, 9, terugkerende periumbilicale buikpijn op schooldagen, normale groei.',
		verdict: 'safe',
		explanation: 'Functioneel buikpijnpatroon zonder alarmsymptomen.',
	},
	{
		id: 'a11',
		difficulty: 'anios',
		category: 'obstetric',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Zwangere, 33 weken, hoofdpijn, visusflitsen, pijn rechtsboven buik, RR 165/105.',
		verdict: 'alarm',
		explanation: 'Verdacht voor ernstige pre-eclampsie; directe obstetrische evaluatie nodig.',
	},
	{
		id: 'a12',
		difficulty: 'anios',
		category: 'infectious',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 81, acuut verward, tachypnoe, hypotherm 35.9C en bloeddruk 95/60.',
		verdict: 'alarm',
		explanation: 'Atypische sepsispresentatie bij oudere met hemodynamische afwijkingen.',
	},
	{
		id: 'a13',
		difficulty: 'anios',
		category: 'vascular',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Man, 58, week na knieoperatie, kuitzwelling en nieuwe inspanningsdyspnoe.',
		verdict: 'alarm',
		explanation: 'Recent operatie + beenzwelling + dyspnoe: denk aan VTE.',
	},
	{
		id: 'a14',
		difficulty: 'anios',
		category: 'vascular',
		sourceTopic: 'Enkeloedeem',
		presentation:
			'Vrouw, 64, beiderzijds enkeloedeem vooral s avonds, minder na nacht, geen dyspneu of pijn op de borst.',
		verdict: 'safe',
		explanation: 'Symmetrisch houdingsafhankelijk oedeem past bij veneuze insufficiëntie.',
	},
	{
		id: 'a15',
		difficulty: 'anios',
		category: 'psychiatric',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Man, 56, vergeetachtig en somber, slaap slecht, geen focale uitval, geen acuut beloop.',
		verdict: 'safe',
		explanation: 'Cognitieve klachten kunnen passen bij depressie zonder acute neurologische rode vlaggen.',
	},

	// ========== HUISARTS (grey areas, still classifiable) ==========
	{
		id: 'h01',
		difficulty: 'huisarts',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Vrouw, 61, plotse hartkloppingen met duizeligheid en bijna-flauwvallen.',
		verdict: 'alarm',
		explanation: 'Hartkloppingen met presyncope is een alarmsignaal voor hemodynamisch relevante ritmestoornis.',
	},
	{
		id: 'h02',
		difficulty: 'huisarts',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation:
			'Man, 34, losse overslagen vooral in rust na koffie, geen syncope, geen dyspneu, normale inspanningstolerantie.',
		verdict: 'safe',
		explanation: 'Geisoleerde extrasystolen zonder rode vlaggen passen bij benigne palpitaties.',
	},
	{
		id: 'h03',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Man, 67, weken vergeetachtiger, sinds vanochtend woorden zoeken en onhandigheid rechterhand.',
		verdict: 'alarm',
		explanation:
			'Nieuwe lateralisatieachtige verandering bovenop cognitieve klachten is verdacht voor een acute cerebrovasculaire oorzaak.',
	},
	{
		id: 'h04',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Vrouw, 29, bekend aurapatroon nu na slaaptekort, volledig herstel en normaal neurostatus.',
		verdict: 'safe',
		explanation: 'Stabiel, stereotiep patroon zonder nieuwe red flags is niet-spoedeisend.',
	},
	{
		id: 'h05',
		difficulty: 'huisarts',
		category: 'respiratory',
		sourceTopic: 'Enkeloedeem',
		presentation:
			'Man, 49, eenzijdig gezwollen onderbeen na knieoperatie, nu plots benauwd met pleuritische pijn en droge hoest.',
		verdict: 'alarm',
		explanation: 'DVT-klachten plus acute respiratoire symptomen zijn verdacht voor longembolie.',
	},
	{
		id: 'h06',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Vrouw, 75, geleidelijk geheugenverlies over jaren, helder bewustzijn, geen acute fluctuaties.',
		verdict: 'safe',
		explanation: 'Chronisch geleidelijk cognitief beloop zonder acute alarmsignalen past niet bij een spoedsituatie.',
	},
	{
		id: 'h07',
		difficulty: 'huisarts',
		category: 'vascular',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Man, 74, nieuwe continue bovenbuik-rugpijn met bekende AAA in follow-up.',
		verdict: 'alarm',
		explanation: 'Nieuwe pijn bij bekend aneurysma is een vaatspoed tot tegendeel bewezen.',
	},
	{
		id: 'h08',
		difficulty: 'huisarts',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation:
			'Vrouw, 33, maanden wisselende stressgebonden buikpijn met opgeblazen gevoel, geen gewichtsverlies of nachtelijke klachten.',
		verdict: 'safe',
		explanation: 'Chronisch functioneel patroon zonder alarmsymptomen.',
	},
	{
		id: 'h09',
		difficulty: 'huisarts',
		category: 'infectious',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 57, acuut verward, koorts 38.3C met forse hoofdpijn en nekpijn bij anteflexie.',
		verdict: 'alarm',
		explanation:
			'Acute verwardheid met infectietekenen en meningeale prikkeling blijft een infectieuze spoedindicatie.',
	},
	{
		id: 'h10',
		difficulty: 'huisarts',
		category: 'psychiatric',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Vrouw, 46, vergeetachtig bij overspanning, volledig georienteerd, geen neurologische uitval.',
		verdict: 'safe',
		explanation: 'Concentratie- en geheugenklachten bij stress zonder objectieve red flags zijn meestal niet acuut.',
	},
	{
		id: 'h11',
		difficulty: 'huisarts',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 38, acuut verward en geagiteerd met paranoide wanen, weigert contact.',
		verdict: 'alarm',
		explanation: 'Acuut psychotisch verward gedrag met mogelijk gevaar is een directe psychiatrische urgentie.',
	},
	{
		id: 'h12',
		difficulty: 'huisarts',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation:
			'Vrouw, 27, tijdelijk verward gevoel bij langdurige stress, helder bewustzijn en orientatie bij onderzoek.',
		verdict: 'safe',
		explanation:
			'Stressgerelateerde ontregeling zonder delierkenmerken of veiligheidsred flags is meestal niet-spoedeisend.',
	},
	{
		id: 'h13',
		difficulty: 'huisarts',
		category: 'obstetric',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Vrouw, 31, 33 weken zwanger, hoofdpijn met visusflitsen en bovenbuikpijn, RR 145/92 bij herhaling.',
		verdict: 'alarm',
		explanation: 'Past bij pre-eclampsie/HELLP-risico; direct obstetrisch beoordelen.',
	},
	{
		id: 'h14',
		difficulty: 'huisarts',
		category: 'vascular',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Vrouw, 58, eenzijdig dik pijnlijk onderbeen, mammacarcinoom in VG en recent immobiel.',
		verdict: 'alarm',
		explanation: 'Hoog-risicoprofiel voor DVT met mogelijk embolierisico.',
	},
	{
		id: 'h15',
		difficulty: 'huisarts',
		category: 'vascular',
		sourceTopic: 'Enkeloedeem',
		presentation: "Man, 69, beiderzijds enkeloedeem vooral 's avonds, minder na nacht, geen dyspneu.",
		verdict: 'safe',
		explanation: 'Symmetrisch dependent oedeem zonder cardiorespiratoire alarmsignalen.',
	},

	// ========== EXPANSION: HOOFDPIJN ==========

	// Hoofdpijn – intern
	{
		id: 'i21',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Man, 55, geleidelijk progressieve hoofdpijn over weken, erger bij hoesten en buigen.',
		verdict: 'alarm',
		explanation: 'Progressieve hoofdpijn verergerd door Valsalva-manoeuvres is verdacht voor ruimte-innemend proces.',
	},
	{
		id: 'i22',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Vrouw, 22, bilaterale drukkende hoofdpijn na beeldschermwerk, geen misselijkheid of fotofobie.',
		verdict: 'safe',
		explanation: 'Spanningshoofdpijn zonder rode vlaggen is niet-spoedeisend.',
	},

	// Hoofdpijn – anios
	{
		id: 'a16',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Vrouw, 42, bekende migraine, nu nieuw type hoofdpijn met ochtendbraken en dubbelzien sinds 3 dagen.',
		verdict: 'alarm',
		explanation:
			'Nieuw type hoofdpijn bij bekende migrainepatiënt met dubbelzien en ochtendbraken wijst op verhoogde intracraniële druk.',
	},
	{
		id: 'a17',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Man, 38, episodische strikt unilaterale stekende hoofdpijn met traanoog en ptosis, duur 45 min.',
		verdict: 'safe',
		explanation:
			'Past bij clusterhoofdpijn: hevig maar benigne. Geen acute spoedindicatie, wel adequate behandeling nodig.',
	},
	{
		id: 'a18',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Man, 61, progressieve hoofdpijn bij anticoagulantia na val vorige week, lichte verwardheid.',
		verdict: 'alarm',
		explanation: 'Hoofdpijn bij anticoagulantia na trauma met bewustzijnsverandering: denk aan intracraniële bloeding.',
	},

	// Hoofdpijn – huisarts
	{
		id: 'h16',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation:
			'Vrouw, 48, nieuwe dagelijkse hoofdpijn sinds 2 weken, niet reagerend op paracetamol, geen focale uitval.',
		verdict: 'alarm',
		explanation:
			'Nieuw type hoofdpijn >40 jaar die niet reageert op analgetica verdient nadere diagnostiek om secundaire oorzaken uit te sluiten.',
	},
	{
		id: 'h17',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation:
			'Man, 29, dagelijkse bilaterale drukkende hoofdpijn bij dagelijks paracetamolgebruik, geen ochtendbraken.',
		verdict: 'safe',
		explanation:
			'Medicatieovergebruikshoofdpijn (MOH) bij chronisch analgeticagebruik. Behandeling is afbouwen, geen spoeddiagnostiek.',
	},
	{
		id: 'h18',
		difficulty: 'huisarts',
		category: 'vascular',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Man, 72, subacute hoofdpijn met gewichtsverlies en verhoogde BSE, kaakpijn bij kauwen.',
		verdict: 'alarm',
		explanation:
			'Subacuut beeld met systemische inflammatie en kaakclaudicatio: arteriitis temporalis tot bewezen tegendeel.',
	},
	{
		id: 'h19',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Vrouw, 35, occipitale hoofdpijn na intensieve nekbelasting, normaal neurologisch onderzoek.',
		verdict: 'safe',
		explanation: 'Cervicogene hoofdpijn bij overbelasting zonder neurologische uitval is niet-spoedeisend.',
	},

	// ========== EXPANSION: HARTKLOPPINGEN ==========

	// Hartkloppingen – intern
	{
		id: 'i23',
		difficulty: 'intern',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Man, 17, palpitaties met syncope tijdens voetbal, oom plotseling overleden op 35-jarige leeftijd.',
		verdict: 'alarm',
		explanation:
			'Inspanningsgebonden syncope met familiaire plotse dood is verdacht voor erfelijke aritmie of cardiomyopathie.',
	},
	{
		id: 'i24',
		difficulty: 'intern',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Vrouw, 32, aanvalsgewijze regulaire snelle hartslag die spontaan stopt, geen syncope of dyspneu.',
		verdict: 'safe',
		explanation:
			'Past bij paroxysmale supraventriculaire tachycardie (SVT); hemodynamisch stabiel zonder alarmsignalen.',
	},

	// Hartkloppingen – anios
	{
		id: 'a19',
		difficulty: 'anios',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Man, 45, palpitaties met thoracale druk bij inspanning, DM2 en hypertensie in VG.',
		verdict: 'alarm',
		explanation:
			'Inspanningsgebonden palpitaties met angineuze klachten en cardiovasculaire risicofactoren zijn verdacht voor ischemie.',
	},
	{
		id: 'a20',
		difficulty: 'anios',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Vrouw, 29, palpitaties met tremor, gewichtsverlies en warmte-intolerantie.',
		verdict: 'alarm',
		explanation:
			'Palpitaties met hyperthyreoïde symptomen: thyreotoxicose kan aritmie veroorzaken en vereist behandeling.',
	},
	{
		id: 'a21',
		difficulty: 'anios',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation:
			'Man, 62, af en toe onregelmatige hartslag, asymptomatisch, gevonden bij eigen bloeddrukmeting thuis.',
		verdict: 'safe',
		explanation:
			'Toevalsbevinding van onregelmatige hartslag zonder symptomen vraagt huisartsbeoordeling maar is niet-spoedeisend.',
	},

	// Hartkloppingen – huisarts
	{
		id: 'h20',
		difficulty: 'huisarts',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Man, 55, nieuw atriumfibrilleren met hartfrequentie 138/min, licht dyspnoe maar stabiele bloeddruk.',
		verdict: 'alarm',
		explanation:
			'Nieuw AF met snelle ventrikelventrikelrespons en dyspnoe vergt urgente frequentiecontrole en tromboseprofylaxe-beoordeling.',
	},
	{
		id: 'h21',
		difficulty: 'huisarts',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Vrouw, 41, perimenopausale palpitaties en opvliegers, normaal ECG, geen syncope.',
		verdict: 'safe',
		explanation: 'Palpitaties passend bij perimenopauze met normaal ECG en geen alarmsignalen.',
	},
	{
		id: 'h22',
		difficulty: 'huisarts',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Man, 70, dagelijkse extrasystolen met af en toe duizeligheid, bekend met matig verminderde LVEF.',
		verdict: 'alarm',
		explanation:
			'Extrasystolen met duizeligheid bij verminderde pompfunctie kunnen wijzen op ventriculaire ritmestoornis.',
	},

	// ========== EXPANSION: ACUTE BUIKPIJN ==========

	// Acute buikpijn – intern
	{
		id: 'i25',
		difficulty: 'intern',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Man, 45, koliekpijn rechterbovenbuik uitstralend naar schouder, misselijk na vettige maaltijd.',
		verdict: 'safe',
		explanation: 'Typische galsteenkoliek zonder cholangitis-tekenen (geen koorts, geen icterus).',
	},

	// Acute buikpijn – anios
	{
		id: 'a22',
		difficulty: 'anios',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Vrouw, 68, diffuse buikpijn met afwezige peristaltiek, distensie en braken, niet doorgelaten.',
		verdict: 'alarm',
		explanation: 'Mechanische ileus met stilte bij auscultatie vereist chirurgische beoordeling.',
	},
	{
		id: 'a23',
		difficulty: 'anios',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Man, 52, heftige epigastrische pijn uitstralend naar rug, alcohol-exces gisteren, tachycard.',
		verdict: 'alarm',
		explanation: 'Epigastrische pijn naar rug met alcohol-exces en tachycardie: denk aan acute pancreatitis.',
	},

	// Acute buikpijn – huisarts
	{
		id: 'h23',
		difficulty: 'huisarts',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Vrouw, 24, recidiverende perimenstruale onderbuikpijn, milde drukpijn, geen koorts of defense.',
		verdict: 'safe',
		explanation: 'Cyclisch patroon passend bij dysmenorroe zonder peritoneale prikkeling.',
	},
	{
		id: 'h24',
		difficulty: 'huisarts',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Man, 81, nieuwe bovenbuikpijn met gewichtsverlies en ijzergebreksanemie, geen defense.',
		verdict: 'alarm',
		explanation:
			'Nieuwe buikpijn bij oudere met gewichtsverlies en anemie is verdacht voor maligniteit; spoedverwijzing nodig.',
	},
	{
		id: 'h25',
		difficulty: 'huisarts',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Vrouw, 55, rechterbovenbuikpijn met koorts 39C, icterus en koude rillingen.',
		verdict: 'alarm',
		explanation: 'Charcot-trias (pijn, koorts, icterus) bij cholangitis: spoedindicatie.',
	},

	// ========== EXPANSION: ENKELOEDEEM ==========

	// Enkeloedeem – intern
	{
		id: 'i26',
		difficulty: 'intern',
		category: 'cardiac',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Man, 65, beiderzijds enkeloedeem met nachtelijke dyspnoe en verminderde inspanningstolerantie.',
		verdict: 'alarm',
		explanation: 'Oedeem met orthopneu en inspanningsintolerantie past bij hartfalen.',
	},

	// Enkeloedeem – anios
	{
		id: 'a24',
		difficulty: 'anios',
		category: 'musculoskeletal',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Vrouw, 45, beiderzijds enkeloedeem bij langdurig staan, BMI 38, geen dyspneu of pitting boven knie.',
		verdict: 'safe',
		explanation: 'Houdingsafhankelijk oedeem bij obesitas en langdurig staan zonder systemische red flags.',
	},

	// Enkeloedeem – huisarts
	{
		id: 'h26',
		difficulty: 'huisarts',
		category: 'cardiac',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Man, 72, toenemend enkeloedeem met gewichtstoename 4 kg in een week, bekende hartfalen NYHA II.',
		verdict: 'alarm',
		explanation: 'Snelle gewichtstoename bij bekend hartfalen wijst op decompensatie.',
	},

	// ========== EXPANSION: VERWARDHEID ==========

	// Verwardheid – intern
	{
		id: 'i27',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Verwardheid',
		presentation: 'Vrouw, 72, acuut verward met glucose 1.8 mmol/L, zweterig en tremor.',
		verdict: 'alarm',
		explanation: 'Ernstige hypoglykemie met neuroglycopene symptomen vereist onmiddellijke glucosetoediening.',
	},
	{
		id: 'i28',
		difficulty: 'intern',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 70, lichte verwardheid na anesthesie, nu helder, eet en drinkt normaal, geen koorts.',
		verdict: 'safe',
		explanation: 'Kortdurende postoperatieve verwardheid die spontaan herstelt past bij voorbijgaand delier.',
	},
	{
		id: 'i29',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 60, acuut verward met hemiparese rechts en afasie.',
		verdict: 'alarm',
		explanation: 'Acute focale neurologische uitval met verwardheid: CVA tot bewezen tegendeel.',
	},
	{
		id: 'i30',
		difficulty: 'intern',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation: 'Vrouw, 85, licht verward bij uitdroging na gastro-enteritis, orienteert na vochttoediening.',
		verdict: 'safe',
		explanation: 'Milde verwardheid door dehydratie die herstelt na rehydratie is niet-spoedeisend.',
	},

	// Verwardheid – anios
	{
		id: 'a25',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Verwardheid',
		presentation:
			'Man, 45, verward en geagiteerd na start van nieuwe medicatie (tramadol en SSRI), myoclonieën en hyperthermie.',
		verdict: 'alarm',
		explanation:
			'Combinatie van verwardheid, myoclonieën en hyperthermie bij serotonerge medicatie: serotoninesyndroom.',
	},
	{
		id: 'a26',
		difficulty: 'anios',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation:
			'Vrouw, 78, milde verwardheid bij slaapgebrek door pijn van heupartrose, helder overdag, geen koorts.',
		verdict: 'safe',
		explanation: 'Verwardheid door slaapgebrek bij adequate oorzaak zonder systemische red flags is niet-acuut.',
	},
	{
		id: 'a27',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 55, episodische verwardheid met staren, lipsmakken en postictale sufheid, duur 3 minuten.',
		verdict: 'alarm',
		explanation: 'Focale aanvallen met bewustzijnsdaling en automatismen vereisen neurologische diagnostiek.',
	},
	{
		id: 'a28',
		difficulty: 'anios',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation: 'Vrouw, 22, desoriëntatie na 3 nachten niet slapen bij examenperiode, verder vitaal stabiel.',
		verdict: 'safe',
		explanation:
			'Acute slaapderivatie verklaart symptomen; geen tekenen van delier, intoxicatie of somatische oorzaak.',
	},

	// Verwardheid – huisarts
	{
		id: 'h27',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Verwardheid',
		presentation: 'Vrouw, 80, acuut verward met urineretentie en obstipatie, recent gestart met amitriptyline.',
		verdict: 'alarm',
		explanation:
			'Anticholinerg delier door medicatie met urineretentie en obstipatie: medicatiestop en beoordeling nodig.',
	},
	{
		id: 'h28',
		difficulty: 'huisarts',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 65, milde verwardheid bij verhuizing naar verzorgingshuis, orienteert goed na geruststelling.',
		verdict: 'safe',
		explanation: 'Aanpassingsreactie zonder delierkenmerken of somatische red flags.',
	},

	// ========== EXPANSION: VERGEETACHTIGHEID ==========

	// Vergeetachtigheid – intern
	{
		id: 'i31',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Man, 60, progressieve vergeetachtigheid met loopstoornissen en urine-incontinentie.',
		verdict: 'alarm',
		explanation: 'Trias van cognitieve achteruitgang, loopstoornis en incontinentie: denk aan NPH, behandelbaar.',
	},

	// Vergeetachtigheid – anios
	{
		id: 'a29',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Vrouw, 58, subacuut geheugenverlies over 6 weken met persoonlijkheidsverandering en myoclonieën.',
		verdict: 'alarm',
		explanation: 'Snel progressief cognitief verval met myoclonieën: denk aan prionziekte of auto-immuunencefalitis.',
	},
	{
		id: 'a30',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Man, 73, geleidelijke woordvindstoornissen over een jaar, ADL zelfstandig, geen acuut beloop.',
		verdict: 'safe',
		explanation:
			'Langzaam progressief beeld zonder acute verandering past bij beginnend neurodegeneratief proces; niet-spoedeisend.',
	},
	{
		id: 'a31',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation:
			'Vrouw, 64, vergeetachtigheid met nieuw hypothyreoïdiebeeld: obstipatie, gewichtstoename en traagheid.',
		verdict: 'alarm',
		explanation:
			'Cognitieve klachten bij verdenking hypothyreoïdie: behandelbare en potentieel reversibele oorzaak die actie vergt.',
	},

	// Vergeetachtigheid – huisarts
	{
		id: 'h29',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation:
			'Man, 74, geleidelijke vergeetachtigheid, valt 3x per maand, incontinentie voor urine, breed gangspoor.',
		verdict: 'alarm',
		explanation: 'Cognitief verval met vallen, incontinentie en gangstoornis: normaledrukhydrocefalie mogelijk.',
	},
	{
		id: 'h30',
		difficulty: 'huisarts',
		category: 'psychiatric',
		sourceTopic: 'Vergeetachtigheid',
		presentation:
			'Vrouw, 69, vergeetachtigheid met verlies van interesse en verminderde eetlust, volledig oriëntatie, geen focale uitval.',
		verdict: 'safe',
		explanation: 'Cognitieve klachten bij depressief beeld zonder neurologische red flags: behandel de depressie.',
	},

	// ========== EXTRA FILL: Remaining gaps ==========

	// Hoofdpijn – intern (extra safe)
	{
		id: 'i32',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Man, 19, bilaterale drukkende hoofdpijn bij tentamenstress, reageert goed op ibuprofen.',
		verdict: 'safe',
		explanation: 'Spanningshoofdpijn uitgelokt door stress, zonder alarmsignalen.',
	},

	// Hoofdpijn – anios (extra alarm)
	{
		id: 'a32',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Hoofdpijn',
		presentation: 'Vrouw, 31, nieuwe hoofdpijn met papiloedeem bij fundoscopie, BMI 35, visusdaling.',
		verdict: 'alarm',
		explanation:
			'Papiloedeem met visusdaling bij obesitas: idiopathische intracraniële hypertensie met risico op visusverlies.',
	},

	// Hartkloppingen – intern (extra alarm)
	{
		id: 'i33',
		difficulty: 'intern',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation: 'Man, 60, palpitaties met brede QRS-tachycardie op ECG, hemodynamisch nog stabiel.',
		verdict: 'alarm',
		explanation:
			'Brede QRS-tachycardie is ventriculaire tachycardie tot bewezen tegendeel; kan snel hemodynamisch decompenseren.',
	},

	// Hartkloppingen – anios (extra safe)
	{
		id: 'a33',
		difficulty: 'anios',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation:
			'Vrouw, 24, palpitaties bij paniekstoornis, hyperventilatie, tintelingen, ECG normaal sinustachycardie.',
		verdict: 'safe',
		explanation: 'Sinustachycardie bij paniekaanval met normaal ECG en herkenbaar patroon; niet cardiaal.',
	},

	// Acute buikpijn – anios (extra safe)
	{
		id: 'a34',
		difficulty: 'anios',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Man, 35, linkszijdige flankpijn uitstralend naar lies, hematurie, koliekmatig, vitaal stabiel.',
		verdict: 'safe',
		explanation: 'Uretersteenkoliek: pijnlijk maar niet acuut levensbedreigend bij stabiele vitale parameters.',
	},

	// Verwardheid – intern (extra alarm)
	{
		id: 'i34',
		difficulty: 'intern',
		category: 'neurological',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 52, acuut verward na val, pupilverschil en toenemende sufheid.',
		verdict: 'alarm',
		explanation: 'Traumatische verwardheid met anisocore en dalend bewustzijn: epiduraal/subduraal hematoom.',
	},

	// Verwardheid – anios (extra alarm)
	{
		id: 'a35',
		difficulty: 'anios',
		category: 'neurological',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 32, acuut verward met koorts, nekstijfheid en petechiën op romp.',
		verdict: 'alarm',
		explanation: 'Meningokokkenmeningitis/-sepsis: levensbedreigende infectie die onmiddellijk antibiotica vergt.',
	},

	// Verwardheid – huisarts (extra safe)
	{
		id: 'h31',
		difficulty: 'huisarts',
		category: 'psychiatric',
		sourceTopic: 'Verwardheid',
		presentation:
			'Vrouw, 44, voelt zich verward en onwerkelijk na ingrijpende scheiding, volledig georienteerd en vitaal stabiel.',
		verdict: 'safe',
		explanation: 'Dissociatieve ervaring bij acute psychosociale stressor zonder delier- of psychosekenmerken.',
	},

	// Vergeetachtigheid – anios (extra safe)
	{
		id: 'a36',
		difficulty: 'anios',
		category: 'psychiatric',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Man, 42, vergeetachtigheid bij chronisch alcoholgebruik, slecht gevoed, geen acuut beloop.',
		verdict: 'safe',
		explanation:
			'Chronische cognitieve klachten bij alcoholgebruik zonder acute Wernicke-kenmerken: niet-spoedeisend maar wel actie.',
	},

	// Vergeetachtigheid – huisarts (extra alarm)
	{
		id: 'h32',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Vrouw, 62, weken toenemende vergeetachtigheid met epileptisch insult vandaag, geen epilepsie in VG.',
		verdict: 'alarm',
		explanation:
			'Nieuw epileptisch insult bij subacuut cognitief verval: denk aan intracranieel ruimte-innemend proces.',
	},

	// Enkeloedeem – intern (extra safe)
	{
		id: 'i35',
		difficulty: 'intern',
		category: 'musculoskeletal',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Vrouw, 30, beiderzijds enkeloedeem bij langdurig staan op werk, geen pijn of dyspneu.',
		verdict: 'safe',
		explanation: 'Fysiologisch houdingsafhankelijk oedeem bij langdurig staan zonder alarmsignalen.',
	},

	// Enkeloedeem – anios (extra alarm)
	{
		id: 'a37',
		difficulty: 'anios',
		category: 'vascular',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Man, 48, eenzijdig beenedeem met maligniteit in VG, recent chemotherapie en immobilisatie.',
		verdict: 'alarm',
		explanation: 'Hoog risico op DVT door maligniteit, chemotherapie en immobilisatie. Laagdrempelig beeldvorming.',
	},

	// Extra Acute buikpijn – intern (extra alarm)
	{
		id: 'i36',
		difficulty: 'intern',
		category: 'abdominal',
		sourceTopic: 'Acute buikpijn',
		presentation: 'Man, 64, acute hevige bovenbuikpijn met defense en vrij lucht op X-thorax.',
		verdict: 'alarm',
		explanation: 'Vrij lucht bij acute buik: perforatie van hol orgaan, chirurgische spoed.',
	},

	// Extra Vergeetachtigheid – intern (extra safe)
	{
		id: 'i37',
		difficulty: 'intern',
		category: 'psychiatric',
		sourceTopic: 'Vergeetachtigheid',
		presentation: 'Vrouw, 25, klaagt over vergeetachtigheid bij ADHD-diagnose, normaal neurologisch onderzoek.',
		verdict: 'safe',
		explanation: 'Aandachts- en geheugenklachten passend bij ADHD zonder neurologische red flags.',
	},

	// Extra Verwardheid – huisarts (extra alarm to balance)
	{
		id: 'h33',
		difficulty: 'huisarts',
		category: 'neurological',
		sourceTopic: 'Verwardheid',
		presentation: 'Man, 73, acuut verward met asymmetrische reflexen en positieve Babinski links.',
		verdict: 'alarm',
		explanation: 'Verwardheid met lateralisatietekenen: cerebrovasculair accident tot tegendeel bewezen.',
	},

	// Extra Hartkloppingen – huisarts (extra safe)
	{
		id: 'h34',
		difficulty: 'huisarts',
		category: 'cardiac',
		sourceTopic: 'Hartkloppingen',
		presentation:
			'Vrouw, 28, palpitaties met angst in drukke omgevingen, normaal ECG, geen syncope, bekende angststoornis.',
		verdict: 'safe',
		explanation: 'Palpitaties passend bij angststoornis met normaal ECG; niet cardiaal.',
	},

	// Extra Enkeloedeem – huisarts (extra safe)
	{
		id: 'h35',
		difficulty: 'huisarts',
		category: 'vascular',
		sourceTopic: 'Enkeloedeem',
		presentation: 'Vrouw, 50, beiderzijds enkeloedeem bij amlodipine-gebruik, geen dyspneu of JVP-stijging.',
		verdict: 'safe',
		explanation: 'Calciumantagonist-geïnduceerd oedeem: medicatiebijwerking, geen hartfalen.',
	},
];

validateScenarioBank(scenarios);
