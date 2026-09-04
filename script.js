// ============================================================================
// DRISHTI-NER | AI-Enabled Landslide Monitoring & Lifeline Early Warning
// Leaflet.js Geotechnical Hazard Mapping Engine
// ============================================================================

// Initialize Lucide Icons
lucide.createIcons();

// ----------------------------------------------------------------------------
// 1. Theme Management (Dark / Light)
// ----------------------------------------------------------------------------
const savedTheme = localStorage.getItem('drishti-theme') || 'dark';
document.body.classList.toggle('light-mode', savedTheme === 'light');

function updateThemeToggle() {
    const lightMode = document.body.classList.contains('light-mode');
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', lightMode ? 'Switch to dark mode' : 'Switch to light mode');
        toggleBtn.title = lightMode ? 'Switch to dark mode' : 'Switch to light mode';
        const label = toggleBtn.querySelector('.theme-label');
        if (label) label.textContent = lightMode ? 'Dark' : 'Light';
    }
}
updateThemeToggle();

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const lightMode = !document.body.classList.contains('light-mode');
        document.body.classList.toggle('light-mode', lightMode);
        localStorage.setItem('drishti-theme', lightMode ? 'light' : 'dark');
        updateThemeToggle();
    });
}

// ----------------------------------------------------------------------------
// 2. Multilingual Translations
// ----------------------------------------------------------------------------
const translations = {
    en: { subtitle: 'AI-Enabled Landslide Early Warning & Lifeline Monitoring Platform', pitch: 'Pitch & Architecture', simulator: 'Interactive Rainfall Hazard Simulator', roadLifelines: 'Road Lifelines' },
    bn: { subtitle: 'AI-চালিত ভূমিধস আগাম সতর্কতা ও জীবনরেখা পর্যবেক্ষণ প্ল্যাটফর্ম', pitch: 'উপস্থাপনা ও আর্কিটেকচার', simulator: 'ইন্টার‍্যাক্টিভ বৃষ্টিপাত ঝুঁকি সিমুলেটর', roadLifelines: 'সড়ক জীবনরেখা' },
    hi: { subtitle: 'AI-सक्षम भूस्खलन पूर्व चेतावनी और जीवनरेखा निगरानी प्लेटफॉर्म', pitch: 'प्रस्तुति और आर्किटेक्चर', simulator: 'इंटरैक्टिव वर्षा जोखिम सिम्युलेटर', roadLifelines: 'सड़क जीवनरेखा' },
    as: { subtitle: 'AI-ভিত্তিক ভূমিস্খলন আগতীয়া সতৰ্কবাণী আৰু জীৱনৰে’খা নিৰীক্ষণ প্লেটফৰ্ম', pitch: 'উপস্থাপনা আৰু আৰ্হি', simulator: 'ইণ্টাৰেক্টিভ বৰষুণৰ বিপদ ছিমুলেটৰ', roadLifelines: 'পথ জীৱনৰে’খা' },
    ne: { subtitle: 'AI-सक्षम पहिरो पूर्व चेतावनी तथा जीवनरेखा निगरानी प्लेटफर्म', pitch: 'प्रस्तुति तथा आर्किटेक्चर', simulator: 'अन्तरक्रियात्मक वर्षा जोखिम सिमुलेटर', roadLifelines: 'सडक जीवनरेखा' }
};

const langSelector = document.getElementById('languageSelector');
if (langSelector) {
    langSelector.addEventListener('change', event => {
        const selected = translations[event.target.value] || translations.en;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (selected[key]) element.textContent = selected[key];
        });
    });
}

