Parse Image Cropper ![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)
====================

A simple image cropper as a Parse micro-service. 

##### Parameters
The module creates an endpoint to `/crop/:url` where `:url` is a base64 encoded image url
accessible via http or https. Two query parameters are expected `width` and `height`. They
seemingly refer to the expected `width` and `height` of the new image. 

##### Format
The cropper returns a `jpeg` image by default, however, by specifying an `Accept:image/png`
http header you can change this behavior to obtain a png which preserves transparency.

##### Example

```
curl -H "Accept:image/png" http://<your-app-url>/crop/aHR1cHM6Ly9hdmF0YXJzMi5naXRodWJ1c2VyY29udGVudC5jb20vdS81NjgwMjU2P3Y9MyZzPTQ2MA==?width=50&height=50" > avatar.png
```

Enjoy.
