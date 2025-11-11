# 🚀 Guía de Despliegue

## 📋 Prerequisitos en la VM

1. Docker instalado
2. Docker Compose instalado
3. Git instalado

## 🔧 Instalación de Docker en Ubuntu (si no lo tienes)

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Cerrar y volver a conectar por SSH para aplicar cambios de grupo
exit
```

## 📥 Despliegue Paso a Paso

### 1. Clonar el repositorio en la VM

```bash
cd ~
git clone <tu-repositorio>
cd IaAplicadaUnlam/deploy
```

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar con tus valores reales
nano .env
```

Presiona `Ctrl+X`, luego `Y`, luego `Enter` para guardar.

### 3. Crear la carpeta para el frontend compilado

```bash
mkdir -p frontend-build
```

### 4. Compilar el frontend (en tu máquina local)

Desde tu máquina local:

```bash
cd frontend
npm run build
```

Esto generará los archivos en `frontend/dist/frontend/browser`

### 5. Copiar el build del frontend a la VM

Desde tu máquina local:

```bash
# Reemplaza USER y VM_IP con tus valores
scp -r frontend/dist/frontend/browser/* USER@VM_IP:~/IaAplicadaUnlam/deploy/frontend-build/
```

O puedes usar cualquier otro método (FileZilla, WinSCP, etc.)

### 6. Verificar que sa-key.json está en su lugar

```bash
# Asegúrate de que este archivo existe
ls -la ../api/sa-key.json
```

Si no existe, cópialo desde tu máquina local:

```bash
# Desde tu máquina local
scp api/sa-key.json USER@VM_IP:~/IaAplicadaUnlam/api/
```

### 7. Levantar los servicios

```bash
# Desde la carpeta deploy en la VM
docker-compose up --build -d
```

### 8. Verificar que todo está corriendo

```bash
# Ver el estado de los contenedores
docker-compose ps

# Ver los logs
docker-compose logs -f
```

### 9. Configurar el firewall de la VM

```bash
# Permitir tráfico en el puerto 8080
sudo ufw allow 8080/tcp
sudo ufw status
```

### 10. Acceder a la aplicación

Abre tu navegador y ve a:
```
http://<IP_DE_TU_VM>:8080
```

## 🔄 Actualizar la Aplicación

### Actualizar el código de la API

```bash
cd ~/IaAplicadaUnlam
git pull
cd deploy
docker-compose down
docker-compose up --build -d
```

### Actualizar el frontend

1. Compilar nuevo build en tu máquina local
2. Copiar archivos a la VM:
   ```bash
   scp -r frontend/dist/frontend/browser/* USER@VM_IP:~/IaAplicadaUnlam/deploy/frontend-build/
   ```
3. Reiniciar nginx:
   ```bash
   docker-compose restart nginx
   ```

## 📊 Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api
docker-compose logs -f nginx

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Ver estado de los contenedores
docker-compose ps

# Ver uso de recursos
docker stats
```

## 🐛 Troubleshooting

### El contenedor de la API no inicia

```bash
# Ver logs detallados
docker-compose logs api

# Verificar variables de entorno
cat .env

# Verificar que sa-key.json existe
ls -la ../api/sa-key.json
```

### No puedo acceder desde el navegador

1. Verifica que los contenedores estén corriendo: `docker-compose ps`
2. Verifica el firewall: `sudo ufw status`
3. Verifica que el puerto 8080 esté abierto en tu proveedor de VM (AWS Security Groups, Azure NSG, etc.)

### El frontend muestra página en blanco

1. Verifica que los archivos estén en `frontend-build/`: `ls -la frontend-build/`
2. Debe haber un `index.html` en esa carpeta
3. Revisa los logs de nginx: `docker-compose logs nginx`

### Errores de permisos

```bash
# Dar permisos correctos a la carpeta
sudo chown -R $USER:$USER ~/IaAplicadaUnlam
chmod -R 755 ~/IaAplicadaUnlam
```

## 🔒 Notas de Seguridad

- El archivo `.env` contiene información sensible, nunca lo subas al repositorio
- Cambia todas las claves secretas antes de desplegar
- Considera usar HTTPS en producción (puedes agregar Certbot/Let's Encrypt)

## 📝 Estructura de Carpetas

```
deploy/
├── docker-compose.yml       # Configuración de servicios
├── nginx.conf              # Configuración de Nginx
├── .env                    # Variables de entorno (crear desde .env.example)
├── .env.example            # Plantilla de variables
├── frontend-build/         # Aquí van los archivos compilados del frontend
│   ├── index.html
│   ├── main-*.js
│   └── ...
└── README.md              # Esta guía
```

## 🌐 Puertos Utilizados

- **8080**: Nginx (frontend y proxy a API)
- **3000**: API (solo accesible internamente entre contenedores)

La aplicación completa está disponible en el puerto **8080**.
