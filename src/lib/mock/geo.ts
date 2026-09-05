import type { Crop, District, Threat } from "../types";

export const DISTRICTS: District[] = [
  { id: "nashik", code: "NSK", name: "Nashik", lat: 19.9975, lng: 73.7898, region: "North Maharashtra" },
  { id: "pune", code: "PUN", name: "Pune", lat: 18.5204, lng: 73.8567, region: "Western Maharashtra" },
  { id: "nagpur", code: "NAG", name: "Nagpur", lat: 21.1458, lng: 79.0882, region: "Vidarbha" },
  { id: "ahmednagar", code: "AHM", name: "Ahmednagar", lat: 19.0948, lng: 74.748, region: "Western Maharashtra" },
  { id: "kolhapur", code: "KOL", name: "Kolhapur", lat: 16.705, lng: 74.2433, region: "Western Maharashtra" },
  { id: "satara", code: "SAT", name: "Satara", lat: 17.6805, lng: 74.0183, region: "Western Maharashtra" },
  { id: "sangli", code: "SAN", name: "Sangli", lat: 16.8524, lng: 74.5815, region: "Western Maharashtra" },
  { id: "jalgaon", code: "JAL", name: "Jalgaon", lat: 21.0077, lng: 75.5626, region: "North Maharashtra" },
  { id: "solapur", code: "SOL", name: "Solapur", lat: 17.6599, lng: 75.9064, region: "Western Maharashtra" },
  { id: "sambhajinagar", code: "CSN", name: "Chhatrapati Sambhajinagar", lat: 19.8762, lng: 75.3433, region: "Marathwada" },
  { id: "amravati", code: "AMR", name: "Amravati", lat: 20.932, lng: 77.7523, region: "Vidarbha" },
  { id: "yavatmal", code: "YAV", name: "Yavatmal", lat: 20.3888, lng: 78.1204, region: "Vidarbha" },
  { id: "latur", code: "LAT", name: "Latur", lat: 18.4088, lng: 76.5604, region: "Marathwada" },
  { id: "wardha", code: "WAR", name: "Wardha", lat: 20.7453, lng: 78.6022, region: "Vidarbha" },
  { id: "dhule", code: "DHU", name: "Dhule", lat: 20.9042, lng: 74.7749, region: "North Maharashtra" },
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
];

export const THREATS: Threat[] = [
  {
    id: "early-blight", name: "Early Blight", type: "disease", scientific: "Alternaria solani", crops: ["tomato"],
    symptoms: ["Concentric target-board spots", "Yellow halo around lesions", "Lower leaves affected first", "Leaf drop on older foliage"],
    favours: "Warm 24–30°C, humidity above 80%, leaf wetness after rain", color: "#b45309",
  },
  {
    id: "late-blight", name: "Late Blight", type: "disease", scientific: "Phytophthora infestans", crops: ["tomato"],
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
    id: "aphids", name: "Aphids", type: "pest", scientific: "Aphis gossypii", crops: ["cotton", "wheat", "tomato"],
    symptoms: ["Colonies under young leaves", "Curled and crinkled leaves", "Sticky honeydew and sooty mould", "Stunted growth"],
    favours: "Warm dry spells, excess nitrogen, low natural enemy activity", color: "#65a30d",
  },
  {
    id: "whitefly", name: "Whitefly", type: "pest", scientific: "Bemisia tabaci", crops: ["cotton", "tomato", "soybean"],
    symptoms: ["Tiny white insects fly up when disturbed", "Yellowing and leaf curl", "Honeydew and sooty mould", "Virus transmission (leaf curl / yellow mosaic)"],
    favours: "Hot dry weather 28–35°C, dense canopy, late sowing", color: "#a16207",
  },
  {
    id: "bollworm", name: "Pink Bollworm", type: "pest", scientific: "Pectinophora gossypiella", crops: ["cotton"],
    symptoms: ["Rosette flowers", "Entry holes on bolls", "Pink larvae inside bolls", "Damaged lint and seeds"],
    favours: "Late-season crop, warm nights, previous-year residue", color: "#be185d",
  },
  {
    id: "leaf-spot", name: "Leaf Spot", type: "disease", scientific: "Cercospora / Alternaria porri", crops: ["soybean", "onion", "rice"],
    symptoms: ["Small purple to brown spots", "Spots merge into blotches", "Tip burn and drying", "Premature defoliation"],
    favours: "Humid warm weather, dense planting, splash from rain", color: "#7e22ce",
  },
  {
    id: "stem-borer", name: "Stem Borer", type: "pest", scientific: "Scirpophaga incertulas / Chilo infuscatellus", crops: ["rice", "sugarcane"],
    symptoms: ["Dead heart in young plants", "White ear heads with empty grains", "Bore holes with frass", "Central shoot dries up"],
    favours: "Continuous cropping, high nitrogen, standing water", color: "#0f766e",
  },
];

export const districtById = (id: string) => DISTRICTS.find((d) => d.id === id)!;
export const cropById = (id: string) => CROPS.find((c) => c.id === id)!;
export const threatById = (id: string) => THREATS.find((t) => t.id === id)!;
