# Using pnpm in This Project

This project uses **pnpm** as its package manager. pnpm is faster, more efficient, and provides better disk space usage than npm.

## Prerequisites

### Install pnpm

If you don't have pnpm installed, install it globally:

```bash
npm install -g pnpm
```

Or using the standalone installer:

**Linux/macOS:**
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

**Windows (PowerShell):**
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

Verify installation:
```bash
pnpm --version
```

## Project Setup

### Initial Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
   This will:
   - Read `pnpm-workspace.yaml` to identify workspace packages
   - Install all dependencies for root and workspace packages
   - Create `pnpm-lock.yaml` (similar to `package-lock.json`)

2. **Verify workspace setup:**
   ```bash
   pnpm list --depth=0
   ```
   This shows all packages in your monorepo.

## Common Commands

### Installing Dependencies

**Root package:**
```bash
# Add a production dependency
pnpm add <package-name>

# Add a dev dependency
pnpm add -D <package-name>

# Add a dependency to a specific workspace
pnpm add <package-name> --filter @exploration/agent
```

**Workspace package (`packages/agent`):**
```bash
# From root, add to agent workspace
pnpm add <package-name> --filter @exploration/agent

# Or navigate to the workspace and use regular commands
cd packages/agent
pnpm add <package-name>
```

### Running Scripts

**Root scripts:**
```bash
pnpm dev          # Start development server
pnpm build        # Build the project
pnpm start        # Start production server
pnpm type-check   # Type check TypeScript
```

**Workspace scripts:**
```bash
# Run script in agent workspace
pnpm --filter @exploration/agent dev
pnpm --filter @exploration/agent build

# Or use the workspace path pattern
pnpm --filter "./packages/agent" dev
```

**Run scripts in all workspaces:**
```bash
pnpm -r dev       # Run 'dev' in all workspaces recursively
pnpm -r build     # Run 'build' in all workspaces recursively
```

### Using Turbo with pnpm

Turbo works seamlessly with pnpm. All Turbo commands work the same:

```bash
# Run turbo tasks
pnpm turbo build
pnpm turbo dev

# Or add turbo scripts to package.json and use:
pnpm build        # If you add "build": "turbo build" to scripts
```

## Migration from npm

If you're migrating from npm:

1. **Remove npm lock file:**
   ```bash
   rm package-lock.json
   ```

2. **Remove node_modules:**
   ```bash
   rm -rf node_modules
  rm -rf packages/agent/node_modules
   ```

3. **Install with pnpm:**
   ```bash
   pnpm install
   ```

   pnpm will automatically convert your `package-lock.json` if it exists, or create a new `pnpm-lock.yaml` based on your `package.json` files.

## Workspace Configuration

The project uses pnpm workspaces defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
```

This tells pnpm to treat everything under `packages/` as workspace packages. The root `package.json` also has a `workspaces` field for compatibility, but pnpm primarily uses `pnpm-workspace.yaml`.

## Key Differences from npm

1. **Faster installs**: pnpm uses hard links and symlinks, making installs faster
2. **Disk space efficient**: Shared store reduces duplicate packages
3. **Strict dependency resolution**: Better at catching dependency issues
4. **Workspace filtering**: More powerful workspace commands with `--filter`

## Troubleshooting

### Clear pnpm cache
```bash
pnpm store prune
```

### Reinstall everything
```bash
rm -rf node_modules
rm -rf packages/agent/node_modules
rm pnpm-lock.yaml
pnpm install
```

### Check for issues
```bash
pnpm list --depth=Infinity
```

### Update dependencies
```bash
# Update all dependencies
pnpm update

# Update a specific package
pnpm update <package-name>

# Update in a workspace
pnpm update <package-name> --filter @exploration/agent
```

## Configuration Files

- **`pnpm-workspace.yaml`**: Defines workspace packages
- **`.npmrc`**: pnpm configuration (workspace settings, peer dependencies, etc.)
- **`pnpm-lock.yaml`**: Lock file (similar to `package-lock.json`)

## Best Practices

1. **Always commit `pnpm-lock.yaml`** - This ensures consistent installs across environments
2. **Use `--filter` for workspace-specific operations** - More explicit and reliable
3. **Run `pnpm install` after pulling changes** - Ensures dependencies are up to date
4. **Use `pnpm update` instead of manually editing versions** - Maintains lock file integrity

## Resources

- [pnpm Documentation](https://pnpm.io/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turbo with pnpm](https://turbo.build/repo/docs/handbook/package-managers/pnpm)

