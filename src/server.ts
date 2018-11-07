import app from "./app"

const port: number = 8081

app.get('/geraete', function(req, res) {
    res.send('hello world');
});

app.listen(port, () => {
    console.log(`Server started. Listening on port ${port}`);
})