let Express = require('express')
let Buffer = require('buffer').Buffer
let Image = require('parse-image')

let app = Express()
app.use(Express.bodyParser())
app.get("/crop/:url", (req, res) => {
    let { width, height }  = req.query
    Parse.Promise.as(req.params.url)
         .then(url => {
             if (!width || !height || !url) { throw "Expected width and height paramters." }
             return url
         })
         .then(url => {
             let decoded = decodeURIComponent(new Buffer(url, 'base64').toString('utf8'))
             return decoded && decoded.match(/^https?:/) ?
                 decoded :
                 Parse.Promise.error("Expected a base64 encoded image url.")
         })
         .then(url => Parse.Cloud.httpRequest({ url }))
         .then(response => (new Image()).setData(response.buffer))
         .then(image => {
            let ih = image.height()
            let iw = image.width()
            let w = +width
            let h = Math.floor(w * ih / iw)

            if (h < +height) {
                h = +height
                w = Math.floor(iw / ih * h)
            }

            return image.scale({ width: w, height: h })
         })
         .then(image => image.crop({
            left: (image.width() - +width) / 2,
            top: (image.height() - +height) / 2,
            width: +width,
            height: +height
         }))
         .then(image => {
            var accept = req.get('Accept')
            if (accept && accept === 'image/png') {
                res.set('Content-Type', 'image/png')
                image.setFormat("PNG")
            } else {
                res.set('Content-Type', 'image/jpeg')
                image.setFormat("JPEG")
            }
            return image.data()
         })
         .done(buffer => {
            res.status(200)
            res.send(buffer)
         })
         .fail(error => {
            res.status(400) // HTTP 400 Bad Request
            res.json({ error })
         })
})

// Help / Usage
app.listen()
