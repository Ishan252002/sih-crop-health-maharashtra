import { caseIdPrefix, districtById } from "./geo";
import type { CropInsurance, CropStage, Expert, Farmer } from "../types";

export const DEMO_FARMER: Farmer = {
  id: "MH-NSK-2026-01847",
  name: "Ramesh Patil",
  nameLocal: "रमेश पाटील",
  mobile: "+91 98XXX 41207",
  village: "Dindori",
  taluka: "Dindori",
  districtId: "nashik",
  landHa: 2.4,
  registeredOn: "2026-06-12",
  avatarHue: 150,
  plots: [
    { id: "P1", name: "Plot 1 · Gat No. 112/2", areaHa: 1.2, cropId: "tomato", stage: "Fruiting", sownOn: "2026-07-02", irrigation: "Drip" },
    { id: "P2", name: "Plot 2 · Gat No. 118", areaHa: 0.8, cropId: "grapes", stage: "Vegetative", sownOn: "2023-01-15", irrigation: "Drip" },
    { id: "P3", name: "Plot 3 · Gat No. 119/1", areaHa: 0.4, cropId: "onion", stage: "Seedling", sownOn: "2026-08-25", irrigation: "Sprinkler" },
  ],
  soil: {
    cardId: "SHC-MH-NSK-0234981",
    soilType: "Medium black (Vertic Inceptisol)",
    ph: 7.4,
    nitrogen: 210,
    phosphorus: 18,
    potassium: 320,
    organicCarbon: 0.58,
    ec: 0.32,
    zinc: 0.54,
    lastTest: "2026-02-12",
    testedBy: "KVK Nashik Soil Testing Lab",
  },
  cropHistory: [
    { season: "Kharif 2026", cropId: "tomato", yield: "In progress", issue: "Early Blight (current)" },
    { season: "Rabi 2025-26", cropId: "onion", yield: "14.2 t/ha", issue: "Purple blotch (mild)" },
    { season: "Kharif 2025", cropId: "soybean", yield: "1.8 t/ha" },
    { season: "Rabi 2024-25", cropId: "wheat", yield: "3.1 t/ha", issue: "Aphids (controlled)" },
    { season: "Kharif 2024", cropId: "tomato", yield: "38 t/ha", issue: "Late blight (moderate)" },
  ],
};

/**
 * Builds a registry row for a district outside the original Maharashtra pilot. The
 * farmer id, the Soil Health Card id and the testing lab all follow the district, so
 * no row carries another state's codes.
 */
const mk = (
  districtId: string,
  serial: string,
  name: string,
  nameLocal: string,
  village: string,
  taluka: string,
  landHa: number,
  avatarHue: number,
  plot: { cropId: string; stage: CropStage; sownOn: string; irrigation: string },
  soilType: string,
  cropHistory: Farmer["cropHistory"],
): Farmer => {
  const prefix = caseIdPrefix(districtId);
  return {
    ...DEMO_FARMER,
    id: `${prefix}-2026-${serial}`,
    name,
    nameLocal,
    village,
    taluka,
    districtId,
    landHa,
    avatarHue,
    plots: [{ id: "P1", name: "Plot 1", areaHa: landHa, ...plot }],
    soil: { ...DEMO_FARMER.soil, cardId: `SHC-${prefix}-0${serial}1`, soilType, testedBy: `KVK ${districtById(districtId).name} Soil Testing Lab` },
    cropHistory,
  };
};

