require('dotenv').config();
const express = require("express");
const app = express();
const bcrypt=require("bcryptjs");
const path = require("path");
// const app = express()
 const hbs = require("hbs");
const LogInCollection = require("./mongo");
const port = process.env.PORT || 3000

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
// console.log(publicPath);
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


//  hbs.registerPartials(partialPath)

console.log(process.env.SECRET_KEY);
app.get("/signup", (req, res) => {
    res.render("signup")
})
app.get("/", (req, res) => {
    res.render("login")
})



// app.get('/home', (req, res) => {
//     res.render('home')
// })

app.post("/signup", async (req, res) => {
    
    
   try{
    const password=req.body.password;
    const name=req.body.name;
    const registerstudent= new LogInCollection({
         name:req.body.name,
         password:req.body.password
    })
   

   
     const checking = await LogInCollection.findOne({ name: req.body.name });
    // const pass=await LogInCollection.findOne({ password: req.body.password});
     if (checking) {
        res.send("user details already exists")
     }
    else{
         
         const token= await registerstudent.generateAuthToken();

         const registered=await registerstudent.save();
        // res.status(201).render("home");
        res.status(201).render("home", {
            naming: req.body.name
        })
    }
    
   }
   catch(error){ 
    res.status(400).send(error);
   }

})

// try{
//     const password=req.body.password;
//     const name=req.body.name;
//     const registerstudent= new LogInCollection({
//          name:req.body.name,
//          password:req.body.password
//     })
//     const registered=await registerstudent.save();
//     res.status(201).render("home");
// }catch(error){
//     res.status(400).send(error);
// }

// try{
//     console.log(req.body.name);
//     res.send(req.body.name);
// }
// catch(error){
//     res.status(400).send(error);
// }



app.post('/login', async (req, res) => {

    try {
        const password=req.body.password;
        const check = await LogInCollection.findOne({ name: req.body.name })
        // console.log(check.password);
        // console.log(password);
        const isMatch= await bcrypt.compare(password,check.password);
        const token= await check.generateAuthToken();
        console.log("login token part"+token);
        // console.log(isMatch);
        if (isMatch) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }


})




// ussage of bcrypt;

// const securePassword=async (password)=>{
//     const passwordHash=await bcrypt.hash(password,10);
//     const passwordmatch=await bcrypt.compare(password,passwordHash);
//     console.log(passwordHash);
//     // give true value
//     console.log(passwordmatch);  

// }
// securePassword("1234");
// you cant convert the hashing password orginal data
// compare fun true or false 

app.listen(3000, (

) => {
    console.log('port connected');
})