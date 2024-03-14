import express from 'express'
const app: express.Application= express()

app.get('/', (_req, _res) => {
    console.log(_req)
    _res.send("Hello from /")
})

app.listen(4000, () => {
    console.log("Server listening at http://localhost:4000")
})