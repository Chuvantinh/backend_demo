# Dockerfile to deploy prisma service layer to tmcc vm dokku setup
# deploy via git push to dokku remote - dokku@s-tmcc-buddy.charite.de:buddy-prisma-service
FROM prismagraphql/prisma:1.34.8
ARG PRISMA_CONFIG_PATH
ENV PRISMA_CONFIG_PATH prisma.yml
COPY dokku_prisma.yml prisma.yml
EXPOSE 4466