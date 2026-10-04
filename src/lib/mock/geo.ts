import type { Crop, District, StateRegion, Threat } from "../types";

/**
 * The geography registry for the whole prototype: states, the districts that report
 * into them, and the crop and threat vocabularies every other mock file draws from.
 *
 * `District.code` stays a 3-letter district code. A case id prefix is composed as
 * `<state code>-<district code>` (see caseIdPrefix), which is why MH-NSK, PB-LDH and
 * UP-MRT all read correctly without the state being baked into the district row.
 */
export const STATES: StateRegion[] = [
  { id: "punjab", code: "PB", name: "Punjab", lat: 31.1471, lng: 75.3412, zone: "North" },
  { id: "haryana", code: "HR", name: "Haryana", lat: 29.0588, lng: 76.0856, zone: "North" },
  { id: "uttar-pradesh", code: "UP", name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, zone: "North" },
  { id: "rajasthan", code: "RJ", name: "Rajasthan", lat: 27.0238, lng: 74.2179, zone: "West" },
  { id: "madhya-pradesh", code: "MP", name: "Madhya Pradesh", lat: 23.4733, lng: 77.947, zone: "Central" },
  { id: "gujarat", code: "GJ", name: "Gujarat", lat: 22.2587, lng: 71.1924, zone: "West" },
  { id: "maharashtra", code: "MH", name: "Maharashtra", lat: 19.7515, lng: 75.7139, zone: "West" },
  { id: "karnataka", code: "KA", name: "Karnataka", lat: 15.3173, lng: 75.7139, zone: "South" },
  { id: "telangana", code: "TG", name: "Telangana", lat: 17.9784, lng: 79.1288, zone: "South" },
  { id: "andhra-pradesh", code: "AP", name: "Andhra Pradesh", lat: 15.9129, lng: 79.74, zone: "South" },
  { id: "tamil-nadu", code: "TN", name: "Tamil Nadu", lat: 11.1271, lng: 78.6569, zone: "South" },
  { id: "kerala", code: "KL", name: "Kerala", lat: 10.8505, lng: 76.2711, zone: "South" },
  { id: "west-bengal", code: "WB", name: "West Bengal", lat: 22.9868, lng: 87.855, zone: "East" },
  { id: "bihar", code: "BR", name: "Bihar", lat: 25.0961, lng: 85.3131, zone: "East" },
  { id: "odisha", code: "OD", name: "Odisha", lat: 20.9517, lng: 85.0985, zone: "East" },
  { id: "assam", code: "AS", name: "Assam", lat: 26.2006, lng: 92.9376, zone: "North-East" },
];

