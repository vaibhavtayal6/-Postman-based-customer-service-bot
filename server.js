// Required packages
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Sample database
const database = {
    company: {
        name: "ABC Lighting Corp",
        locations: [
            {
                address: "123 Solar Blvd, Sun City",
                phone: "555-123-4567"
            },
            {
                address: "456 Lighting Ave, Bright Town",
                phone: "555-987-6543"
            }
        ],
        businessHours: "Monday to Friday, 9 AM to 6 PM",
        about: "ABC Lighting Corp is a leading provider of solar-powered lighting solutions for residential and commercial use. We specialize in sustainable outdoor lighting options that are environmentally friendly and cost-effective."
    },
    products: {
        "street-light": {
            name: "Solar Powered Street Light",
            height: "10 ft",
            batteryLife: "12 hours",
            range: "30 ft diameter",
            features: [
                "Motion sensor activation",
                "Weatherproof IP68 rating",
                "Dusk-to-dawn operation",
                "Die-cast aluminum housing"
            ],
            price: "$299.99",
            warranty: "5 years",
            imageUrl: "/images/street-light.jpg"
        },
        "driveway-light": {
            name: "Solar Powered Driveway Light",
            height: "3 ft",
            batteryLife: "10 hours",
            range: "20 ft diameter",
            features: [
                "Automatic on/off",
                "Weatherproof IP65 rating",
                "Adjustable brightness",
                "Easy installation"
            ],
            price: "$149.99",
            warranty: "3 years",
            imageUrl: "/images/driveway-light.jpg"
        },
        "wall-light": {
            name: "Solar Powered Outside Wall Light",
            dimensions: "8 inches × 6 inches × 4 inches",
            batteryLife: "8 hours",
            lightColor: "Warm white",
            features: [
                "Weatherproof IP67 rating",
                "180° illumination angle",
                "No wiring required",
                "Adjustable mounting bracket"
            ],
            price: "$89.99",
            warranty: "2 years",
            imageUrl: "/images/wall-light.jpg"
        }
    },
    // Store user conversations and contact information
    conversations: []
};

// API Routes

// Get company information
app.get('/api/company-info', (req, res) => {
    res.json(database.company);
});

// Get all products
app.get('/api/products', (req, res) => {
    res.json(database.products);
});

// Get specific product information
app.get('/api/products/:productName', (req, res) => {
    const productName = req.params.productName;
    
    if (database.products[productName]) {
        res.json(database.products[productName]);
    } else {
        res.status(404).json({ error: "Product not found" });
    }
});

// Get product image URL
app.get('/api/product-image/:productName', (req, res) => {
    const productName = req.params.productName;
    
    if (database.products[productName] && database.products[productName].imageUrl) {
        res.json({ imageUrl: database.products[productName].imageUrl });
    } else {
        res.status(404).json({ error: "Product image not found" });
    }
});

// Chat endpoint to handle conversations
app.post('/api/chat', (req, res) => {
    const { message, sessionId } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    
    // Process the message and determine the intent
    const response = processMessage(message);
    
    // Store the conversation
    if (!sessionId) {
        // Generate a new session ID for new conversations
        const newSessionId = Date.now().toString();
        database.conversations.push({
            sessionId: newSessionId,
            messages: [
                { role: "user", content: message },
                { role: "bot", content: response.message }
            ]
        });
        
        return res.json({
            message: response.message,
            followUp: response.followUp,
            sessionId: newSessionId,
            data: response.data
        });
    } else {
        // Find existing conversation
        const conversation = database.conversations.find(conv => conv.sessionId === sessionId);
        
        if (conversation) {
            conversation.messages.push(
                { role: "user", content: message },
                { role: "bot", content: response.message }
            );
        } else {
            database.conversations.push({
                sessionId,
                messages: [
                    { role: "user", content: message },
                    { role: "bot", content: response.message }
                ]
            });
        }
        
        return res.json({
            message: response.message,
            followUp: response.followUp,
            sessionId,
            data: response.data
        });
    }
});

// Save contact information
app.post('/api/contact', (req, res) => {
    const { name, email, phone, sessionId } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }
    
    // Find the conversation and add contact info
    const conversation = database.conversations.find(conv => conv.sessionId === sessionId);
    
    if (conversation) {
        conversation.contactInfo = { name, email, phone };
        return res.json({ 
            success: true,
            message: `Thank you ${name}, we have saved your contact information. Our team will reach out to you soon!`
        });
    } else {
        return res.status(404).json({ error: "Conversation not found" });
    }
});

