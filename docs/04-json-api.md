---
id: json-api
title: JSON API
sidebar_label: JSON API
---

Every SENAITE site ships with a REST API that speaks JSON. It needs no
add-on and no configuration. Other systems use it to read samples and
results, to create records and to drive the workflow. The API is provided
by [senaite.jsonapi][JSONAPI-DOCS], whose documentation covers every
route in detail.

The examples below use `curl` against a local site at
`http://localhost:8080/senaite` with the default `admin:admin` login. The
responses are real, shortened to the parts that matter. Use HTTPS and an
account of its own for anything that is not a local test site.


## Base URL

The API lives under the site, not under the server root:

```
http://localhost:8080/senaite/@@API/senaite/v1
```

A quick check that the API answers:

```shell
curl -u admin:admin \
  http://localhost:8080/senaite/@@API/senaite/v1/version
```

```json
{
  "url": "http://localhost:8080/senaite/@@API/senaite/v1/version",
  "version": "2.7.0",
  "date": "unreleased"
}
```

This is the answer of the `2.x` Docker image, which runs the development
version; a 2.6.0 installation reports `2.6.0`.


## Authentication

The API uses the same users and permissions as the web interface. A
request sees exactly what the user would see in the browser, no more.

The simplest way is HTTP Basic authentication on every request, as in the
examples on this page. A client can also log in once and keep the session
cookie:

```shell
curl -c cookies.txt -X POST \
  -d "__ac_name=admin&__ac_password=admin" \
  http://localhost:8080/senaite/@@API/senaite/v1/login
```

```json
{
  "authenticated": true,
  "username": "admin",
  "roles": ["Manager", "Authenticated"]
}
```

Later requests pass `-b cookies.txt` instead of `-u`.


## Resources Are Type Names

A resource is the content type name in lower case: `client`,
`analysisservice`, `sampletype`, `worksheet`. Samples are the one name
that surprises: their type is `AnalysisRequest`, so the resource is
`analysisrequest`.

`/samples` is not a list of samples. It returns the folder that holds
them, a single item of type `Samples`.


## Listing

```shell
curl -u admin:admin \
  "http://localhost:8080/senaite/@@API/senaite/v1/client?limit=2"
```

```json
{
  "count": 3,
  "pagesize": 2,
  "page": 1,
  "pages": 2,
  "next": "http://localhost:8080/senaite/@@API/senaite/v1/client?b_start=2&limit=2",
  "previous": null,
  "items": [
    {
      "uid": "1dae3a845cda4d8b9a2fee650ef3ca0c",
      "id": "client-1",
      "title": "Lakeside Brewery",
      "portal_type": "Client",
      "review_state": "active",
      "getClientID": "LB",
      "url": "http://localhost:8080/senaite/clients/client-1",
      "api_url": "http://localhost:8080/senaite/@@API/senaite/v1/client/1dae3a845cda4d8b9a2fee650ef3ca0c"
    },
    {
      "uid": "b6f1eb48090f43caad17519097cd1b52",
      "id": "client-2",
      "title": "Hillside Dairy",
      "portal_type": "Client",
      "review_state": "active",
      "getClientID": "HD"
    }
  ]
}
```

`count` is the total number of matches, `pagesize` the number of items on
this page. A listing returns the catalog's summary of each object, which
is fast but does not contain every field. Add `complete=yes` to get the
full records, and `fields=` to limit them to the fields you need:

```shell
curl -u admin:admin \
  "http://localhost:8080/senaite/@@API/senaite/v1/client?complete=yes&fields=title,ClientID,Phone"
```


## Paging

`limit` sets the page size (25 by default), `b_start` the index of the
first item. The response carries ready made links in `next` and
`previous`; follow `next` until it is `null`:

```shell
curl -u admin:admin \
  "http://localhost:8080/senaite/@@API/senaite/v1/client?b_start=2&limit=2"
```

```json
{
  "count": 3,
  "pagesize": 2,
  "page": 2,
  "pages": 2,
  "next": null,
  "previous": "http://localhost:8080/senaite/@@API/senaite/v1/client?limit=2&b_start=0",
  "items": [
    {"title": "Riverbank Water Works"}
  ]
}
```

Sort with `sort_on` and `sort_order`, for example
`?sort_on=sortable_title&sort_order=ascending`, so that pages do not
shift between requests.


## One Object

Every item carries its `uid`. Fetch the full record by type and UID, or by
UID alone:

```shell
curl -u admin:admin \
  http://localhost:8080/senaite/@@API/senaite/v1/client/b6f1eb48090f43caad17519097cd1b52

curl -u admin:admin \
  http://localhost:8080/senaite/@@API/senaite/v1/b6f1eb48090f43caad17519097cd1b52
```

Both return the same envelope with one item that contains every field of
the object, for example `ClientID`, `Phone` and `EmailAddress`.


## Filtering

Query parameters that match a catalog index filter the listing:

```shell
curl -u admin:admin \
  "http://localhost:8080/senaite/@@API/senaite/v1/client?getClientID=HD"
```

```json
{
  "count": 1,
  "items": [
    {"title": "Hillside Dairy", "getClientID": "HD"}
  ]
}
```

Which indexes exist depends on the catalog. `/catalogs` lists the
catalogs, and `/catalogs/<id>` lists the indexes of one of them:

```shell
curl -u admin:admin \
  http://localhost:8080/senaite/@@API/senaite/v1/catalogs/senaite_catalog_client
```

```json
{
  "id": "senaite_catalog_client",
  "indexes": ["Creator", "Title", "UID", "allowedRolesAndUsers",
    "client_searchable_text", "created", "getClientID", "getId",
    "getName", "id", "is_active", "object_provides", "path",
    "portal_type", "review_state", "sortable_title", "title"]
}
```


## Writing

:::warning
Run write requests against a test site first. They change data with the
permissions of the user, and there is no undo.
:::

Create an object with `POST /create`, naming the type and the folder it
goes into:

```shell
curl -u admin:admin -X POST \
  -H "Content-Type: application/json" \
  -d '{"portal_type": "Client", "parent_path": "/senaite/clients",
       "title": "Lakeside Brewery", "ClientID": "LB"}' \
  http://localhost:8080/senaite/@@API/senaite/v1/create
```

The response contains the new object, including its `uid`.

Change fields with `POST /update/<uid>`:

```shell
curl -u admin:admin -X POST \
  -H "Content-Type: application/json" \
  -d '{"Phone": "+1 555 0100"}' \
  http://localhost:8080/senaite/@@API/senaite/v1/update/b6f1eb48090f43caad17519097cd1b52
```

```json
{
  "count": 1,
  "items": [
    {
      "title": "Hillside Dairy",
      "Phone": "+1 555 0100",
      "modified": "2026-10-14T10:37:22+00:00"
    }
  ]
}
```

Creating samples, entering results and running workflow transitions work
the same way; the [senaite.jsonapi documentation][JSONAPI-DOCS] describes
the routes and the fields they expect.


## Three Silent Failures

These cost integrators the most time, because the API answers with
`200 OK` and no error:

- **Wrong credentials.** With a wrong password the request runs as an
  anonymous user and returns an empty list: `"count": 0`, status 200.
  If a listing is unexpectedly empty, check the login first.
- **Misspelled parameters.** Parameters that match no index are ignored.
  `?getClientId=HD` (lower case `d`) returns all three clients instead of
  one.
- **Missing permissions.** A user who may not see an object does not get
  it in a listing either. Use a dedicated API user with the roles the
  integration needs.


[JSONAPI-DOCS]: https://senaitejsonapi.readthedocs.io/
