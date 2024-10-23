const mongoose=require('mongoose')
mongoose.connect("mongodb+srv://Adithyab:8281041547@cluster0.uhvrb.mongodb.net/templeDBB?retryWrites=true&w=majority&appName=Cluster0").then(console.log('connected'))
mongoose.set('strictPopulate',false)

const express= require('express')

const cors=require('cors')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const {userModel} = require('./models/userModel')
const { vazhipadbookingModel } = require('./models/vazhipadbooking')
const { vazhipadModel } = require('./models/vazhipadModel')
const verifyToken = require('./middleware')
const dotenv =require("dotenv")
const darshanModel = require('./models/darshanModel')
const { ceremonyModel } = require('./models/ceremonyModel')
dotenv.config();


let app=express()

app.use(express.json())
app.use(cors())


// API route for ceremony booking
app.post('/specialceremony', async (req, res) => {
    const { babyName, fatherName, motherName, eventName, eventPrice, date, timeSlot } = req.body;

    try {
        // Count the number of existing bookings for the selected date and event type
        const existingCount = await ceremonyModel.countDocuments({ date, eventName });
        
        // Check if there are less than 20 bookings
        if (existingCount >= 20) {
            return res.status(400).json({ error: 'This time slot is fully booked. Maximum of 20 bookings allowed.' });
        }

        const ceremony = new ceremonyModel(req.body);
        await ceremony.save();
        res.status(201).json({ message: 'Ceremony booked successfully' });
    } catch (error) {
        console.error("Error booking ceremony:", error); // Log the error for debugging
        res.status(400).json({ error: 'Error booking ceremony' });
    }
});


// app.post('/viewdarshan', verifyToken, async (req, res) => {
//     try {
//         // Assuming 'darshanModel' has a userId field referencing the user collection
//         const bookings = await darshanModel.find()
//             .populate('userId', 'name') // Ensure this is correct
//             .exec();
        
//         res.json(bookings);
//     } catch (error) {
//         console.error('Error fetching bookings:', error);
//         res.status(500).json({ error: 'Failed to fetch bookings' });
//     }
// });





app.get('/checkSlots', async (req, res) => {
    const { date, eventName } = req.query;

    try {
        const count = await ceremonyModel.countDocuments({ date, eventName });
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching slot count:", error);
        res.status(500).json({ error: 'Error fetching slot count' });
    }
});




//search vazhipad
app.post("/searchvazhipad",(req,res)=>{
    let input = req.body
    vazhipadModel.find(input).then(
        (data)=>{
            res.json(data)

        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    )
})


//delete vazhipad
app.post("/delete",(req,res)=>{
    let input=req.body
    vazhipadModel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    ).finally()
    

})

// delete darshan

app.delete('/delete', async (req, res) => {
    const { _id } = req.body; // Destructure _id from the request body

    try {
        // Check if the record exists and delete it
        const deletedRecord = await darshanModel.findByIdAndDelete(_id);
        if (!deletedRecord) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', message: 'Successfully deleted' });
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ status: 'error', message: 'An error occurred while deleting' });
    }
});



app.post("/view",(req,res)=>{
    userModel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    ).finally()
})


app.get('/viewvazhipad', async (req, res) => {
    try {
        const vazhipads = await vazhipadModel.find();

        res.status(200).json(vazhipads);
    } catch (error) {
        console.error('Error fetching vazhipads:', error);
        res.status(500).json({ message: 'Error fetching vazhipads' });
    }
});


