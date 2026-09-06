import type { Lang } from "../types";
import { THREAT_NAMES } from "./ui";

/**
 * Phrase dictionary for strings that live in mock data (symptoms, reasoning, notes,
 * roles, weather conditions, scan steps). English is the key; unknown strings fall
 * back to English so nothing ever renders blank.
 */
type Pair = [hi: string, mr: string];

export const PHRASES: Record<string, Pair> = {
  // ---- scan steps
  "Scanning image": ["छवि स्कैन हो रही है", "प्रतिमा स्कॅन होत आहे"],
  "Normalising colour, exposure and leaf segmentation": ["रंग, एक्सपोज़र और पत्ती विभाजन सामान्य किया जा रहा है", "रंग, एक्सपोजर आणि पान विभाजन सामान्य केले जात आहे"],
  "Detecting symptoms": ["लक्षण पहचाने जा रहे हैं", "लक्षणे शोधली जात आहेत"],
  "Locating lesions, spots, insects and discolouration": ["धब्बे, कीट और रंग-परिवर्तन खोजे जा रहे हैं", "ठिपके, कीटक आणि रंगबदल शोधले जात आहेत"],
  "Comparing disease patterns": ["रोग पैटर्न की तुलना", "रोग नमुन्यांची तुलना"],
  "Matching against 42,000 field-validated Maharashtra samples": ["42,000 क्षेत्र-सत्यापित महाराष्ट्र नमूनों से मिलान", "42,000 क्षेत्र-पडताळलेल्या महाराष्ट्र नमुन्यांशी जुळवणी"],
  "Calculating confidence": ["विश्वास की गणना", "विश्वासाची गणना"],
  "Weighting weather, crop stage and local outbreak history": ["मौसम, फसल अवस्था और स्थानीय प्रकोप इतिहास का भार", "हवामान, पीक अवस्था आणि स्थानिक प्रादुर्भाव इतिहासाचे भारांकन"],
  "Generating advisory": ["सलाह तैयार हो रही है", "सल्ला तयार होत आहे"],
  "Composing IPM steps in English, Hindi and Marathi": ["अंग्रेज़ी, हिंदी और मराठी में IPM चरण तैयार", "इंग्रजी, हिंदी आणि मराठीत IPM टप्पे तयार"],
  // ---- weather
  Sunny: ["धूप", "सूर्यप्रकाश"], Cloudy: ["बादल", "ढगाळ"], Overcast: ["घने बादल", "दाट ढगाळ"], Showers: ["हल्की बारिश", "हलका पाऊस"], Rain: ["बारिश", "पाऊस"], Storm: ["तूफ़ान", "वादळ"],
  Mon: ["सोम", "सोम"], Tue: ["मंगल", "मंगळ"], Wed: ["बुध", "बुध"], Thu: ["गुरु", "गुरु"], Fri: ["शुक्र", "शुक्र"], Sat: ["शनि", "शनि"], Sun: ["रवि", "रवि"],
  // ---- risk factors
  Humidity: ["नमी", "आर्द्रता"], "Rainfall (24h)": ["वर्षा (24 घंटे)", "पाऊस (24 तास)"], Temperature: ["तापमान", "तापमान"], "Crop stage": ["फसल अवस्था", "पीक अवस्था"], "Soil health": ["मृदा स्वास्थ्य", "मृदा आरोग्य"], "Nearby cases (14 km)": ["आस-पास के मामले (14 किमी)", "जवळची प्रकरणे (14 किमी)"], "Low nitrogen": ["कम नाइट्रोजन", "कमी नत्र"], Balanced: ["संतुलित", "संतुलित"],
  // ---- farm / plots
  "Plot 1 · Gat No. 112/2": ["भाग 1 · गट नं. 112/2", "प्लॉट 1 · गट नं. 112/2"], "Plot 2 · Gat No. 118": ["भाग 2 · गट नं. 118", "प्लॉट 2 · गट नं. 118"], "Plot 3 · Gat No. 119/1": ["भाग 3 · गट नं. 119/1", "प्लॉट 3 · गट नं. 119/1"],
  Drip: ["ड्रिप", "ठिबक"], Sprinkler: ["स्प्रिंकलर", "तुषार"], Rainfed: ["वर्षा-आधारित", "कोरडवाहू"], Flood: ["प्रवाह सिंचाई", "पाटपाणी"],
  "Medium black (Vertic Inceptisol)": ["मध्यम काली (वर्टिक इनसेप्टिसोल)", "मध्यम काळी (व्हर्टिक इनसेप्टिसॉल)"],
  "KVK Nashik Soil Testing Lab": ["KVK नाशिक मृदा परीक्षण प्रयोगशाला", "KVK नाशिक माती परीक्षण प्रयोगशाळा"],
  "Kharif 2026": ["खरीफ 2026", "खरीप 2026"], "Rabi 2025-26": ["रबी 2025-26", "रब्बी 2025-26"], "Kharif 2025": ["खरीफ 2025", "खरीप 2025"], "Rabi 2024-25": ["रबी 2024-25", "रब्बी 2024-25"], "Kharif 2024": ["खरीफ 2024", "खरीप 2024"], "Rabi 2026-27": ["रबी 2026-27", "रब्बी 2026-27"],
  "Early Blight (current)": ["अर्ली ब्लाइट (वर्तमान)", "अर्ली ब्लाइट (सध्या)"], "Purple blotch (mild)": ["पर्पल ब्लॉच (हल्का)", "जांभळा करपा (सौम्य)"], "Aphids (controlled)": ["माहू (नियंत्रित)", "मावा (नियंत्रित)"], "Late blight (moderate)": ["लेट ब्लाइट (मध्यम)", "लेट ब्लाइट (मध्यम)"],
  Dindori: ["डिंडोरी", "दिंडोरी"], Niphad: ["निफाड", "निफाड"],
  // ---- insurance
  "Agriculture Insurance Company of India": ["भारतीय कृषि बीमा कंपनी", "भारतीय कृषी विमा कंपनी"], "PMFBY (Pradhan Mantri Fasal Bima Yojana)": ["PMFBY (प्रधानमंत्री फसल बीमा योजना)", "PMFBY (प्रधानमंत्री पीक विमा योजना)"],
  // ---- experts
  "Plant Pathologist": ["पादप रोग विशेषज्ञ", "वनस्पती रोगतज्ज्ञ"], "Taluka Agriculture Officer": ["तालुका कृषि अधिकारी", "तालुका कृषी अधिकारी"], Entomologist: ["कीट विज्ञानी", "कीटकशास्त्रज्ञ"], "Diagnostic Laboratory": ["निदान प्रयोगशाला", "निदान प्रयोगशाळा"], "Cotton Specialist": ["कपास विशेषज्ञ", "कापूस तज्ज्ञ"],
  "KVK Nashik (YCMOU)": ["KVK नाशिक (YCMOU)", "KVK नाशिक (YCMOU)"], "Dept. of Agriculture, Dindori": ["कृषि विभाग, डिंडोरी", "कृषी विभाग, दिंडोरी"], "NRC Grapes, Pune": ["NRC अंगूर, पुणे", "NRC द्राक्ष, पुणे"], "MPKV Rahuri": ["MPKV राहुरी", "MPKV राहुरी"], "CICR Nagpur": ["CICR नागपुर", "CICR नागपूर"],
  Tomato: ["टमाटर", "टोमॅटो"], Grapes: ["अंगूर", "द्राक्ष"], Cotton: ["कपास", "कापूस"], "Fungal diseases": ["फफूंद रोग", "बुरशीजन्य रोग"], IPM: ["IPM", "IPM"], "Input subsidy": ["इनपुट सब्सिडी", "निविष्ठा अनुदान"], "Field visits": ["खेत भ्रमण", "शेत भेटी"], Mealybug: ["मिलीबग", "पिठ्या ढेकूण"], Thrips: ["थ्रिप्स", "फुलकिडे"], "Lab confirmation": ["लैब पुष्टि", "प्रयोगशाळा पुष्टी"], "Pathogen isolation": ["रोगाणु पृथक्करण", "रोगकारक पृथक्करण"], "Soil testing": ["मृदा परीक्षण", "माती परीक्षण"], Bollworm: ["सुंडी", "बोंडअळी"], Whitefly: ["सफेद मक्खी", "पांढरी माशी"],
  "Plant Health Clinic": ["पादप स्वास्थ्य क्लिनिक", "वनस्पती आरोग्य क्लिनिक"],
  "Dr. Meera Kulkarni": ["डॉ. मीरा कुलकर्णी", "डॉ. मीरा कुलकर्णी"], "S. R. Deshmukh": ["एस. आर. देशमुख", "एस. आर. देशमुख"], "Dr. Anil Bhosale": ["डॉ. अनिल भोसले", "डॉ. अनिल भोसले"], "Dr. Rekha Wankhede": ["डॉ. रेखा वानखेडे", "डॉ. रेखा वानखेडे"],
  "Auto-validated (≥75%)": ["स्वतः सत्यापित (≥75%)", "आपोआप पडताळले (≥75%)"],
  // ---- AI symptoms / reasoning (tomato clear sample)
  "Concentric target-board rings on 7 lesions": ["7 धब्बों पर संकेंद्रित लक्ष्य-पट्ट जैसे छल्ले", "7 ठिपक्यांवर वर्तुळाकार वलये"],
  "Chlorotic yellow halo around spots": ["धब्बों के चारों ओर पीला घेरा", "ठिपक्यांभोवती पिवळे वलय"],
  "Lesions concentrated on lower, older leaves": ["धब्बे निचली, पुरानी पत्तियों पर केंद्रित", "ठिपके खालच्या, जुन्या पानांवर केंद्रित"],
  "No water-soaking or white sporulation seen": ["पानी-भराव या सफेद फफूंद नहीं दिखी", "पाणथळ डाग किंवा पांढरी बुरशी दिसली नाही"],
  "Lesion ring texture matched Alternaria solani reference set at 0.94": ["धब्बों की छल्लेदार बनावट Alternaria solani संदर्भ सेट से 0.94 पर मेल खाई", "ठिपक्यांची वलयांकित रचना Alternaria solani संदर्भ संचाशी 0.94 वर जुळली"],
  "Lesion size 4–9 mm consistent with early blight (late blight lesions are larger and irregular)": ["धब्बों का आकार 4–9 मिमी अर्ली ब्लाइट के अनुरूप (लेट ब्लाइट के धब्बे बड़े और अनियमित होते हैं)", "ठिपक्यांचा आकार 4–9 मिमी अर्ली ब्लाइटशी सुसंगत (लेट ब्लाइटचे ठिपके मोठे व अनियमित असतात)"],
  "Crop at fruiting stage; older leaves have lower resistance": ["फसल फल अवस्था में; पुरानी पत्तियों की प्रतिरोधकता कम", "पीक फळधारणा अवस्थेत; जुन्या पानांची प्रतिकारशक्ती कमी"],
  "Nashik cluster: 36 confirmed early blight cases in 14 km": ["नाशिक क्लस्टर: 14 किमी में 36 पुष्ट अर्ली ब्लाइट मामले", "नाशिक क्लस्टर: 14 किमीत 36 निश्चित अर्ली ब्लाइट प्रकरणे"],
  "72 h humidity 82% and 41 mm rain increase prior probability": ["72 घंटे में 82% नमी और 41 मिमी वर्षा पूर्व संभावना बढ़ाते हैं", "72 तासांत 82% आर्द्रता आणि 41 मिमी पाऊस पूर्वसंभाव्यता वाढवतात"],
  // ---- low-confidence sample
  "Small dark spots, edges unclear": ["छोटे गहरे धब्बे, किनारे अस्पष्ट", "लहान गडद ठिपके, कडा अस्पष्ट"],
  "Image partially blurred, low light": ["छवि आंशिक रूप से धुंधली, कम रोशनी", "प्रतिमा अंशतः अस्पष्ट, कमी प्रकाश"],
  "Possible dust or spray residue overlap": ["धूल या छिड़काव अवशेष का संभावित ओवरलैप", "धूळ किंवा फवारणी अवशेषांचा संभाव्य ओव्हरलॅप"],
  "Spot texture partially matches Alternaria (0.61) but rings not resolved": ["धब्बों की बनावट आंशिक रूप से Alternaria (0.61) से मेल खाती है पर छल्ले स्पष्ट नहीं", "ठिपक्यांची रचना अंशतः Alternaria (0.61) शी जुळते पण वलये स्पष्ट नाहीत"],
  "Low-light image reduces feature quality": ["कम रोशनी की छवि से विशेषताओं की गुणवत्ता घटी", "कमी प्रकाशातील प्रतिमेमुळे वैशिष्ट्यांची गुणवत्ता घटली"],
  "Early blight and bacterial spot remain plausible": ["अर्ली ब्लाइट और जीवाणु धब्बा दोनों संभव", "अर्ली ब्लाइट आणि जिवाणूजन्य ठिपके दोन्ही शक्य"],
  "Confidence below 75% threshold, routing to expert": ["विश्वास 75% सीमा से नीचे, विशेषज्ञ को भेजा जा रहा है", "विश्वास 75% मर्यादेखाली, तज्ज्ञांकडे पाठवले जात आहे"],
  // ---- other crop profiles (symptoms shown after scan)
  "White powdery coating on upper surface": ["ऊपरी सतह पर सफेद पाउडर जैसी परत", "वरच्या बाजूला पांढरा पावडरसारखा थर"], "Slight curling of young leaves": ["नई पत्तियों का हल्का मुड़ना", "कोवळ्या पानांचे किंचित वळणे"], "Greyish patches on shoot": ["टहनी पर धूसर धब्बे", "फुटव्यावर राखाडी डाग"],
  "Entry holes on bolls": ["टिंडों पर प्रवेश छेद", "बोंडांवर प्रवेश छिद्रे"], "Pink larva detected in one boll": ["एक टिंडे में गुलाबी लार्वा", "एका बोंडात गुलाबी अळी"], "Rosette flower visible": ["गुलाबनुमा फूल दिखा", "गुलाबकळी फूल दिसले"],
  "Small reddish-brown spots with yellow margins": ["पीले किनारों वाले छोटे लाल-भूरे धब्बे", "पिवळ्या कडांचे लहान लालसर-तपकिरी ठिपके"], "Spots merging on lower trifoliate": ["निचली त्रिपत्री पर धब्बे मिल रहे हैं", "खालच्या त्रिदल पानावर ठिपके एकत्र होत आहेत"],
  "Pale elongated patches": ["हल्के लंबे धब्बे", "फिकट लांबट डाग"], "Violet-grey fuzzy growth": ["बैंगनी-धूसर रोएँदार वृद्धि", "जांभळट-राखाडी लवदार वाढ"], "Tip dieback": ["सिरे का सूखना", "टोके करपणे"],
  "Dead heart in central shoot": ["मध्य कल्ले में मृत गोभ", "मधल्या फुटव्यात पोंगेमर"], "Bore hole with frass": ["बुरादे सहित छेद", "भुशासह छिद्र"],
  "White ear heads": ["सफेद बालियाँ", "पांढऱ्या ओंब्या"], "Dead heart tillers": ["मृत गोभ वाले कल्ले", "पोंगेमर फुटवे"],
  "Aphid colonies on ear heads": ["बालियों पर माहू की कॉलोनियाँ", "ओंब्यांवर माव्याच्या वसाहती"], "Honeydew shine": ["शहद जैसी चमक", "मधासारखी चमक"],
  // ---- demo farmer seed cases (onion leaf spot, grape powdery)
  "Small purple lesions": ["छोटे बैंगनी धब्बे", "लहान जांभळे ठिपके"], "Tip yellowing": ["सिरे का पीलापन", "टोके पिवळी पडणे"], "Purple blotch pattern": ["पर्पल ब्लॉच पैटर्न", "जांभळ्या करप्याचा नमुना"], "Seedling stage susceptible": ["पौध अवस्था संवेदनशील", "रोप अवस्था संवेदनशील"],
  "White powder on young shoot": ["नई टहनी पर सफेद पाउडर", "कोवळ्या फुटव्यावर पांढरी पावडर"], "Early powdery signature": ["प्रारंभिक पाउडरी संकेत", "प्रारंभिक भुरीची खूण"], "Dry days with humid nights": ["सूखे दिन, नम रातें", "कोरडे दिवस, दमट रात्री"],
  "No new lesions after neem spray": ["नीम छिड़काव के बाद कोई नया धब्बा नहीं", "निंबोळी फवारणीनंतर नवीन ठिपके नाहीत"], "Sulphur dusting done, spread contained": ["गंधक भुरकाव किया, फैलाव रुका", "गंधक भुकटी केली, प्रसार थांबला"], "No new patches": ["कोई नया धब्बा नहीं", "नवीन डाग नाहीत"],
  "Onion seedlings": ["प्याज़ की पौध", "कांद्याची रोपे"], "Grape shoot": ["अंगूर की टहनी", "द्राक्षाचा फुटवा"], "Tomato leaf, clear photo": ["टमाटर की पत्ती, साफ फोटो", "टोमॅटोचे पान, स्पष्ट फोटो"], "Leaf photo, low light": ["पत्ती की फोटो, कम रोशनी", "पानाचा फोटो, कमी प्रकाश"], "Uploaded photo": ["अपलोड की गई फोटो", "अपलोड केलेला फोटो"],
  // ---- expert decision notes shown to the farmer
  "Diagnosis confirmed from lesion morphology and weather context.": ["धब्बों की आकृति और मौसम संदर्भ से निदान की पुष्टि।", "ठिपक्यांची रचना आणि हवामान संदर्भावरून निदानाची पुष्टी."],
  "Please upload leaf underside in daylight and a photo of 3 neighbouring plants.": ["कृपया दिन की रोशनी में पत्ती का निचला भाग और 3 पड़ोसी पौधों की फोटो अपलोड करें।", "कृपया दिवसाच्या प्रकाशात पानाची खालची बाजू आणि 3 शेजारच्या झाडांचा फोटो अपलोड करा."],
  "Referred to MPKV Rahuri Plant Health Clinic for pathogen isolation.": ["रोगाणु पृथक्करण के लिए MPKV राहुरी पादप स्वास्थ्य क्लिनिक को संदर्भित।", "रोगकारक पृथक्करणासाठी MPKV राहुरी वनस्पती आरोग्य क्लिनिककडे संदर्भित."],
  "Confirmed. Advise yellow sticky traps + neem; avoid synthetic pyrethroids.": ["पुष्ट। पीले चिपचिपे ट्रैप + नीम की सलाह; सिंथेटिक पाइरेथ्रॉइड से बचें।", "निश्चित. पिवळे चिकट सापळे + निंबोळीचा सल्ला; सिंथेटिक पायरेथ्रॉइड टाळा."],
  "Condition improved": ["स्थिति में सुधार", "स्थितीत सुधारणा"], "No improvement, spread continues": ["कोई सुधार नहीं, फैलाव जारी", "सुधारणा नाही, प्रसार सुरू"],
};

function threatName(english: string, lang: Lang) {
  const id = Object.entries(THREAT_NAMES.en).find(([, n]) => n === english)?.[0];
  return id ? THREAT_NAMES[lang][id] : english;
}

const RULES: { re: RegExp; hi: (m: RegExpMatchArray) => string; mr: (m: RegExpMatchArray) => string }[] = [
  { re: /^Corrected to (.+)\. Sample added to retraining set\.$/, hi: (m) => `${threatName(m[1], "hi")} में सुधारा गया। नमूना पुनः-प्रशिक्षण सेट में जोड़ा गया।`, mr: (m) => `${threatName(m[1], "mr")} असे दुरुस्त केले. नमुना पुनर्प्रशिक्षण संचात जोडला.` },
  { re: /^Plot (\d+)$/, hi: (m) => `भाग ${m[1]}`, mr: (m) => `प्लॉट ${m[1]}` },
];

export function translatePhrase(text: string, lang: Lang): string {
  if (lang === "en" || !text) return text;
  const hit = PHRASES[text];
  if (hit) return lang === "hi" ? hit[0] : hit[1];
  for (const r of RULES) {
    const m = text.match(r.re);
    if (m) return lang === "hi" ? r.hi(m) : r.mr(m);
  }
  return text;
}
