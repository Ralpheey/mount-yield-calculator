# Mount Yield Calculator

A sophisticated tool for calculating optimal sheet layout and yield for mounting boards with apertures. Features advanced mixed-orientation packing algorithms and aperture nesting optimization.

## Features

- **Mixed Orientation Packing**: Automatically finds the best combination of normal and rotated mount orientations
- **Aperture Nesting**: Detects when smaller mounts can be cut from larger mounts' aperture waste
- **Complete Layout Visualization**: Shows exactly how mounts will be arranged on each sheet
- **Yield Optimization**: Compares multiple packing strategies to maximize material utilization
- **Multi-Unit Support**: Work in millimeters, centimeters, or inches
- **Cost Calculation**: Automatically calculates total sheet cost and material efficiency

## How to Use

1. **Configure Sheet**: Enter your sheet dimensions, gutters, and price
2. **Add Mounts**: Define each mount type with outer dimensions and apertures
3. **Set Quantities**: Specify how many of each mount you need
4. **Calculate**: Click "Calculate Yield" to see optimized layout and results

## Advanced Features

### Mixed Orientation Strategies
- **Normal-First**: Fill with normal orientation, then rotated in gaps
- **Rotated-First**: Fill with rotated orientation, then normal in gaps  
- **Alternating Rows**: Mix orientations by rows for optimal space usage
- **Column-Mixed**: Arrange entire columns in different orientations

### Aperture Nesting
Automatically detects when smaller mounts can be cut from larger mounts' aperture waste material, significantly reducing required sheets.

### Layout Visualization
- Complete sheet layout showing all mounts
- Rotation indicators (↻ for rotated mounts)
- Mixed orientation symbols (◐ for mixed layouts)
- Aperture visualization with nesting indicators
- Safety gutter visualization

## Technical Details

Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and performance.

## Live Demo

[Insert your GitHub Pages URL here after deployment]

## Development

To run locally, simply open `index.html` in any modern web browser.

## Feedback

This tool is actively being improved based on user feedback. Please test thoroughly and report any issues or suggestions. 