// ----------------------------------------------------------------------------
// 3. Geocoded NER Landslide Monitoring Places Dataset (Red, Yellow, Green)
// ----------------------------------------------------------------------------
const landslidePlaces = [
    // --- 🔴 RED: CRITICAL / SEVERE RISK (> 70) ---
    {
        id: 'gangtok',
        name: 'Gangtok & 29th Mile',
        state: 'Sikkim',
        pos: [27.3389, 88.6065],
        category: 'CRITICAL',
        color: '#ef4444',
        score: 88,
        rain: 112,
        slope: 36,
        soil: 85,
        probability: 84,
        window: '6–12 hours',
        highway: 'NH-10 Siliguri-Gangtok',
        geology: 'Weathered Gneiss & Phyllite',
        desc: 'Active deep-seated rotational failure on NH-10. Slope creep rate accelerating at 4.8mm/day.'
    },
    {
        id: 'mangan',
        name: 'Mangan & Chungthang',
        state: 'North Sikkim',
        pos: [27.5050, 88.5300],
        category: 'CRITICAL',
        color: '#ef4444',
        score: 93,
        rain: 135,
        slope: 41,
        soil: 91,
        probability: 92,
        window: 'Immediate / <6h',
        highway: 'North Sikkim Highway',
        geology: 'High-grade Crystalline Schist',
        desc: 'Debris flows and torrential runoff following glacial surge. Carriageway severed at multiple bends.'
    },
    {
        id: 'darjeeling',
        name: 'Darjeeling (Pagla Jhora)',
        state: 'West Bengal',
        pos: [27.0410, 88.2663],
        category: 'CRITICAL',
        color: '#ef4444',
        score: 84,
        rain: 98,
        slope: 35,
        soil: 82,
        probability: 79,
        window: '12–24 hours',
        highway: 'Hill Cart Road / NH-110',
        geology: 'Darjeeling Gneiss & Mica Schist',
        desc: 'Historical sinking zone at Pagla Jhora. Severe toe cutting from mountain torrents.'
    },
    {
        id: 'kalimpong',
        name: 'Kalimpong (Teesta Gorge)',
        state: 'West Bengal',
        pos: [27.0600, 88.4700],
        category: 'CRITICAL',
        color: '#ef4444',
        score: 79,
        rain: 92,
        slope: 33,
        soil: 78,
        probability: 74,
        window: '12–24 hours',
        highway: 'NH-10 Teesta Corridor',
        geology: 'Daling Series Slates & Phyllites',
        desc: 'Under-cutting by swollen Teesta River. Carriageway subsidence along gorge section.'
    },
    {
        id: 'noney',
        name: 'Noney & Tupul Rail Yard',
        state: 'Manipur',
        pos: [24.7800, 93.6200],
        category: 'CRITICAL',
        color: '#ef4444',
        score: 89,
        rain: 105,
        slope: 38,
        soil: 86,
        probability: 86,
        window: '6–12 hours',
        highway: 'Jiribam-Imphal Corridor / NH-37',
        geology: 'Disang Shales & Siltstones',
        desc: 'Clay-rich slippery shale beddings prone to rapid translational shearing during downpours.'
    },
    {
        id: 'haflong',
        name: 'Dima Hasao (Haflong–Jatinga)',
        state: 'Assam',
        pos: [25.1800, 93.0200],
        category: 'CRITICAL',
        color: '#ef4444',
        score: 81,
        rain: 94,
        slope: 32,
        soil: 84,
        probability: 76,
        window: '12–24 hours',
        highway: 'Lumding–Badarpur Hill Route',
        geology: 'Barail Sandstone-Shale Interbeds',
        desc: 'Rapid soil creep and hill section railway embankment sliding across Jatinga valley.'
    },
    {
        id: 'cherrapunji',
        name: 'Cherrapunji / Sohra Rim',
        state: 'Meghalaya',
        pos: [25.2700, 91.7300],
        category: 'CRITICAL',
        color: '#ef4444',
        score: 86,
        rain: 140,
        slope: 37,
        soil: 88,
        probability: 82,
        window: '6–12 hours',
        highway: 'Shillong–Sohra Highway',
        geology: 'Shella Sandstone on Limestone',
        desc: 'Extreme torrential runoff causing massive hydrostatic pressure along valley scarp walls.'
    },
    {
        id: 'phek',
        name: 'Phek (Jessami Highway)',
        state: 'Nagaland',
        pos: [25.6800, 94.5000],
        category: 'CRITICAL',
        color: '#ef4444',
        score: 76,
        rain: 82,
        slope: 30,
        soil: 75,
        probability: 71,
        window: '24 hours',
        highway: 'Trans-Nagaland Highway',
        geology: 'Ophiolite Melange & Foliated Shales',
        desc: 'Indo-Myanmar tectonic boundary shearing zone with major carriageway cracks.'
    },
    {
        id: 'tawang',
        name: 'Tawang (Sela Pass Approach)',
        state: 'Arunachal Pradesh',
        pos: [27.5860, 91.8600],
        category: 'CRITICAL',
        color: '#ef4444',
        score: 77,
        rain: 80,
        slope: 34,
        soil: 74,
        probability: 72,
        window: '12–24 hours',
        highway: 'BCT High Altitude Road',
        geology: 'Glacial Moraines & Granite Gneiss',
        desc: 'Moraine slope destabilization caused by freeze-thaw cycles combined with high rainfall.'
    },

    // --- 🟡 YELLOW: MODERATE / ADVISORY WATCH (35–70) ---
    {
        id: 'kohima',
        name: 'Kohima (Dzüdza Section)',
        state: 'Nagaland',
        pos: [25.6751, 94.1086],
        category: 'WATCH',
        color: '#eab308',
        score: 58,
        rain: 62,
        slope: 27,
        soil: 64,
        probability: 52,
        window: '24–48 hours',
        highway: 'NH-29 Dimapur-Kohima Corridor',
        geology: 'Tertiary Splintery Shales',
        desc: 'Single-lane restriction active. Continuous geotechnical surveillance on Dzüdza river cut.'
    },
    {
        id: 'aizawl',
        name: 'Aizawl (Ramhlun / Hunthar)',
        state: 'Mizoram',
        pos: [23.7271, 92.7176],
        category: 'WATCH',
        color: '#eab308',
        score: 52,
        rain: 58,
        slope: 26,
        soil: 61,
        probability: 46,
        window: '24–48 hours',
        highway: 'NH-54 / NH-108 Corridor',
        geology: 'Surma Group Siltstones',
        desc: 'Urban slope creep on eastern and western flanks with municipal drainage surcharge.'
    },
    {
        id: 'kurseong',
        name: 'Kurseong (Tindharia)',
        state: 'West Bengal',
        pos: [26.8800, 88.2800],
        category: 'WATCH',
        color: '#eab308',
        score: 62,
        rain: 68,
        slope: 29,
        soil: 67,
        probability: 58,
        window: '24 hours',
        highway: 'NH-110 Tindharia Section',
        geology: 'Damuda Sandstone & Slates',
        desc: 'DHR railway slope subsidence with recurring shoulder washouts after moderate rain.'
    },
    {
        id: 'namchi',
        name: 'Namchi & Ravangla',
        state: 'Sikkim',
        pos: [27.1700, 88.3500],
        category: 'WATCH',
        color: '#eab308',
        score: 55,
        rain: 60,
        slope: 25,
        soil: 62,
        probability: 49,
        window: '36 hours',
        highway: 'Jorethang–Namchi Highway',
        geology: 'Gondwana Sandstones',
        desc: 'Terraced agricultural hillslopes monitored for pore water pressure saturation.'
    },
    {
        id: 'itanagar',
        name: 'Itanagar & Naharlagun',
        state: 'Arunachal Pradesh',
        pos: [27.0844, 93.6053],
        category: 'WATCH',
        color: '#eab308',
        score: 61,
        rain: 74,
        slope: 28,
        soil: 69,
        probability: 57,
        window: '24 hours',
        highway: 'NH-415 Corridor',
        geology: 'Siwalik Sandstones & Conglomerate',
        desc: 'Hill cutting excavations showing localized slumping along NH-415.'
    },
    {
        id: 'pasighat',
        name: 'Pasighat (Siang Gorge)',
        state: 'Arunachal Pradesh',
        pos: [28.0600, 95.3300],
        category: 'WATCH',
        color: '#eab308',
        score: 56,
        rain: 65,
        slope: 26,
        soil: 63,
        probability: 48,
        window: '36 hours',
        highway: 'NH-513 Corridor',
        geology: 'Abor Volcanics & River Gravels',
        desc: 'Riverine toe erosion on foothill bends. Lateral bank cutting actively monitored.'
    },
    {
        id: 'guwahati_hills',
        name: 'Guwahati (Narakasur Hills)',
        state: 'Assam',
        pos: [26.1445, 91.7362],
        category: 'WATCH',
        color: '#eab308',
        score: 48,
        rain: 52,
        slope: 22,
        soil: 56,
        probability: 39,
        window: '48 hours',
        highway: 'Guwahati Urban Ring',
        geology: 'Precambrian Granitic Gneiss',
        desc: 'Unregulated hill cutting and loose red soil runoff during monsoon rain spells.'
    },
    {
        id: 'tura',
        name: 'Tura (Garo Hills)',
        state: 'Meghalaya',
        pos: [25.5100, 90.2200],
        category: 'WATCH',
        color: '#eab308',
        score: 53,
        rain: 59,
        slope: 24,
        soil: 60,
        probability: 45,
        window: '36 hours',
        highway: 'NH-217 Tura–Dalu Highway',
        geology: 'Granite-Gneiss with Laterite Caps',
        desc: 'Lateritic topsoil saturation leading to road culvert blockages and bank slides.'
    },
    {
        id: 'senapati',
        name: 'Senapati (Tahamzam)',
        state: 'Manipur',
        pos: [25.2600, 94.0200],
        category: 'WATCH',
        color: '#eab308',
        score: 64,
        rain: 70,
        slope: 28,
        soil: 66,
        probability: 60,
        window: '24 hours',
        highway: 'NH-02 Imphal-Dimapur Road',
        geology: 'Disang Shales with Sandstone Layers',
        desc: 'Vulnerable highway cuttings subject to rockfalls and debris mudslides.'
    },
    {
        id: 'champhai',
        name: 'Champhai Border Ridge',
        state: 'Mizoram',
        pos: [23.4700, 93.3300],
        category: 'WATCH',
        color: '#eab308',
        score: 45,
        rain: 48,
        slope: 21,
        soil: 54,
        probability: 36,
        window: '48 hours',
        highway: 'NH-06 Champhai Highway',
        geology: 'Bhuban Sandstone Ridges',
        desc: 'Moderate slope movement monitored along international trade highway corridor.'
    },
    {
        id: 'jampui',
        name: 'Jampui Hills Ridge',
        state: 'Tripura',
        pos: [23.9500, 92.2700],
        category: 'WATCH',
        color: '#eab308',
        score: 42,
        rain: 46,
        slope: 20,
        soil: 52,
        probability: 33,
        window: '48 hours',
        highway: 'Kanchanpur–Vanghmun Road',
        geology: 'Tipam Sandstone & Shale Synclines',
        desc: 'Moderate ridgeline erosion along the Tripura–Mizoram border hills.'
    },

    // --- 🟢 GREEN: LOW RISK / SAFE STABILITY (< 35) ---
    {
        id: 'shillong',
        name: 'Shillong Central Plateau',
        state: 'Meghalaya',
        pos: [25.5788, 91.8933],
        category: 'SAFE',
        color: '#10b981',
        score: 24,
        rain: 30,
        slope: 15,
        soil: 38,
        probability: 16,
        window: 'Stable Monitoring',
        highway: 'NH-06 Shillong Bypass',
        geology: 'Shillong Group Quartzites (Massive)',
        desc: 'Dense vegetation canopy and highly competent quartzite bedrock. Safe and stable.'
    },
    {
        id: 'siliguri',
        name: 'Siliguri Foothills Staging Area',
        state: 'West Bengal',
        pos: [26.7271, 88.3953],
        category: 'SAFE',
        color: '#10b981',
        score: 18,
        rain: 24,
        slope: 6,
        soil: 30,
        probability: 10,
        window: 'Clear / Open',
        highway: 'NH-27 / NH-10 Origin',
        geology: 'Alluvial Outwash Fan & Terai Gravels',
        desc: 'Flat alluvial basin serving as primary emergency staging area for Sikkim corridors.'
    },
    {
        id: 'dimapur',
        name: 'Dimapur Plain Corridor',
        state: 'Nagaland',
        pos: [25.9068, 93.7271],
        category: 'SAFE',
        color: '#10b981',
        score: 20,
        rain: 28,
        slope: 8,
        soil: 34,
        probability: 12,
        window: 'Clear / Open',
        highway: 'NH-29 Logistics Gateway',
        geology: 'Dhansiri Alluvium & Terraces',
        desc: 'Stable valley floor transport hub. Unrestricted traffic flow.'
    },
    {
        id: 'imphal_valley',
        name: 'Imphal Valley Basin',
        state: 'Manipur',
        pos: [24.8170, 93.9368],
        category: 'SAFE',
        color: '#10b981',
        score: 22,
        rain: 26,
        slope: 7,
        soil: 36,
        probability: 14,
        window: 'Clear / Open',
        highway: 'NH-02 & NH-37 Terminus',
        geology: 'Lacustrine Silt & Clays',
        desc: 'Intermontane valley floor; slope hazard negligible under current rainfall levels.'
    },
    {
        id: 'tezpur',
        name: 'Tezpur & Sonitpur Plain',
        state: 'Assam',
        pos: [26.6338, 92.7926],
        category: 'SAFE',
        color: '#10b981',
        score: 16,
        rain: 22,
        slope: 5,
        soil: 28,
        probability: 8,
        window: 'Clear / Open',
        highway: 'NH-15 Brahmaputra Highway',
        geology: 'Brahmaputra Alluvial Plain',
        desc: 'Major staging base for Western Arunachal disaster relief operations.'
    },
    {
        id: 'dibrugarh',
        name: 'Dibrugarh Upper Assam Basin',
        state: 'Assam',
        pos: [27.4728, 94.9120],
        category: 'SAFE',
        color: '#10b981',
        score: 19,
        rain: 27,
        slope: 4,
        soil: 32,
        probability: 9,
        window: 'Clear / Open',
        highway: 'Bogibeel Bridge & NH-15',
        geology: 'Deep Quaternary Alluvium',
        desc: 'Low gradient floodplain, zero slope instability hazard detected.'
    },
    {
        id: 'ziro',
        name: 'Ziro Terraced Valley',
        state: 'Arunachal Pradesh',
        pos: [27.5300, 93.8300],
        category: 'SAFE',
        color: '#10b981',
        score: 28,
        rain: 36,
        slope: 14,
        soil: 41,
        probability: 20,
        window: 'Clear / Open',
        highway: 'Trans-Arunachal Highway (NH-13)',
        geology: 'Granite & Mica Schist Terraces',
        desc: 'Traditional Apatani terraced slope stabilization. Low erosion index.'
    },
    {
        id: 'serchhip',
        name: 'Serchhip Valley Ridge',
        state: 'Mizoram',
        pos: [23.3100, 92.8300],
        category: 'SAFE',
        color: '#10b981',
        score: 25,
        rain: 32,
        slope: 13,
        soil: 39,
        probability: 17,
        window: 'Clear / Open',
        highway: 'NH-54 Middle Corridor',
        geology: 'Massive Barail Sandstone',
        desc: 'Competent sandstone ridge with dense vegetative anchoring. Safe.'
    },
    {
        id: 'agartala',
        name: 'Agartala Basin Plain',
        state: 'Tripura',
        pos: [23.8315, 91.2868],
        category: 'SAFE',
        color: '#10b981',
        score: 15,
        rain: 20,
        slope: 5,
        soil: 25,
        probability: 7,
        window: 'Clear / Open',
        highway: 'NH-08 National Corridor',
        geology: 'Dupitila Sandstones & Clays',
        desc: 'Lowland plain terrain; entirely safe from slope slip and hill failure.'
    },
    {
        id: 'geyzing',
        name: 'Geyzing & Pelling Ridge',
        state: 'West Sikkim',
        pos: [27.2800, 88.2300],
        category: 'SAFE',
        color: '#10b981',
        score: 29,
        rain: 38,
        slope: 16,
        soil: 42,
        probability: 22,
        window: 'Stable Monitoring',
        highway: 'Geyzing–Legship Road',
        geology: 'Phyllitic Quartzite with High Cohesion',
        desc: 'Engineered retaining walls and afforested mountain contours. Normal watch.'
    }
];

