import type { Category, Team, Location, Project, PointOfInterest, Achievement, VisitorStats } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// DEMO / SAMPLE DATA
// These are fictional records for local development and the KHOJ demo.
// Nothing here represents a real KHOJ 2026 team. Replace via the admin
// dashboard (Tier 3) or by seeding /supabase/schema.sql directly.
// ─────────────────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  { id: "physics", name: "Physics", icon: "atom", color: "indigo" },
  { id: "chemistry", name: "Chemistry", icon: "flask-conical", color: "teal" },
  { id: "biology", name: "Biology", icon: "leaf", color: "teal" },
  { id: "cs", name: "Computer Science", icon: "code", color: "indigo" },
  { id: "ai", name: "AI", icon: "brain-circuit", color: "gold" },
  { id: "robotics", name: "Robotics", icon: "bot", color: "coral" },
  { id: "environment", name: "Environment", icon: "sprout", color: "teal" },
  { id: "engineering", name: "Engineering", icon: "cog", color: "indigo" },
  { id: "other", name: "Other", icon: "sparkles", color: "gold" },
];

function loc(id: string, building: string, floor: number, room: string, x: number, y: number): Location {
  return { id, building, floor, room, node: { id: `${id}-node`, floor, x, y, label: room } };
}

export const LOCATIONS: Location[] = [
  loc("loc-a-lab1", "Block A", 0, "Lab 1", 18, 28),
  loc("loc-a-lab2", "Block A", 0, "Lab 2", 30, 28),
  loc("loc-a-lab3", "Block A", 0, "Lab 3", 42, 28),
  loc("loc-a-hall", "Block A", 0, "Main Hall", 30, 55),
  loc("loc-b-lab1", "Block B", 1, "Lab 4", 65, 22),
  loc("loc-b-lab2", "Block B", 1, "Lab 5", 78, 22),
  loc("loc-b-lab3", "Block B", 1, "Lab 6", 65, 40),
  loc("loc-b-studio", "Block B", 1, "Robotics Studio", 78, 40),
  loc("loc-c-atrium", "Block C", 0, "Atrium", 50, 68),
  loc("loc-c-room1", "Block C", 0, "Room C1", 60, 80),
  loc("loc-c-room2", "Block C", 0, "Room C2", 72, 80),
  loc("loc-c-terrace", "Block C", 1, "Green Terrace", 50, 20),
  loc("loc-gym", "Sports Block", 0, "Gymnasium", 15, 78),
  loc("loc-library", "Block A", 1, "Library Wing", 20, 55),
];

function team(id: string, name: string, members: string[]): Team {
  return { id, name, logoUrl: `/logos/${id}.svg`, members };
}

export const TEAMS: Team[] = [
  team("aquatech", "AquaTech", ["Meera S.", "Devan R.", "Priya K."]),
  team("robonova", "RoboNova", ["Arjun T.", "Sana W."]),
  team("greengrid", "GreenGrid", ["Farah I.", "Leo M.", "Owen P."]),
  team("neurolink", "NeuroLink", ["Kabir V.", "Amara D."]),
  team("solarx", "SolarX", ["Yusuf H.", "Nina B."]),
  team("biosphere", "BioSphere", ["Zara Q.", "Milan C."]),
  team("quantumlab", "QuantumLab", ["Advait N.", "Ishaan G."]),
  team("echomind", "EchoMind", ["Tara F.", "Rhea J."]),
  team("volthive", "VoltHive", ["Kian O.", "Dev A."]),
  team("mycora", "Mycora", ["Sana L.", "Ira P."]),
  team("skyloom", "SkyLoom", ["Nikhil B.", "Vera T."]),
  team("pulsecraft", "PulseCraft", ["Aditi R.", "Rohan S."]),
  team("terraform", "TerraForm", ["Wei C.", "Ana G."]),
  team("photonix", "Photonix", ["Kavya M.", "Elan D."]),
  team("hydronova", "HydroNova", ["Sam K.", "Priyanka V."]),
  team("codeforge", "CodeForge", ["Aryan P.", "Maya L."]),
  team("biobyte", "BioByte", ["Nora H.", "Vikram S."]),
  team("windrunner", "WindRunner", ["Iris T.", "Omar F."]),
  team("cryolab", "CryoLab", ["Suri N.", "Aiden M."]),
  team("polymera", "Polymera", ["Diya R.", "Theo K."]),
  team("gravitas", "Gravitas", ["Nila S.", "Marcus O."]),
  team("beamwork", "BeamWorks", ["Farhan Q.", "Ellie C."]),
  team("sprout-lab", "SproutLab", ["Anaya B.", "Jude R."]),
  team("circuitry", "Circuitry", ["Reva T.", "Adam L."]),
];

