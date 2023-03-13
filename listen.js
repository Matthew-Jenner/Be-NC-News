const app = require("./app")
const {port = 5432} = process.env

app.listen(port, () =>{
   
        console.log(`Server listening and running at ${port}`)
     })
