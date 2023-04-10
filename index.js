const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const port = 3000

let dbUsers = [
  {
      username: "Wong",
      password: "password",
      name: "Wong Xu Huan",
      email: "B022110214@student.utem.edu.my"
  },
  {
      username: "Chua",
      password: "010uehs",
      name: "CHua CF",
      email: "Chua233@gmail.com"
  }
]

app.use(express.json());

function login(username, password) {
  console.log("Someone try to login with", username, password)
  let matched = dbUsers.find(element => 
      element.username == username
  )
  if (matched){
      if(matched.password == password) {
          return matched
      } else{
          return "Password not matched"
      }
  } else{
      return "Username not found"
  }
}

function register(newusername, newpassword, newname, newemail){
  //TODO: Check username if exist
  let checking = dbUsers.find(element=>
      element.username == newusername
      )
  if(checking){
      console.log("This username has been registered")
  }
  else{
  dbUsers.push({
      username: newusername,
      password: newpassword,
      name: newname,
      email: newemail
  })
  return ("Register successful")
}
}

//To generate JWT token
function generateToken(userProfile){
  return jwt.sign(
    userProfile
  ,'secret', { expiresIn: 60 * 60 });
}

//To verify JWT Token
function verifyToken(req, res, next){
  let header = req.headers.authorization
  console.log(header)
  let token = header.split(' ')[1]

  jwt.verify(token, 'secret', function(err, decoded) {
    if(err) {
      res.send("Invalid Token")
    }

    req.user = decoded
  // console.log(decoded) // bar

    next()
  });
}

app.post('/register',(req,res) => {
  let data = req.body
  res.send(
    register(
      data.newusername,
      data.newpassword,
      data.newname,
      data.newemail
    )
  );
});

// create a post for user to login
app.post('/login',(req,res)=> {
  // get the username and password from the request body
  const {username,password} = req.body;

  //find the user in the database
  const user = dbUsers.find(user => user.username === username && user.password === password);

  //if user is found, return the user object
  if(user){
    res.send(user);
  } else {
    //if user is not found, return an error message
    res.send({error : "User not found"})
  }

})

app.post('/login2', (req, res) => {
  let data = req.body
  const user = login(data.username, data.password)
  res.send(generateToken(user))
})

app.get('/bye', verifyToken ,(req, res) => {
    console.log(req.user)

    res.send('Bye Bye World!')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log(login("Wong", "password"))