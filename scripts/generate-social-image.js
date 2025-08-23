#!/usr/bin/env node

// This script creates a social media image for better sharing
// Since we can't use external image generation libraries easily,
// we'll create a simple HTML canvas approach

import fs from 'fs';
import path from 'path';

const socialImageHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #ec4899 0%, #be185d 50%, #831843 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .background-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            background-image: 
                radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
            background-size: 50px 50px;
        }
        
        .content {
            text-align: center;
            z-index: 2;
            max-width: 800px;
            padding: 40px;
        }
        
        .logo {
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .logo-text {
            font-size: 48px;
        }
        
        h1 {
            font-size: 48px;
            font-weight: 700;
            margin: 0 0 20px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: -1px;
        }
        
        .tagline {
            font-size: 24px;
            font-weight: 300;
            margin: 0 0 30px 0;
            opacity: 0.95;
        }
        
        .services {
            font-size: 18px;
            font-weight: 400;
            opacity: 0.9;
        }
        
        .nail-icons {
            position: absolute;
            top: 50px;
            right: 50px;
            font-size: 40px;
            opacity: 0.3;
        }
        
        .nail-icons-left {
            position: absolute;
            bottom: 50px;
            left: 50px;
            font-size: 40px;
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <div class="background-pattern"></div>
    
    <div class="nail-icons">💅✨</div>
    <div class="nail-icons-left">🌸💎</div>
    
    <div class="content">
        <div class="logo">
            <div class="logo-text">💅</div>
        </div>
        
        <h1>Polished Perfection</h1>
        <div class="tagline">Professional Nail Artistry & Beauty Services</div>
        <div class="services">Gel Nails • Nail Art • Manicures • Pedicures • Custom Designs</div>
    </div>
</body>
</html>
`;

// Write the HTML file for manual screenshot
fs.writeFileSync('static/social-preview.html', socialImageHTML);

console.log('✅ Social media preview HTML created at static/social-preview.html');
console.log('📸 To create a PNG image:');
console.log('   1. Open static/social-preview.html in your browser');
console.log('   2. Take a screenshot (1200x630)');
console.log('   3. Save as static/social-image.png');
console.log('   4. Update app.html to use the PNG file');