// Helper functions for risk categorization
const getLevel = score => score <= 35 ? 'SAFE' : score <= 70 ? 'WATCH' : 'CRITICAL';
const levelColors = { SAFE: '#10b981', WATCH: '#eab308', CRITICAL: '#ef4444' };

// Bounding box covering India & the sub-Himalayan North East Region
// [South-West: Lat 6.0°N, Lng 68.0°E] to [North-East: Lat 37.5°N, Lng 98.0°E]
const indiaBounds = L.latLngBounds([6.0, 68.0], [37.5, 98.0]);
const nerBounds = L.latLngBounds([21.0, 87.0], [29.8, 97.6]);

const map = L.map('map', {
    zoomControl: true,
    attributionControl: true,
    maxBounds: indiaBounds.pad(0.25),
    maxBoundsViscosity: 0.85,
    minZoom: 4,
    maxZoom: 18
}).setView([27.3389, 88.6065], 11); // Initial default view before live GPS lock

const tileLayers = {
    topo: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '&copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ'
    }),
    voyager: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; CARTO &copy; OpenStreetMap contributors'
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: '&copy; Esri &mdash; Earthstar Geographics'
    }),
    osm: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    })
};

// Default basemap: Natural Terrain Topo (vibrant terrain textures, green patches, elevation relief)
let currentBasemap = tileLayers.topo.addTo(map);

// Basemap Switcher Handler
const layerSelector = document.getElementById('mapLayerSelector');
if (layerSelector) {
    layerSelector.addEventListener('change', event => {
        map.removeLayer(currentBasemap);
        currentBasemap = tileLayers[event.target.value] || tileLayers.topo;
        currentBasemap.addTo(map);
    });
}

// Reset Map View Button (Re-focus on user's location)
const resetBtn = document.getElementById('resetMapView');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        locateUser(true);
    });
}

// View Entire NER Macro Button
const viewEntireNerBtn = document.getElementById('viewEntireNerBtn');
if (viewEntireNerBtn) {
    viewEntireNerBtn.addEventListener('click', () => {
        map.flyToBounds(nerBounds, { duration: 1.2 });
    });
}

// Fullscreen / Complete Map View Handler
const fsBtn = document.getElementById('fullscreenMapBtn');
const mapContainer = document.getElementById('mapContainer');
if (fsBtn && mapContainer) {
    fsBtn.addEventListener('click', () => {
        mapContainer.classList.toggle('fullscreen');
        const isFs = mapContainer.classList.contains('fullscreen');
        const fsText = document.getElementById('fullscreenBtnText');
        if (fsText) fsText.textContent = isFs ? 'Exit Fullscreen' : 'View Map Completely';
        setTimeout(() => map.invalidateSize(), 300);
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mapContainer && mapContainer.classList.contains('fullscreen')) {
        mapContainer.classList.remove('fullscreen');
        const fsText = document.getElementById('fullscreenBtnText');
        if (fsText) fsText.textContent = 'View Map Completely';
        setTimeout(() => map.invalidateSize(), 300);
    }
});

// ----------------------------------------------------------------------------
// 5. Layer Groups and Custom Leaflet Pulsing Markers
// ----------------------------------------------------------------------------
const criticalLayer = L.layerGroup().addTo(map);
const watchLayer = L.layerGroup().addTo(map);
const safeLayer = L.layerGroup().addTo(map);
const roadLayer = L.layerGroup().addTo(map);
const halosLayer = L.layerGroup().addTo(map);
const reportLayer = L.layerGroup().addTo(map);
const userLocationLayer = L.layerGroup().addTo(map);

// ----------------------------------------------------------------------------
// 5.1 Geolocation User Tracking & Hazard Tier Calculation Engine
// ----------------------------------------------------------------------------
let userMarker = null;
let userAccuracyCircle = null;

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function evaluateUserHazardZone(lat, lng) {
    let closestPlace = landslidePlaces[0];
    let minDistance = Infinity;

    landslidePlaces.forEach(place => {
        const d = calculateDistanceKm(lat, lng, place.pos[0], place.pos[1]);
        if (d < minDistance) {
            minDistance = d;
            closestPlace = place;
        }
    });

    return { closestPlace, distanceKm: Math.round(minDistance) };
}

function updateUserLocationUI(lat, lng, accuracy = 20) {
    userLocationLayer.clearLayers();

    const userIcon = L.divIcon({
        className: 'user-gps-marker',
        html: `
            <div class="user-gps-pin">
                <div class="user-gps-pulse"></div>
                <div class="user-gps-core"></div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    const { closestPlace, distanceKm } = evaluateUserHazardZone(lat, lng);

    let hazardTier = 'SAFE';
    let hazardColor = '#10b981';
    let statusText = '';
    let badgeText = '';

    if (distanceKm <= 15) {
        hazardTier = closestPlace.category;
        hazardColor = closestPlace.color;
        statusText = `Near ${closestPlace.name} (${closestPlace.state}) &bull; ${distanceKm} km`;
        badgeText = `${hazardTier} HAZARD ZONE`;
    } else if (distanceKm <= 45) {
        hazardTier = closestPlace.category === 'CRITICAL' ? 'WATCH' : 'SAFE';
        hazardColor = hazardTier === 'WATCH' ? '#eab308' : '#10b981';
        statusText = `${distanceKm} km from ${closestPlace.name} (${closestPlace.state})`;
        badgeText = `${hazardTier}: APPROACHING HILL CORRIDOR`;
    } else {
        hazardTier = 'SAFE';
        hazardColor = '#10b981';
        statusText = `Active GPS &bull; Nearest NER Zone: ${closestPlace.name} (${distanceKm} km)`;
        badgeText = `🟢 SAFE FOOTHILLS REGION`;
    }

    const locText = document.getElementById('userLocationText');
    const badge = document.getElementById('userHazardZoneBadge');
    const gpsDot = document.getElementById('gpsDot');

    if (locText) {
        locText.innerHTML = `<span class="text-gray-400">Your Location:</span> <b class="text-white">${statusText}</b>`;
    }
    if (badge) {
        badge.textContent = badgeText;
        badge.style.color = hazardColor;
        badge.style.borderColor = hazardColor + '60';
        badge.style.backgroundColor = hazardColor + '18';
    }
    if (gpsDot) {
        gpsDot.style.backgroundColor = hazardColor;
    }

    userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(userLocationLayer);
    userMarker.bindPopup(`
        <div class="landslide-popup-card">
            <div class="flex items-center justify-between">
                <b class="text-cyan-400 text-xs">📍 YOUR CURRENT LOCATION</b>
                <span class="text-[9px] px-1.5 py-0.5 rounded font-bold" style="background:${hazardColor}20;color:${hazardColor};border:1px solid ${hazardColor}50">
                    ${badgeText}
                </span>
            </div>
            <div class="text-xs text-gray-300 mt-2 leading-relaxed">
                <b>Coordinates:</b> ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E<br>
                <b>Nearest Sector:</b> ${closestPlace.name} (${closestPlace.state})<br>
                <b>Proximity:</b> ${distanceKm} km to active monitoring zone<br>
                <b>Geology:</b> ${closestPlace.geology}
            </div>
            <p class="text-[10px] text-gray-400 mt-1.5 pt-1.5 border-t border-slate-700">
                ${hazardTier === 'CRITICAL' ? '⚠️ High risk of rockfall and debris accumulation on slopes. Exercise extreme caution.' : 'Normal monitoring conditions. Safe from immediate slope movement.'}
            </p>
        </div>
    `);

    userAccuracyCircle = L.circle([lat, lng], {
        radius: Math.min(accuracy * 12, 1500),
        color: '#06b6d4',
        weight: 1,
        fillColor: '#06b6d4',
        fillOpacity: 0.08
    }).addTo(userLocationLayer);

    if (distanceKm <= 50) {
        updateRiskPanel(closestPlace);
    }
}

function locateUser(zoomToUser = true) {
    const locText = document.getElementById('userLocationText');
    if (locText) {
        locText.innerHTML = `<span class="text-gray-400">GPS Status:</span> <span class="text-cyan-400 animate-pulse font-semibold">Locking onto your live coordinates...</span>`;
    }

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const accuracy = position.coords.accuracy || 20;

                // Dynamically extend bounds so Leaflet never restricts the user's location
                if (!indiaBounds.contains([lat, lng])) {
                    indiaBounds.extend([lat, lng]);
                    map.setMaxBounds(indiaBounds.pad(0.3));
                }

                updateUserLocationUI(lat, lng, accuracy);

                if (zoomToUser) {
                    map.setView([lat, lng], 14);
                    setTimeout(() => {
                        if (userMarker) userMarker.openPopup();
                    }, 450);
                }
            },
            error => {
                console.warn('Geolocation unavailable / denied:', error.message);
                // Graceful fallback for permission denial
                updateUserLocationUI(27.3389, 88.6065, 30);
                if (locText) {
                    locText.innerHTML = `<span class="text-amber-400">GPS Access Denied:</span> <span class="text-gray-300">Click 'Locate Me' or allow browser location. Focus: Gangtok (NH-10)</span>`;
                }
                if (zoomToUser) {
                    map.setView([27.3389, 88.6065], 11);
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        updateUserLocationUI(27.3389, 88.6065, 30);
        if (locText) {
            locText.innerHTML = `<span class="text-gray-400">Focus:</span> <b class="text-white">Gangtok 29th Mile (NH-10)</b> <span class="text-[10px] text-gray-500">(Geolocation not supported)</span>`;
        }
    }
}

// Locate Me button listener
const locateUserBtn = document.getElementById('locateUserBtn');
if (locateUserBtn) {
    locateUserBtn.addEventListener('click', () => {
        locateUser(true);
    });
}

// Map place instances
const placeMarkerMap = new Map();

function createPopupContent(place) {
    return `
        <div class="landslide-popup-card">
            <div class="landslide-popup-header">
                <div>
                    <div class="landslide-popup-title">${place.name}</div>
                    <div class="landslide-popup-state">${place.state} &bull; ${place.highway}</div>
                </div>
                <span class="landslide-popup-badge" style="background:${place.color}20;color:${place.color};border:1px solid ${place.color}50">
                    ${place.category}
                </span>
            </div>
            <div class="landslide-popup-grid">
                <div class="landslide-popup-item"><span>Risk Score</span><b style="color:${place.color}">${place.score}/100</b></div>
                <div class="landslide-popup-item"><span>24h Rain</span><b>${place.rain} mm</b></div>
                <div class="landslide-popup-item"><span>Slope Angle</span><b>${place.slope}&deg;</b></div>
                <div class="landslide-popup-item"><span>Soil Saturation</span><b>${place.soil}%</b></div>
            </div>
            <div class="landslide-popup-desc">${place.desc}</div>
            <button class="landslide-popup-action" onclick="window.selectLandslidePlace('${place.id}')">
                Focus in Geotechnical Model
            </button>
        </div>
    `;
}

// Render all 30 landslide places on the Leaflet map
landslidePlaces.forEach(place => {
    const icon = L.divIcon({
        className: 'landslide-custom-icon',
        html: `
            <div class="landslide-pin ${place.category.toLowerCase()}">
                <div class="landslide-pulse"></div>
                <div class="landslide-pin-inner"></div>
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
    });

    const marker = L.marker(place.pos, { icon }).bindPopup(createPopupContent(place));

    // Target layer based on category
    if (place.category === 'CRITICAL') {
        marker.addTo(criticalLayer);
    } else if (place.category === 'WATCH') {
        marker.addTo(watchLayer);
    } else {
        marker.addTo(safeLayer);
    }

    // Add subtle risk watershed circle
    L.circle(place.pos, {
        radius: place.score * 80,
        color: place.color,
        weight: 1,
        fillColor: place.color,
        fillOpacity: place.category === 'CRITICAL' ? 0.12 : place.category === 'WATCH' ? 0.08 : 0.04
    }).addTo(halosLayer);

    marker.on('click', () => {
        selectLandslidePlace(place.id, false);
    });

    placeMarkerMap.set(place.id, { marker, place });
});

