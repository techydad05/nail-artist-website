#!/usr/bin/env node

import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const TARGET_PORT = 5173;

async function killProcessOnPort(port) {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`);
    
    // Find processes using the port
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pids = stdout.trim().split('\n').filter(pid => pid);
    
    if (pids.length > 0) {
      console.log(`💀 Killing ${pids.length} process(es) on port ${port}:`, pids.join(', '));
      
      // Kill each process
      for (const pid of pids) {
        try {
          await execAsync(`kill -9 ${pid}`);
          console.log(`   ✅ Killed process ${pid}`);
        } catch (error) {
          console.log(`   ⚠️  Could not kill process ${pid} (may have already exited)`);
        }
      }
      
      // Wait a moment for processes to fully terminate
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`✅ Port ${port} is already free`);
    }
  } catch (error) {
    if (error.code === 1) {
      // lsof returns exit code 1 when no processes found - this is normal
      console.log(`✅ Port ${port} is free`);
    } else {
      console.log(`⚠️  Error checking port ${port}:`, error.message);
    }
  }
}

async function startDevServer() {
  try {
    console.log(`🚀 Starting development server on port ${TARGET_PORT}...`);
    
    // Start the dev server with explicit port
    const devProcess = spawn('npm', ['run', 'dev', '--', '--port', TARGET_PORT.toString(), '--host'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development server...');
      devProcess.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down development server...');
      devProcess.kill('SIGTERM');
      process.exit(0);
    });
    
    devProcess.on('close', (code) => {
      console.log(`\n📊 Development server exited with code ${code}`);
      process.exit(code);
    });
    
    devProcess.on('error', (error) => {
      console.error('❌ Failed to start development server:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Error starting development server:', error);
    process.exit(1);
  }
}

async function main() {
  console.log('🔧 Nail Artist Website - Development Server Manager');
  console.log('================================================\n');
  
  // Kill any existing processes on the target port
  await killProcessOnPort(TARGET_PORT);
  
  // Start the development server
  await startDevServer();
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});