export const NATIONAL_FARMERS: Farmer[] = [
  mk("ludhiana", "00412", "Gurpreet Singh", "गुरप्रीत सिंह", "Dakha", "Jagraon", 4.6, 95, { cropId: "wheat", stage: "Vegetative", sownOn: "2026-11-08", irrigation: "Canal" }, "Alluvial loam (Typic Ustochrept)", [{ season: "Rabi 2025-26", cropId: "wheat", yield: "5.1 t/ha", issue: "Yellow rust (moderate)" }, { season: "Kharif 2025", cropId: "rice", yield: "6.8 t/ha" }]),
  mk("amritsar", "00388", "Harjit Kaur", "हरजीत कौर", "Majitha", "Majitha", 3.1, 275, { cropId: "rice", stage: "Flowering", sownOn: "2026-06-22", irrigation: "Canal" }, "Alluvial sandy loam", [{ season: "Kharif 2026", cropId: "rice", yield: "In progress", issue: "Brown planthopper (current)" }, { season: "Rabi 2025-26", cropId: "wheat", yield: "4.7 t/ha" }]),
  mk("karnal", "00254", "Satbir Singh", "सतबीर सिंह", "Nilokheri", "Nilokheri", 5.2, 40, { cropId: "wheat", stage: "Seedling", sownOn: "2026-11-15", irrigation: "Tubewell" }, "Alluvial clay loam", [{ season: "Rabi 2025-26", cropId: "wheat", yield: "5.4 t/ha", issue: "Yellow rust (severe)" }, { season: "Kharif 2025", cropId: "rice", yield: "7.1 t/ha" }]),
  mk("meerut", "00331", "Ramkishan Tyagi", "रामकिशन त्यागी", "Sardhana", "Sardhana", 2.9, 200, { cropId: "sugarcane", stage: "Vegetative", sownOn: "2026-02-18", irrigation: "Tubewell" }, "Alluvial loam", [{ season: "Annual 2026", cropId: "sugarcane", yield: "In progress", issue: "Stem borer (current)" }, { season: "Rabi 2025-26", cropId: "mustard", yield: "1.6 t/ha" }]),
  mk("varanasi", "00297", "Shivkumar Yadav", "शिवकुमार यादव", "Pindra", "Pindra", 1.4, 165, { cropId: "rice", stage: "Flowering", sownOn: "2026-07-01", irrigation: "Tubewell" }, "Gangetic alluvium", [{ season: "Kharif 2026", cropId: "rice", yield: "In progress", issue: "Brown planthopper (current)" }, { season: "Rabi 2025-26", cropId: "potato", yield: "21 t/ha" }]),
  mk("sriganganagar", "00176", "Mohan Lal Jat", "मोहन लाल जाट", "Suratgarh", "Suratgarh", 6.8, 25, { cropId: "mustard", stage: "Flowering", sownOn: "2026-10-20", irrigation: "Canal" }, "Desert sandy loam (Typic Torripsamment)", [{ season: "Rabi 2025-26", cropId: "mustard", yield: "1.9 t/ha", issue: "Aphids (controlled)" }, { season: "Kharif 2025", cropId: "cotton", yield: "2.2 t/ha" }]),
  mk("indore", "00523", "Rekha Patidar", "रेखा पाटीदार", "Depalpur", "Depalpur", 3.4, 310, { cropId: "soybean", stage: "Fruiting", sownOn: "2026-06-26", irrigation: "Rainfed" }, "Deep black cotton soil (Vertisol)", [{ season: "Kharif 2026", cropId: "soybean", yield: "In progress", issue: "Leaf spot (current)" }, { season: "Rabi 2025-26", cropId: "wheat", yield: "3.8 t/ha" }]),
  mk("chhindwara", "00461", "Dinesh Uikey", "दिनेश उईके", "Saunsar", "Saunsar", 2.2, 80, { cropId: "maize", stage: "Vegetative", sownOn: "2026-07-04", irrigation: "Rainfed" }, "Medium black (Vertic Inceptisol)", [{ season: "Kharif 2026", cropId: "maize", yield: "In progress", issue: "Fall armyworm (current)" }, { season: "Rabi 2025-26", cropId: "wheat", yield: "2.9 t/ha" }]),
  mk("rajkot", "00608", "Bhavesh Patel", "भावेश पटेल", "Gondal", "Gondal", 4.1, 55, { cropId: "groundnut", stage: "Fruiting", sownOn: "2026-06-20", irrigation: "Drip" }, "Medium black calcareous", [{ season: "Kharif 2026", cropId: "groundnut", yield: "In progress", issue: "Tikka leaf spot (current)" }, { season: "Rabi 2025-26", cropId: "wheat", yield: "3.4 t/ha" }]),
  mk("bharuch", "00572", "Jayanti Vasava", "जयंती वसावा", "Jhagadia", "Jhagadia", 2.6, 130, { cropId: "cotton", stage: "Flowering", sownOn: "2026-06-14", irrigation: "Rainfed" }, "Coastal alluvium", [{ season: "Kharif 2026", cropId: "cotton", yield: "In progress", issue: "Whitefly (current)" }, { season: "Kharif 2025", cropId: "cotton", yield: "2.4 t/ha" }]),
  mk("belagavi", "00349", "Shivanand Patil", "शिवानंद पाटील", "Gokak", "Gokak", 3.7, 110, { cropId: "sugarcane", stage: "Vegetative", sownOn: "2026-01-28", irrigation: "Flood" }, "Red sandy loam", [{ season: "Annual 2026", cropId: "sugarcane", yield: "In progress" }, { season: "Kharif 2025", cropId: "soybean", yield: "1.7 t/ha" }]),
  mk("mandya", "00286", "Chandrashekar Gowda", "चंद्रशेखर गौड़ा", "Maddur", "Maddur", 1.2, 235, { cropId: "rice", stage: "Vegetative", sownOn: "2026-07-12", irrigation: "Canal" }, "Red loam (Cauvery command)", [{ season: "Kharif 2026", cropId: "rice", yield: "In progress", issue: "Stem borer (current)" }, { season: "Rabi 2025-26", cropId: "maize", yield: "5.2 t/ha" }]),
  mk("warangal", "00517", "Lakshmi Reddy", "लक्ष्मी रेड्डी", "Parkal", "Parkal", 3.9, 345, { cropId: "cotton", stage: "Fruiting", sownOn: "2026-06-16", irrigation: "Drip" }, "Red chalka soil", [{ season: "Kharif 2026", cropId: "cotton", yield: "In progress", issue: "Pink bollworm (current)" }, { season: "Rabi 2025-26", cropId: "maize", yield: "6.1 t/ha" }]),
  mk("guntur", "00634", "Venkateswarlu Naidu", "वेंकटेश्वरलु नायडू", "Tenali", "Tenali", 2.3, 15, { cropId: "chilli", stage: "Fruiting", sownOn: "2026-07-08", irrigation: "Drip" }, "Black cotton soil (Krishna delta)", [{ season: "Kharif 2026", cropId: "chilli", yield: "In progress", issue: "Whitefly (current)" }, { season: "Rabi 2025-26", cropId: "rice", yield: "6.4 t/ha" }]),
  mk("anantapur", "00398", "Ramanjaneyulu Gowd", "रामांजनेयुलु गौड़", "Dharmavaram", "Dharmavaram", 5.4, 70, { cropId: "groundnut", stage: "Flowering", sownOn: "2026-06-30", irrigation: "Rainfed" }, "Red sandy soil (Rayalaseema)", [{ season: "Kharif 2026", cropId: "groundnut", yield: "In progress", issue: "Tikka leaf spot (current)" }, { season: "Kharif 2025", cropId: "groundnut", yield: "0.9 t/ha" }]),
  mk("thanjavur", "00441", "Murugan Sellappan", "मुरुगन सेल्लप्पन", "Kumbakonam", "Kumbakonam", 1.8, 190, { cropId: "rice", stage: "Flowering", sownOn: "2026-06-24", irrigation: "Canal" }, "Deltaic alluvium", [{ season: "Kharif 2026", cropId: "rice", yield: "In progress", issue: "Brown planthopper (current)" }, { season: "Rabi 2025-26", cropId: "rice", yield: "5.7 t/ha" }]),
  mk("idukki", "00215", "Thomas Mathew", "थॉमस मैथ्यू", "Thodupuzha", "Thodupuzha", 0.8, 155, { cropId: "banana", stage: "Fruiting", sownOn: "2026-03-10", irrigation: "Rainfed" }, "Lateritic forest loam", [{ season: "Perennial 2026", cropId: "banana", yield: "In progress", issue: "Leaf spot (current)" }, { season: "Perennial 2025", cropId: "tea", yield: "1.9 t/ha made tea" }]),
  mk("bardhaman", "00479", "Ashok Mondal", "अशोक मंडल", "Kalna", "Kalna", 1.1, 285, { cropId: "potato", stage: "Vegetative", sownOn: "2026-11-02", irrigation: "Tubewell" }, "Gangetic alluvium (lower plain)", [{ season: "Rabi 2025-26", cropId: "potato", yield: "24 t/ha", issue: "Late blight (severe)" }, { season: "Kharif 2025", cropId: "rice", yield: "5.9 t/ha" }]),
  mk("samastipur", "00363", "Rajesh Paswan", "राजेश पासवान", "Rosera", "Rosera", 0.9, 35, { cropId: "maize", stage: "Vegetative", sownOn: "2026-07-06", irrigation: "Tubewell" }, "Calcareous alluvium", [{ season: "Kharif 2026", cropId: "maize", yield: "In progress", issue: "Fall armyworm (current)" }, { season: "Rabi 2025-26", cropId: "wheat", yield: "3.2 t/ha" }]),
  mk("bargarh", "00302", "Sanjay Pradhan", "संजय प्रधान", "Attabira", "Attabira", 2.1, 215, { cropId: "rice", stage: "Flowering", sownOn: "2026-06-28", irrigation: "Canal" }, "Red and yellow loam", [{ season: "Kharif 2026", cropId: "rice", yield: "In progress", issue: "Stem borer (current)" }, { season: "Rabi 2025-26", cropId: "groundnut", yield: "1.4 t/ha" }]),
  mk("jorhat", "00188", "Bhaskar Bora", "भास्कर बोरा", "Titabar", "Titabar", 1.6, 125, { cropId: "rice", stage: "Vegetative", sownOn: "2026-07-14", irrigation: "Rainfed" }, "Brahmaputra valley alluvium", [{ season: "Kharif 2026", cropId: "rice", yield: "In progress", issue: "Brown planthopper (current)" }, { season: "Perennial 2025", cropId: "tea", yield: "2.3 t/ha made tea" }]),
];

