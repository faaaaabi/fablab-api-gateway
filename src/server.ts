import app from "./app"

const port: number = 8081

app.listen(port, () => {
    console.log(`Server started. Listening on port ${port}`);
})