// ----------------------------------------------------------------------------
// 6. Expanded National Highway Corridors & Real-Time Blockages (15 Routes)
// ----------------------------------------------------------------------------
const roads = [
    // 1. NH-10 (Sikkim Lifeline)
    {
        id: 'nh10',
        name: 'NH-10 — Siliguri to Gangtok Corridor',
        highwayCode: 'NH-10',
        state: 'Sikkim / West Bengal',
        coords: [[26.73, 88.40], [26.85, 88.42], [27.04, 88.45], [27.10, 88.52], [27.34, 88.61]],
        status: 'BLOCKED AT 29TH MILE',
        risk: 'CRITICAL',
        color: '#ef4444',
        blockage: '29th Mile & Sethi Jhora: Active slope slip, rolling boulders, and Teesta under-cutting',
        clearingEta: 'SDRF / BRO Project Swastik clearing active (Est. 14 hrs)',
        alternative: 'Via Lava – Algarah – Rhenock – Reshi Road (+2.5 hrs for light vehicles)',
        agency: 'BRO Project Swastik & Sikkim PWD',
        blockagePoint: [27.08, 88.49],
        blockageSeverity: 'CRITICAL'
    },
    // 2. NH-110 (Old Hill Cart Road)
    {
        id: 'nh110',
        name: 'NH-110 (Hill Cart Road) — Siliguri to Darjeeling',
        highwayCode: 'NH-110',
        state: 'West Bengal',
        coords: [[26.73, 88.41], [26.82, 88.35], [26.88, 88.28], [26.98, 88.27], [27.04, 88.26]],
        status: 'SEVERED AT PAGLA JHORA',
        risk: 'CRITICAL',
        color: '#ef4444',
        blockage: 'Pagla Jhora / Tindharia: 40m road formation slumped down mountain ravine',
        clearingEta: 'Closed for all commercial freight (Est. 48 hrs)',
        alternative: 'Rerouted via Rohini Road or Pankhabari (Strictly light vehicles)',
        agency: 'West Bengal PWD NH Division',
        blockagePoint: [26.88, 88.28],
        blockageSeverity: 'CRITICAL'
    },
    // 3. North Sikkim Highway (NSH)
    {
        id: 'nsh',
        name: 'North Sikkim Highway — Mangan to Chungthang & Lachen',
        highwayCode: 'NSH',
        state: 'North Sikkim',
        coords: [[27.34, 88.61], [27.50, 88.53], [27.60, 88.64], [27.72, 88.55]],
        status: 'TOTAL CLOSURE AT TOONG GORGE',
        risk: 'CRITICAL',
        color: '#ef4444',
        blockage: 'Toong & Pegong: Glacial surge aftermath; massive rock cliffs collapsed on carriageway',
        clearingEta: 'Emergency bailey bridge launch in progress by BRO',
        alternative: 'No overland vehicle route; essential supplies airlifted by IAF',
        agency: 'Border Roads Organisation (BRO)',
        blockagePoint: [27.55, 88.58],
        blockageSeverity: 'CRITICAL'
    },
    // 4. Lumding – Haflong – Silchar Corridor (Dima Hasao)
    {
        id: 'dima_hasao',
        name: 'Lumding – Haflong – Silchar Mountain Pass',
        highwayCode: 'NH-54E / NH-27 Con.',
        state: 'Assam (Dima Hasao)',
        coords: [[25.75, 93.18], [25.40, 93.10], [25.17, 93.02], [24.95, 92.90], [24.82, 92.80]],
        status: 'BLOCKED AT JATINGA MUD SLIDE',
        risk: 'CRITICAL',
        color: '#ef4444',
        blockage: 'Jatinga Lampu: 200m active mudflow buried highway section; hill cut culvert ruptured',
        clearingEta: 'NHIDCL excavators clearing heavy slurry (Est. 24 hrs)',
        alternative: 'Via Umrangso – Lanka detour route (+4.5 hrs)',
        agency: 'National Highways & Infrastructure Development Corp (NHIDCL)',
        blockagePoint: [25.15, 92.98],
        blockageSeverity: 'CRITICAL'
    },
    // 5. NH-37 / NH-02 (Jiribam to Imphal Lifeline)
    {
        id: 'nh37',
        name: 'NH-37 / NH-02 — Jiribam to Imphal Lifeline',
        highwayCode: 'NH-37',
        state: 'Manipur',
        coords: [[24.80, 93.12], [24.75, 93.35], [24.78, 93.62], [24.81, 93.80], [24.82, 93.94]],
        status: 'SEVERED AT TUPUL CUTTING',
        risk: 'CRITICAL',
        color: '#ef4444',
        blockage: 'Tupul & Awangkhul: Disang shale slip buried 3 highway bays near railway approach',
        clearingEta: 'BRO Project Sewak clearing debris (Est. 36 hrs)',
        alternative: 'Reroute via Old Cachar Road (Restricted to light 4x4 vehicles only)',
        agency: 'BRO Project Sewak',
        blockagePoint: [24.78, 93.63],
        blockageSeverity: 'CRITICAL'
    },
    // 6. NH-29 (Dimapur to Kohima Corridor)
    {
        id: 'nh29',
        name: 'NH-29 — Dimapur to Kohima & Mao Corridor',
        highwayCode: 'NH-29',
        state: 'Nagaland / Manipur',
        coords: [[25.91, 93.73], [25.80, 93.85], [25.72, 94.01], [25.68, 94.11], [25.50, 94.12]],
        status: 'SINGLE-LANE AT DZÜDZA RIVER',
        risk: 'RESTRICTED',
        color: '#f59e0b',
        blockage: 'Dzüdza river section & Paglapahar: Severe toe cutting & intermittent mud wash',
        clearingEta: 'One-way regulated convoy piloted by Kohima Police',
        alternative: 'Peducha to Tsiesema 10km bypass (Heavy vehicles barred)',
        agency: 'Nagaland PWD (NH) & Kohima Traffic Police',
        blockagePoint: [25.71, 94.02],
        blockageSeverity: 'RESTRICTED'
    },
    // 7. NH-06 (Guwahati – Shillong – Silchar Corridor)
    {
        id: 'nh06',
        name: 'NH-06 — Guwahati – Shillong – Silchar Corridor',
        highwayCode: 'NH-06',
        state: 'Assam / Meghalaya',
        coords: [[26.14, 91.75], [25.58, 91.89], [25.44, 92.20], [25.10, 92.40], [24.82, 92.80]],
        status: 'SLOW TRANSIT AT SONAPUR TUNNEL',
        risk: 'RESTRICTED',
        color: '#f59e0b',
        blockage: 'Sonapur Tunnel & Lumshnong: Heavy mud slurry at portal approaches; night transit restricted',
        clearingEta: 'Continuous clearing; single convoy movement',
        alternative: 'Exercise high caution during downpours; daytime transit only',
        agency: 'NHAI & Meghalaya PWD',
        blockagePoint: [25.12, 92.36],
        blockageSeverity: 'RESTRICTED'
    },
    // 8. NH-13 (Trans-Arunachal Highway)
    {
        id: 'nh13',
        name: 'NH-13 (Trans-Arunachal Highway) — Potin to Pasighat',
        highwayCode: 'NH-13',
        state: 'Arunachal Pradesh',
        coords: [[27.12, 93.60], [27.53, 93.83], [27.98, 94.22], [28.06, 95.33]],
        status: 'CAUTION: MUDWASH AT POTIN',
        risk: 'RESTRICTED',
        color: '#f59e0b',
        blockage: 'Potin cuttings (Km 18–34): Loose hill washouts spreading across blind turns',
        clearingEta: 'Arunachal PWD excavators clearing mud continuously',
        alternative: 'Daylight driving recommended with high ground clearance vehicles',
        agency: 'Arunachal Pradesh PWD (Highways)',
        blockagePoint: [27.35, 93.72],
        blockageSeverity: 'RESTRICTED'
    },
    // 9. BCT Road (Balipara–Charduar–Tawang)
    {
        id: 'bct_tawang',
        name: 'BCT Road — Tezpur – Bomdila – Sela Tunnel – Tawang',
        highwayCode: 'BCT Corridor',
        state: 'Arunachal Pradesh',
        coords: [[26.85, 92.70], [27.15, 92.50], [27.26, 92.42], [27.50, 92.10], [27.59, 91.86]],
        status: 'RESTRICTED AT SELA PASS APPROACH',
        risk: 'RESTRICTED',
        color: '#f59e0b',
        blockage: 'Sela Pass approach: Freeze-thaw rockfalls and loose boulder slides along switchbacks',
        clearingEta: 'BRO Project Vartak dozers maintaining pilot lane',
        alternative: 'Transit via newly inaugurated Sela Tunnel when cleared of rockwash',
        agency: 'BRO Project Vartak',
        blockagePoint: [27.50, 92.10],
        blockageSeverity: 'RESTRICTED'
    },
    // 10. NH-54 / NH-306 (Silchar to Aizawl)
    {
        id: 'nh54',
        name: 'NH-54 / NH-306 — Silchar to Aizawl Lifeline',
        highwayCode: 'NH-306',
        state: 'Assam / Mizoram',
        coords: [[24.82, 92.80], [24.30, 92.75], [23.95, 92.70], [23.73, 92.72]],
        status: 'RESTRICTED AT HUNTHAR SINKING ZONE',
        risk: 'RESTRICTED',
        color: '#f59e0b',
        blockage: 'Hunthar slope (Northern Aizawl): Progressive rotational road depression and surface fractures',
        clearingEta: 'Controlled single-vehicle movement; gross weight restricted to <12 Tonnes',
        alternative: 'Via Durtlang bypass route (+45 mins)',
        agency: 'Mizoram PWD & NHIDCL',
        blockagePoint: [23.76, 92.71],
        blockageSeverity: 'RESTRICTED'
    },
    // 11. NH-717A (Alternative Sikkim Access)
    {
        id: 'nh717a',
        name: 'NH-717A — Bagrakote – Labha – Algarah – Gangtok',
        highwayCode: 'NH-717A',
        state: 'West Bengal / Sikkim',
        coords: [[26.88, 88.60], [27.08, 88.66], [27.18, 88.62], [27.28, 88.60], [27.34, 88.61]],
        status: 'RESTRICTED AT RORATHANG SECTION',
        risk: 'RESTRICTED',
        color: '#f59e0b',
        blockage: 'Rorathang embankment: Slope slump along valley flank; single-lane convoy control',
        clearingEta: 'Passable for light vehicles and emergency ambulances',
        alternative: 'Official designated alternative bypass to blocked NH-10',
        agency: 'NHIDCL Sikkim Project',
        blockagePoint: [27.18, 88.62],
        blockageSeverity: 'RESTRICTED'
    },
    // 12. NH-702D (Mokokchung to Mariani)
    {
        id: 'nh702d',
        name: 'NH-702D — Mokokchung to Mariani Corridor',
        highwayCode: 'NH-702D',
        state: 'Nagaland / Assam',
        coords: [[26.66, 94.33], [26.55, 94.40], [26.40, 94.45], [26.32, 94.52]],
        status: 'SINGLE LANE AT CHANGKI VALLEY',
        risk: 'RESTRICTED',
        color: '#f59e0b',
        blockage: 'Changki gorge: Debris roll-down and mud slurry from hillside tea estates',
        clearingEta: 'Local PWD earthmovers operating; single vehicle transit',
        alternative: 'Mariani to Mokokchung via Tuli–Amguri route',
        agency: 'Nagaland PWD (Mechanical)',
        blockagePoint: [26.55, 94.40],
        blockageSeverity: 'RESTRICTED'
    },
    // 13. NH-208A (Tripura Eastern Ridge)
    {
        id: 'nh208a',
        name: 'NH-208A — Kailashahar – Dharmanagar – Kanchanpur',
        highwayCode: 'NH-208A',
        state: 'Tripura',
        coords: [[24.33, 92.01], [24.38, 92.17], [24.08, 92.25], [23.75, 92.28]],
        status: 'PASSABLE WITH CARE AT JAMPUI',
        risk: 'RESTRICTED',
        color: '#f59e0b',
        blockage: 'Jampui Hills foothills: Lateral surface mudwash and gravel washouts',
        clearingEta: 'Clear for vehicular transit under 20 km/h speed limit',
        alternative: 'Slow driving recommended on steep ascent turns',
        agency: 'Tripura PWD NH Division',
        blockagePoint: [24.08, 92.25],
        blockageSeverity: 'RESTRICTED'
    },
    // 14. NH-27 (East-West Highway)
    {
        id: 'nh27',
        name: 'NH-27 — East-West Expressway (Siliguri – Guwahati)',
        highwayCode: 'NH-27',
        state: 'West Bengal / Assam',
        coords: [[26.73, 88.40], [26.54, 89.50], [26.51, 90.54], [26.18, 91.74]],
        status: '4-LANE EXPRESSWAY ALL CLEAR',
        risk: 'SAFE',
        color: '#10b981',
        blockage: 'None: Plains corridor, zero slope instability risk',
        clearingEta: 'Unrestricted 24/7 high-speed commercial transit',
        alternative: 'Primary heavy logistics lifeline connecting North East to mainland India',
        agency: 'National Highways Authority of India (NHAI)',
        blockagePoint: null,
        blockageSeverity: 'SAFE'
    },
    // 15. NH-15 (Brahmaputra North Bank Highway)
    {
        id: 'nh15',
        name: 'NH-15 — Tezpur to North Lakhimpur & Dibrugarh',
        highwayCode: 'NH-15',
        state: 'Assam',
        coords: [[26.63, 92.79], [26.85, 93.62], [27.23, 94.10], [27.47, 94.91]],
        status: 'HIGHWAY FULLY OPEN',
        risk: 'SAFE',
        color: '#10b981',
        blockage: 'None: Flat Brahmaputra valley floor, fully open across Bogibeel Bridge',
        clearingEta: 'Clear unrestricted highway',
        alternative: 'Direct northern axis serving Upper Assam and East Arunachal',
        agency: 'NHIDCL & Assam PWD',
        blockagePoint: null,
        blockageSeverity: 'SAFE'
    }
];

