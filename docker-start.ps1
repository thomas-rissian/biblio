param(
    [Parameter(Mandatory=$false)]
    [string]$Command = 'help'
)

# Simple Docker wrapper
switch ($Command.ToLower()) {
    'start' {
        docker-compose up -d
        Start-Sleep -Seconds 5
        docker-compose ps
    }
    'stop' {
        docker-compose down
    }
    'restart' {
        docker-compose restart
    }
    'logs' {
        docker-compose logs -f
    }
    'build' {
        docker-compose build
    }
    'clean' {
        docker-compose down -v
    }
    'ps' {
        docker-compose ps
    }
    default {
        Write-Host "Usage: .\docker-start.ps1 [command]" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor Cyan
        Write-Host "  start    - Start all services"
        Write-Host "  stop     - Stop all services"
        Write-Host "  restart  - Restart services"
        Write-Host "  logs     - Show logs"
        Write-Host "  build    - Build images"
        Write-Host "  clean    - Remove containers and volumes"
        Write-Host "  ps       - Show container status"
        Write-Host ""
    }
}
