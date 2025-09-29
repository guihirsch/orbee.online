@echo off
REM Script para executar pré-processamento de municípios no Windows
REM Uso: run_preload.bat [--once] [--schedule] [--cleanup]

setlocal enabledelayedexpansion

REM Cores para output (Windows)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Função para log colorido
:log
echo %BLUE%[%date% %time%]%NC% %~1
goto :eof

:error
echo %RED%[ERROR]%NC% %~1
goto :eof

:success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

REM Verifica se o ambiente virtual está ativado
if "%VIRTUAL_ENV%"=="" (
    call warning "Ambiente virtual não detectado. Ativando..."
    call ..\.venv\Scripts\activate.bat 2>nul || (
        call error "Ambiente virtual não encontrado. Execute: python -m venv .venv"
        exit /b 1
    )
)

REM Instala dependências se necessário
if not exist "requirements.txt" (
    call error "Arquivo requirements.txt não encontrado"
    exit /b 1
)

call log "Instalando dependências..."
pip install -r requirements.txt

REM Verifica variáveis de ambiente
if "%DATABASE_URL%"=="" (
    call warning "DATABASE_URL não definida. Usando padrão local..."
    set "DATABASE_URL=postgresql://user:password@localhost:5432/orbee"
)

REM Função para executar uma vez
:run_once
call log "Executando pré-processamento uma vez..."
python preload_municipalities.py
if %errorlevel% equ 0 (
    call success "Pré-processamento concluído!"
) else (
    call error "Erro no pré-processamento"
    exit /b 1
)
goto :eof

REM Função para executar agendador
:run_schedule
call log "Iniciando agendador de pré-processamento..."
python scheduler.py
goto :eof

REM Função para limpar cache
:cleanup_cache
call log "Limpando cache expirado..."
python -c "import asyncio; from preload_municipalities import MunicipalityPreloader; asyncio.run(MunicipalityPreloader().cleanup_expired_cache())"
call success "Cache limpo!"
goto :eof

REM Função para mostrar status
:show_status
call log "Verificando status do cache..."
python -c "import asyncio; from preload_municipalities import MunicipalityPreloader; asyncio.run(MunicipalityPreloader().show_status())"
goto :eof

REM Processa argumentos
if "%1"=="--once" goto run_once
if "%1"=="--schedule" goto run_schedule
if "%1"=="--cleanup" goto cleanup_cache
if "%1"=="--status" goto show_status
if "%1"=="--help" goto show_help
if "%1"=="-h" goto show_help

REM Se não há argumentos, executa uma vez
if "%1"=="" goto run_once

call error "Opção inválida: %1"
goto show_help

:show_help
echo Uso: %0 [opção]
echo.
echo Opções:
echo   --once      Executa pré-processamento uma vez
echo   --schedule  Inicia agendador contínuo
echo   --cleanup   Limpa cache expirado
echo   --status    Mostra status do cache
echo   --help      Mostra esta ajuda
echo.
echo Exemplos:
echo   %0 --once        # Executa uma vez
echo   %0 --schedule    # Inicia agendador
echo   %0 --status      # Verifica status
goto :eof