const roadLinesMap = new Map();
const roadMarkersMap = new Map();

const roadLines = roads.map(road => {
    const line = L.polyline(road.coords, {
        color: road.color,
        weight: 5,
        opacity: 0.95
    }).addTo(roadLayer).bindPopup(`
        <div class="landslide-popup-card">
            <div class="flex items-center justify-between">
                <b class="text-white text-sm">${road.name}</b>
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded" style="background:${road.color}20;color:${road.color};border:1px solid ${road.color}50">
                    ${road.status}
                </span>
            </div>
            <div class="text-xs text-gray-300 mt-2 leading-relaxed">
                <b>Corridor:</b> ${road.highwayCode} &bull; ${road.state}<br>
                <b>Authority:</b> ${road.agency}<br>
                <b>Condition:</b> ${road.blockage}<br>
                <span class="text-emerald-400"><b>Detour:</b> ${road.alternative}</span>
            </div>
        </div>
    `);

    roadLinesMap.set(road.id, line);

    // Add blockage point marker if highway is blocked or restricted
    if (road.blockagePoint) {
        const isCritical = road.blockageSeverity === 'CRITICAL';
        const blockageIcon = L.divIcon({
            className: 'road-blockage-icon',
            html: `
                <div class="road-blockage-pin ${isCritical ? 'critical' : 'restricted'}">
                    <span>${isCritical ? '⛔' : '⚠️'}</span>
                </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -14]
        });

        const blockageMarker = L.marker(road.blockagePoint, { icon: blockageIcon }).addTo(roadLayer).bindPopup(`
            <div class="landslide-popup-card">
                <div class="flex items-center justify-between">
                    <b class="${isCritical ? 'text-red-400' : 'text-amber-400'} text-xs font-bold">${isCritical ? '⛔ ROAD SEVERED / BLOCKED' : '⚠️ SINGLE-LANE RESTRICTED'}</b>
                    <span class="text-[9px] font-bold px-1.5 py-0.5 rounded" style="background:${road.color}20;color:${road.color};border:1px solid ${road.color}50">
                        ${road.risk}
                    </span>
                </div>
                <div class="text-sm font-bold text-white mt-1">${road.name}</div>
                <div class="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    <b>Location:</b> ${road.state}<br>
                    <b>Agency:</b> ${road.agency}<br>
                    <b>Obstruction:</b> ${road.blockage}
                </div>
                <div class="text-xs text-yellow-400 mt-1 font-semibold"><b>Clearance ETA:</b> ${road.clearingEta}</div>
                <div class="text-xs text-emerald-400 mt-1 font-semibold"><b>Alternative Route:</b> ${road.alternative}</div>
            </div>
        `);

        roadMarkersMap.set(road.id, blockageMarker);
    }

    return line;
});

// Detour dashed bypass route for NH-10 (Lava – Algarah – Reshi Road)
L.polyline([[27.04, 88.45], [27.16, 88.62], [27.12, 88.75], [27.05, 88.83]], {
    color: '#38bdf8',
    weight: 3,
    dashArray: '7 7',
    opacity: 0.95
}).addTo(roadLayer).bindPopup(`
    <div class="landslide-popup-card">
        <b class="text-sky-400 text-xs">🛣️ NH-10 EMERGENCY BYPASS ROUTE</b>
        <p class="text-xs text-gray-300 mt-1">Lava &ndash; Algarah &ndash; Reshi Road (Operational for ambulances and light emergency convoys).</p>
    </div>
`);

// Window Focus Road Helper for Interactive Cards
window.focusRoad = function(roadId) {
    const road = roads.find(r => r.id === roadId);
    if (!road) return;

    // Scroll map container into view
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Target point: blockagePoint if exists, else midpoint of coords
    const targetPoint = road.blockagePoint || road.coords[Math.floor(road.coords.length / 2)];
    const zoomLevel = road.blockagePoint ? 13 : 9.5;

    map.flyTo(targetPoint, zoomLevel, { duration: 1.2 });

    setTimeout(() => {
        const marker = roadMarkersMap.get(road.id);
        if (marker) {
            marker.openPopup();
        } else {
            const line = roadLinesMap.get(road.id);
            if (line) line.openPopup(targetPoint);
        }
    }, 1300);
};

// ----------------------------------------------------------------------------
// 7. Floating Map Legend & Layer Controls
// ----------------------------------------------------------------------------
const legend = L.control({ position: 'bottomleft' });
legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
        <b style="font-size:11px;letter-spacing:0.04em">LANDSLIDE &amp; HIGHWAY KEY</b><br>
        <span class="legend-dot" style="background:#ef4444"></span><b>Red</b>: Critical Hazard (&gt;70)<br>
        <span class="legend-dot" style="background:#eab308"></span><b>Yellow</b>: Watch Advisory (35–70)<br>
        <span class="legend-dot" style="background:#10b981"></span><b>Green</b>: Low / Safe (&lt;35)<br>
        <span style="display:inline-block;margin-right:4px;">📍</span><b>Cyan</b>: Your Location<br>
        <span style="display:inline-block;margin-right:4px;">⛔</span><b>Red Pin</b>: Blocked Highway (5 Routes)<br>
        <span style="display:inline-block;margin-right:4px;">⚠️</span><b>Yellow Pin</b>: Single-Lane Watch (6 Routes)<br>
        <span class="legend-line" style="border-color:#10b981"></span>Open Arteries (NH-27/NH-15)
    `;
    return div;
};
legend.addTo(map);

// ----------------------------------------------------------------------------
// 8. Map Filter Toolbar (All, Critical, Watch, Safe, Roads)
// ----------------------------------------------------------------------------
const mapFilterButtons = document.querySelectorAll('.map-filter');
mapFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
        mapFilterButtons.forEach(btn => {
            btn.classList.remove('bg-emerald-600', 'text-white');
            btn.classList.add('hover:bg-slate-800');
        });
        button.classList.add('bg-emerald-600', 'text-white');
        button.classList.remove('hover:bg-slate-800');

        const filter = button.dataset.filter;
        const countDisplay = document.getElementById('activeMapCount');

        if (filter === 'all') {
            map.addLayer(criticalLayer);
            map.addLayer(watchLayer);
            map.addLayer(safeLayer);
            map.addLayer(roadLayer);
            map.addLayer(halosLayer);
            map.addLayer(reportLayer);
            if (countDisplay) countDisplay.textContent = 'Showing 30 Landslide Monitoring Zones & 15 Corridors';
            map.flyTo([26.2, 92.8], 7, { duration: 0.8 });
        } else if (filter === 'CRITICAL') {
            map.addLayer(criticalLayer);
            map.removeLayer(watchLayer);
            map.removeLayer(safeLayer);
            map.addLayer(roadLayer);
            if (countDisplay) countDisplay.textContent = 'Showing 9 Critical / Severe Risk Zones (Red)';
            map.flyTo([26.5, 91.5], 7.5, { duration: 0.8 });
        } else if (filter === 'WATCH') {
            map.removeLayer(criticalLayer);
            map.addLayer(watchLayer);
            map.removeLayer(safeLayer);
            map.addLayer(roadLayer);
            if (countDisplay) countDisplay.textContent = 'Showing 11 Advisory Watch Zones (Yellow)';
            map.flyTo([25.8, 92.8], 7.5, { duration: 0.8 });
        } else if (filter === 'SAFE') {
            map.removeLayer(criticalLayer);
            map.removeLayer(watchLayer);
            map.addLayer(safeLayer);
            map.addLayer(roadLayer);
            if (countDisplay) countDisplay.textContent = 'Showing 10 Low Hazard / Safe Zones (Green)';
            map.flyTo([25.8, 92.8], 7.5, { duration: 0.8 });
        } else if (filter === 'ROADS') {
            map.removeLayer(criticalLayer);
            map.removeLayer(watchLayer);
            map.removeLayer(safeLayer);
            map.addLayer(roadLayer);
            if (countDisplay) countDisplay.textContent = 'Showing 15 National Highway Corridors (5 Blocked, 6 Restricted)';
            map.flyTo([26.2, 91.8], 7.2, { duration: 0.8 });
        }
    });
});

