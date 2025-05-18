// Initialize the projection and map when the page loads
document.addEventListener('DOMContentLoaded', initMap);

let secondHemisphereOpacity = 0.5;
let primaryRotation = [-67, 0]; // [longitude, latitude]
let secondaryRotation = [-67, 180]; // Antipode of primary

function initMap() {
    // Get the dimensions of the window
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Create SVG element
    const svg = d3.select('#map')
        .attr('width', width)
        .attr('height', height);
    
    // Clear any existing content
    svg.selectAll('*').remove();
    
    // Create groups for each hemisphere
    const primaryGroup = svg.append('g').attr('id', 'primary-hemisphere');
    const secondaryGroup = svg.append('g')
        .attr('id', 'secondary-hemisphere')
        .style('opacity', secondHemisphereOpacity);
    
    // Create gnomonic projections
    const primaryProjection = d3.geoGnomonic()
        .scale(width / 30)
        .center([0, 0])
        .rotate(primaryRotation)
        .clipAngle(90 - 1e-4)
        .translate([width / 2, height / 2]);
    
    const secondaryProjection = d3.geoGnomonic()
        .scale(width / 30)
        .center([0, 0])
        .rotate(secondaryRotation)
        .clipAngle(90 - 1e-4)
        .reflectX(true)
        .translate([width / 2, height / 2]);
    
    // Create path generators
    const primaryPath = d3.geoPath().projection(primaryProjection);
    const secondaryPath = d3.geoPath().projection(secondaryProjection);
    
    // Create projections and load data
    Promise.all([
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    ]).then(([worldData]) => {
        // Add ocean backgrounds
        primaryGroup.append('rect')
            .attr('class', 'ocean-primary')
            .attr('width', width)
            .attr('height', height);
        
        secondaryGroup.append('rect')
            .attr('class', 'ocean-secondary')
            .attr('width', width)
            .attr('height', height);
        
        // Convert TopoJSON to GeoJSON
        const countries = topojson.feature(worldData, worldData.objects.countries);
        
        // Draw countries for primary hemisphere
        primaryGroup.selectAll('.country-primary')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('class', 'country-primary')
            .attr('d', primaryPath);
        
        // Draw countries for secondary hemisphere
        secondaryGroup.selectAll('.country-secondary')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('class', 'country-secondary')
            .attr('d', secondaryPath);
        
        // Add graticules
        const graticule = d3.geoGraticule();
        
        primaryGroup.append('path')
            .datum(graticule)
            .attr('class', 'graticule-primary')
            .attr('d', primaryPath);
        
        secondaryGroup.append('path')
            .datum(graticule)
            .attr('class', 'graticule-secondary')
            .attr('d', secondaryPath);
        
        // Add outlines of the Earth
        primaryGroup.append('path')
            .datum({type: 'Sphere'})
            .attr('class', 'sphere-primary')
            .attr('d', primaryPath);
        
        secondaryGroup.append('path')
            .datum({type: 'Sphere'})
            .attr('class', 'sphere-secondary')
            .attr('d', secondaryPath);
        
        // Add hemisphere labels
        addHemisphereLabels(primaryGroup, secondaryGroup, width, height);
    });
    
    // Set up controls
    setupControls();
}

function addHemisphereLabels(primaryGroup, secondaryGroup, width, height) {
    // Primary hemisphere label
    primaryGroup.append('text')
        .attr('class', 'hemisphere-label')
        .attr('x', 20)
        .attr('y', 30)
        .text(`Primary: ${formatCoordinates(primaryRotation[0], primaryRotation[1])}`)
        .style('font-size', '14px')
        .style('font-weight', 'bold');
    
    // Secondary hemisphere label
    secondaryGroup.append('text')
        .attr('class', 'hemisphere-label')
        .attr('x', width - 260)
        .attr('y', 30)
        .text(`Secondary: ${formatCoordinates(secondaryRotation[0], secondaryRotation[1])}`)
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#1c567a');
}

function formatCoordinates(lon, lat) {
    const lonDir = lon >= 0 ? 'E' : 'W';
    const latDir = lat >= 0 ? 'N' : 'S';
    return `${Math.abs(lon)}° ${lonDir}, ${Math.abs(lat)}° ${latDir}`;
}

function setupControls() {
    // Opacity slider
    d3.select('#opacity-slider').on('input', function() {
        secondHemisphereOpacity = +this.value;
        d3.select('#secondary-hemisphere').style('opacity', secondHemisphereOpacity);
    });
    
    // Toggle button
    d3.select('#toggle-hemispheres').on('click', function() {
        // Swap rotations
        const temp = primaryRotation;
        primaryRotation = secondaryRotation;
        secondaryRotation = temp;
        
        // Redraw map
        initMap();
    });
    
    // Set initial opacity
    d3.select('#opacity-slider').property('value', secondHemisphereOpacity);
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    initMap();
}, 250));

// Debounce function to limit how often a function can run
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}
