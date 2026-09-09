import type { Lang } from "../types";
import type {
  DoseUnit,
  FertilizerBasisId,
  FertilizerCautionId,
  FertilizerItemId,
  FertilizerKind,
} from "../fertilizer";

/**
 * Marathi / Hindi / English text for the prototype fertilizer advisory.
 *
 * The engine in lib/fertilizer.ts only ever returns ids and numeric ranges, so a dose is
 * written once and read in three languages. Every pack repeats the prototype framing:
 * these are indicative ranges to discuss with an agronomist, not a validated prescription.
 */

export interface FertilizerLabels {
  title: string;
  subtitle: string;
  prototypeBadge: string;
  prototypeNote: string;
  basedOn: string;
  input: string;
  dose: string;
  timing: string;
  why: string;
  safety: string;
  noDose: string;
  soilReadings: string;
  levels: { Low: string; Medium: string; High: string; Acidic: string; Neutral: string; Alkaline: string };
  readingNames: { nitrogen: string; phosphorus: string; potassium: string; organicCarbon: string; zinc: string; ph: string };
  readingUnits: { nitrogen: string; phosphorus: string; potassium: string; organicCarbon: string; zinc: string; ph: string };
}

export const FERTILIZER_LABELS: Record<Lang, FertilizerLabels> = {
  en: {
    title: "Fertilizer Recommendation",
    subtitle: "From your Soil Health Card, crop stage and the condition detected",
    prototypeBadge: "Prototype advisory",
    prototypeNote:
      "Prototype advisory only. These are indicative ranges from published package-of-practice guidance, not a validated prescription. Confirm the dose against your own soil test and your Taluka Agriculture Officer or KVK before applying.",
    basedOn: "Based on",
    input: "Input",
    dose: "Dose",
    timing: "Application and timing",
    why: "Why",
    safety: "Safety caution",
    noDose: "No dose right now",
    soilReadings: "Soil Health Card readings used",
    levels: { Low: "Low", Medium: "Medium", High: "High", Acidic: "Acidic", Neutral: "Neutral", Alkaline: "Alkaline" },
    readingNames: { nitrogen: "Nitrogen (N)", phosphorus: "Phosphorus (P)", potassium: "Potassium (K)", organicCarbon: "Organic carbon", zinc: "Zinc", ph: "Soil pH" },
    readingUnits: { nitrogen: "kg/ha", phosphorus: "kg/ha", potassium: "kg/ha", organicCarbon: "%", zinc: "ppm", ph: "" },
  },
  hi: {
    title: "उर्वरक सिफारिश",
    subtitle: "आपके मृदा स्वास्थ्य कार्ड, फसल अवस्था और पहचानी गई समस्या के आधार पर",
    prototypeBadge: "प्रोटोटाइप सलाह",
    prototypeNote:
      "यह केवल प्रोटोटाइप सलाह है। ये प्रकाशित पैकेज-ऑफ-प्रैक्टिस मार्गदर्शन से लिए गए संकेतात्मक परास हैं, कोई सत्यापित नुस्खा नहीं। उपयोग से पहले अपनी मिट्टी जाँच रिपोर्ट और तालुका कृषि अधिकारी या KVK से मात्रा की पुष्टि करें।",
    basedOn: "किस आधार पर",
    input: "इनपुट",
    dose: "मात्रा",
    timing: "प्रयोग और समय",
    why: "क्यों",
    safety: "सुरक्षा चेतावनी",
    noDose: "अभी कोई मात्रा नहीं",
    soilReadings: "उपयोग किए गए मृदा कार्ड मान",
    levels: { Low: "कम", Medium: "मध्यम", High: "अधिक", Acidic: "अम्लीय", Neutral: "उदासीन", Alkaline: "क्षारीय" },
    readingNames: { nitrogen: "नाइट्रोजन (N)", phosphorus: "फॉस्फोरस (P)", potassium: "पोटाश (K)", organicCarbon: "जैविक कार्बन", zinc: "जिंक", ph: "मृदा pH" },
    readingUnits: { nitrogen: "किग्रा/हे", phosphorus: "किग्रा/हे", potassium: "किग्रा/हे", organicCarbon: "%", zinc: "ppm", ph: "" },
  },
  mr: {
    title: "खत शिफारस",
    subtitle: "तुमचे मृदा आरोग्य पत्रक, पीक अवस्था आणि आढळलेल्या समस्येवर आधारित",
    prototypeBadge: "प्रोटोटाइप सल्ला",
    prototypeNote:
      "हा फक्त प्रोटोटाइप सल्ला आहे. ही प्रकाशित पॅकेज-ऑफ-प्रॅक्टिस मार्गदर्शनातील निर्देशात्मक श्रेणी आहेत, पडताळलेली शिफारस नाही. वापरण्यापूर्वी तुमचा स्वतःचा माती परीक्षण अहवाल आणि तालुका कृषी अधिकारी किंवा KVK यांच्याकडून मात्रा निश्चित करा.",
    basedOn: "कशाच्या आधारे",
    input: "निविष्ठा",
    dose: "मात्रा",
    timing: "वापर आणि वेळ",
    why: "का",
    safety: "सुरक्षा इशारा",
    noDose: "सध्या मात्रा नाही",
    soilReadings: "वापरलेली मृदा पत्रक नोंदी",
    levels: { Low: "कमी", Medium: "मध्यम", High: "जास्त", Acidic: "आम्लधर्मी", Neutral: "उदासीन", Alkaline: "विम्लधर्मी" },
    readingNames: { nitrogen: "नत्र (N)", phosphorus: "स्फुरद (P)", potassium: "पालाश (K)", organicCarbon: "सेंद्रिय कर्ब", zinc: "जस्त", ph: "मृदा pH" },
    readingUnits: { nitrogen: "किलो/हे", phosphorus: "किलो/हे", potassium: "किलो/हे", organicCarbon: "%", zinc: "ppm", ph: "" },
  },
};

