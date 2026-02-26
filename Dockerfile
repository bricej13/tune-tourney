FROM alpine:latest AS pb

ARG PB_VERSION=0.22.19

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

FROM pb
COPY ./pocketbase/pb_migrations /pb/pb_migrations
COPY ./pocketbase/pb_hooks /pb/pb_hooks
COPY ./dist /pb/pb_public

EXPOSE 8080

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]
