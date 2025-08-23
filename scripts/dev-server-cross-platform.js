#!/usr/bin/env node

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { platform } from 'os';

const execAsync = promisify(exec);
const TARGET_PORT = 5173;
const isWindows = platform() === 'win32';

async function killProcessOnPort(port) {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`);
    
    let command;
    if (isWindows) {
      // Windows command to find and kill processes on port
      command = `netstat -ano | findstr :${port}`;
    } else {
      // Unix/Linux/macOS command
      command = `lsof -ti:${port}`;
    }
    
    const { stdout } = await execAsync(command);
    
    if (isWindows) {
      // Parse Windows netstat output
      const lines = stdout.trim().split('\n');
      const pids = [];
      
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && !pids.includes(pid)) {
            pids.push(pid);
          }
        }
      }
      
      if (pids.length > 0) {
        console.log(`💀 Killing ${pids.length} process(es) on port ${port}:`, pids.join(', '));
        
        for (const pid of pids) {
          try {
            await execAsync(`taskkill /PID ${pid} /F`);
            console.log(`   ✅ Killed process ${pid}`);
          } catch (error) {
            console.log(`   ⚠️  Could not kill process ${pid} (may have already exited)`);
          }
        }
      } else {
        console.log(`✅ Port ${port} is free`);
      }
    } else {
      // Unix/Linux/macOS
      const pids = stdout.trim().split('\n').filter(pid => pid);
      
      if (pids.length > 0) {
        console.log(`💀 Killing ${pids.length} process(es) on port ${port}:`, pids.join(', '));
        
        for (const pid of pids) {
          try {
            await execAsync(`kill -9 ${pid}`);
            console.log(`   ✅ Killed process ${pid}`);
          } catch (error) {
            console.log(`   ⚠️  Could not kill process ${pid} (may have already exited)`);
          }
        }
      } else {
        console.log(`✅ Port ${port} is free`);
      }
    }
    
    // Wait a moment for processes to fully terminate
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    if (error.code === 1 || error.stderr?.includes('No such process')) {
      // Command returns exit code 1 when no processes found - this is normal
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
    const cleanup = () => {
      console.log('\n🛑 Shutting down development server...');
      devProcess.kill('SIGINT');
      process.exit(0);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    // On Windows, also handle CTRL+C
    if (isWindows) {
      process.on('SIGBREAK', cleanup);
    }
    
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
  console.log(`🖥️  Platform: ${platform()}`);
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