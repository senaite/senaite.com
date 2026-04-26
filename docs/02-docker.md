---
id: docker
title: Docker Installation
sidebar_label: Docker Installation
---

The official SENAITE Docker image provides a fast way to run SENAITE without
setting up a Python environment or running Buildout. It is well suited for
evaluation, development and production deployments.

The image is published on [Docker Hub][DOCKERHUB] under `senaite/senaite`.


## Prerequisites

- [Docker][DOCKER] 20.10 or later
- [Docker Compose][COMPOSE] v2 (included with Docker Desktop)


## Quick Start

Start a container with the rolling `2.x` image tag:

```shell
docker run --rm --name senaite -p 8080:8080 senaite/senaite:2.x
```

Open `http://localhost:8080` in a browser and log in with `admin:admin`.
Press **Install SENAITE LIMS** to complete the site setup.

The `--rm` flag removes the container when it stops. Data is not persisted
between runs with this command — see the section below for persistent storage.

Start in foreground (debug) mode to see log output:

```shell
docker run --rm --name senaite -p 8080:8080 senaite/senaite:2.x fg
```


## Persistent Storage

By default, the database lives inside the container and is lost when the
container is removed. Mount a host directory to persist data across restarts:

```shell
docker run -d \
  --name senaite \
  -p 8080:8080 \
  -v senaite-data:/data \
  senaite/senaite:2.x
```

The named volume `senaite-data` is managed by Docker and survives container
removal.


## Docker Compose

A Compose file is the recommended way to manage SENAITE in production. Create
a `compose.yml` file:

```yaml
services:
  senaite:
    image: senaite/senaite:2.x
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - senaite-data:/data
    environment:
      - SITE=senaite
      - PASSWORD=changeme

volumes:
  senaite-data:
```

Start the service:

```shell
docker compose up -d
```

Check the logs:

```shell
docker compose logs -f senaite
```

Stop and remove the containers (data volume is preserved):

```shell
docker compose down
```


## ZEO Cluster

For production setups with multiple clients behind a load balancer, use the
ZEO configuration. ZEO stores the database in a dedicated server container and
allows several client instances to serve requests simultaneously.

```yaml
services:
  zeo:
    image: senaite/senaite:2.x
    restart: unless-stopped
    command: zeo
    volumes:
      - senaite-data:/data

  instance1:
    image: senaite/senaite:2.x
    restart: unless-stopped
    ports:
      - "8081:8080"
    environment:
      - ZEO_ADDRESS=zeo:8080
    depends_on:
      - zeo

  instance2:
    image: senaite/senaite:2.x
    restart: unless-stopped
    ports:
      - "8082:8080"
    environment:
      - ZEO_ADDRESS=zeo:8080
    depends_on:
      - zeo

volumes:
  senaite-data:
```

Place a reverse proxy (nginx, Traefik, Caddy) in front of the instances to
distribute traffic and handle TLS termination.


## Environment Variables

| Variable | Description |
|---|---|
| `SITE` | Create and install a SENAITE site with this ID on first start |
| `PASSWORD` | Password for the `admin` user (default: `admin`) |
| `ADDONS` | Space-separated list of additional add-ons to install, e.g. `senaite.storage` |
| `ZEO_ADDRESS` | `host:port` of the ZEO server — starts the image as a ZEO client |
| `ZEO_READ_ONLY` | Run as a read-only ZEO client (`off` by default) |
| `ZEO_SHARED_BLOB_DIR` | Set to `on` if ZEO server and client share the same blob directory |
| `DEVELOP` | Path to a local add-on to mount and develop inside the container |


## Installing Add-ons

Pass add-on package names via the `ADDONS` variable. Pin a specific version
with `==`:

```shell
docker run --rm -p 8080:8080 \
  -e ADDONS="senaite.storage==1.0.0 senaite.patient" \
  senaite/senaite:2.x
```


## Pinning a Specific Version

SENAITE does not publish a `latest` Docker tag. Use the rolling `2.x` tag, or
replace `2.x` with a specific version tag from [Docker Hub][DOCKERHUB]:

```shell
docker run --rm -p 8080:8080 senaite/senaite:v2.6.0
```

Available tags: `v2.6.0`, `v2.5.0`, `v2.4.1`, `v2.4.0`, `2.x`.


## Further Reading

- [senaite.docker on GitHub][SENAITE-DOCKER]
- [Docker documentation][DOCKER]
- [Docker Compose documentation][COMPOSE]


[DOCKERHUB]: https://hub.docker.com/r/senaite/senaite
[SENAITE-DOCKER]: https://github.com/senaite/senaite.docker
[DOCKER]: https://docs.docker.com/get-docker/
[COMPOSE]: https://docs.docker.com/compose/
