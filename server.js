const http = require('http');
const fs = require('fs');
const path = require('path');

// --- Talk Data ---
const talks = [
    {
        title: "The Future of JavaScript",
        speakers: ["Jane Doe"],
        category: ["JavaScript", "Future Tech"],
        description: "A deep dive into the next features of JavaScript and the future of the language."
    },
    {
        title: "Advanced CSS Techniques",
        speakers: ["John Smith"],
        category: ["CSS", "Frontend"],
        description: "Learn about modern CSS features like Grid, Flexbox, and custom properties."
    },
    {
        title: "Building Scalable APIs with Node.js",
        speakers: ["Emily White", "Mike Green"],
        category: ["Node.js", "Backend", "API"],
        description: "An in-depth look at patterns and practices for building robust and scalable APIs."
    },
    {
        title: "State Management in Modern Web Apps",
        speakers: ["Chris Blue"],
        category: ["JavaScript", "Frontend", "State Management"],
        description: "A comparative analysis of different state management libraries and patterns."
    },
    {
        title: "Introduction to Machine Learning with Python",
        speakers: ["Patricia Orange"],
        category: ["Python", "Machine Learning"],
        description: "A beginner-friendly introduction to the world of machine learning."
    },
    {
        title: "DevOps for Dummies",
        speakers: ["Leo Purple"],
        category: ["DevOps", "CI/CD"],
        description: "A guide to the principles of DevOps and how to implement a CI/CD pipeline."
    }
];

// --- Schedule Generation ---
function generateSchedule() {
    const schedule = [];
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

    for (let i = 0; i < talks.length; i++) {
        if (i === 3) { // Lunch break after the 3rd talk
            schedule.push({
                title: "Lunch Break",
                startTime: new Date(currentTime),
                endTime: new Date(currentTime.getTime() + 60 * 60 * 1000),
                isBreak: true
            });
            currentTime.setTime(currentTime.getTime() + 60 * 60 * 1000);
        }

        const talk = talks[i];
        schedule.push({
            ...talk,
            startTime: new Date(currentTime),
            endTime: new Date(currentTime.getTime() + 60 * 60 * 1000)
        });

        currentTime.setTime(currentTime.getTime() + 60 * 60 * 1000 + 10 * 60 * 1000); // 1 hour talk + 10 min break
    }
    return schedule;
}

const schedule = generateSchedule();

// --- Server --- 
const server = http.createServer((req, res) => {
    if (req.url === '/api/talks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(schedule));
    } else {
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
