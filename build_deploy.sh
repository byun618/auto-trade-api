#/bin/bash
version=$1

echo "Set Version: ${version}"

echo "Build Start"
docker build -t "byun618/auto-trade-api:${version}" .

echo "Push Start"
docker push "byun618/auto-trade-api:${version}"

echo "Rolling Update Start"
kubectl set image deployment/auto-trade-api auto-trade-api=byun618/auto-trade-api:${version}

echo "END "