app.post('/viewdarshan', verifyToken, async (req, res) => {
    try {
        // Assuming 'darshanModel' has a userId field referencing the user collection
        const bookings = await darshanModel.find()
            .populate('userId', 'name') // Ensure this is correct
            .exec();
        
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});



app.post('/vazhipadbooking', async (req, res) => {
    try {
      const members = req.body.members;
  
      // Validate members array
      if (!members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid members data' });
      }
  
      // Validate each member object
      const validatedMembers = members.map(member => {
        // Check for required fields
        if (!member.name) throw new Error('Name is required.');
        if (!member.star) throw new Error('Star is required.');
        if (!member.price) throw new Error('Price is required.');
  
        // Parse and validate date
        const parsedDate = new Date(member.date);
        if (isNaN(parsedDate)) throw new Error('Invalid Date format.');
  
        // Return the validated member object
        return {
          name: member.name,
          star: member.star,
          date: parsedDate,
          vazhipadId: new mongoose.Types.ObjectId(member.vazhipadId), // Ensure ObjectId
          price: member.price
        };
      });
  
      // Create a new booking object with the validated members array
      const newBooking = new vazhipadbookingModel({
        members: validatedMembers
      });
  
      // Save the booking to the database
      await newBooking.save();
  
      console.log("New booking created:", newBooking); // Log the newly created booking
  
      res.status(201).json({ status: 'success', message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
      console.error('Error creating booking:', error.message); // Log the specific error message
      res.status(400).json({ status: 'error', message: `Error creating booking: ${error.message}` });
    }
  });
  


  app.post("/viewvazhipadbooking", (req, res) => {
    vazhipadbookingModel.find()
      .populate('members.vazhipadId', 'vname vprice')  // This populates 'vname' and 'vprice' from 'vazhipads' collection
      .then((data) => {
        console.log("Fetched Vazhipad Bookings:", JSON.stringify(data, null, 2));  // This should now include the populated 'vname' and 'vprice'
        res.json(data);  // Send the populated data to the frontend
      })
      .catch((error) => {
        console.error("Error fetching Vazhipad data:", error);
        res.status(500).json({ error: "An error occurred while fetching the Vazhipad data" });
      });
  });
  


app.post("/addvazhipad",(req,res)=>{
    let input=req.body
    let vazhipads=new vazhipadModel(input)
    vazhipads.save()
    res.json({"status":"success"})
})






app.post('/darshan', verifyToken, async (req, res) => {
    const { date, time, membersCount } = req.body;

    if (!date || !time || !membersCount) {
        return res.status(400).json({ error: 'Date, time, and members count are required' });
    }

    try {
        const booking = new darshanModel({
            userId: req.userId, // User ID is obtained from the verified token
            date: new Date(date),
            time,
            membersCount,
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Booking creation failed' });
    }
});



app.post("/search",(req,res)=>{
    let input = req.body
    userModel.find(input).then(
        (data)=>{
            res.json(data)

        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    )
})



app.post("/delete",(req,res)=>{
    let input=req.body
    userModel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    ).finally()
    

})



app.post("/delete",(req,res)=>{
    let token=req.headers["token"]
    let input=req.body
    jwt.verify(token,"templeapp",(error,decoded)=>{
        if(error)
            {
                res.json({"status":"unauthorised access"})
            }
            else{
                if(decoded){
                    userModel.findByIdAndDelete(input._id).then(
                    (response)=>{
                        res.json(response)
                    }
                ).catch().finally()

            }
        }
    })
   

})

app.post('/vazhipadbooking', async (req, res) => {
    try {
      console.log(req.body); // Log the incoming request body
  
      const members = req.body.members;
  
      // Validate members array
      if (!members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid members data' });
      }
  
      // Create a new booking object with the members array
      const newBooking = new vazhipadbookingModel({
        members: members.map(member => ({
          name: member.name,
          star: member.star,
          date: member.date,
          vazhipadId: member.vazhipadId,
          price: member.price
        }))
      });
  
      // Save the booking to the database
      await newBooking.save();
  
      res.status(201).json({ status: 'success', message: 'Booking created successfully' });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ status: 'error', message: 'Error creating booking' });
    }
  });
  



app.post("/signUp",async(req,res)=>{
    let input=req.body
    let hashedPassword= bcrypt.hashSync(req.body.password,10)
    req.body.password=hashedPassword
 
    userModel.find({email:req.body.email}).then(
     (items)=>{
         if(items.length>0){
             res.json({"status":"email id already exist"})
         }
         else{
             let result=new userModel(input)
             result.save()
             res.json({"status":"success"})
         }
     }
    ).catch(
     (error)=>{}
    )
 
     
 })


//  app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
  
//     // Default admin credentials (Move these to env variables for better security)
//     const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
//     const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
//     try {
//         // Check if the input matches the default admin credentials
//         if (email === adminEmail && password === adminPassword) {
//             // Admin login successful (for hardcoded admin)
//             const token = jwt.sign({ email, role: 'admin' }, "laundryapp", { expiresIn: "1d" });
//             return res.json({ status: "success", token, role: 'admin', message: "Admin logged in successfully" });
//         }
  
//         // Check if the user exists in the user table
//         const user = await userModel.findOne({ email });
//         if (!user) {
//             return res.json({ status: "error", message: "Invalid email id" });
//         }
  
//         // Compare the password with the stored hash
//         const passwordMatch = bcrypt.compareSync(password, user.password);
//         if (!passwordMatch) {
//             return res.json({ status: "error", message: "Incorrect password" });
//         }
  
//         // Generate token for user
//         const token = jwt.sign({ email: user.email, _id: user._id, role: 'user' }, "laundryapp", { expiresIn: "1d" });
//         return res.json({ 
//             status: "success", 
//             token, 
//             role: 'user', 
//             userId: user._id,  // Return the user ID
//             username: user.name  // Assuming the user model has a 'name' field
//         });
  
//     } catch (error) {
//         console.error("Login error:", error);
//         return res.json({ status: "error", message: "An error occurred", error: error.message });
//     }
//   });


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Default admin credentials (Move these to env variables for better security)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    try {
        // Check if the input matches the default admin credentials
        if (email === adminEmail && password === adminPassword) {
            // Admin login successful (for hardcoded admin)
            const token = jwt.sign({ email, role: 'admin' }, "laundryapp", { expiresIn: "1d" });
            return res.json({ status: "success", token, role: 'admin', message: "Admin logged in successfully" });
        }

        // Check if the user exists in the user table
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ status: "error", message: "Invalid email id" });
        }

        // Compare the password with the stored hash
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.json({ status: "error", message: "Incorrect password" });
        }

        // Generate token for user
        const token = jwt.sign({ email: user.email, _id: user._id, role: 'user' }, "laundryapp", { expiresIn: "1d" });
        return res.json({ 
            status: "success", 
            token, 
            role: 'user', 
            userId: user._id,  // Return the user ID
            username: user.name  // Return the username
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.json({ status: "error", message: "An error occurred", error: error.message });
    }
});



  app.listen(3030,()=>{
    console.log("server started")
})