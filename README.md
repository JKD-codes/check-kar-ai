<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #1a202c; color: #e2e8f0; font-family: Arial, sans-serif; line-height: 1.6; padding: 40px;">
    <div style="max-width: 900px; margin-left: auto; margin-right: auto;">
        <h1 style="color: #4299e1; border-bottom: 2px solid #2d3748; padding-bottom: 8px;">
            <span style="color: #e2e8f0;">&#x1F50D;</span>Check-Kar AI Detector
        </h1>
        <p style="font-size: 18px; color: #a0aec0; margin-bottom: 24px;">
            A professional-grade, open-source tool built to analyze images for common artifacts and inconsistencies, distinguishing between human-made content and deepfakes or AI-generated imagery. It provides detailed technical breakdowns and confidence scores.
        </p>
        <p>
            Project Status: &#x1F7E2; <strong>Live and Deployed</strong>
        </p>
        <h2 style="color: #63b3ed; border-bottom: 1px solid #2d3748; padding-bottom: 4px;">&#x2728; Key Features</h2>
        <ul style="list-style-type: disc; margin-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>Core Technology:</strong> Powered by the <strong>Gemini 2.5 Flash</strong> model for sophisticated, multimodal visual analysis.</li>
            <li style="margin-bottom: 8px;"><strong>Forensic Analysis:</strong> Looks for specific artifacts, including anatomical inconsistencies, unnatural lighting, texture repetition, and diffusion artifacts.</li>
            <li style="margin-bottom: 8px;"><strong>Confidence Scoring:</strong> Provides a clear verdict (<code style="background-color: #2d3748; color: #f69999; padding: 2px 6px;">LIKELY_AI</code>, <code style="background-color: #2d3748; color: #a3bffa; padding: 2px 6px;">LIKELY_HUMAN</code>, <code style="background-color: #2d3748; color: #fcd34d; padding: 2px 6px;">UNCERTAIN</code>) with an associated confidence score.</li>
            <li style="margin-bottom: 8px;"><strong>Modern Frontend:</strong> Built with React (using TypeScript and Vite) for a fast, clean, and responsive user experience.</li>
            <li style="margin-bottom: 8px;"><strong>Secure Deployment:</strong> Deployed on Vercel with the API key securely stored as a server-side Environment Variable.</li>
        </ul>
        <h2 style="color: #63b3ed; border-bottom: 1px solid #2d3748; padding-bottom: 4px;">&#x1F517; Live Demo & Repository</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
                <tr>
                    <th style="background-color: #2d3748; padding: 12px; border: 1px solid #4a5568;">Type</th>
                    <th style="background-color: #2d3748; padding: 12px; border: 1px solid #4a5568;">Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 12px; border: 1px solid #4a5568;"><strong>Live URL</strong></td>
                    <td style="padding: 12px; border: 1px solid #4a5568;"><a href="https://check-kar-ai.vercel.app/" target="_blank" style="color: #4299e1;">https://check-kar-ai.vercel.app/</a></td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #4a5568;"><strong>GitHub Repo</strong></td>
                    <td style="padding: 12px; border: 1px solid #4a5568;"><a href="https://github.com/JKD-codes/check-kar-ai" target="_blank" style="color: #4299e1;">https://github.com/JKD-codes/check-kar-ai</a></td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #4a5568;"><strong>Deployment Platform</strong></td>
                    <td style="padding: 12px; border: 1px solid #4a5568;">Vercel</td>
                </tr>
            </tbody>
        </table>
        <h2 style="color: #63b3ed; border-bottom: 1px solid #2d3748; padding-bottom: 4px;">&#x1F4BB; Tech Stack</h2>
        <ul style="list-style-type: disc; margin-left: 20px;">
            <li style="margin-bottom: 8px;">React 19 / TypeScript</li>
            <li style="margin-bottom: 8px;">Vite</li>
            <li style="margin-bottom: 8px;">Standard HTML / CSS</li>
            <li style="margin-bottom: 8px;">Gemini 2.5 Flash</li>
        </ul>
        <h2 style="color: #63b3ed; border-bottom: 1px solid #2d3748; padding-bottom: 4px;">&#x2699;&#xFE0F; Local Setup and Installation</h2>
        <h3 style="color: #a0aec0;">Prerequisites</h3>
        <ul style="list-style-type: disc; margin-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>Node.js</strong> (version 18 or later)</li>
            <li style="margin-bottom: 8px;"><strong>npm</strong> or <strong>Yarn</strong></li>
            <li style="margin-bottom: 8px;"><strong>A Gemini API Key</strong> (Essential for running the analysis)</li>
        </ul>
        <h3 style="color: #a0aec0;">Installation & Run</h3>
        <ol style="list-style-type: decimal; margin-left: 20px;">
            <li><strong>Clone the Repository:</strong>
                <pre style="background-color: #2d3748; color: #63b3ed; padding: 16px;"><code>git clone https://github.com/JKD-codes/ai-detector
cd ai-detector</code></pre>
            </li>
            <li><strong>Install Dependencies:</strong>
                <pre style="background-color: #2d3748; color: #63b3ed; padding: 16px;"><code>npm install</code></pre>
            </li>
            <li><strong>Configure API Key:</strong> Create a new file named <code>.env.local</code> in the root directory and add your key:
                <pre style="background-color: #2d3748; color: #63b3ed; padding: 16px;"><code># .env.local
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY_HERE"</code></pre>
            </li>
            <li><strong>Run the App:</strong>
                <pre style="background-color: #2d3748; color: #63b3ed; padding: 16px;"><code>npm run dev</code></pre>
                The application will launch and be accessible at <code>http://localhost:3000</code>.
            </li>
        </ol>
        
   </div>
</body>
</html> 
