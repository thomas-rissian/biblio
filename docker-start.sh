#!/bin/bash

COMMAND=${1:-start}

case "$COMMAND" in
    start)
        docker compose up -d
        docker compose ps
        ;;
    stop)
        docker compose down
        ;;
    restart)
        docker compose restart
        ;;
    logs)
        docker compose logs -f ${2:-}
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs [service]}"
        exit 1
        ;;
esac