# Proxy Modes
there are several different settings we can change for the proxy, on an app-by-app basis. Since we don't use subdomains, but rather path prefixes, there are some issues, since for example, if your app request a stylesheet from `/styles.css`, that may work fine when you visit an app using `localhost:3000/index.html` on your own machine, but when hosted on cwdc infrastructure, your index file is now at `localhost:3000/myApp/index.html`, and so a request for `/styles.css` will not get the file you want, if it even exists at all. In an ideal situation, you could write it to use all relative links, though that is not always possible. 

## Normal Mode
```
location /myApp {
    proxy_pass http://web-1:8000
}
```