export const FARMERS: Farmer[] = [
  DEMO_FARMER,
  { ...DEMO_FARMER, id: "MH-NSK-2026-01902", name: "Sunita Gaikwad", nameLocal: "सुनीता गायकवाड", village: "Pimpalgaon Baswant", taluka: "Niphad", landHa: 1.6, avatarHue: 30, plots: [{ id: "P1", name: "Plot 1", areaHa: 1.6, cropId: "grapes", stage: "Fruiting", sownOn: "2022-02-01", irrigation: "Drip" }] },
  { ...DEMO_FARMER, id: "MH-JAL-2026-00318", name: "Vikas Chaudhari", nameLocal: "विकास चौधरी", village: "Bhusawal", taluka: "Bhusawal", districtId: "jalgaon", landHa: 3.2, avatarHue: 210, plots: [{ id: "P1", name: "Plot 1", areaHa: 3.2, cropId: "cotton", stage: "Fruiting", sownOn: "2026-06-18", irrigation: "Rainfed" }] },
  { ...DEMO_FARMER, id: "MH-PUN-2026-02211", name: "Asha Shinde", nameLocal: "आशा शिंदे", village: "Junnar", taluka: "Junnar", districtId: "pune", landHa: 0.9, avatarHue: 320, plots: [{ id: "P1", name: "Plot 1", areaHa: 0.9, cropId: "tomato", stage: "Flowering", sownOn: "2026-07-20", irrigation: "Drip" }] },
  { ...DEMO_FARMER, id: "MH-NAG-2026-00877", name: "Prakash Meshram", nameLocal: "प्रकाश मेश्राम", village: "Kalmeshwar", taluka: "Kalmeshwar", districtId: "nagpur", landHa: 4.1, avatarHue: 90, plots: [{ id: "P1", name: "Plot 1", areaHa: 4.1, cropId: "cotton", stage: "Flowering", sownOn: "2026-06-25", irrigation: "Rainfed" }] },
  { ...DEMO_FARMER, id: "MH-SAN-2026-01133", name: "Mahesh Jadhav", nameLocal: "महेश जाधव", village: "Tasgaon", taluka: "Tasgaon", districtId: "sangli", landHa: 2.0, avatarHue: 260, plots: [{ id: "P1", name: "Plot 1", areaHa: 2.0, cropId: "grapes", stage: "Vegetative", sownOn: "2021-12-10", irrigation: "Drip" }] },
  { ...DEMO_FARMER, id: "MH-YAV-2026-00452", name: "Sanjay Rathod", nameLocal: "संजय राठोड", village: "Pusad", taluka: "Pusad", districtId: "yavatmal", landHa: 2.8, avatarHue: 10, plots: [{ id: "P1", name: "Plot 1", areaHa: 2.8, cropId: "cotton", stage: "Fruiting", sownOn: "2026-06-15", irrigation: "Rainfed" }] },
  { ...DEMO_FARMER, id: "MH-AHM-2026-01590", name: "Kavita More", nameLocal: "कविता मोरे", village: "Rahuri", taluka: "Rahuri", districtId: "ahmednagar", landHa: 1.1, avatarHue: 180, plots: [{ id: "P1", name: "Plot 1", areaHa: 1.1, cropId: "onion", stage: "Vegetative", sownOn: "2026-08-05", irrigation: "Sprinkler" }] },
  { ...DEMO_FARMER, id: "MH-KOL-2026-00721", name: "Dattatray Pawar", nameLocal: "दत्तात्रय पवार", village: "Shirol", taluka: "Shirol", districtId: "kolhapur", landHa: 1.5, avatarHue: 45, plots: [{ id: "P1", name: "Plot 1", areaHa: 1.5, cropId: "sugarcane", stage: "Vegetative", sownOn: "2026-01-20", irrigation: "Flood" }] },
  { ...DEMO_FARMER, id: "MH-SAT-2026-00964", name: "Nanda Bhosale", nameLocal: "नंदा भोसले", village: "Karad", taluka: "Karad", districtId: "satara", landHa: 1.3, avatarHue: 120, plots: [{ id: "P1", name: "Plot 1", areaHa: 1.3, cropId: "soybean", stage: "Flowering", sownOn: "2026-06-28", irrigation: "Rainfed" }] },
  ...NATIONAL_FARMERS,
];

