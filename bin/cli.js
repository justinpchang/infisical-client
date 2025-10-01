#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_DIR = join(__dirname, '..');
const ENV_FILE = join(PROJECT_DIR, '.env');
const PORT = 8394;
const URL = `http://localhost:${PORT}`;

console.log('🔐 Infisical Client\n');

// Check if .env file exists
if (!existsSync(ENV_FILE)) {
  console.log('⚠️  No .env file found. Let\'s set up your Infisical credentials.\n');
  
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const questions = [
    'INFISICAL_UNIVERSAL_AUTH_CLIENT_ID',
    'INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET',
    'INFISICAL_PROJECT_ID',
    'INFISICAL_ENV_SLUG (e.g., dev, prod)'
  ];

  const answers = {};
  let currentQuestion = 0;

  const askQuestion = () => {
    if (currentQuestion < questions.length) {
      const question = questions[currentQuestion];
      const key = question.split(' ')[0];
      rl.question(`${question}: `, (answer) => {
        answers[key] = answer.trim();
        currentQuestion++;
        askQuestion();
      });
    } else {
      rl.close();
      
      // Create .env file
      const envContent = Object.entries(answers)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n') + '\n';
      
      writeFileSync(ENV_FILE, envContent);
      console.log('\n✓ Created .env file');
      startServer();
    }
  };

  askQuestion();
} else {
  console.log('✓ Found .env file');
  startServer();
}

function startServer() {
  console.log('\n🚀 Starting dev server...\n');
  
  // Check if server is already running
  fetch(URL)
    .then(() => {
      console.log(`✓ Server already running at ${URL}`);
      console.log('📂 Opening in browser...\n');
      openBrowser(URL);
    })
    .catch(() => {
      // Server not running, start it
      const viteProcess = spawn('npm', ['run', 'dev'], {
        cwd: PROJECT_DIR,
        stdio: 'inherit',
        shell: true
      });

      // Wait for server to be ready
      let attempts = 0;
      const maxAttempts = 30;
      
      const checkServer = setInterval(() => {
        fetch(URL)
          .then(() => {
            clearInterval(checkServer);
            console.log(`\n✓ Server ready at ${URL}`);
            console.log('📂 Opening in browser...\n');
            setTimeout(() => openBrowser(URL), 500);
          })
          .catch(() => {
            attempts++;
            if (attempts >= maxAttempts) {
              clearInterval(checkServer);
              console.log('\n❌ Server failed to start within 30 seconds');
              console.log(`💡 Check logs or try manually: cd ${PROJECT_DIR} && npm run dev`);
              process.exit(1);
            }
          });
      }, 1000);

      viteProcess.on('error', (err) => {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
      });

      // Handle Ctrl+C
      process.on('SIGINT', () => {
        console.log('\n\n🛑 Stopping server...');
        viteProcess.kill();
        process.exit(0);
      });
    });
}

function openBrowser(url) {
  const platform = process.platform;
  let command;

  if (platform === 'darwin') {
    command = 'open';
  } else if (platform === 'win32') {
    command = 'start';
  } else {
    command = 'xdg-open';
  }

  spawn(command, [url], { stdio: 'ignore', detached: true }).unref();
  
  console.log('💡 Press Ctrl+C to stop the server\n');
}