export const DOSE_UNITS: Record<Lang, Record<DoseUnit, string>> = {
  en: { none: "", g_per_l: "g/litre", ml_per_l: "ml/litre", kg_per_acre: "kg/acre", kg_per_ha: "kg/ha", t_per_acre: "tonne/acre" },
  hi: { none: "", g_per_l: "ग्राम/लीटर", ml_per_l: "मिली/लीटर", kg_per_acre: "किग्रा/एकड़", kg_per_ha: "किग्रा/हेक्टेयर", t_per_acre: "टन/एकड़" },
  mr: { none: "", g_per_l: "ग्रॅम/लिटर", ml_per_l: "मिली/लिटर", kg_per_acre: "किलो/एकर", kg_per_ha: "किलो/हेक्टर", t_per_acre: "टन/एकर" },
};

export const FERTILIZER_KIND_NAMES: Record<Lang, Record<FertilizerKind, string>> = {
  en: { hold: "Hold", foliar: "Foliar spray", micronutrient: "Micronutrient", soil: "Soil application", organic: "Organic", amendment: "Soil amendment" },
  hi: { hold: "रोकें", foliar: "पर्णीय छिड़काव", micronutrient: "सूक्ष्म पोषक", soil: "मिट्टी में", organic: "जैविक", amendment: "भूमि सुधारक" },
  mr: { hold: "थांबवा", foliar: "फवारणी", micronutrient: "सूक्ष्म अन्नद्रव्य", soil: "जमिनीतून", organic: "सेंद्रिय", amendment: "भूसुधारक" },
};

export interface FertilizerInputText {
  name: string;
  timing: string;
}

