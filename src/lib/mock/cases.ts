import { MODEL_LABEL } from "../ai-mock";
import type { Alert, CropCase } from "../types";

const ai = (threatId: string, confidence: number, severity: CropCase["ai"]["severity"], affectedArea: number, symptoms: string[], reasoning: string[], alternatives: { threatId: string; confidence: number }[]): CropCase["ai"] => ({
  threatId, confidence, severity, affectedArea, symptoms, reasoning, alternatives, modelVersion: MODEL_LABEL, inferenceMs: 1240 + Math.round(confidence * 3),
});

export const SEED_CASES: CropCase[] = [
  {
    id: "MH-NSK-2026-0412", farmerId: "MH-NSK-2026-01902", farmerName: "Sunita Gaikwad", village: "Pimpalgaon Baswant", districtId: "nashik", cropId: "grapes", stage: "Fruiting",
    image: "/samples/grape-powdery.svg", imageLabel: "Grape leaf, upper surface", createdAt: "2026-09-05T07:12:00+05:30", updatedAt: "2026-09-05T07:12:00+05:30",
    ai: ai("powdery-mildew", 61, "Moderate", 22, ["Greyish-white patches on upper leaf", "Slight leaf curling", "Uneven coating (possible dust/residue overlap)"], ["Powdery texture detected on 22% of leaf area", "Pattern overlaps with spray residue signature (confusion risk)", "Night humidity 88% in last 72 h supports mildew", "Canopy density flag from farmer notes"], [{ threatId: "downy-mildew", confidence: 24 }, { threatId: "leaf-spot", confidence: 9 }]),
    risk: "HIGH", riskScore: 78, status: "Pending", followUps: [], source: "seed",
  },
  {
    id: "MH-JAL-2026-0388", farmerId: "MH-JAL-2026-00318", farmerName: "Vikas Chaudhari", village: "Bhusawal", districtId: "jalgaon", cropId: "cotton", stage: "Fruiting",
    image: "/samples/cotton-boll.svg", imageLabel: "Cotton boll, cross-section", createdAt: "2026-09-05T06:48:00+05:30", updatedAt: "2026-09-05T06:48:00+05:30",
    ai: ai("bollworm", 89, "Severe", 38, ["Entry holes on 3 of 5 bolls", "Pink larva visible in cross-section", "Rosette flower in frame"], ["YOLO detected 2 larvae (bbox conf 0.91, 0.84)", "Boll damage density above economic threshold", "Pheromone trap count 12 moths/trap/night in cluster"], [{ threatId: "aphids", confidence: 4 }]),
    risk: "HIGH", riskScore: 84, status: "Pending", followUps: [], source: "seed",
  },
  {
    id: "MH-PUN-2026-0361", farmerId: "MH-PUN-2026-02211", farmerName: "Asha Shinde", village: "Junnar", districtId: "pune", cropId: "tomato", stage: "Flowering",
    image: "/samples/tomato-late.svg", imageLabel: "Tomato leaf, underside", createdAt: "2026-09-04T18:30:00+05:30", updatedAt: "2026-09-04T21:05:00+05:30",
    ai: ai("late-blight", 68, "Moderate", 19, ["Water-soaked irregular lesions", "Faint white growth at lesion margin", "Low-light image, partial blur"], ["Lesion margin texture matches Phytophthora (0.68)", "Alternative early blight rings not clearly resolved", "Temperature 21–25°C with 86% RH favours late blight"], [{ threatId: "early-blight", confidence: 27 }]),
    risk: "MEDIUM", riskScore: 58, status: "Under Review", followUps: [], source: "seed",
  },
  {
    id: "MH-NAG-2026-0297", farmerId: "MH-NAG-2026-00877", farmerName: "Prakash Meshram", village: "Kalmeshwar", districtId: "nagpur", cropId: "cotton", stage: "Flowering",
    image: "/samples/cotton-whitefly.svg", imageLabel: "Cotton leaf, underside", createdAt: "2026-09-04T11:15:00+05:30", updatedAt: "2026-09-04T16:40:00+05:30",
    ai: ai("whitefly", 92, "Moderate", 15, ["Adult whiteflies clustered under leaf", "Sooty mould on lower leaves", "Mild yellowing"], ["YOLO counted 34 adults per leaf (threshold 6–8)", "Sooty mould signature confirms honeydew", "Hot dry spell 32°C / 60% RH"], [{ threatId: "aphids", confidence: 5 }]),
    risk: "MEDIUM", riskScore: 55, status: "Confirmed", expertName: "Dr. Rekha Wankhede", expertNote: "Confirmed. Advise yellow sticky traps + neem; avoid synthetic pyrethroids.", followUpDue: "2026-09-09", followUps: [{ date: "2026-09-05", note: "Sticky traps installed, count reduced to 18/leaf", improved: true }], source: "seed",
  },
  {
    id: "MH-SAN-2026-0344", farmerId: "MH-SAN-2026-01133", farmerName: "Mahesh Jadhav", village: "Tasgaon", districtId: "sangli", cropId: "grapes", stage: "Vegetative",
    image: "/samples/grape-downy.svg", imageLabel: "Grape leaf, underside", createdAt: "2026-09-03T09:40:00+05:30", updatedAt: "2026-09-03T14:20:00+05:30",
    ai: ai("powdery-mildew", 57, "Mild", 9, ["White growth on leaf underside", "Oily yellow spots on top"], ["Underside growth pattern ambiguous", "Oil-spot signature favours downy mildew", "Recent rain 22 mm supports downy over powdery"], [{ threatId: "downy-mildew", confidence: 39 }]),
    risk: "MEDIUM", riskScore: 61, status: "Corrected", expertName: "Dr. Meera Kulkarni", expertThreatId: "downy-mildew", expertNote: "Oil spots on upper surface with underside sporulation = downy mildew, not powdery. Model retrained with this sample.", followUpDue: "2026-09-08", followUps: [], source: "seed",
  },
  {
    id: "MH-YAV-2026-0310", farmerId: "MH-YAV-2026-00452", farmerName: "Sanjay Rathod", village: "Pusad", districtId: "yavatmal", cropId: "cotton", stage: "Fruiting",
    image: "/samples/cotton-boll.svg", imageLabel: "Cotton boll, external", createdAt: "2026-09-02T15:10:00+05:30", updatedAt: "2026-09-03T10:00:00+05:30",
    ai: ai("bollworm", 74, "Severe", 33, ["Multiple bore holes", "Rosette flowers"], ["Bore hole count high", "No larva visible in frame (confidence capped)"], [{ threatId: "whitefly", confidence: 8 }]),
    risk: "HIGH", riskScore: 81, status: "Referred", expertName: "S. R. Deshmukh", expertNote: "Referred to CICR Nagpur for larval identification and resistance screening.", followUps: [], source: "seed",
  },
  {
    id: "MH-AHM-2026-0289", farmerId: "MH-AHM-2026-01590", farmerName: "Kavita More", village: "Rahuri", districtId: "ahmednagar", cropId: "onion", stage: "Vegetative",
    image: "/samples/onion-leaf.svg", imageLabel: "Onion leaves", createdAt: "2026-09-02T08:20:00+05:30", updatedAt: "2026-09-02T12:45:00+05:30",
    ai: ai("downy-mildew", 88, "Moderate", 24, ["Pale elongated patches", "Violet-grey fuzzy growth", "Tip dieback"], ["Sporulation texture strong match", "Morning dew + 84% RH pattern"], [{ threatId: "leaf-spot", confidence: 9 }]),
    risk: "MEDIUM", riskScore: 52, status: "Confirmed", expertName: "Dr. Meera Kulkarni", followUpDue: "2026-09-07", followUps: [{ date: "2026-09-04", note: "Spread halted after drainage correction", improved: true }], source: "seed",
  },
  {
    id: "MH-SAT-2026-0271", farmerId: "MH-SAT-2026-00964", farmerName: "Nanda Bhosale", village: "Karad", districtId: "satara", cropId: "soybean", stage: "Flowering",
    image: "/samples/soy-leaf.svg", imageLabel: "Soybean trifoliate", createdAt: "2026-09-01T10:05:00+05:30", updatedAt: "2026-09-01T10:05:00+05:30",
    ai: ai("leaf-spot", 63, "Mild", 7, ["Small reddish-brown spots", "Faint yellow margins"], ["Spot size small; could be early bacterial pustule", "Low affected area"], [{ threatId: "whitefly", confidence: 12 }]),
    risk: "LOW", riskScore: 32, status: "More Info Requested", expertName: "Dr. Meera Kulkarni", expertNote: "Please upload underside of leaf in daylight and a photo of 3 neighbouring plants.", followUps: [], source: "seed",
  },
  {
    id: "MH-KOL-2026-0250", farmerId: "MH-KOL-2026-00721", farmerName: "Dattatray Pawar", village: "Shirol", districtId: "kolhapur", cropId: "sugarcane", stage: "Vegetative",
    image: "/samples/cane-stem.svg", imageLabel: "Cane stem with bore hole", createdAt: "2026-08-30T09:00:00+05:30", updatedAt: "2026-08-31T11:30:00+05:30",
    ai: ai("stem-borer", 90, "Moderate", 12, ["Dead heart", "Bore hole with frass"], ["Dead heart detection strong", "Frass texture identified"], []),
    risk: "LOW", riskScore: 28, status: "Confirmed", expertName: "S. R. Deshmukh", followUps: [{ date: "2026-09-03", note: "Trichogramma cards released", improved: true }], source: "seed",
  },
  {
    id: "MH-NSK-2026-0398", farmerId: "MH-NSK-2026-01847", farmerName: "Ramesh Patil", village: "Dindori", districtId: "nashik", cropId: "onion", stage: "Seedling",
    image: "/samples/onion-leaf.svg", imageLabel: "Onion seedlings", createdAt: "2026-08-28T07:45:00+05:30", updatedAt: "2026-08-28T13:00:00+05:30",
    ai: ai("leaf-spot", 86, "Mild", 6, ["Small purple lesions", "Tip yellowing"], ["Purple blotch pattern", "Seedling stage susceptible"], []),
    risk: "LOW", riskScore: 30, status: "Confirmed", expertName: "Dr. Meera Kulkarni", followUpDue: "2026-09-04", followUps: [{ date: "2026-09-03", note: "No new lesions after neem spray", improved: true }], source: "seed",
  },
  {
    id: "MH-NSK-2026-0354", farmerId: "MH-NSK-2026-01847", farmerName: "Ramesh Patil", village: "Dindori", districtId: "nashik", cropId: "grapes", stage: "Vegetative",
    image: "/samples/grape-powdery.svg", imageLabel: "Grape shoot", createdAt: "2026-08-19T08:30:00+05:30", updatedAt: "2026-08-19T15:10:00+05:30",
    ai: ai("powdery-mildew", 91, "Mild", 8, ["White powder on young shoot"], ["Early powdery signature", "Dry days with humid nights"], []),
    risk: "MEDIUM", riskScore: 49, status: "Confirmed", expertName: "Dr. Meera Kulkarni", followUps: [{ date: "2026-08-24", note: "Sulphur dusting done, spread contained", improved: true }, { date: "2026-08-30", note: "No new patches", improved: true }], source: "seed",
  },
  {
    id: "PB-LDH-2026-0412", farmerId: "PB-LDH-2026-00412", farmerName: "Gurpreet Singh", village: "Dakha", districtId: "ludhiana", cropId: "wheat", stage: "Vegetative",
    image: "/samples/wheat-aphids.svg", imageLabel: "Wheat flag leaf, upper surface", createdAt: "2026-09-05T07:25:00+05:30", updatedAt: "2026-09-05T07:25:00+05:30",
    ai: ai("yellow-rust", 84, "Severe", 31, ["Yellow-orange pustules in stripes along the veins", "Powder rubs off on contact", "Lower leaves affected first"], ["Stripe orientation along veins matches Puccinia striiformis", "Dew hours above 9 h for 4 consecutive mornings", "Variety flagged susceptible in the district sowing plan"], [{ threatId: "aphids", confidence: 7 }]),
    risk: "HIGH", riskScore: 82, status: "Pending", followUps: [], source: "seed",
  },
  {
    id: "UP-MRT-2026-0388", farmerId: "UP-MRT-2026-00331", farmerName: "Ramkishan Tyagi", village: "Sardhana", districtId: "meerut", cropId: "sugarcane", stage: "Vegetative",
    image: "/samples/cane-stem.svg", imageLabel: "Cane stem with bore hole", createdAt: "2026-09-05T06:35:00+05:30", updatedAt: "2026-09-05T11:10:00+05:30",
    ai: ai("stem-borer", 87, "Moderate", 17, ["Dead heart in young tillers", "Bore hole with fresh frass", "Central shoot pulls out easily"], ["Dead heart detection strong (0.87)", "Frass texture identified at two entry points", "Ratoon crop with previous-season residue"], []),
    risk: "MEDIUM", riskScore: 57, status: "Confirmed", expertName: "Dr. Harpal Sandhu", followUpDue: "2026-09-10", followUps: [{ date: "2026-09-05", note: "Trichogramma cards released across 1.8 ha", improved: true }], source: "seed",
  },
  {
    id: "MP-CWA-2026-0376", farmerId: "MP-CWA-2026-00461", farmerName: "Dinesh Uikey", village: "Saunsar", districtId: "chhindwara", cropId: "maize", stage: "Vegetative",
    image: "/samples/leaf-blurry.svg", imageLabel: "Maize whorl, top view", createdAt: "2026-09-05T06:15:00+05:30", updatedAt: "2026-09-05T06:15:00+05:30",
    ai: ai("fall-armyworm", 91, "Severe", 42, ["Ragged shot holes across whorl leaves", "Moist sawdust-like frass in the whorl", "Larva visible with inverted Y on head"], ["YOLO detected 3 larvae in the whorl (bbox conf 0.93, 0.88, 0.81)", "Whorl damage above the 20% economic threshold", "Staggered sowing in the cluster extends the susceptible window"], [{ threatId: "stem-borer", confidence: 6 }]),
    risk: "HIGH", riskScore: 88, status: "Pending", followUps: [], source: "seed",
  },
  {
    id: "GJ-RJT-2026-0359", farmerId: "GJ-RJT-2026-00608", farmerName: "Bhavesh Patel", village: "Gondal", districtId: "rajkot", cropId: "groundnut", stage: "Fruiting",
    image: "/samples/soy-leaf.svg", imageLabel: "Groundnut leaflet, upper surface", createdAt: "2026-09-05T09:05:00+05:30", updatedAt: "2026-09-05T09:05:00+05:30",
    ai: ai("tikka-leaf-spot", 79, "Moderate", 26, ["Dark brown circular spots with a yellow halo", "Spots on both leaf surfaces", "Defoliation starting from the lower canopy"], ["Spot margin and halo match Cercospora personata", "Humidity above 85% for 5 of the last 7 nights", "Closed canopy at peg-filling raises splash risk"], [{ threatId: "leaf-spot", confidence: 14 }]),
    risk: "HIGH", riskScore: 74, status: "Under Review", followUps: [], source: "seed",
  },
  {
    id: "AP-GNT-2026-0341", farmerId: "AP-GNT-2026-00634", farmerName: "Venkateswarlu Naidu", village: "Tenali", districtId: "guntur", cropId: "chilli", stage: "Fruiting",
    image: "/samples/cotton-whitefly.svg", imageLabel: "Chilli leaf, underside", createdAt: "2026-09-05T08:50:00+05:30", updatedAt: "2026-09-05T08:50:00+05:30",
    ai: ai("whitefly", 90, "Severe", 29, ["Adults lift off when the leaf is disturbed", "Upward leaf curl on young growth", "Sooty mould on lower leaves"], ["YOLO counted 41 adults per leaf (threshold 6-8)", "Leaf curl pattern suggests virus transmission risk", "Hot dry spell 34C with a dense canopy"], [{ threatId: "aphids", confidence: 6 }]),
    risk: "HIGH", riskScore: 85, status: "Pending", followUps: [], source: "seed",
  },
  {
    id: "TG-WGL-2026-0327", farmerId: "TG-WGL-2026-00517", farmerName: "Lakshmi Reddy", village: "Parkal", districtId: "warangal", cropId: "cotton", stage: "Fruiting",
    image: "/samples/cotton-boll.svg", imageLabel: "Cotton boll, cross-section", createdAt: "2026-09-04T17:40:00+05:30", updatedAt: "2026-09-05T08:05:00+05:30",
    ai: ai("bollworm", 86, "Severe", 35, ["Entry holes on 4 of 6 bolls", "Pink larva in cross-section", "Rosette flowers nearby"], ["Two larvae detected (bbox conf 0.89, 0.82)", "Boll damage above economic threshold", "Trap count 11 moths/trap/night in the cluster"], [{ threatId: "whitefly", confidence: 5 }]),
    risk: "HIGH", riskScore: 83, status: "Confirmed", expertName: "Dr. Sailaja Vemuri", expertNote: "Confirmed. Mass trapping plus timely terminal-shoot removal; avoid repeat pyrethroid sprays.", followUpDue: "2026-09-09", followUps: [], source: "seed",
  },
  {
    id: "WB-BWN-2026-0318", farmerId: "WB-BWN-2026-00479", farmerName: "Ashok Mondal", village: "Kalna", districtId: "bardhaman", cropId: "potato", stage: "Vegetative",
    image: "/samples/tomato-late.svg", imageLabel: "Potato leaf, underside", createdAt: "2026-09-04T16:20:00+05:30", updatedAt: "2026-09-04T19:45:00+05:30",
    ai: ai("late-blight", 72, "Moderate", 21, ["Water-soaked irregular lesions", "White growth at the lesion margin", "Rapid browning of petioles"], ["Lesion margin texture matches Phytophthora (0.72)", "Night temperature 17-21C with 91% RH", "Neighbouring plot reported the same symptom 2 days earlier"], [{ threatId: "early-blight", confidence: 19 }]),
    risk: "HIGH", riskScore: 76, status: "Under Review", followUps: [], source: "seed",
  },
  {
    id: "TN-TNJ-2026-0304", farmerId: "TN-TNJ-2026-00441", farmerName: "Murugan Sellappan", village: "Kumbakonam", districtId: "thanjavur", cropId: "rice", stage: "Flowering",
    image: "/samples/rice-stem-borer.svg", imageLabel: "Rice hill, base of tillers", createdAt: "2026-09-04T17:50:00+05:30", updatedAt: "2026-09-05T07:30:00+05:30",
    ai: ai("brown-planthopper", 81, "Moderate", 23, ["Hoppers clustered at the plant base", "Circular drying patch forming", "Sooty mould on lower stems"], ["Hopper count 28 per hill (threshold 10)", "Canopy closed with continuous standing water", "Hopperburn patch expanding from the field centre"], [{ threatId: "stem-borer", confidence: 11 }]),
    risk: "MEDIUM", riskScore: 64, status: "Confirmed", expertName: "Dr. R. Shanmugam", followUpDue: "2026-09-08", followUps: [{ date: "2026-09-05", note: "Alternate wetting and drying started, count down to 17/hill", improved: true }], source: "seed",
  },
  {
    id: "HR-KNL-2026-0292", farmerId: "HR-KNL-2026-00254", farmerName: "Satbir Singh", village: "Nilokheri", districtId: "karnal", cropId: "wheat", stage: "Seedling",
    image: "/samples/wheat-aphids.svg", imageLabel: "Wheat seedling leaves", createdAt: "2026-09-03T08:40:00+05:30", updatedAt: "2026-09-03T15:20:00+05:30",
    ai: ai("yellow-rust", 68, "Mild", 11, ["Faint yellow striping on two leaves", "Pustules not yet erupting", "Patch confined to a field corner"], ["Early stripe signature, low pustule density", "Cool cloudy mornings at 12-16C favour establishment", "Same focus reported in the adjoining block last week"], [{ threatId: "aphids", confidence: 21 }]),
    risk: "MEDIUM", riskScore: 54, status: "Corrected", expertName: "Dr. Harpal Sandhu", expertThreatId: "aphids", expertNote: "Striping is feeding chlorosis from an aphid colony on the leaf underside, not rust pustules. Sample added to the retraining set.", followUpDue: "2026-09-09", followUps: [], source: "seed",
  },
  {
    id: "BR-SMP-2026-0281", farmerId: "BR-SMP-2026-00363", farmerName: "Rajesh Paswan", village: "Rosera", districtId: "samastipur", cropId: "maize", stage: "Vegetative",
    image: "/samples/leaf-blurry.svg", imageLabel: "Maize leaf, mid-whorl", createdAt: "2026-09-02T11:30:00+05:30", updatedAt: "2026-09-02T11:30:00+05:30",
    ai: ai("fall-armyworm", 64, "Mild", 9, ["Papery windowing on young leaves", "Small shot holes, no frass visible", "Single plant affected in frame"], ["Window pattern matches early instar feeding", "No larva in frame, confidence capped", "Low damage area keeps this below the spray threshold"], [{ threatId: "leaf-spot", confidence: 18 }]),
    risk: "LOW", riskScore: 34, status: "More Info Requested", expertName: "Dr. Sunita Jha", expertNote: "Please photograph the whorl centre in daylight and check 10 neighbouring plants for frass.", followUps: [], source: "seed",
  },
  {
    id: "MP-IND-2026-0268", farmerId: "MP-IND-2026-00523", farmerName: "Rekha Patidar", village: "Depalpur", districtId: "indore", cropId: "soybean", stage: "Fruiting",
    image: "/samples/soy-leaf.svg", imageLabel: "Soybean trifoliate", createdAt: "2026-09-01T09:15:00+05:30", updatedAt: "2026-09-01T14:05:00+05:30",
    ai: ai("leaf-spot", 77, "Moderate", 18, ["Brown spots merging into blotches", "Yellow margins around lesions", "Defoliation in the lower canopy"], ["Spot coalescence pattern matches Cercospora", "Dense planting with rain splash in the last 72 h", "Pod-filling stage raises the yield cost of defoliation"], [{ threatId: "tikka-leaf-spot", confidence: 15 }]),
    risk: "MEDIUM", riskScore: 59, status: "Confirmed", expertName: "Dr. Alok Verma", followUpDue: "2026-09-07", followUps: [{ date: "2026-09-04", note: "Spread slowed after the first fungicide round", improved: true }], source: "seed",
  },
  {
    id: "AS-JRT-2026-0255", farmerId: "AS-JRT-2026-00188", farmerName: "Bhaskar Bora", village: "Titabar", districtId: "jorhat", cropId: "rice", stage: "Vegetative",
    image: "/samples/rice-stem-borer.svg", imageLabel: "Rice tillers, base", createdAt: "2026-08-31T10:20:00+05:30", updatedAt: "2026-09-01T09:40:00+05:30",
    ai: ai("brown-planthopper", 66, "Mild", 8, ["A few hoppers at the base", "No drying patch yet", "Leaf colour normal"], ["Hopper count 9 per hill, just under threshold", "Humid valley conditions favour build-up", "Worth a second look in 5 days"], [{ threatId: "stem-borer", confidence: 17 }]),
    risk: "LOW", riskScore: 31, status: "Confirmed", expertName: "Dr. Nabanita Saikia", followUps: [{ date: "2026-09-01", note: "Drainage advised, no hopperburn seen", improved: true }], source: "seed",
  },
];