// ----------------------------------------------------------------------------
// 9. Risk Analysis Model Panel Synchronization
// ----------------------------------------------------------------------------
let activePlaceId = 'gangtok';

function updateRiskPanel(place) {
    const riskLevel = place.category;
    const color = levelColors[riskLevel] || '#ef4444';

    const scoreElem = document.getElementById('riskScore');
    const levelElem = document.getElementById('riskLevel');
    const gaugeElem = document.getElementById('riskGauge');

    if (scoreElem) scoreElem.textContent = place.score;
    if (levelElem) {
        levelElem.textContent = riskLevel;
        levelElem.style.color = color;
        levelElem.style.borderColor = color + '60';
    }
    if (gaugeElem) {
        gaugeElem.style.width = place.score + '%';
        gaugeElem.style.background = color;
    }

    const rainElem = document.getElementById('riskRain');
    const slopeElem = document.getElementById('riskSlope');
    const soilElem = document.getElementById('riskSoil');
    const probElem = document.getElementById('riskProbability');
    const predElem = document.getElementById('riskPrediction');
    const windowElem = document.getElementById('riskWindow');

    if (rainElem) rainElem.textContent = place.rain + ' mm';
    if (slopeElem) slopeElem.textContent = place.slope + '°';
    if (soilElem) soilElem.textContent = place.soil + '%';
    if (probElem) probElem.textContent = place.probability + '%';
    if (windowElem) windowElem.textContent = place.window;

    if (predElem) {
        predElem.textContent = place.score > 70 ? 'CRITICAL HAZARD' : place.score > 35 ? 'MODERATE WATCH' : 'LOW RISK';
        predElem.style.color = color;
    }

    // Geotechnical sensitivities
    const sensRain = document.getElementById('sensRain');
    const sensSlope = document.getElementById('sensSlope');
    const sensPore = document.getElementById('sensPore');
    const sensVerdict = document.getElementById('sensVerdict');

    if (sensRain) sensRain.style.width = Math.min(100, Math.round((place.rain / 140) * 100)) + '%';
    if (sensSlope) sensSlope.style.width = Math.min(100, Math.round((place.slope / 45) * 100)) + '%';
    if (sensPore) sensPore.style.width = place.soil + '%';
    if (sensVerdict) {
        sensVerdict.textContent = place.score > 70 ? 'HIGH SUSCEPTIBILITY' : place.score > 35 ? 'MODERATE SUSCEPTIBILITY' : 'LOW SUSCEPTIBILITY';
        sensVerdict.style.color = color;
    }

    // Update time-series projection
    const timelineBar = document.getElementById('timelineBar');
    if (timelineBar) {
        timelineBar.style.width = place.score + '%';
        timelineBar.style.background = color;
    }
    const timelineVals = document.getElementById('timelineValues');
    if (timelineVals) {
        const s = place.score;
        timelineVals.innerHTML = `
            <span>${s}</span>
            <span>${Math.max(10, s - 6)}</span>
            <span>${Math.max(10, s - 13)}</span>
            <span>${Math.max(10, s - 19)}</span>
        `;
    }

    // Highlight card in directory
    document.querySelectorAll('.hotspot-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.id === place.id);
    });
}

