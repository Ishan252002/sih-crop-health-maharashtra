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
];

export const ALERTS: Alert[] = [
  { id: "al-1", level: "HIGH", title: "High-risk cluster detected in Nashik", body: "36 early blight cases in tomato within 14 km of Dindori. Humidity above 80% forecast for 72 h. Recommend advisory push to 2,140 tomato growers.", districtId: "nashik", cropId: "tomato", threatId: "early-blight", createdAt: "2026-09-05T08:15:00+05:30", acknowledged: false },
  { id: "al-2", level: "HIGH", title: "Pink bollworm above ETL in Jalgaon and Yavatmal", body: "Pheromone trap counts exceed 8 moths/trap/night in 11 villages. Trigger mass trapping and PBW advisory.", districtId: "jalgaon", cropId: "cotton", threatId: "bollworm", createdAt: "2026-09-05T07:40:00+05:30", acknowledged: false },
  { id: "al-3", level: "HIGH", title: "Powdery mildew spreading in Nashik grape belt", body: "Cases up 23% week-on-week around Niphad. Night humidity 88%.", districtId: "nashik", cropId: "grapes", threatId: "powdery-mildew", createdAt: "2026-09-04T19:00:00+05:30", acknowledged: true },
  { id: "al-4", level: "MEDIUM", title: "Downy mildew watch for Sangli grapes", body: "Rain 22 mm in 48 h. Recommend prophylactic bio-spray advisory to Tasgaon and Miraj.", districtId: "sangli", cropId: "grapes", threatId: "downy-mildew", createdAt: "2026-09-04T16:20:00+05:30", acknowledged: true },
  { id: "al-5", level: "MEDIUM", title: "Whitefly build-up in Nagpur cotton", body: "Counts 34 adults/leaf at Kalmeshwar. Sticky trap distribution recommended.", districtId: "nagpur", cropId: "cotton", threatId: "whitefly", createdAt: "2026-09-04T12:30:00+05:30", acknowledged: true },
  { id: "al-6", level: "LOW", title: "Stem borer declining in Kolhapur sugarcane", body: "Trichogramma release showing effect. Cases down 12%.", districtId: "kolhapur", cropId: "sugarcane", threatId: "stem-borer", createdAt: "2026-09-03T10:00:00+05:30", acknowledged: true },
];
