#!/bin/bash
echo "Removing Old DOckerfile"
rm Dockerfile
echo "Downloading New DockerFIle"
wget https://raw.githubusercontent.com/Flutech-cmr/Flask-Server/main/Dockerfile
echo "Building and running new container"
docker build --network=host -t flutech_crm .
docker run -d -p 5050:5050 flutech_crm