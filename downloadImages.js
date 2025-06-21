const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    {
        url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f',
        filename: 'watch1.jpg',
        category: 'watches'
    },
    {
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        filename: 'watch2.jpg',
        category: 'watches'
    },
    {
        url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
        filename: 'watch3.jpg',
        category: 'watches'
    },
    {
        url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
        filename: 'jewelry1.jpg',
        category: 'jewelry'
    },
    {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
        filename: 'jewelry2.jpg',
        category: 'jewelry'
    },
    {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
        filename: 'bag1.jpg',
        category: 'bags'
    },
    {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
        filename: 'bag2.jpg',
        category: 'bags'
    },
    {
        url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
        filename: 'sunglasses1.jpg',
        category: 'sunglasses'
    },
    {
        url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
        filename: 'sunglasses2.jpg',
        category: 'sunglasses'
    }
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                const filePath = path.join(__dirname, '../images/products', filename);
                const fileStream = fs.createWriteStream(filePath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Downloaded: ${filename}`);
                    resolve();
                });
            } else {
                reject(`Failed to download ${filename}: ${response.statusCode}`);
            }
        }).on('error', (err) => {
            reject(`Error downloading ${filename}: ${err.message}`);
        });
    });
};

const downloadAllImages = async () => {
    try {
        for (const image of images) {
            await downloadImage(image.url, image.filename);
        }
        console.log('All images downloaded successfully!');
    } catch (error) {
        console.error('Error downloading images:', error);
    }
};

downloadAllImages(); 