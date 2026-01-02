#!/bin/bash
# Script to kill process on port 5000

echo "Finding processes using port 5000..."
PIDS=$(lsof -ti:5000)

if [ -z "$PIDS" ]; then
    echo "✅ Port 5000 is free - no processes found"
else
    echo "Found processes: $PIDS"
    echo "Killing processes..."
    kill -9 $PIDS 2>/dev/null
    sleep 1
    
    # Check again
    REMAINING=$(lsof -ti:5000)
    if [ -z "$REMAINING" ]; then
        echo "✅ Port 5000 is now free!"
    else
        echo "⚠️ Some processes may still be using port 5000"
        echo "Try running: kill -9 $REMAINING"
    fi
fi

