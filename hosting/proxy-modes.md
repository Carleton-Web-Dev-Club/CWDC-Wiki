# Proxy Settings
There are several different settings we can change for the proxy, on an app-by-app basis. 

Since we don't use subdomains, but rather path prefixes, there are some issues, since for example, if your app request a stylesheet from `/styles.css`, that may work fine when you visit an app using `localhost:3000/index.html` on your own machine, but when hosted on cwdc infrastructure, your index file is now at `localhost:3000/myApp/index.html`, and so a request for `/styles.css` will not get the file you want, if it even exists at all. In an ideal situation, you could write it to use all relative links, or use a special header to figure out the reverse proxy prefix, though that is not always possible. 

To begin, you must pick either [Proxy Full Path](#proxy-full-path) or [Proxy Path Ending](#proxy-path-ending). Then you can ask for any of the other features 

## Proxy Full Path
```
location /myApp {
    proxy_pass http://localhost:7000;
}

```
`curl cwdc.scs.carleton.ca/myApp/index.html` result in:
```
GET /myApp/index.html HTTP/1.1
Host: cwdc.scs.carleton.ca
X-Forwarded-For: 134.117.26.94
X-Forwarded-Proto: https
X-Forwarded-Host: cwdc.scs.carleton.ca
X-Forwarded-Port: 443
Connection: upgrade
user-agent: curl/7.68.0
accept: */*
```
## Proxy Path Ending
This will still match cwdc.scs.carleton.ca/myApp, and redirect it automatically to cwdc.scs.carleton.ca/myApp/, which will then get proxied as a request to /.

```
location /myApp/ {
    proxy_pass http://localhost:7000/;
}

```
`curl cwdc.scs.carleton.ca/myApp/index.html` results in:

```
GET /index.html HTTP/1.1
Host: cwdc.scs.carleton.ca
X-Forwarded-For: 134.117.26.94
X-Forwarded-Proto: https
X-Forwarded-Host: cwdc.scs.carleton.ca
X-Forwarded-Port: 443
Connection: upgrade
user-agent: curl/7.68.0
accept: */*
```
### Add X-Forwarded-Path Header
This seems to be a very non-standard header, even more so than the other X-Forwarded-* ones. With this you could configure your site to add the X-Forwarded-Path to the start of all links. Added benefit is that you will still be able to test without a reverse proxy, by just having it default to "/".
```
location /myApp/ {
    proxy_pass http://localhost:7000/;
    proxy_set_header X-Forwarded-Path  /myApp;
}

```
`curl cwdc.scs.carleton.ca/myApp/index.html` results in:

```
GET /index.html HTTP/1.1
Host: cwdc.scs.carleton.ca
X-Forwarded-For: 134.117.26.94
X-Forwarded-Path: /myApp
X-Forwarded-Proto: https
X-Forwarded-Host: cwdc.scs.carleton.ca
X-Forwarded-Port: 443
Connection: upgrade
user-agent: curl/7.68.0
accept: */*
```

## Rewrites (Not recommended)
If you've already written the app and it can't be changed, in most cases we can add a rewrite rule for the http body. In the scenario given at the top of the page, a rewrite rule could be added, so that `href="/` is rewritten and sent to the client as `href="/myApp/`, that way the correct file can be loaded. Rewrite rules can be specified wither via a regex, or simple string substitution