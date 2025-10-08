# -----------------------------------------------------------------------------
# 1. Build Stage (for compiling and dependency installation)
# -----------------------------------------------------------------------------
    FROM node:20-alpine AS builder

    # Install Git, required for installing private Git-based dependencies
    RUN apk add --no-cache git 
    
    # Set the working directory
    WORKDIR /app
    
    # Copy package files (for caching and dependency analysis)
    COPY package.json ./
    COPY package-lock.json ./
    
    # Install ALL dependencies (dev and production)
    RUN npm install
    
    # Copy the rest of the application code
    COPY . .
    
    # Run the Next.js build step
    RUN npm run build
    
    
    # -----------------------------------------------------------------------------
    # 2. Production/Runner Stage (for serving the app)
    # -----------------------------------------------------------------------------
    FROM node:20-alpine AS runner
    
    # INSTALL GIT HERE AGAIN: Required for installing production-only Git dependencies
    RUN apk add --no-cache git
    
    # Environment variables
    ENV NODE_ENV production
    ENV HOST 0.0.0.0
    
    # Set the working directory
    WORKDIR /app
    
    # Expose the default Next.js port
    EXPOSE 3000
    
    # 1. Copy package files 
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/package-lock.json ./
    
    # 2. Install only production dependencies
    # This step now successfully runs 'git' to fetch your private dependency.
    RUN npm install --omit=dev
    
    # 3. Copy the built artifacts from the 'builder' stage
    COPY --from=builder /app/.next ./.next
    
    # 4. Copy public assets (images, fonts, etc.)
    COPY --from=builder /app/public ./public
    
    # Define the command to start the production server
    CMD ["npm", "start"]