type Seed = {
  team: string;
  name: string;
  tagline: string;
  category: string;
  location: string;
  about: string;
  problem: string;
  solution: string;
  impact: string;
  featured?: boolean;
};

const SEEDS: Seed[] = [
  { team: "aquatech", name: "AquaTech", tagline: "Smart Water Monitoring System", category: "environment", location: "loc-a-lab3", about: "A low-cost sensor network that tracks water quality across campus in real time.", problem: "Contaminated water sources often go unnoticed until it's too late.", solution: "Floating sensor pods stream pH, turbidity, and contaminant data to a live dashboard.", impact: "Enables early warnings for unsafe water, protecting hundreds of daily users.", featured: true },
  { team: "robonova", name: "RoboNova", tagline: "Autonomous Campus Delivery Bot", category: "robotics", location: "loc-b-studio", about: "A four-wheeled robot that navigates hallways to deliver small packages.", problem: "Manual delivery of lab materials between blocks wastes staff time.", solution: "LIDAR-guided navigation with obstacle avoidance and a scheduling app.", impact: "Frees up staff time and demonstrates real-world autonomous navigation.", featured: true },
  { team: "greengrid", name: "GreenGrid", tagline: "Community Microgrid Simulator", category: "engineering", location: "loc-c-terrace", about: "A simulation platform for designing resilient neighborhood solar microgrids.", problem: "Neighborhoods lack tools to plan for outages and renewable integration.", solution: "An interactive simulator models load, storage, and solar generation together.", impact: "Helps communities plan affordable, resilient local power grids." },
  { team: "neurolink", name: "NeuroLink", tagline: "EEG-Based Focus Tracker", category: "ai", location: "loc-b-lab1", about: "A wearable EEG headband paired with a model that scores sustained attention.", problem: "Students struggle to notice when their focus drifts during study sessions.", solution: "A lightweight classifier flags attention dips and suggests short breaks.", impact: "Early trials show a measurable improvement in study session quality.", featured: true },
  { team: "solarx", name: "SolarX", tagline: "High-Efficiency Solar Tracker", category: "engineering", location: "loc-c-terrace", about: "A dual-axis solar panel mount that follows the sun throughout the day.", problem: "Fixed solar panels lose significant output outside of peak sun hours.", solution: "A motorized mount uses light sensors to track the sun in real time.", impact: "Measured a 31% increase in daily energy yield over a fixed panel." },
  { team: "biosphere", name: "BioSphere", tagline: "Closed-Loop Terrarium Ecosystem", category: "biology", location: "loc-c-room1", about: "A fully sealed terrarium that has sustained itself for over a year.", problem: "Understanding closed ecological loops is hard without a working model.", solution: "A balanced mix of plants, soil microbes, and springtails recycle nutrients.", impact: "A living demonstration of ecological balance and the carbon cycle." },
  { team: "quantumlab", name: "QuantumLab", tagline: "Visualizing Quantum Superposition", category: "physics", location: "loc-a-lab1", about: "An interactive optical bench demonstrating single-photon interference.", problem: "Quantum concepts are difficult to grasp without hands-on demonstration.", solution: "A tabletop double-slit setup lets visitors observe interference patterns live.", impact: "Makes an abstract topic tangible for visitors of all ages.", featured: true },
  { team: "echomind", name: "EchoMind", tagline: "Sign Language to Speech Translator", category: "ai", location: "loc-b-lab2", about: "A computer-vision model that translates sign language gestures into spoken audio.", problem: "Communication gaps persist between hearing and non-hearing individuals.", solution: "A trained gesture-recognition model converts signs to synthesized speech in real time.", impact: "A step toward more accessible everyday communication." },
  { team: "volthive", name: "VoltHive", tagline: "Piezoelectric Footstep Harvester", category: "physics", location: "loc-a-hall", about: "Floor tiles that convert footstep pressure into usable electricity.", problem: "High-footfall areas waste enormous amounts of kinetic energy.", solution: "Piezoelectric tiles capture pressure and store harvested charge in a battery bank.", impact: "Could power low-draw lighting in busy corridors." },
  { team: "mycora", name: "Mycora", tagline: "Mycelium-Based Packaging", category: "chemistry", location: "loc-a-lab2", about: "Biodegradable packaging grown from mushroom mycelium and agricultural waste.", problem: "Styrofoam packaging is cheap but environmentally devastating.", solution: "Mycelium is grown into moulded shapes that fully compost in weeks.", impact: "A viable, compostable alternative to single-use foam packaging." },
  { team: "skyloom", name: "SkyLoom", tagline: "Weather-Predicting Kite Array", category: "environment", location: "loc-c-terrace", about: "A tethered sensor kite array that gathers upper-atmosphere weather data.", problem: "Hyperlocal weather forecasting is expensive and data-poor.", solution: "Lightweight kites carry sensors that feed a local prediction model.", impact: "Cheaper hyperlocal forecasts for agricultural and event planning." },
  { team: "pulsecraft", name: "PulseCraft", tagline: "Wearable Heart-Health Monitor", category: "biology", location: "loc-b-lab3", about: "An affordable wrist device that screens for irregular heart rhythms.", problem: "Early arrhythmia detection tools are often expensive or inaccessible.", solution: "A low-cost optical sensor and on-device model flag irregular patterns.", impact: "Potential for low-cost, early cardiac screening in underserved areas." },
  { team: "terraform", name: "TerraForm", tagline: "Soil Health Mapping Rover", category: "environment", location: "loc-c-room2", about: "A small rover that maps soil nutrients across a field autonomously.", problem: "Farmers often over- or under-fertilize due to a lack of soil data.", solution: "The rover drives a grid pattern, sampling and mapping nutrient levels.", impact: "Enables precision fertilization, reducing cost and runoff." },
  { team: "photonix", name: "Photonix", tagline: "DIY Spectrometer from a Webcam", category: "physics", location: "loc-a-lab1", about: "A spectrometer built from a webcam, a diffraction grating, and open software.", problem: "Real spectrometers are too costly for most school science labs.", solution: "A 3D-printed housing and open-source software turn a webcam into a working spectrometer.", impact: "Brings quantitative spectroscopy to classrooms for under $20." },
  { team: "hydronova", name: "HydroNova", tagline: "Atmospheric Water Generator", category: "engineering", location: "loc-a-lab3", about: "A compact device that condenses drinking water directly from humid air.", problem: "Many regions have humid air but unreliable access to clean water.", solution: "A Peltier-cooled condenser collects and filters atmospheric moisture.", impact: "A small-scale proof of concept for off-grid water generation." },
  { team: "codeforge", name: "CodeForge", tagline: "Peer-to-Peer Study Matcher", category: "cs", location: "loc-library", about: "A matching algorithm that pairs students for study sessions by subject and schedule.", problem: "Students struggle to find compatible study partners efficiently.", solution: "A constraint-based matching engine balances subject overlap and free time.", impact: "Higher-quality study pairings with less manual coordination." },
  { team: "biobyte", name: "BioByte", tagline: "Genomic Pattern Visualizer", category: "cs", location: "loc-b-lab2", about: "A tool that turns raw DNA sequence data into explorable visual patterns.", problem: "Raw genomic data is unintuitive for students learning genetics.", solution: "An interactive visualizer highlights motifs, mutations, and repeats.", impact: "Makes genomics education far more approachable." },
  { team: "windrunner", name: "WindRunner", tagline: "Micro Wind Turbine Array", category: "engineering", location: "loc-c-terrace", about: "A cluster of small vertical-axis wind turbines optimized for turbulent campus airflow.", problem: "Traditional turbines underperform in the gusty airflow between buildings.", solution: "Vertical-axis blades are tuned for low-speed, turbulent wind conditions.", impact: "A practical renewable option for urban and campus settings." },
  { team: "cryolab", name: "CryoLab", tagline: "Cold-Chain Vaccine Tracker", category: "engineering", location: "loc-b-lab1", about: "A sensor tag that logs temperature exposure for vaccine shipments.", problem: "Vaccines can silently lose potency when the cold chain is broken.", solution: "A tamper-evident logger records temperature spikes across the entire journey.", impact: "Helps catch spoiled shipments before they reach patients." },
  { team: "polymera", name: "Polymera", tagline: "Self-Healing Polymer Coating", category: "chemistry", location: "loc-a-lab2", about: "A polymer coating that automatically seals small scratches when warmed.", problem: "Everyday wear damages surfaces long before they're due for replacement.", solution: "Embedded microcapsules release a sealant when a scratch breaks the surface.", impact: "Could extend the lifespan of everyday plastic products." },
  { team: "gravitas", name: "Gravitas", tagline: "Tabletop Gravity Well Simulator", category: "physics", location: "loc-a-lab1", about: "A stretched fabric and marble rig that visualizes gravitational curvature.", problem: "General relativity's core idea is rarely shown, only described.", solution: "Weighted objects on a tensioned surface visually mimic gravitational wells.", impact: "A hands-on, intuitive entry point into general relativity." },
  { team: "beamwork", name: "BeamWorks", tagline: "Laser-Cut Bridge Load Tester", category: "engineering", location: "loc-c-room1", about: "A rig that laser-cuts and load-tests miniature bridge designs.", problem: "Structural design principles are hard to grasp without physical testing.", solution: "Students design a bridge, laser-cut it, and load-test it to failure live.", impact: "Turns structural engineering into a fast, tactile feedback loop." },
  { team: "sprout-lab", name: "SproutLab", tagline: "AI Plant Disease Scanner", category: "ai", location: "loc-c-terrace", about: "A phone camera app that identifies plant diseases from leaf photos.", problem: "Smallholder farmers often lack access to agronomists for diagnosis.", solution: "An on-device vision model classifies common leaf diseases instantly.", impact: "Faster, cheaper diagnosis for small-scale growers." },
  { team: "circuitry", name: "Circuitry", tagline: "Modular Robotics Learning Kit", category: "robotics", location: "loc-b-studio", about: "A snap-together robotics kit designed to teach control systems to beginners.", problem: "Entry-level robotics kits are often too simple or too expensive.", solution: "Magnetic modular blocks let students build and reprogram robots quickly.", impact: "Lowers the barrier to hands-on robotics education." },
];