export const FERTILIZER_INPUTS: Record<Lang, Record<FertilizerItemId, FertilizerInputText>> = {
  en: {
    "hold-nitrogen": {
      name: "Hold nitrogen (urea / top-dress)",
      timing: "Do not apply the soil nitrogen dose while the infection is active. Re-scan after 7 days; once no new spots appear, resume the held dose split into two applications 10–12 days apart.",
    },
    "foliar-13-0-45": {
      name: "Foliar 13:0:45 (potassium nitrate)",
      timing: "Dissolve fully and spray in the evening. Two sprays, 8–10 days apart. Cover both leaf surfaces until run-off.",
    },
    "zinc-sulphate": {
      name: "Zinc sulphate (ZnSO₄·H₂O, 33%)",
      timing: "Broadcast into moist soil and mix in lightly, once per season before the next irrigation.",
    },
    "urea-split": {
      name: "Urea (46% N)",
      timing: "Split into two top-dressings 10–12 days apart. Apply beside the root zone in moist soil, then irrigate.",
    },
    "ssp-basal": {
      name: "Single super phosphate (16% P₂O₅)",
      timing: "Full quantity as a basal dose, placed below the seed or seedling line.",
    },
    "mop-basal": {
      name: "Muriate of potash (60% K₂O)",
      timing: "Half at basal, half at the start of flowering. Place beside the root zone in moist soil.",
    },
    "fym-compost": {
      name: "Well-rotted FYM or compost",
      timing: "Incorporate into the soil 15–20 days before sowing or at the start of the next season.",
    },
    gypsum: {
      name: "Agricultural gypsum",
      timing: "Broadcast and mix into the top 15 cm before the next irrigation. Once per season.",
    },
    "agricultural-lime": {
      name: "Agricultural lime",
      timing: "Broadcast and incorporate 3–4 weeks before sowing so it has time to react with the soil.",
    },
    "balanced-maintenance": {
      name: "Balanced maintenance dose only",
      timing: "Your soil card shows no deficiency to correct. Continue the recommended package-of-practice dose for this crop and stage.",
    },
  },
  hi: {
    "hold-nitrogen": {
      name: "नाइट्रोजन रोकें (यूरिया / टॉप-ड्रेसिंग)",
      timing: "संक्रमण सक्रिय रहने तक मिट्टी में नाइट्रोजन न दें। 7 दिन बाद दोबारा जाँच करें; नए धब्बे न दिखें तो रोकी गई मात्रा को 10–12 दिन के अंतर पर दो भागों में बाँटकर दें।",
    },
    "foliar-13-0-45": {
      name: "पर्णीय 13:0:45 (पोटैशियम नाइट्रेट)",
      timing: "पूरी तरह घोलकर शाम को छिड़काव करें। 8–10 दिन के अंतर पर दो छिड़काव। पत्ती की दोनों सतहें भिगोएँ।",
    },
    "zinc-sulphate": {
      name: "जिंक सल्फेट (ZnSO₄·H₂O, 33%)",
      timing: "नम मिट्टी में बिखेरकर हल्का मिलाएँ, प्रति मौसम एक बार, अगली सिंचाई से पहले।",
    },
    "urea-split": {
      name: "यूरिया (46% N)",
      timing: "10–12 दिन के अंतर पर दो टॉप-ड्रेसिंग में बाँटें। नम मिट्टी में जड़ क्षेत्र के पास दें, फिर सिंचाई करें।",
    },
    "ssp-basal": {
      name: "सिंगल सुपर फॉस्फेट (16% P₂O₅)",
      timing: "पूरी मात्रा आधार खुराक के रूप में, बीज या पौध पंक्ति के नीचे रखें।",
    },
    "mop-basal": {
      name: "म्यूरेट ऑफ पोटाश (60% K₂O)",
      timing: "आधी मात्रा आधार खुराक में, आधी फूल आने की शुरुआत में। नम मिट्टी में जड़ क्षेत्र के पास दें।",
    },
    "fym-compost": {
      name: "अच्छी तरह सड़ी गोबर खाद या कम्पोस्ट",
      timing: "बुवाई से 15–20 दिन पहले या अगले मौसम की शुरुआत में मिट्टी में मिलाएँ।",
    },
    gypsum: {
      name: "कृषि जिप्सम",
      timing: "अगली सिंचाई से पहले बिखेरकर ऊपरी 15 सेमी मिट्टी में मिलाएँ। प्रति मौसम एक बार।",
    },
    "agricultural-lime": {
      name: "कृषि चूना",
      timing: "बुवाई से 3–4 सप्ताह पहले बिखेरकर मिलाएँ ताकि मिट्टी के साथ प्रतिक्रिया का समय मिले।",
    },
    "balanced-maintenance": {
      name: "केवल संतुलित रखरखाव मात्रा",
      timing: "आपके मृदा कार्ड में सुधारने योग्य कोई कमी नहीं है। इस फसल और अवस्था के लिए अनुशंसित पैकेज-ऑफ-प्रैक्टिस मात्रा जारी रखें।",
    },
  },
  mr: {
    "hold-nitrogen": {
      name: "नत्र थांबवा (युरिया / वरखत)",
      timing: "संसर्ग सक्रिय असेपर्यंत जमिनीतून नत्र देऊ नका. 7 दिवसांनी पुन्हा तपासा; नवीन ठिपके न दिसल्यास थांबवलेली मात्रा 10–12 दिवसांच्या अंतराने दोन हप्त्यांत विभागून द्या.",
    },
    "foliar-13-0-45": {
      name: "फवारणी 13:0:45 (पोटॅशियम नायट्रेट)",
      timing: "पूर्णपणे विरघळवून संध्याकाळी फवारा. 8–10 दिवसांच्या अंतराने दोन फवारण्या. पानाच्या दोन्ही बाजू ओल्या होईपर्यंत फवारा.",
    },
    "zinc-sulphate": {
      name: "झिंक सल्फेट (ZnSO₄·H₂O, 33%)",
      timing: "ओलसर जमिनीत पसरून हलके मिसळा, हंगामात एकदा, पुढील पाणी देण्यापूर्वी.",
    },
    "urea-split": {
      name: "युरिया (46% N)",
      timing: "10–12 दिवसांच्या अंतराने दोन वरखतांत विभागा. ओलसर जमिनीत मुळांच्या भागाशेजारी द्या आणि नंतर पाणी द्या.",
    },
    "ssp-basal": {
      name: "सिंगल सुपर फॉस्फेट (16% P₂O₅)",
      timing: "संपूर्ण मात्रा पायाभूत डोस म्हणून, बियाणे किंवा रोप ओळीच्या खाली द्या.",
    },
    "mop-basal": {
      name: "म्युरेट ऑफ पोटॅश (60% K₂O)",
      timing: "अर्धी मात्रा पायाभूत, अर्धी फुलोरा सुरू होताना. ओलसर जमिनीत मुळांशेजारी द्या.",
    },
    "fym-compost": {
      name: "चांगले कुजलेले शेणखत किंवा कंपोस्ट",
      timing: "पेरणीच्या 15–20 दिवस आधी किंवा पुढील हंगामाच्या सुरुवातीला जमिनीत मिसळा.",
    },
    gypsum: {
      name: "कृषी जिप्सम",
      timing: "पुढील पाणी देण्यापूर्वी पसरून वरच्या 15 सेंमी मातीत मिसळा. हंगामात एकदा.",
    },
    "agricultural-lime": {
      name: "कृषी चुना",
      timing: "पेरणीच्या 3–4 आठवडे आधी पसरून मिसळा, म्हणजे मातीशी प्रक्रिया होण्यास वेळ मिळेल.",
    },
    "balanced-maintenance": {
      name: "फक्त संतुलित देखभाल मात्रा",
      timing: "तुमच्या मृदा पत्रकात दुरुस्त करण्याजोगी कमतरता नाही. या पिकासाठी व अवस्थेसाठी शिफारशीत पॅकेज-ऑफ-प्रॅक्टिस मात्रा सुरू ठेवा.",
    },
  },
};

