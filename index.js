const express = require('express')
const app = express()
const port = 3001

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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/bye', (req, res) => {
    res.send('Bye Bye World!')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log(login("Wong", "password"))