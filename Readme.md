🏢 Smart Office Automation System
Built for the IUT Robotics Hackathon

📖 Project Overview
The Smart Office Automation System is a full-stack IoT simulator designed to monitor and control an enterprise environment in real time. It simulates an office with three separate rooms and 15 distinct devices (lights and fans).

Powered by a unified Node.js backend that acts as the central source of truth, the system instantly synchronizes live power consumption and hardware states across two interactive platforms:

A 3D Web Dashboard: Built with Three.js, allowing users to view the office layout, manually toggle devices on/off, and watch the 3D environment react dynamically with spinning fans and glowing lights.
A Discord Bot: A custom integration that allows users to remotely monitor the office's active devices and total wattage using simple chat commands.
✨ Key Features
Interactive 3D Visualization: A single-floor architectural view with live lighting and rotational physics.
Discord Integration: Remote server monitoring using bot commands (e.g., !status, !usage).
Live Power Tracking: Automatically calculates and displays real-time wattage based on active devices.
Instant Manual Override: Click any device on the web dashboard to instantly toggle its state, updating the 3D scene, the activity log, and the backend simultaneously.
⚙️ Installation Instructions
To run this project locally, you will need Node.js installed on your machine.

Clone the repository:
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
