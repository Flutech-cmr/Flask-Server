docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker system prune 
docker system prune -a --volumes 