export const FERTILIZER_BASIS: Record<Lang, Record<FertilizerBasisId, string>> = {
  en: {
    "n-low": "Soil card nitrogen is low",
    "n-high": "Soil card nitrogen is already high",
    "p-low": "Soil card phosphorus is low",
    "k-low": "Soil card potassium is low",
    "k-high": "Soil card potassium is already high",
    "oc-low": "Organic carbon is below 0.5%",
    "zn-low": "Zinc is below the 0.6 ppm critical limit",
    "ph-acidic": "Soil pH is acidic",
    "ph-alkaline": "Soil pH is alkaline",
    "active-foliar-disease": "Active foliar fungal infection",
    "active-pest": "Active pest or disease pressure",
    "healthy-crop": "No condition detected",
    "reproductive-stage": "Crop is at flowering or fruiting",
    "vegetative-stage": "Crop is at an early vegetative stage",
    "severity-moderate": "Severity is moderate",
    "severity-severe": "Severity is severe",
  },
  hi: {
    "n-low": "मृदा कार्ड में नाइट्रोजन कम है",
    "n-high": "मृदा कार्ड में नाइट्रोजन पहले से अधिक है",
    "p-low": "मृदा कार्ड में फॉस्फोरस कम है",
    "k-low": "मृदा कार्ड में पोटाश कम है",
    "k-high": "मृदा कार्ड में पोटाश पहले से अधिक है",
    "oc-low": "जैविक कार्बन 0.5% से कम है",
    "zn-low": "जिंक 0.6 ppm की सीमा से कम है",
    "ph-acidic": "मृदा pH अम्लीय है",
    "ph-alkaline": "मृदा pH क्षारीय है",
    "active-foliar-disease": "पत्तियों पर सक्रिय फफूंद संक्रमण",
    "active-pest": "सक्रिय कीट या रोग दबाव",
    "healthy-crop": "कोई समस्या नहीं मिली",
    "reproductive-stage": "फसल फूल या फल अवस्था में है",
    "vegetative-stage": "फसल प्रारंभिक वानस्पतिक अवस्था में है",
    "severity-moderate": "गंभीरता मध्यम है",
    "severity-severe": "गंभीरता अधिक है",
  },
  mr: {
    "n-low": "मृदा पत्रकात नत्र कमी आहे",
    "n-high": "मृदा पत्रकात नत्र आधीच जास्त आहे",
    "p-low": "मृदा पत्रकात स्फुरद कमी आहे",
    "k-low": "मृदा पत्रकात पालाश कमी आहे",
    "k-high": "मृदा पत्रकात पालाश आधीच जास्त आहे",
    "oc-low": "सेंद्रिय कर्ब 0.5% पेक्षा कमी आहे",
    "zn-low": "जस्त 0.6 ppm मर्यादेपेक्षा कमी आहे",
    "ph-acidic": "मृदा pH आम्लधर्मी आहे",
    "ph-alkaline": "मृदा pH विम्लधर्मी आहे",
    "active-foliar-disease": "पानांवर सक्रिय बुरशीजन्य संसर्ग",
    "active-pest": "सक्रिय कीड किंवा रोगाचा दाब",
    "healthy-crop": "कोणतीही समस्या आढळली नाही",
    "reproductive-stage": "पीक फुलोरा किंवा फळधारणा अवस्थेत आहे",
    "vegetative-stage": "पीक सुरुवातीच्या वाढीच्या अवस्थेत आहे",
    "severity-moderate": "तीव्रता मध्यम आहे",
    "severity-severe": "तीव्रता जास्त आहे",
  },
};