export const DISTRICTS: District[] = [
  // Punjab
  { id: "ludhiana", code: "LDH", name: "Ludhiana", lat: 30.901, lng: 75.8573, region: "Central Plain", stateId: "punjab" },
  { id: "amritsar", code: "ASR", name: "Amritsar", lat: 31.634, lng: 74.8723, region: "Majha", stateId: "punjab" },
  // Haryana
  { id: "karnal", code: "KNL", name: "Karnal", lat: 29.6857, lng: 76.9905, region: "Upper Yamuna Plain", stateId: "haryana" },
  // Uttar Pradesh
  { id: "meerut", code: "MRT", name: "Meerut", lat: 28.9845, lng: 77.7064, region: "Upper Doab", stateId: "uttar-pradesh" },
  { id: "varanasi", code: "VNS", name: "Varanasi", lat: 25.3176, lng: 82.9739, region: "Eastern Plain", stateId: "uttar-pradesh" },
  // Rajasthan
  { id: "sriganganagar", code: "SGN", name: "Sri Ganganagar", lat: 29.9094, lng: 73.88, region: "Irrigated North-West", stateId: "rajasthan" },
  // Madhya Pradesh
  { id: "indore", code: "IND", name: "Indore", lat: 22.7196, lng: 75.8577, region: "Malwa", stateId: "madhya-pradesh" },
  { id: "chhindwara", code: "CWA", name: "Chhindwara", lat: 22.0574, lng: 78.9382, region: "Satpura Plateau", stateId: "madhya-pradesh" },
  // Gujarat
  { id: "rajkot", code: "RJT", name: "Rajkot", lat: 22.3039, lng: 70.8022, region: "Saurashtra", stateId: "gujarat" },
  { id: "bharuch", code: "BRC", name: "Bharuch", lat: 21.7051, lng: 72.9959, region: "South Gujarat", stateId: "gujarat" },
  // Maharashtra
  { id: "nashik", code: "NSK", name: "Nashik", lat: 19.9975, lng: 73.7898, region: "North Maharashtra", stateId: "maharashtra" },
  { id: "pune", code: "PUN", name: "Pune", lat: 18.5204, lng: 73.8567, region: "Western Maharashtra", stateId: "maharashtra" },
  { id: "nagpur", code: "NAG", name: "Nagpur", lat: 21.1458, lng: 79.0882, region: "Vidarbha", stateId: "maharashtra" },
  { id: "ahmednagar", code: "AHM", name: "Ahmednagar", lat: 19.0948, lng: 74.748, region: "Western Maharashtra", stateId: "maharashtra" },
  { id: "kolhapur", code: "KOL", name: "Kolhapur", lat: 16.705, lng: 74.2433, region: "Western Maharashtra", stateId: "maharashtra" },
  { id: "satara", code: "SAT", name: "Satara", lat: 17.6805, lng: 74.0183, region: "Western Maharashtra", stateId: "maharashtra" },
  { id: "sangli", code: "SAN", name: "Sangli", lat: 16.8524, lng: 74.5815, region: "Western Maharashtra", stateId: "maharashtra" },
  { id: "jalgaon", code: "JAL", name: "Jalgaon", lat: 21.0077, lng: 75.5626, region: "North Maharashtra", stateId: "maharashtra" },
  { id: "solapur", code: "SOL", name: "Solapur", lat: 17.6599, lng: 75.9064, region: "Western Maharashtra", stateId: "maharashtra" },
  { id: "sambhajinagar", code: "CSN", name: "Chhatrapati Sambhajinagar", lat: 19.8762, lng: 75.3433, region: "Marathwada", stateId: "maharashtra" },
  { id: "amravati", code: "AMR", name: "Amravati", lat: 20.932, lng: 77.7523, region: "Vidarbha", stateId: "maharashtra" },
  { id: "yavatmal", code: "YAV", name: "Yavatmal", lat: 20.3888, lng: 78.1204, region: "Vidarbha", stateId: "maharashtra" },
  { id: "latur", code: "LAT", name: "Latur", lat: 18.4088, lng: 76.5604, region: "Marathwada", stateId: "maharashtra" },
  { id: "wardha", code: "WAR", name: "Wardha", lat: 20.7453, lng: 78.6022, region: "Vidarbha", stateId: "maharashtra" },
  { id: "dhule", code: "DHU", name: "Dhule", lat: 20.9042, lng: 74.7749, region: "North Maharashtra", stateId: "maharashtra" },
  // Karnataka
  { id: "belagavi", code: "BGM", name: "Belagavi", lat: 15.8497, lng: 74.4977, region: "Northern Transition Zone", stateId: "karnataka" },
  { id: "mandya", code: "MDY", name: "Mandya", lat: 12.5218, lng: 76.8951, region: "Cauvery Command", stateId: "karnataka" },
  // Telangana
  { id: "warangal", code: "WGL", name: "Warangal", lat: 17.9689, lng: 79.5941, region: "Northern Telangana", stateId: "telangana" },
  // Andhra Pradesh
  { id: "guntur", code: "GNT", name: "Guntur", lat: 16.3067, lng: 80.4365, region: "Krishna Delta", stateId: "andhra-pradesh" },
  { id: "anantapur", code: "ATP", name: "Anantapur", lat: 14.6819, lng: 77.6006, region: "Rayalaseema", stateId: "andhra-pradesh" },
  // Tamil Nadu
  { id: "thanjavur", code: "TNJ", name: "Thanjavur", lat: 10.787, lng: 79.1378, region: "Cauvery Delta", stateId: "tamil-nadu" },
  // Kerala
  { id: "idukki", code: "IDK", name: "Idukki", lat: 9.85, lng: 76.97, region: "High Range", stateId: "kerala" },
  // West Bengal
  { id: "bardhaman", code: "BWN", name: "Purba Bardhaman", lat: 23.2324, lng: 87.8615, region: "Lower Gangetic Plain", stateId: "west-bengal" },
  // Bihar
  { id: "samastipur", code: "SMP", name: "Samastipur", lat: 25.856, lng: 85.7811, region: "North Bihar Plain", stateId: "bihar" },
  // Odisha
  { id: "bargarh", code: "BRG", name: "Bargarh", lat: 21.3338, lng: 83.619, region: "Western Central Table Land", stateId: "odisha" },
  // Assam
  { id: "jorhat", code: "JRT", name: "Jorhat", lat: 26.7509, lng: 94.2037, region: "Upper Brahmaputra Valley", stateId: "assam" },
];