export const ALERTS: Alert[] = [
  { id: "al-1", level: "HIGH", title: "High-risk cluster detected in Nashik", body: "36 early blight cases in tomato within 14 km of Dindori. Humidity above 80% forecast for 72 h. Recommend advisory push to 2,140 tomato growers.", districtId: "nashik", cropId: "tomato", threatId: "early-blight", createdAt: "2026-09-05T08:15:00+05:30", acknowledged: false },
  { id: "al-2", level: "HIGH", title: "Pink bollworm above ETL in Jalgaon and Yavatmal", body: "Pheromone trap counts exceed 8 moths/trap/night in 11 villages. Trigger mass trapping and PBW advisory.", districtId: "jalgaon", cropId: "cotton", threatId: "bollworm", createdAt: "2026-09-05T07:40:00+05:30", acknowledged: false },
  { id: "al-3", level: "HIGH", title: "Powdery mildew spreading in Nashik grape belt", body: "Cases up 23% week-on-week around Niphad. Night humidity 88%.", districtId: "nashik", cropId: "grapes", threatId: "powdery-mildew", createdAt: "2026-09-04T19:00:00+05:30", acknowledged: true },
  { id: "al-4", level: "MEDIUM", title: "Downy mildew watch for Sangli grapes", body: "Rain 22 mm in 48 h. Recommend prophylactic bio-spray advisory to Tasgaon and Miraj.", districtId: "sangli", cropId: "grapes", threatId: "downy-mildew", createdAt: "2026-09-04T16:20:00+05:30", acknowledged: true },
  { id: "al-5", level: "MEDIUM", title: "Whitefly build-up in Nagpur cotton", body: "Counts 34 adults/leaf at Kalmeshwar. Sticky trap distribution recommended.", districtId: "nagpur", cropId: "cotton", threatId: "whitefly", createdAt: "2026-09-04T12:30:00+05:30", acknowledged: true },
  { id: "al-6", level: "LOW", title: "Stem borer declining in Kolhapur sugarcane", body: "Trichogramma release showing effect. Cases down 12%.", districtId: "kolhapur", cropId: "sugarcane", threatId: "stem-borer", createdAt: "2026-09-03T10:00:00+05:30", acknowledged: true },
  { id: "al-7", level: "HIGH", title: "Fall armyworm above threshold in Chhindwara maize", body: "52 cases across 9 villages with whorl damage over 20%. Trigger the FAW advisory and release Trichogramma in the Saunsar cluster.", districtId: "chhindwara", cropId: "maize", threatId: "fall-armyworm", createdAt: "2026-09-05T08:05:00+05:30", acknowledged: false },
  { id: "al-8", level: "HIGH", title: "Yellow rust confirmed across the Punjab-Haryana wheat belt", body: "Ludhiana and Karnal both report erupting pustules on susceptible varieties. Dew hours above 9 h forecast for 4 days. Advise an immediate first spray window.", districtId: "ludhiana", cropId: "wheat", threatId: "yellow-rust", createdAt: "2026-09-05T07:30:00+05:30", acknowledged: false },
  { id: "al-9", level: "HIGH", title: "Whitefly surge in Guntur chilli", body: "41 adults per leaf at Tenali with upward leaf curl. Leaf-curl virus transmission risk. Yellow sticky traps and a bio-pesticide advisory recommended.", districtId: "guntur", cropId: "chilli", threatId: "whitefly", createdAt: "2026-09-05T08:55:00+05:30", acknowledged: false },
  { id: "al-10", level: "MEDIUM", title: "Brown planthopper watch for the Cauvery delta", body: "Counts at 28 per hill in Thanjavur with closed canopy and standing water. Advise alternate wetting and drying across Kumbakonam block.", districtId: "thanjavur", cropId: "rice", threatId: "brown-planthopper", createdAt: "2026-09-04T18:10:00+05:30", acknowledged: true },
  { id: "al-11", level: "MEDIUM", title: "Tikka leaf spot building in Saurashtra groundnut", body: "Rajkot and Anantapur both crossing 25% leaf area affected at peg filling. Prophylactic advisory queued for 1,900 growers.", districtId: "rajkot", cropId: "groundnut", threatId: "tikka-leaf-spot", createdAt: "2026-09-04T15:40:00+05:30", acknowledged: true },
  { id: "al-12", level: "MEDIUM", title: "Late blight in Purba Bardhaman potato", body: "Night temperature 17-21C with 91% RH. Recommend advisory to Kalna block before the next irrigation.", districtId: "bardhaman", cropId: "potato", threatId: "late-blight", createdAt: "2026-09-04T17:00:00+05:30", acknowledged: true },
];
