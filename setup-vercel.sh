#!/bin/bash

# Script para configurar Vercel deployment
# Execute este script após instalar Vercel CLI: npm i -g vercel

echo "🚀 Configuração do Deploy na Vercel"
echo "===================================="
echo ""

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado!"
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel
fi

echo "✅ Vercel CLI instalado"
echo ""

# Login na Vercel
echo "📝 Fazendo login na Vercel..."
echo "Se você não tem conta, crie em: https://vercel.com/signup"
echo ""
vercel login

# Link do projeto
echo ""
echo "🔗 Vinculando projeto à Vercel..."
echo "Responda as perguntas a seguir:"
echo ""
vercel link

# Deploy inicial
echo ""
echo "🚀 Fazendo deploy inicial..."
read -p "Deseja fazer o deploy agora? (y/n): " deploy_now

if [ "$deploy_now" = "y" ]; then
    echo "Deploying to production..."
    vercel --prod
    echo ""
    echo "✅ Deploy realizado com sucesso!"
else
    echo "⏭️ Deploy pulado. Execute 'vercel --prod' quando estiver pronto."
fi

# Obter informações do projeto
echo ""
echo "📋 Obtendo informações do projeto..."
echo ""

# Verificar se arquivo .vercel existe
if [ -f ".vercel/project.json" ]; then
    echo "✅ Projeto configurado com sucesso!"
    echo ""
    echo "🔐 IMPORTANTE: Adicione estes secrets no GitHub:"
    echo "================================================"
    
    # Obter token
    echo "1. VERCEL_TOKEN:"
    echo "   - Acesse: https://vercel.com/account/tokens"
    echo "   - Crie um novo token com nome 'GitHub Actions'"
    echo "   - Copie o token gerado"
    echo ""
    
    # Obter IDs do projeto
    if [ -f ".vercel/project.json" ]; then
        echo "2. VERCEL_ORG_ID:"
        cat .vercel/project.json | grep orgId | cut -d'"' -f4
        echo ""
        echo "3. VERCEL_PROJECT_ID:"
        cat .vercel/project.json | grep projectId | cut -d'"' -f4
        echo ""
    fi
    
    echo "📝 Como adicionar no GitHub:"
    echo "1. Vá para: https://github.com/GiovaneFreu/supplier-management-system/settings/secrets/actions"
    echo "2. Clique em 'New repository secret'"
    echo "3. Adicione cada secret acima"
    echo ""
    
    # Criar arquivo com as informações
    echo "💾 Salvando informações em 'vercel-config.txt'..."
    {
        echo "VERCEL CONFIGURATION"
        echo "===================="
        echo ""
        echo "GitHub Secrets Required:"
        echo "------------------------"
        echo "VERCEL_TOKEN=<create at https://vercel.com/account/tokens>"
        if [ -f ".vercel/project.json" ]; then
            echo "VERCEL_ORG_ID=$(cat .vercel/project.json | grep orgId | cut -d'"' -f4)"
            echo "VERCEL_PROJECT_ID=$(cat .vercel/project.json | grep projectId | cut -d'"' -f4)"
        fi
        echo ""
        echo "Project URLs:"
        echo "-------------"
        vercel ls 2>/dev/null | head -10
    } > vercel-config.txt
    
    echo "✅ Configuração salva em 'vercel-config.txt'"
    echo ""
    
    # URLs do projeto
    echo "🔗 URLs do Projeto:"
    echo "==================="
    vercel ls 2>/dev/null | head -5
    
else
    echo "❌ Erro na configuração. Execute o script novamente."
fi

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. ✅ Adicione os secrets no GitHub"
echo "2. ✅ Faça um commit e push das alterações"
echo "3. ✅ O deploy será automático a cada push na branch main"