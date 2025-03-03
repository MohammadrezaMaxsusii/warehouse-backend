# nexus-backend

Online meeting and class platform

# minio docker command

docker volume create minio-volume && docker run -d --name minio \
 --publish 9000:9000 \
 --publish 9001:9001 \
 --env MINIO_ROOT_USER="minio-root-user" \
 --env MINIO_ROOT_PASSWORD="minio-root-password" \
 --volume minio-volume:/bitnami/minio/data \
 bitnami/minio:latest

# mongo docker command

docker volume create mongo-volume && docker run -d -p 27017:27017 -v mongo-volume:/data/db --name mongo mongo
