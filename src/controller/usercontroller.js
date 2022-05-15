const userModel = require("../Models/usermodel")
const jwt = require("jsonwebtoken");

//.............................................PHASE (1) Create user........................................................


const createuser = async (req, res) => {
  try {

    //EMAIL VALIDATION BY REJEX
    const validateEmail = (email) => {
      return (email).trim().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    //PASSWORD VALIDATION BY REJEX
    const validatePassword = (password) => {
      return String(password).trim().match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/);
    };

    //STRING VALIDATION BY REJEX
    const validatefeild = (name) => {
      return String(name).trim().match(
        /^[a-zA-Z]/);
    };


    //STREET VALIDATION BY REJEX
    const validatestreet = (name) => {
      return String(name).trim().match(
        /^[a-zA-Z0-9_.-]/);
    };
 

    //VALIDATION OF MOBILE NO BY REJEX
    const validateNumber = (Feild) => {
      return String(Feild).trim().match(
        /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/);
    };


    //VALIDATION OF pincode BY REJEX
    const validatepincode = (pincode) => {
      return String(pincode).trim().match(
        /^(\d{4}|\d{6})$/);
    };



    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Feild Can't Empty.Please Enter Some Details" });
    }

    if (!data.title) {
      return res.status(400).send({ status: false, msg: "Title is missing" });
    }

    let validTitle = ['Mr', 'Mrs', 'Miss'];
    if (!validTitle.includes(data.title.trim())) return res.status(400).send({ status: false, msg: "Title should be one of Mr, Mrs, Miss" });

    if (!data.name) {
      return res.status(400).send({ status: false, msg: "Name is missing" });
    }

    //Name validation by Rejex
    if (!validatefeild(data.name)) {
      return res.status(400).send({ status: false, msg: "Invalid Name format", });
    }

    let validString = /\d/;
    if (validString.test(data.name.trim())) return res.status(400).send({ status: false, msg: "Name must be valid it should not contains numbers" });

    if (!data.phone) {
      return res.status(400).send({ status: false, message: "Phone Number is missing" });
    }
    //Phone no. validation by Rejex
    if (!validateNumber(data.phone)) {
      return res.status(400).send({ status: false, message: "Invaild Phone No.." });
    }

    const findphoneno = await userModel.findOne({ phone: data.phone });

    if (findphoneno) {
      return res.status(400).send({ status: false, message: `${data.phone} Phone no. Already Registered.Please,Give Another Phone.no` })
    }

    if (!data.email) {
      return res.status(400).send({ status: false, message: "Email is missing" });
    }

    //email validation by Rejex
    if (!validateEmail(data.email)) {
      return res.status(400).send({ status: false, message: "Invaild E-mail id." });
    }

    const findemail = await userModel.findOne({ email: data.email }); //email exist or not

    if (findemail) {
      return res.status(400).send({ status: false, message: `${data.email} Email Id  Already Registered.Please,Give Another ID` })
    }

    if (!data.password) {
      return res.status(400).send({ status: false, msg: "Password is missing" });
    }

    //password validation by Rejex

    if (!validatePassword(data.password)) {
      return res.status(400).send({ status: false, msg: "Password should contain at-least one number,one special character and one capital letter", }); //password validation
    }
if(data.address){
    if (data.address.street) {
      if (!validatestreet(data.address.street)) {
        return res.status(400).send({ status: false, msg: "Street must contain Alphabet or Number", });
      }
    }
    if (data.address.city) {
      if (!validatefeild(data.address.city)) {
        return res.status(400).send({ status: false, msg: "field must contain the name of the city", });
      }
      let validString = /\d/;
      if (validString.test(data.address.city)) return res.status(400).send({ status: false, msg: " Name of the City must be valid it should not contains numbers" });
    }

    if (data.address.pincode) {
      if (!validatepincode(data.address.pincode)) {
        return res.status(400).send({ status: false, msg: "Invalid Pincode", });
      }
    }}

    const user = await userModel.create(data);
    return res.status(201).send({ status: true, msg: user });
  }

  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};




//.............................................POST /login........................................................

const login = async function (req, res) {
  try {
    const data = req.body;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Feild Can't Empty.Please Enter Some Details" }); //details is given or not
    }

    let email = req.body.email;
    let password = req.body.password;

    if (!email) {
      return res.status(400).send({ sataus: false, msg: "Email is missing" });
    }

    if (!password) {
      return res.status(400).send({ status: false, msg: "Password not given" });
    }

    const findemailpass = await userModel.findOne({ email: email, password: password, }); //verification for Email Password

    if (!findemailpass)// No Data Stored in findemailpass variable Beacuse no entry found with this email id nd password
      return res.status(400).send({ status: false, msg: "Email and Password not Matched" });

    var token = jwt.sign(
      { "UserId": findemailpass._id },
      "group51", { expiresIn: '12h' }  //sectetkey
    );


    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });
  }

  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

module.exports.createuser = createuser
module.exports.login = login