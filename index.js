var express = require("express")
var getImages = require("google-image-search-url-results")
var imgToAscii = require("image-to-ascii")

var app = express()

app.get(/.*/, (req, res) => {
	var keywords = req.url.split("/").join(" ").trim()
	if (keywords === "favicon.ico") {
		res.send("no")
		return
	}
	getImages(keywords)
		.then((images) => {
			return Promise.all(images.map((src) => {
				return new Promise((resolve, reject)=> {
					imgToAscii(src, {
						colored: false, 
						reverse: true,
						size: {
							width: 40,
							height: 80
						}
					}, (err, converted)=>{
						err ? reject(err) : resolve(converted)
					})
				})
			}))
		})
		.then((artz)=> {
			res.type("text/plain")
			res.send(artz.join("\n\n"))
		})
		.catch((err)=> {
			console.log(err)
			res.send("SUPER SAD")
		})

})

app.listen(8000, () => {
	console.log("super-important stuff up at localhost:8000")
})