export const EXPERTS: Expert[] = [
  { id: "ex-1", name: "Dr. Meera Kulkarni", role: "Plant Pathologist", org: "KVK Nashik (YCMOU)", districtId: "nashik", phone: "+91 253 2XX XXXX", specialisation: ["Tomato", "Grapes", "Fungal diseases"], distanceKm: 6.2, available: true, languages: ["en", "hi"] },
  { id: "ex-2", name: "S. R. Deshmukh", role: "Taluka Agriculture Officer", org: "Dept. of Agriculture, Dindori", districtId: "nashik", phone: "+91 98XXX 22314", specialisation: ["IPM", "Input subsidy", "Field visits"], distanceKm: 3.8, available: true, languages: ["hi"] },
  { id: "ex-3", name: "Dr. Anil Bhosale", role: "Entomologist", org: "NRC Grapes, Pune", districtId: "pune", phone: "+91 20 2XX XXXX", specialisation: ["Grapes", "Mealybug", "Thrips"], distanceKm: 172, available: false, languages: ["en"] },
  { id: "ex-4", name: "Plant Health Clinic", role: "Diagnostic Laboratory", org: "MPKV Rahuri", districtId: "ahmednagar", phone: "+91 2426 2XX XXX", specialisation: ["Lab confirmation", "Pathogen isolation", "Soil testing"], distanceKm: 118, available: true, languages: ["en", "hi"] },
  { id: "ex-5", name: "Dr. Rekha Wankhede", role: "Cotton Specialist", org: "CICR Nagpur", districtId: "nagpur", phone: "+91 712 2XX XXXX", specialisation: ["Cotton", "Bollworm", "Whitefly"], distanceKm: 640, available: true, languages: ["en", "hi"] },
];

export const DEMO_INSURANCE: CropInsurance = {
  policyNumber: "CI-MH-2026-18492",
  farmerId: DEMO_FARMER.id,
  cropId: "soybean",
  provider: "Agriculture Insurance Company of India",
  scheme: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
  season: "Kharif 2026",
  coverage: 85000,
  status: "Active",
  validFrom: "2026-07-01",
  validTo: "2026-12-31",
  plotId: "P1",
  addedOn: "2026-09-05",
};