// Message processing function
function processMessage(message) {
    message = message.toLowerCase();
    
    // Check for company information intent
    if (message.includes("company") || message.includes("about") || message.includes("abc lighting")) {
        return {
            message: `${database.company.name} is a leading provider of solar-powered lighting solutions. We have two locations: ${database.company.locations[0].address} and ${database.company.locations[1].address}. Our business hours are ${database.company.businessHours}.`,
            followUp: "Is there anything specific about our company you'd like to know?",
            data: database.company
        };
    }
    
    // Check for location intent
    if (message.includes("location") || message.includes("address") || message.includes("where")) {
        return {
            message: `We have two locations: 1. ${database.company.locations[0].address} (Phone: ${database.company.locations[0].phone}) and 2. ${database.company.locations[1].address} (Phone: ${database.company.locations[1].phone}).`,
            followUp: "Would you like to know more about our products?",
            data: database.company.locations
        };
    }
    
    // Check for business hours intent
    if (message.includes("hours") || message.includes("time") || message.includes("open")) {
        return {
            message: `Our business hours are ${database.company.businessHours}.`,
            followUp: "Is there anything else I can help you with?",
            data: { businessHours: database.company.businessHours }
        };
    }
    
    // Check for product catalog intent
    if (message.includes("products") || message.includes("catalog") || message.includes("what do you sell")) {
        return {
            message: "We offer three main products: Solar Powered Street Light, Solar Powered Driveway Light, and Solar Powered Outside Wall Light.",
            followUp: "Would you like to know more about any specific product?",
            data: Object.keys(database.products).map(key => database.products[key].name)
        };
    }
    
    // Check for street light intent
    if (message.includes("street light") || message.includes("streetlight")) {
        const product = database.products["street-light"];
        return {
            message: `Our ${product.name} is ${product.height} tall with a battery life of ${product.batteryLife}. It illuminates an area of ${product.range} and costs ${product.price}. Features include: ${product.features.join(", ")}.`,
            followUp: "Would you like to see an image of the street light or know about other products?",
            data: product
        };
    }
    
    // Check for driveway light intent
    if (message.includes("driveway") || message.includes("drive way")) {
        const product = database.products["driveway-light"];
        return {
            message: `Our ${product.name} is ${product.height} tall with a battery life of ${product.batteryLife}. It illuminates an area of ${product.range} and costs ${product.price}. Features include: ${product.features.join(", ")}.`,
            followUp: "Would you like to see an image of the driveway light or know about other products?",
            data: product
        };
    }
    
    // Check for wall light intent
    if (message.includes("wall") || message.includes("outside light")) {
        const product = database.products["wall-light"];
        return {
            message: `Our ${product.name} has dimensions of ${product.dimensions} with a battery life of ${product.batteryLife}. It emits a ${product.lightColor} glow and costs ${product.price}. Features include: ${product.features.join(", ")}.`,
            followUp: "Would you like to see an image of the wall light or know about other products?",
            data: product
        };
    }
    
    // Check for image intent
    if (message.includes("image") || message.includes("picture") || message.includes("show me")) {
        let productName = null;
        if (message.includes("street")) productName = "street-light";
        else if (message.includes("driveway")) productName = "driveway-light";
        else if (message.includes("wall")) productName = "wall-light";
        
        if (productName) {
            return {
                message: `Here's an image of our ${database.products[productName].name}:`,
                followUp: "Is there anything else you'd like to know about this product?",
                data: { imageUrl: database.products[productName].imageUrl }
            };
        }
    }

    // Check for ending conversation
    if (message.includes("no") || message.includes("that's all") || message.includes("goodbye")) {
        return {
            message: "Before you go, I'd like to collect your contact information for our records.",
            followUp: "Could you please provide your name, email, and phone number?",
            data: { endConversation: true }
        };
    }
    
    // Default response
    return {
        message: "I'm here to help with information about ABC Lighting Corp and our solar-powered lighting products.",
        followUp: "Would you like to know about our company, locations, business hours, or specific products?",
        data: null
    };
}

// Create public directory for storing images
if (!fs.existsSync('./public/images')) {
    fs.mkdirSync('./public/images', { recursive: true });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;