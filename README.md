# Dual Hemisphere Gnomonic Earth Projection

A web application that displays the Earth using two overlaid gnomonic projections, allowing for visualization of the entire globe while preserving the unique properties of gnomonic projections.

## Features

- Interactive dual hemisphere visualization with adjustable opacity
- Ability to toggle between primary and secondary hemispheres
- Responsive design that fills the browser window
- Clear visual differentiation between the two hemispheres
- Country borders, graticules, and sphere outlines

## Installation

1. Ensure you have Node.js installed
2. Clone this repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open your browser to `http://localhost:8080`

## Usage

- Use the opacity slider to adjust the visibility of the secondary hemisphere
- Click the "Toggle Hemispheres" button to swap primary and secondary views
- The browser window will display both projections overlaid on top of each other

## About Gnomonic Projections

The gnomonic projection has several fascinating mathematical properties:

1. **Antipodal Points**: In our dual projection, antipodes (points directly opposite each other on the globe) are overlaid on top of each other when the hemispheres are centered at opposite points.

2. **Great Circle Paths**: Any straight line drawn on a gnomonic projection represents a great circle path on the Earth - the shortest distance between two points on a sphere. This makes it valuable for navigation and understanding global distance relationships.

3. **Distortion**: Areas far from the center of projection are significantly distorted, which is why a single gnomonic projection can show less than half the Earth at once. Our dual projection solves this by combining two complementary views.

4. **Perspective**: The gnomonic projection can be visualized as projecting the Earth onto a plane from its center point, as if using a light source at the center of the Earth.

## Limitations

- Even with dual projections, distortion is significant toward the edges
- The transition between hemispheres can be visually complex
- Gnomonic projections don't preserve area, shape, or distance (except along great circles)

## References

- [D3 Gnomonic Projection Example](https://observablehq.com/@d3/gnomonic)
- [D3.js Library](https://d3js.org/)
- [TopoJSON](https://github.com/topojson/topojson)
- [World Atlas TopoJSON](https://github.com/topojson/world-atlas)

## License

MIT