// Global selection handler for markers and directory
window.selectLandslidePlace = function (placeId, openPopup = true) {
    activePlaceId = placeId;
    const entry = placeMarkerMap.get(placeId);
    if (!entry) return;

    const { marker, place } = entry;
    updateRiskPanel(place);

    // Sync region dropdown
    const regSelect = document.getElementById('regionSelector');
    if (regSelect) regSelect.value = placeId;

    // Fly to position
    map.flyTo(place.pos, 9.5, { duration: 1.0 });

    if (openPopup) {
        window.setTimeout(() => {
            marker.openPopup();
        }, 600);
    }
};

// ----------------------------------------------------------------------------
// 10. Landslide Hotspots Directory Component (Search & Category Filter)
// ----------------------------------------------------------------------------
const hotspotsListContainer = document.getElementById('hotspotsList');

function renderHotspotsDirectory(filterCategory = 'all', searchQuery = '') {
    if (!hotspotsListContainer) return;

    const query = searchQuery.trim().toLowerCase();
    const filtered = landslidePlaces.filter(place => {
        const matchesCategory = (filterCategory === 'all' || place.category === filterCategory);
        const matchesSearch = query === '' ||
            place.name.toLowerCase().includes(query) ||
            place.state.toLowerCase().includes(query) ||
            place.highway.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        hotspotsListContainer.innerHTML = `<div class="text-xs text-gray-500 text-center py-6">No matching landslide zones found.</div>`;
        return;
    }

    hotspotsListContainer.innerHTML = filtered.map(place => {
        const isSelected = place.id === activePlaceId;
        const colorClass = place.category.toLowerCase();
        const badgeColor = place.color;

        return `
            <div class="hotspot-card ${colorClass} ${isSelected ? 'selected' : ''}" data-id="${place.id}">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full" style="background:${badgeColor}"></span>
                            <b class="text-xs text-white">${place.name}</b>
                        </div>
                        <p class="text-[10px] text-gray-400 mt-0.5">${place.state} &bull; <span class="text-gray-300">${place.highway}</span></p>
                    </div>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full" style="background:${badgeColor}25;color:${badgeColor};border:1px solid ${badgeColor}40">
                        ${place.category}
                    </span>
                </div>
                <div class="flex justify-between items-center mt-2 pt-2 border-t border-slate-800 text-[10px] text-gray-400">
                    <span>Rain: <b class="text-white">${place.rain}mm</b></span>
                    <span>Slope: <b class="text-white">${place.slope}&deg;</b></span>
                    <span>Score: <b style="color:${badgeColor}">${place.score}/100</b></span>
                    <button class="text-sky-400 hover:text-white font-semibold flex items-center gap-1">
                        View &rarr;
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Bind click events on cards
    hotspotsListContainer.querySelectorAll('.hotspot-card').forEach(card => {
        card.addEventListener('click', () => {
            selectLandslidePlace(card.dataset.id, true);
        });
    });
}

// Directory category filter buttons
const dirFilterButtons = document.querySelectorAll('.dir-filter-btn');
let currentDirCategory = 'all';

dirFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        dirFilterButtons.forEach(b => {
            b.classList.remove('bg-emerald-600', 'text-white');
            b.classList.add('bg-slate-800');
        });
        btn.classList.add('bg-emerald-600', 'text-white');
        btn.classList.remove('bg-slate-800');
        currentDirCategory = btn.dataset.dirFilter;
        const searchInput = document.getElementById('hotspotSearch');
        renderHotspotsDirectory(currentDirCategory, searchInput ? searchInput.value : '');
    });
});

// Search input listener
const searchInput = document.getElementById('hotspotSearch');
if (searchInput) {
    searchInput.addEventListener('input', e => {
        renderHotspotsDirectory(currentDirCategory, e.target.value);
    });
}

// ----------------------------------------------------------------------------
// 10.1 Highway Lifelines & Road Blockages Directory Component
// ----------------------------------------------------------------------------
const roadsListContainer = document.getElementById('roadsList');
let currentRoadFilter = 'all';

function renderRoadsDirectory(filterCategory = 'all', searchQuery = '') {
    if (!roadsListContainer) return;

    const query = searchQuery.trim().toLowerCase();
    const filtered = roads.filter(road => {
        const matchesCategory = (filterCategory === 'all' ||
            (filterCategory === 'CRITICAL' && road.blockageSeverity === 'CRITICAL') ||
            (filterCategory === 'RESTRICTED' && road.blockageSeverity === 'RESTRICTED') ||
            (filterCategory === 'SAFE' && road.blockageSeverity === 'SAFE') ||
            road.risk === filterCategory);

        const matchesSearch = query === '' ||
            road.name.toLowerCase().includes(query) ||
            road.highwayCode.toLowerCase().includes(query) ||
            road.state.toLowerCase().includes(query) ||
            road.status.toLowerCase().includes(query) ||
            road.blockage.toLowerCase().includes(query) ||
            road.alternative.toLowerCase().includes(query) ||
            road.agency.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        roadsListContainer.innerHTML = `
            <div class="text-xs text-gray-500 text-center py-8">
                <i data-lucide="route" class="w-8 h-8 mx-auto mb-2 opacity-50 text-gray-400"></i>
                <p>No matching highway corridors found.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    roadsListContainer.innerHTML = filtered.map(road => {
        const isCrit = road.blockageSeverity === 'CRITICAL';
        const isRest = road.blockageSeverity === 'RESTRICTED';
        const statusBadgeColor = isCrit ? '#ef4444' : isRest ? '#f59e0b' : '#10b981';
        const statusIcon = isCrit ? '⛔' : isRest ? '⚠️' : '🟢';
        const cardClass = isCrit ? 'critical' : isRest ? 'restricted' : 'safe';

        return `
            <div class="road-card ${cardClass}" id="roadCard-${road.id}">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="text-base">${statusIcon}</span>
                        <div>
                            <h4 class="text-xs font-bold text-white leading-tight">${road.name}</h4>
                            <p class="text-[10px] text-gray-400">${road.state} &bull; <span class="text-cyan-400 font-semibold">${road.agency}</span></p>
                        </div>
                    </div>
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style="background:${statusBadgeColor}20;color:${statusBadgeColor};border:1px solid ${statusBadgeColor}50">
                        ${road.status}
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-gray-300 mt-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <div>
                        <span class="text-[9px] text-gray-400 uppercase font-semibold block">Obstruction / Status</span>
                        <p class="text-gray-200 mt-0.5 leading-snug">${road.blockage}</p>
                    </div>
                    <div>
                        <span class="text-[9px] text-yellow-400 uppercase font-semibold block">Clearance / Traffic Advisory</span>
                        <p class="text-gray-200 mt-0.5 leading-snug">${road.clearingEta}</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px]">
                    <div class="flex items-center gap-1.5 min-w-0 text-emerald-400">
                        <i data-lucide="corner-up-right" class="w-3.5 h-3.5 flex-shrink-0"></i>
                        <span class="truncate"><b>Detour:</b> ${road.alternative}</span>
                    </div>
                    <button class="px-2.5 py-1 bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 rounded border border-sky-500/40 text-[10px] font-semibold transition flex items-center gap-1 flex-shrink-0" onclick="window.focusRoad('${road.id}')">
                        <i data-lucide="crosshair" class="w-3 h-3"></i> Inspect on Map
                    </button>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

// Road filter buttons
const roadFilterButtons = document.querySelectorAll('.road-filter-btn');
roadFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        roadFilterButtons.forEach(b => {
            b.classList.remove('bg-sky-600', 'text-white');
            b.classList.add('bg-slate-800');
        });
        btn.classList.add('bg-sky-600', 'text-white');
        btn.classList.remove('bg-slate-800');
        currentRoadFilter = btn.dataset.roadFilter;
        const searchInput = document.getElementById('roadSearch');
        renderRoadsDirectory(currentRoadFilter, searchInput ? searchInput.value : '');
    });
});

// Road search listener
const roadSearchInput = document.getElementById('roadSearch');
if (roadSearchInput) {
    roadSearchInput.addEventListener('input', e => {
        renderRoadsDirectory(currentRoadFilter, e.target.value);
    });
}

// ----------------------------------------------------------------------------
// 11. Populate Quick Select NER Zone Dropdown
// ----------------------------------------------------------------------------
const regionDropdown = document.getElementById('regionSelector');
if (regionDropdown) {
    regionDropdown.innerHTML = landslidePlaces.map(place => {
        const emoji = place.category === 'CRITICAL' ? '🔴' : place.category === 'WATCH' ? '🟡' : '🟢';
        return `<option value="${place.id}">${emoji} ${place.name} (${place.state})</option>`;
    }).join('');

    regionDropdown.addEventListener('change', event => {
        selectLandslidePlace(event.target.value, true);
    });
}

// ----------------------------------------------------------------------------
// 12. Interactive Rainfall Hazard Simulator
// ----------------------------------------------------------------------------
const rainfallSlider = document.getElementById('rainfallSlider');
const rainfallVal = document.getElementById('rainfallVal');
const simRiskTier = document.getElementById('simRiskTier');
const simRiskDot = document.getElementById('simRiskDot');
const simRiskScore = document.getElementById('simRiskScore');
const simSeveredRoads = document.getElementById('simSeveredRoads');

function updateSimulator(rainfall) {
    if (rainfallVal) rainfallVal.textContent = rainfall + ' mm';

    // Find active place or default to Gangtok
    const activePlace = landslidePlaces.find(p => p.id === activePlaceId) || landslidePlaces[0];

    // Compute dynamic model score
    const slope = activePlace.slope;
    const soil = Math.min(100, Math.round(activePlace.soil * 0.5 + (rainfall / 150) * 50));
    const dynamicScore = Math.min(100, Math.max(15, Math.round(0.48 * rainfall + 0.32 * slope + 0.20 * soil)));
    const dynamicRisk = getLevel(dynamicScore);
    const color = levelColors[dynamicRisk];

    if (simRiskTier) {
        simRiskTier.style.color = color;
        simRiskTier.innerHTML = `<span id="simRiskDot" class="w-3 h-3 rounded-full inline-block mr-1" style="background:${color}"></span> ${dynamicRisk === 'CRITICAL' ? 'CRITICAL ALERT' : dynamicRisk === 'WATCH' ? 'ADVISORY WATCH' : 'SAFE'}`;
    }
    if (simRiskScore) {
        simRiskScore.textContent = `(${dynamicScore}/100)`;
    }

    if (simSeveredRoads) {
        const corridors = rainfall > 110 ? '2 Corridors' : rainfall > 50 ? '1 Corridor' : '0 Corridors';
        simSeveredRoads.textContent = corridors;
    }

    // Refresh active panel with simulated values
    const simulatedPlace = {
        ...activePlace,
        score: dynamicScore,
        rain: rainfall,
        soil: soil,
        probability: Math.min(99, Math.max(5, dynamicScore - 4)),
        category: dynamicRisk,
        color: color
    };
    updateRiskPanel(simulatedPlace);
}

if (rainfallSlider) {
    rainfallSlider.addEventListener('input', e => {
        updateSimulator(Number(e.target.value));
    });
}

const resetSimBtn = document.getElementById('resetSimulator');
if (resetSimBtn && rainfallSlider) {
    resetSimBtn.addEventListener('click', () => {
        rainfallSlider.value = 45;
        updateSimulator(45);
    });
}

// ----------------------------------------------------------------------------
// 13. Precipitation Forecast Chart Setup
// ----------------------------------------------------------------------------
const forecastValues = [45, 62, 78, 105, 132];
const chartX = [20, 135, 250, 365, 480];
const chartPoints = forecastValues.map((val, i) => `${chartX[i]},${95 - (val / 132 * 70)}`).join(' ');

const fLine = document.getElementById('forecastLine');
if (fLine) fLine.setAttribute('points', chartPoints);

const fPoints = document.getElementById('forecastPoints');
if (fPoints) {
    fPoints.innerHTML = forecastValues.map((val, i) => `
        <circle cx="${chartX[i]}" cy="${95 - (val / 132 * 70)}" r="4" fill="#38bdf8" stroke="#0f172a" stroke-width="2">
            <title>${val} mm</title>
        </circle>
    `).join('');
}

const fLabels = document.getElementById('forecastLabels');
if (fLabels) {
    fLabels.innerHTML = forecastValues.map((val, i) => `
        <text x="${chartX[i]}" y="108" fill="#94a3b8" font-size="11" text-anchor="middle">
            ${['Now', '+3h', '+6h', '+12h', '+24h'][i]}
        </text>
    `).join('');
}

// ----------------------------------------------------------------------------
// 14. Toast Notification Engine
// ----------------------------------------------------------------------------
const incidentToast = document.getElementById('incidentToast');
function showToast(message) {
    if (!incidentToast) return;
    incidentToast.textContent = message;
    incidentToast.classList.add('visible');
    window.setTimeout(() => incidentToast.classList.remove('visible'), 3200);
}

// ----------------------------------------------------------------------------
// 15. Citizen Hazard Reporting Engine (AI Verified Field Observations)
// ----------------------------------------------------------------------------
const sampleReports = [
    {
        location: 'Gangtok 29th Mile NH-10',
        type: 'Active Landslide / Debris Fall',
        severity: 'HIGH',
        desc: 'New tension crack opened across uphill carriageway. Boulders rolling down.',
        pos: [27.2400, 88.5400],
        time: '18 mins ago'
    },
    {
        location: 'Kurseong Dow Hill Road',
        type: 'Road Surface Fissure / Cracks',
        severity: 'MODERATE',
        desc: 'Cracks widening by 15mm after morning heavy rain. Light vehicles passing slowly.',
        pos: [26.8800, 88.2800],
        time: '45 mins ago'
    }
];

function addCitizenReportToMap(report, isNew = false) {
    const reportIcon = L.divIcon({
        className: 'citizen-report-icon',
        html: `
            <div style="background:#f97316;color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 14px rgba(249,115,22,0.85);border:2px solid #ffffff;font-size:14px;position:relative;cursor:pointer;">
                <span>⚠️</span>
                <span style="position:absolute;top:-3px;right:-3px;width:9px;height:9px;border-radius:50%;background:#ef4444;border:1px solid #ffffff;"></span>
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });

    const marker = L.marker(report.pos, { icon: reportIcon }).addTo(reportLayer);
    marker.bindPopup(`
        <div class="landslide-popup-card">
            <div class="flex items-center justify-between">
                <b class="text-orange-400 text-xs">📍 CITIZEN HAZARD REPORT</b>
                <span class="text-[9px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded font-bold">${report.severity}</span>
            </div>
            <div class="text-sm font-bold text-white mt-1">${report.location}</div>
            <div class="text-xs text-gray-300 mt-1"><b>Type:</b> ${report.type}</div>
            <p class="text-xs text-gray-400 mt-1 leading-relaxed">${report.desc}</p>
            <div class="mt-2 pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-gray-400">
                <span class="text-emerald-400 font-semibold">✓ AI Verified (94% Conf.)</span>
                <span>${report.time || 'Just now'}</span>
            </div>
        </div>
    `);

    if (isNew) {
        map.flyTo(report.pos, 10, { duration: 1.0 });
        setTimeout(() => marker.openPopup(), 1100);
    }
}

// Populate sample field observations
sampleReports.forEach(r => addCitizenReportToMap(r, false));

// Citizen Report Form Submission Handler
const reportForm = document.getElementById('citizenReportForm');
const reportAlert = document.getElementById('reportSuccessAlert');
const reportMsg = document.getElementById('reportSuccessMsg');

if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loc = document.getElementById('reportLocation').value.trim();
        const type = document.getElementById('reportType').value;
        const severity = document.getElementById('reportSeverity').value;
        const desc = document.getElementById('reportDescription').value.trim() || 'Ground observation submitted by community responder.';

        // Approximate coordinates near active landslide monitoring place
        const activePlace = landslidePlaces.find(p => p.id === activePlaceId) || landslidePlaces[0];
        const lat = activePlace.pos[0] + (Math.random() - 0.5) * 0.05;
        const lng = activePlace.pos[1] + (Math.random() - 0.5) * 0.05;

        const newReport = {
            location: loc,
            type: type,
            severity: severity,
            desc: desc,
            pos: [lat, lng],
            time: 'Just now'
        };

        addCitizenReportToMap(newReport, true);

        if (reportAlert && reportMsg) {
            reportMsg.innerHTML = `Your report for <b>"${loc}"</b> has been AI-verified with high confidence, plotted live on the Leaflet map, and dispatched to local disaster management teams.`;
            reportAlert.classList.remove('hidden');
        }

        showToast(`📍 Citizen report for "${loc}" verified & plotted!`);

        // Re-initialize Lucide icons for any newly injected elements
        lucide.createIcons();

        // Reset the form
        reportForm.reset();
    });
}

