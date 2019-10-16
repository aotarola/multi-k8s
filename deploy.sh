# tag current build and push new images

docker build -t aotarola/multi-client:latest -t aotarola/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t aotarola/multi-server:latest -t aotarola/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t aotarola/multi-worker:latest -t aotarola/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push aotarola/multi-client:latest
docker push aotarola/multi-client:$SHA
docker push aotarola/multi-server:latest
docker push aotarola/multi-server:$SHA
docker push aotarola/multi-worker:latest
docker push aotarola/multi-worker:$SHA

kubectl apply -f k8s

# force deployments to update
kubectl set image deployments/client-deployment client=aotarola/multi-server:$SHA
kubectl set image deployments/server-deployment server=aotarola/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=aotarola/multi-server:$SHA