export const FERTILIZER_CAUTIONS: Record<Lang, Record<FertilizerCautionId, string>> = {
  en: {
    prototype: "Prototype figures. Not a validated prescription and not a substitute for a local agronomist.",
    "confirm-soil-test": "Confirm every dose against your own soil test report before buying or applying anything.",
    "hold-and-split":
      "Hold and split: do not apply the whole nitrogen dose at once. Wait until the infection stops spreading, then give the held quantity in two parts 10–12 days apart.",
    "foliar-evening": "Spray in the evening. Wear a mask, gloves and full-sleeve clothing. Do not spray if rain is expected within 6 hours.",
    "no-tank-mix": "Do not tank-mix foliar nutrients with a fungicide or insecticide unless the label allows it. Keep sprays 3–4 days apart.",
    "zinc-keep-separate": "Do not apply zinc sulphate together with phosphatic fertiliser or lime. Keep them 8–10 days apart or the zinc is locked up.",
    "k-already-high": "Potassium is already high on your soil card. Do not add extra muriate of potash this season.",
    "no-nitrogen-during-infection": "Extra nitrogen during an active infection produces soft growth and speeds up spread. Do not increase the dose to make the crop look greener.",
  },
  hi: {
    prototype: "प्रोटोटाइप आँकड़े। यह सत्यापित नुस्खा नहीं है और स्थानीय कृषि विशेषज्ञ का विकल्प नहीं है।",
    "confirm-soil-test": "कुछ भी खरीदने या डालने से पहले हर मात्रा को अपनी मिट्टी जाँच रिपोर्ट से मिलाएँ।",
    "hold-and-split":
      "रोकें और बाँटें: पूरी नाइट्रोजन मात्रा एक साथ न दें। संक्रमण फैलना रुकने तक रुकें, फिर रोकी गई मात्रा 10–12 दिन के अंतर पर दो भागों में दें।",
    "foliar-evening": "शाम को छिड़काव करें। मास्क, दस्ताने और पूरी बाँह के कपड़े पहनें। 6 घंटे में बारिश की संभावना हो तो छिड़काव न करें।",
    "no-tank-mix": "जब तक लेबल अनुमति न दे, पर्णीय पोषक तत्वों को फफूंदनाशक या कीटनाशक के साथ न मिलाएँ। छिड़कावों के बीच 3–4 दिन का अंतर रखें।",
    "zinc-keep-separate": "जिंक सल्फेट को फॉस्फेटिक उर्वरक या चूने के साथ न डालें। 8–10 दिन का अंतर रखें, वरना जिंक अनुपलब्ध हो जाता है।",
    "k-already-high": "आपके मृदा कार्ड में पोटाश पहले से अधिक है। इस मौसम में अतिरिक्त म्यूरेट ऑफ पोटाश न डालें।",
    "no-nitrogen-during-infection": "सक्रिय संक्रमण के दौरान अतिरिक्त नाइट्रोजन से कोमल वृद्धि होती है और फैलाव तेज होता है। फसल हरी दिखाने के लिए मात्रा न बढ़ाएँ।",
  },
  mr: {
    prototype: "प्रोटोटाइप आकडे. ही पडताळलेली शिफारस नाही आणि स्थानिक कृषी तज्ज्ञांना पर्याय नाही.",
    "confirm-soil-test": "काहीही खरेदी करण्यापूर्वी किंवा देण्यापूर्वी प्रत्येक मात्रा तुमच्या माती परीक्षण अहवालाशी पडताळा.",
    "hold-and-split":
      "थांबवा आणि विभागा: संपूर्ण नत्र मात्रा एकदम देऊ नका. संसर्गाचा प्रसार थांबेपर्यंत थांबा, नंतर थांबवलेली मात्रा 10–12 दिवसांच्या अंतराने दोन हप्त्यांत द्या.",
    "foliar-evening": "संध्याकाळी फवारणी करा. मास्क, हातमोजे आणि पूर्ण बाह्यांचे कपडे वापरा. 6 तासांत पाऊस अपेक्षित असल्यास फवारू नका.",
    "no-tank-mix": "लेबलवर परवानगी नसल्यास फवारणीची अन्नद्रव्ये बुरशीनाशक किंवा कीटकनाशकात मिसळू नका. दोन फवारण्यांत 3–4 दिवसांचे अंतर ठेवा.",
    "zinc-keep-separate": "झिंक सल्फेट स्फुरदयुक्त खत किंवा चुन्यासोबत देऊ नका. 8–10 दिवसांचे अंतर ठेवा, अन्यथा जस्त पिकाला उपलब्ध होत नाही.",
    "k-already-high": "तुमच्या मृदा पत्रकात पालाश आधीच जास्त आहे. या हंगामात जादा म्युरेट ऑफ पोटॅश देऊ नका.",
    "no-nitrogen-during-infection": "सक्रिय संसर्गाच्या काळात जादा नत्र दिल्यास कोवळी वाढ होते आणि प्रसार वेगाने होतो. पीक हिरवे दिसावे म्हणून मात्रा वाढवू नका.",
  },
};