// ----------------------------------------------------------------------------
// 16. Tab Switching (Landslide Directory vs Citizen Reporting)
// ----------------------------------------------------------------------------
const tabButtons = document.querySelectorAll('.tab-button');
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => {
            b.classList.remove('bg-emerald-600', 'text-white');
            b.classList.add('bg-slate-800', 'text-gray-400');
        });
        document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));

        btn.classList.add('bg-emerald-600', 'text-white');
        btn.classList.remove('bg-slate-800', 'text-gray-400');

        const targetView = document.getElementById(btn.dataset.tab);
        if (targetView) targetView.classList.add('active');
    });
});

// ----------------------------------------------------------------------------
// 17. Top Navigation Smooth Scrolling & Tab Activation
// ----------------------------------------------------------------------------
const navTargets = {
    map: '#mapContainer',
    risk: '#riskPanel',
    hotspots: '#hotspots',
    roadsPanel: '#roadsPanel',
    reportPanel: '#reportPanel'
};

document.querySelectorAll('.top-nav-item').forEach(button => {
    button.addEventListener('click', () => {
        const navKey = button.dataset.nav;
        const selector = navTargets[navKey];

        if (navKey === 'hotspots' || navKey === 'roadsPanel' || navKey === 'reportPanel') {
            const tabBtn = document.querySelector(`[data-tab="${navKey}"]`);
            if (tabBtn) tabBtn.click();
        }

        document.querySelectorAll('.top-nav-item').forEach(item => {
            item.classList.toggle('active', item === button);
            item.removeAttribute('aria-current');
        });
        button.setAttribute('aria-current', 'page');

        if (selector) {
            const targetEl = document.querySelector(selector);
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ----------------------------------------------------------------------------
// 18. Initial State Setup (Default Locked on User's Location)
// ----------------------------------------------------------------------------
renderHotspotsDirectory('all');
renderRoadsDirectory('all');
updateRiskPanel(landslidePlaces[0]);
setTimeout(() => {
    map.invalidateSize();
    locateUser(true); // Default map view: locked directly on the user's location
}, 300);