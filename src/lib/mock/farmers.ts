import type { Expert, Farmer } from "../types";

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
];

export const EXPERTS: Expert[] = [
  { id: "ex-1", name: "Dr. Meera Kulkarni", role: "Plant Pathologist", org: "KVK Nashik (YCMOU)", districtId: "nashik", phone: "+91 253 2XX XXXX", specialisation: ["Tomato", "Grapes", "Fungal diseases"], distanceKm: 6.2, available: true, languages: ["en", "mr", "hi"] },
  { id: "ex-2", name: "S. R. Deshmukh", role: "Taluka Agriculture Officer", org: "Dept. of Agriculture, Dindori", districtId: "nashik", phone: "+91 98XXX 22314", specialisation: ["IPM", "Input subsidy", "Field visits"], distanceKm: 3.8, available: true, languages: ["mr", "hi"] },
  { id: "ex-3", name: "Dr. Anil Bhosale", role: "Entomologist", org: "NRC Grapes, Pune", districtId: "pune", phone: "+91 20 2XX XXXX", specialisation: ["Grapes", "Mealybug", "Thrips"], distanceKm: 172, available: false, languages: ["en", "mr"] },
  { id: "ex-4", name: "Plant Health Clinic", role: "Diagnostic Laboratory", org: "MPKV Rahuri", districtId: "ahmednagar", phone: "+91 2426 2XX XXX", specialisation: ["Lab confirmation", "Pathogen isolation", "Soil testing"], distanceKm: 118, available: true, languages: ["en", "mr", "hi"] },
  { id: "ex-5", name: "Dr. Rekha Wankhede", role: "Cotton Specialist", org: "CICR Nagpur", districtId: "nagpur", phone: "+91 712 2XX XXXX", specialisation: ["Cotton", "Bollworm", "Whitefly"], distanceKm: 640, available: true, languages: ["en", "hi", "mr"] },
];
