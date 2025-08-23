# Development Server Memory

## Always Use Port 5173

To ensure the development server always runs on port 5173 (even if other processes are using it), use:

```bash
npm run dev:force
```

This command will:
1. 🔍 Check for any processes running on port 5173
2. 💀 Kill those processes automatically
3. 🚀 Start the dev server on port 5173 with host exposure

## Regular Dev Command

For normal development (without force-killing processes):

```bash
npm run dev
```

## How It Works

The `dev:force` script (`scripts/dev-server-cross-platform.js`):
- Works on Windows, macOS, and Linux
- Uses `lsof` on Unix systems and `netstat` on Windows
- Kills processes gracefully with proper cleanup
- Automatically exposes the server on network interfaces
- Handles CTRL+C and other termination signals properly

## Admin Access

Once the server is running on port 5173:
- **Admin Login:** http://localhost:5173/admin/login
- **Credentials:** admin@polishedperfection.com / admin123

## Port Conflicts

If you ever see "Port 5173 is in use", just use `npm run dev:force` instead of the regular `npm run dev` command.

## Network Access

The server runs with `--host` flag, so it's accessible from:
- Local: http://localhost:5173/
- Network: http://[your-ip]:5173/ (for testing on mobile devices)