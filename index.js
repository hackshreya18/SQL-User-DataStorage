const {faker} =require("@faker-js/faker");
const mySql=require("mysql2");
const path=require("path");
const express=require("express");
const methodOverride = require('method-override');

const app=express();
const port=8080;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

let getUser = () => {
    return [
      id=faker.string.uuid(),
      username= faker.internet.userName(),
      email= faker.internet.email(),
      password= faker.internet.password(),
    ];
  };

  const connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'shreyaSQL@16'
  });

  app.listen(port,()=>{
    console.log("your are listening to port:",port);
  });


  // //Inserting new data

  // let q= "INSERT INTO User (id,username,email,password) VALUES ?";
  // let users=[];
  // for(let i=1;i<=10;i++){
  //   users.push(getUser());
  // }

// try{
//   connection.query(q, [users] ,(err,result) =>{
//       if(err) throw err;
//       console.log(result);
//     });
// }
// catch(err){
//   console.log("Error in database:",err);
// }


  // Home route
  app.get("/",(req,res)=>{
    let q=`SELECT count(*) FROM User`;
    try{
      connection.query(q,(err,result)=>{
        if (err) throw err;
        // console.log(result);
        // console.log(result[0]["count(*)"]);
        let count=result[0]["count(*)"];
        res.render("index.ejs",{count});
      })
    }catch(err){
      console.log("Error occured:",err);
      res.send("some error in database");
    }
  });
 
  // Show Route
  app.get("/user",(req,res)=>{
      let q=` SELECT id,username,email FROM User `;
      try{
        connection.query(q,(err,result)=>{
          if(err) throw err;
          res.render("show.ejs",{result});
        });
      }catch(err){
        res.send("Error Occured");
      }
  })


//Edit route
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM User WHERE id="${id}"`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      user=result[0];
      console.log(user);
      res.render("edit.ejs",{user});
    })
  }catch(err){
    res.send("Error Generated");
  }
  
})

//Update Route:

app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {username:newname,password:newpass}=req.body;
  // console.log(newname);
  // console.log(newpass);
  let q=`SELECT * FROM User WHERE id="${id}"`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      user=result[0];
      console.log(user.username);
      console.log(user.password);      
      if(user.password === newpass){
        let q2=`UPDATE user SET user.username="${newname}" WHERE id="${id}"`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        });    
      }
      else{
        res.send("Wrong password");
      }
    })
  }catch(err){
    res.send("Error Generated");
  }
  
})

// Add a new user
app.get("/user/create",(req,res)=>{
  res.render("create.ejs");
})

app.post("/user",(req,res)=>{
  let {id,username,email,password,confirmPwd}=req.body;
  console.log(id,username,email,password,confirmPwd);

    if(password != confirmPwd){
      return res.send("Wrong Password!!! Try Again");
    }
  
 
  let q=`INSERT INTO User (id,username,email,password) VALUES ("${id}","${username}","${email}","${password}")`;
  try{
    connection.query(q,(err,result)=>{
      if (err) {
        console.error("Error occurred:", err);
        return res.status(500).send("An error occurred while creating the user.");
      }
      res.redirect("/user");
    })
  }catch(err){
    console.log("Error occured",err);
  }
})

// Delete User

app.get("/user/delete/:id",(req,res)=>{
  const {id}=req.params;
  res.render("delete.ejs",{id});
})
app.delete("/user/:id",(req,res)=>{
  const {id}=req.params;
  let {email,password}=req.body;
  let q=`SELECT * FROM User WHERE id="${id}"`;
    connection.query(q,(err,result)=>{
      user=result[0];
  
      console.log(user.email);
      console.log(user.password);
  
      if(user.email === email && user.password === password){
        let q2=`DELETE FROM User WHERE id="${id}"`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
           res.redirect("/user");
        })
      }
      else{
        res.send("Enter correct data");
      }
    })
})


// connection.end();