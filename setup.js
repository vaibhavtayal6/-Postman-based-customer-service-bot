const fs = require('fs');
const path = require('path');

// Create directories
const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Create an HTML file with a basic SVG for each product
const products = [
    {
        name: 'street-light',
        color: '#FFC107',
        title: 'Solar Street Light'
    },
    {
        name: 'driveway-light',
        color: '#2196F3',
        title: 'Solar Driveway Light'
    },
    {
        name: 'wall-light',
        color: '#4CAF50',
        title: 'Solar Wall Light'
    }
];

products.forEach(product => {
    // Create an SVG as a placeholder image
    const svgContent = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="white"/>
        <rect x="10" y="10" width="280" height="180" fill="${product.color}" rx="15"/>
        <text x="150" y="100" font-family="Arial" font-size="18" text-anchor="middle" fill="white">${product.title}</text>
    </svg>`;
    
    fs.writeFileSync(path.join(imagesDir, `${product.name}.jpg`), svgContent);
    console.log(`Created placeholder image for ${product.name}`);
});

// Create index.html in public directory that redirects to our chat interface
const indexHtml = fs.readFileSync(path.join(__dirname, 'frontend.html'), 'utf8');
fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);

console.log('Setup complete! 🚀');