export const CROPS: Crop[] = [
  { id: "tomato", name: "Tomato", emoji: "🍅", season: "Kharif / Rabi", stages: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"] },
  { id: "cotton", name: "Cotton", emoji: "🌿", season: "Kharif", stages: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"] },
  { id: "soybean", name: "Soybean", emoji: "🫘", season: "Kharif", stages: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"] },
  { id: "grapes", name: "Grapes", emoji: "🍇", season: "Perennial", stages: ["Vegetative", "Flowering", "Fruiting", "Maturity"] },
  { id: "onion", name: "Onion", emoji: "🧅", season: "Rabi", stages: ["Seedling", "Vegetative", "Maturity"] },
  { id: "sugarcane", name: "Sugarcane", emoji: "🎋", season: "Annual", stages: ["Seedling", "Vegetative", "Maturity"] },
  { id: "rice", name: "Rice", emoji: "🌾", season: "Kharif", stages: ["Seedling", "Vegetative", "Flowering", "Maturity"] },
  { id: "wheat", name: "Wheat", emoji: "🌾", season: "Rabi", stages: ["Seedling", "Vegetative", "Flowering", "Maturity"] },
  { id: "maize", name: "Maize", emoji: "🌽", season: "Kharif / Rabi", stages: ["Seedling", "Vegetative", "Flowering", "Maturity"] },
  { id: "groundnut", name: "Groundnut", emoji: "🥜", season: "Kharif", stages: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"] },
  { id: "mustard", name: "Mustard", emoji: "🌼", season: "Rabi", stages: ["Seedling", "Vegetative", "Flowering", "Maturity"] },
  { id: "chilli", name: "Chilli", emoji: "🌶️", season: "Kharif / Rabi", stages: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"] },
  { id: "banana", name: "Banana", emoji: "🍌", season: "Perennial", stages: ["Vegetative", "Flowering", "Fruiting", "Maturity"] },
  { id: "potato", name: "Potato", emoji: "🥔", season: "Rabi", stages: ["Seedling", "Vegetative", "Maturity"] },
  { id: "tea", name: "Tea", emoji: "🍃", season: "Perennial", stages: ["Vegetative", "Maturity"] },
];

export const THREATS: Threat[] = [
  {
    id: "early-blight", name: "Early Blight", type: "disease", scientific: "Alternaria solani", crops: ["tomato"],
    symptoms: ["Concentric target-board spots", "Yellow halo around lesions", "Lower leaves affected first", "Leaf drop on older foliage"],
    favours: "Warm 24–30°C, humidity above 80%, leaf wetness after rain", color: "#b45309",
  },
  {
    id: "late-blight", name: "Late Blight", type: "disease", scientific: "Phytophthora infestans", crops: ["tomato", "potato"],
    symptoms: ["Water-soaked irregular lesions", "White fuzzy growth on leaf underside", "Rapid browning of stems", "Fruit rot with firm brown patches"],
    favours: "Cool 15–22°C, humidity above 90%, prolonged leaf wetness", color: "#7c2d12",
  },
  {
    id: "powdery-mildew", name: "Powdery Mildew", type: "disease", scientific: "Erysiphe necator", crops: ["grapes"],
    symptoms: ["White powdery coating on leaves", "Distorted young shoots", "Berries crack and shrivel", "Greyish patches on stems"],
    favours: "Warm 20–28°C days, dry with high night humidity, shaded canopy", color: "#6b7280",
  },
  {
    id: "downy-mildew", name: "Downy Mildew", type: "disease", scientific: "Plasmopara viticola", crops: ["grapes", "onion"],
    symptoms: ["Oily yellow spots on upper leaf", "White downy growth underneath", "Flower clusters turn brown", "Leaf curling and drop"],
    favours: "Rain, humidity above 85%, temperature 18–25°C", color: "#0e7490",
  },
  {
    id: "aphids", name: "Aphids", type: "pest", scientific: "Aphis gossypii", crops: ["cotton", "wheat", "tomato", "mustard"],
    symptoms: ["Colonies under young leaves", "Curled and crinkled leaves", "Sticky honeydew and sooty mould", "Stunted growth"],
    favours: "Warm dry spells, excess nitrogen, low natural enemy activity", color: "#65a30d",
  },
  {
    id: "whitefly", name: "Whitefly", type: "pest", scientific: "Bemisia tabaci", crops: ["cotton", "tomato", "soybean", "chilli"],
    symptoms: ["Tiny white insects fly up when disturbed", "Yellowing and leaf curl", "Honeydew and sooty mould", "Virus transmission (leaf curl / yellow mosaic)"],
    favours: "Hot dry weather 28–35°C, dense canopy, late sowing", color: "#a16207",
  },
  {
    id: "bollworm", name: "Pink Bollworm", type: "pest", scientific: "Pectinophora gossypiella", crops: ["cotton"],
    symptoms: ["Rosette flowers", "Entry holes on bolls", "Pink larvae inside bolls", "Damaged lint and seeds"],
    favours: "Late-season crop, warm nights, previous-year residue", color: "#be185d",
  },
  {
    id: "leaf-spot", name: "Leaf Spot", type: "disease", scientific: "Cercospora / Alternaria porri", crops: ["soybean", "onion", "rice", "banana"],
    symptoms: ["Small purple to brown spots", "Spots merge into blotches", "Tip burn and drying", "Premature defoliation"],
    favours: "Humid warm weather, dense planting, splash from rain", color: "#7e22ce",
  },
  {
    id: "stem-borer", name: "Stem Borer", type: "pest", scientific: "Scirpophaga incertulas / Chilo infuscatellus", crops: ["rice", "sugarcane"],
    symptoms: ["Dead heart in young plants", "White ear heads with empty grains", "Bore holes with frass", "Central shoot dries up"],
    favours: "Continuous cropping, high nitrogen, standing water", color: "#0f766e",
  },
  {
    id: "fall-armyworm", name: "Fall Armyworm", type: "pest", scientific: "Spodoptera frugiperda", crops: ["maize"],
    symptoms: ["Ragged shot holes in whorl leaves", "Moist sawdust-like frass in the whorl", "Papery windowing on young leaves", "Larva with inverted Y on the head"],
    favours: "Warm 26–32°C, staggered sowing, maize at whorl stage after dry spells", color: "#9a3412",
  },
  {
    id: "brown-planthopper", name: "Brown Planthopper", type: "pest", scientific: "Nilaparvata lugens", crops: ["rice"],
    symptoms: ["Circular patches of dried plants (hopperburn)", "Hoppers clustered at the plant base", "Sooty mould on lower stems", "Plants lodge and dry from the centre outward"],
    favours: "Dense closed canopy, standing water, high nitrogen, humidity above 80%", color: "#78350f",
  },
  {
    id: "yellow-rust", name: "Yellow Rust", type: "disease", scientific: "Puccinia striiformis", crops: ["wheat"],
    symptoms: ["Yellow-orange pustules in stripes along the veins", "Powder rubs off onto the hand", "Lower leaves affected first", "Shrivelled grain in severe patches"],
    favours: "Cool 10–18°C with dew or light rain, cloudy mornings, susceptible varieties", color: "#ca8a04",
  },
  {
    id: "tikka-leaf-spot", name: "Tikka Leaf Spot", type: "disease", scientific: "Cercospora personata", crops: ["groundnut"],
    symptoms: ["Dark brown circular spots with a yellow halo", "Spots on both leaf surfaces", "Heavy defoliation from the base upward", "Pod filling cut short"],
    favours: "Humidity above 85%, temperature 24–28°C, rain splash in a closed canopy", color: "#4d7c0f",
  },
];

export const districtById = (id: string) => DISTRICTS.find((d) => d.id === id)!;
export const cropById = (id: string) => CROPS.find((c) => c.id === id)!;
export const threatById = (id: string) => THREATS.find((t) => t.id === id)!;
export const stateById = (id: string) => STATES.find((s) => s.id === id)!;
export const districtsByState = (stateId: string) => DISTRICTS.filter((d) => d.stateId === stateId);

/** `<state code>-<district code>`, the prefix every case id in a district carries. */
export const caseIdPrefix = (districtId: string) => {
  const d = districtById(districtId);
  return `${stateById(d.stateId).code}-${d.code}`;
};