export const PROJECTS: Project[] = SEEDS.map((s, i) => ({
  id: `proj-${i + 1}`,
  projectNumber: i + 1,
  name: s.name,
  slug: `${s.team}-${i + 1}`,
  tagline: s.tagline,
  team: TEAMS.find((t) => t.id === s.team)!,
  categoryId: s.category,
  locationId: s.location,
  about: s.about,
  problem: s.problem,
  solution: s.solution,
  impact: s.impact,
  featured: !!s.featured,
  active: true,
}));

export const POINTS_OF_INTEREST: PointOfInterest[] = [
  { id: "poi-entrance-main", kind: "entrance", label: "Main Entrance", locationId: "loc-a-hall" },
  { id: "poi-food-1", kind: "food", label: "Refreshments — Atrium", locationId: "loc-c-atrium" },
  { id: "poi-restroom-a", kind: "restroom", label: "Restrooms — Block A", locationId: "loc-a-hall" },
  { id: "poi-restroom-b", kind: "restroom", label: "Restrooms — Block B", locationId: "loc-b-lab3" },
  { id: "poi-help", kind: "help", label: "KHOJ Help Desk", locationId: "loc-c-atrium" },
  { id: "poi-first-aid", kind: "first-aid", label: "First Aid Station", locationId: "loc-gym" },
  { id: "poi-stairs-a", kind: "stairs", label: "Stairs — Block A", locationId: "loc-a-lab2" },
  { id: "poi-lift-b", kind: "lift", label: "Lift — Block B", locationId: "loc-b-lab1" },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-discovery", name: "First Discovery", description: "Scan your first project.", icon: "sparkle", check: (s) => s.projectsExplored >= 1 },
  { id: "science-explorer", name: "Science Explorer", description: "Discover 10 projects.", icon: "compass", check: (s) => s.projectsExplored >= 10 },
  { id: "deep-explorer", name: "Deep Explorer", description: "Discover 25 projects.", icon: "map", check: (s) => s.projectsExplored >= 25 },
  { id: "khoj-master", name: "Khoj Master", description: "Discover every project.", icon: "trophy", check: (s) => s.totalProjects > 0 && s.projectsExplored >= s.totalProjects },
  { id: "curious-mind", name: "Curious Mind", description: "Visit 5 different categories.", icon: "lightbulb", check: (s) => s.categoriesVisited >= 5 },
  { id: "peoples-scientist", name: "People's Scientist", description: "Rate 10 projects.", icon: "star", check: (s) => s.projectsRated >= 10 },
];

export function computeStats(
  badges: { projectId: string }[],
  ratings: { projectId: string }[],
  totalProjects: number
): VisitorStats {
  const exploredIds = new Set(badges.map((b) => b.projectId));
  const categories = new Set(
    Array.from(exploredIds)
      .map((id) => PROJECTS.find((p) => p.id === id)?.categoryId)
      .filter(Boolean)
  );
  return {
    projectsExplored: exploredIds.size,
    projectsRated: new Set(ratings.map((r) => r.projectId)).size,
    categoriesVisited: categories.size,
    totalProjects,
  };
}
