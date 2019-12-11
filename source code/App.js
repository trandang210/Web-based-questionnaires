
/**
 * Require express and mysql to connect to the database and ejs files
 */
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 5000;


// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, '/'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

/**
 * The option is used to determine if the user select add visit or edit visit
 * if user chooses add myoption =1
 * if user chooses lookup myoption =2
 * if user chooses edit myoption =3
 */
let myoption = 0;

// routes for the app

/**
 * The route used when first open the browser
 * It renders the connection form template
 */
app.get('/',function(req,res){
    res.render('Connection.ejs',{})
  });

  
/**
 * The route used to achieve the entered data
 * It takes the user's data and used it to connect to the database
 */
app.post('/connect',function(req,res){
    let myhost = req.body.host
    let myuser = req.body.user
    let mypass = req.body.password
    let myport = req.body.port
    let mydatabase = req.body.database
    const db = mysql.createConnection ({
        host: myhost,
        user: myuser,
        password: mypass,
        port: myport,
        database: mydatabase
    });
    
    // connect to database
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to database');
    });
    global.db = db;
    res.render('HomePage.ejs',{})
})

/**
 * The route used to navigate back to homepage
 * It renders the homepage prompt
 */
app.post('/home',function(req,res){
    res.render('Homepage.ejs',{})
  });

app.get('/home',function(req,res){
    res.render('Homepage.ejs',{})
  });


/**
 * The route used to retrieve entered thc number
 * It store the thc number and determine which option the user chooses
 */
app.post('/thc', function(req,res){
    let click = req.body.option
    if (click == 'add') myoption = 1
    if (click == 'lookup') myoption =2
    if (click == 'edit') myoption =3

    res.render('AddVisit.ejs',{option: myoption,})
});

/**
 * The route used when user chooses add new visit
 * It inserts new tuples to the visit table and display the interview form with given information
 */
app.post('/newvisit', function(req,res){
    let thc = req.body.thc_num
    let query2,query3
    let sequence =0;
    let today = new Date()
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let query1 = "SELECT Visit_sequence_number FROM visit WHERE PATIENT_THC ='"+thc+"';"
    db.query(query1, (err, result) => {
        if(err){
            return res.status(500).send(err)
        }
        for(let i = 0;i<result.length;i++){
            if (result[i].Visit_sequence_number >= sequence) sequence = result[i].Visit_sequence_number
        }
        sequence++
        query2 = "INSERT INTO visit(PATIENT_THC,Visit_Date,Visit_sequence_number) VALUES ('"+thc+"','"+date+"','"+sequence+"');"
        query3 = "SELECT VISIT_ID, PATIENT_THC,Visit_sequence_number,Visit_Date,"+
                    "First_name,Last_name FROM visit NATURAL JOIN patient WHERE THC = '"+thc+
                    "' and PATIENT_THC = '"+thc+"'and Visit_sequence_number ='"+sequence+"';"
                     // execute query
        db.query(query2, (err, result) => {
            if(err){
                return res.status(500).send(err)
            }
        })
        db.query(query3, (err, result) => {
            if (err) {
                res.redirect('/home');
            }
            res.render('Interview.ejs', {
                visit: result[0],
            })
        })
    })
});


/**The route used when user chooses edit visit 
 * It shows the list of all visit from given thc number by ascending order
*/
app.post('/editvisit', function(req,res){
    let thc = req.body.thc_num
    query = "SELECT * FROM visit WHERE PATIENT_THC = '" + thc +"' ORDER BY VISIT_ID ASC;"
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            res.redirect('/home');
        }
        res.render('EditVisit.ejs', {
            visits: result,
        })
    })
});

/**
 * The route used when user chooses a method to sort the result
 */
app.post('/sortresult', function(req,res){
    let select = req.body.sort
    let query
    if (select == 'visitid'){
        query = "SELECT * FROM visit ORDER BY Visit_ID ASC;"; // query database to get all the players
       
    }
    if (select == 'date'){
        query = "SELECT * FROM visit ORDER BY Visit_Date ASC"
     
    }
        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/home');
            }
            res.render('EditVisit.ejs', {
                visits: result,

            })
        })
});

/**
 * The route used when user chooses lookup patient method
 * It list all of the patient from patient table by default
 */
app.post('/lookup', function(req,res){
    let query = "SELECT * FROM patient"; 

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/home');
            }
            res.render('LookUp.ejs', {
                title: "lookup",
                patients: result,
            })
        })
});

/**
 * The route used when user chooses a method and value to search 
 * for a patient. It search by the patient first name, thc, or ssn 
 */
app.post('/searchresult',function(req,res){
    let select = req.body.search
    let value = req.body.search_value
    if (select == 'name')
        query = "SELECT * FROM patient WHERE First_name = '" + value +"'"
    if (select == 'thc')
        query = "SELECT * FROM patient WHERE THC = '" + value +"'"
    if (select == 'ssn')
        query = "SELECT * FROM patient WHERE SSN = '" + value +"'"
    db.query(query, (err, result) => {
        if (err) {
            res.redirect('/home');
        }
        res.render('LookUp.ejs', {
            patients: result,
        })
    })
})

/**
 * The route used when user chooses a specific visit from edit visit table
 * It will find and display the choosen visit's information
 */
app.post('/currentvisit',function(req,res){
    let thc = req.body.current_visit
    let query = "SELECT VISIT_ID, PATIENT_THC,Visit_sequence_number,Visit_Date,"+
    "First_name,Last_name FROM visit NATURAL JOIN patient WHERE THC = '"+thc+
    "' and PATIENT_THC = '"+thc+"';"

    db.query(query, (err, result) => {
        if (err) {
            res.redirect('/home');
        }
        res.render('Interview.ejs', {
            visit: result[0],
        })
    })
})

/**
 * The route used when user chooses THI interview
 * It will display all questions and options as well as the
 * patient's information at the beginning
 */
app.post('/thi',function(req,res){
    let visitid = req.body.visitid_val
    let query = "SELECT v.VISIT_ID, v.PATIENT_THC, v.Visit_sequence_number, v.Visit_Date,"+
    "p.First_name,p.Last_name FROM visit as v JOIN patient as p  ON v.patient_thc = p.thc WHERE v.visit_id = '"+visitid+"';"
    db.query(query, (err, result1) => {
        if (err) {
            res.redirect('/home');
        }
        let query2 = "SELECT * FROM description WHERE type = 'THI'"
        db.query(query2, (err, result) => {
            if (err) {
                res.redirect('/home');
            }
            res.render('thi.ejs', {
                questions: result,
                visit: result1[0],
            })
        })
    })
})

/**
 * The route used when user clicks submit for thi form
 * It will calculate and insert new data to thi table
 */
app.post('/thi_result',function(req,res){
    
    let query
    let scores = {}
    let question_result = []  
    let c_score = 0
    let f_score = 0
    let e_score  = 0
    let t_score = 0
    visitid = req.body.visitid_val
    scores['q1'] = [req.body.q1, 'F'] 
    scores['q2'] = [req.body.q2, 'F']
    scores['q3'] = [req.body.q3, 'E']
    scores['q4'] = [req.body.q4, 'F']
    scores['q5'] = [req.body.q5, 'C']
    scores['q6'] = [req.body.q6, 'E']
    scores['q7'] = [req.body.q7, 'F']
    scores['q8'] = [req.body.q8, 'C']
    scores['q9'] = [req.body.q9, 'F']
    scores['q10'] = [req.body.q10, 'E']
    scores['q11'] = [req.body.q11, 'C']
    scores['q12'] = [req.body.q12, 'F']
    scores['q13'] = [req.body.q13, 'F']
    scores['q14'] = [req.body.q14, 'E']
    scores['q15'] = [req.body.q15, 'F']
    scores['q16'] = [req.body.q16, 'E']
    scores['q17'] = [req.body.q17, 'E']
    scores['q18'] = [req.body.q18, 'F']
    scores['q19'] = [req.body.q19, 'C']
    scores['q20'] = [req.body.q20, 'F']
    scores['q21'] = [req.body.q21, 'E']
    scores['q22'] = [req.body.q22, 'E']
    scores['q23'] = [req.body.q23, 'C']
    scores['q24'] = [req.body.q24, 'F']
    scores['q25'] = [req.body.q25, 'E']

    let score, type    
    for (var q in scores){
        score = parseInt(scores[q][0])
        type = scores[q][1]
        question_result.push(score)
        t_score += score
        switch(type) {
            case 'C':
                c_score += score
                break;
            case 'F': 
                f_score += score
                break;
            case 'E':
                e_score += score
                break;       
          }
    }
       
    question_result.push(f_score)
    question_result.push(e_score)
    question_result.push(c_score)
    question_result.push(t_score)
    question_result.push(visitid)
   
    let result_comment
    if (t_score <= 16) {
        result_comment = "GRADE 1: Slight or no handicap"
    }
    else if (t_score <= 36){
        result_comment = "GRADE 2: Mild handicap"
    }
    else if (t_score <= 56){
        result_comment = "GRADE 3: Moderate handicap"
    }
    else if (t_score <= 76){
        result_comment = "GRADE 4: Severe handicap"
    }
    else if (t_score <= 100){
        result_comment = "GRADE 5: Catastrophic handicap"
    }

    query = "SELECT * FROM thi WHERE VISIT_VISIT_ID = " + visitid
    
    db.query(query, function (err, result) {
        if (err) {
            res.redirect('/home');
        }
        if (result.length >=1){
            query1 = "DELETE FROM thi WHERE VISIT_VISIT_ID = " +visitid
            db.query(query1, function (err, result1) {
                if (err) {
                    throw(err);
                }
                console.log("Number of records deleted: " + result1.affectedRows);
            })
        }
    })
        
    query = "INSERT INTO thi(F1,F2,E3,F4,C5,E6,F7,C8,F9,E10,C11,F12,F13,E14,F15,E16,E17,F18,C19,F20,E21,E22,C23,F24,E25,Sc_F,Sc_E,Sc_C,Sc_T,VISIT_VISIT_ID) VALUES (?)"
  
    db.query(query, [question_result], function (err, result) {
        if (err) {
            res.redirect('/home');
        }
        console.log("Number of records inserted: " + result.affectedRows);
    })

    let query3 = "SELECT v.VISIT_ID, v.PATIENT_THC, v.Visit_sequence_number, v.Visit_Date,"+
        "p.First_name,p.Last_name FROM visit as v JOIN patient as p  ON v.patient_thc = p.thc WHERE v.visit_id = '"+visitid+"';"
        
    db.query(query3, function (err, result2) {
        if (err) {
            res.redirect('/home');
        }
        res.render('thi_result.ejs', {
            scores: question_result,
            visit: result2[0],
            result_detail: result_comment, 
        })
    })
})

/**
 * The route used when user clicks cancel for thi result
 * It will remove the data from thi table
 */
app.post('/thi_cancel',function(req,res){
    let visitid = req.body.visitid_val
    let query = "SELECT v.VISIT_ID, v.PATIENT_THC, v.Visit_sequence_number, v.Visit_Date,"+
    "p.First_name,p.Last_name FROM visit as v JOIN patient as p  ON v.patient_thc = p.thc WHERE v.visit_id = '"+visitid+"';"
    db.query(query, (err, result1) => {
        if (err) {
            res.redirect('/home');
        }
        let query2 = "DELETE FROM thi WHERE VISIT_VISIT_ID = " + visitid
        db.query(query2, (err, result) => {
            if (err) {
                res.redirect('/home');
            }
            console.log("Number of records deleted: " + result.affectedRows);
        })
        let query3 = "SELECT * FROM description WHERE type = 'THI'"
        db.query(query3, (err, result3) => {
            if (err) {
                res.redirect('/home');
            }
            res.render('thi.ejs', {
                questions: result3,
                visit: result1[0],
            })
        })
    })
})

/**
 * The route used when user chooses TFI interview
 * It will display all questions and options as well as the
 * patient's information at the beginning
 */
app.post('/tfi',function(req,res){
    let message
    let visitid = req.body.visitid_val
    let query = "SELECT v.VISIT_ID, v.PATIENT_THC, v.Visit_sequence_number, v.Visit_Date,"+
    "p.First_name,p.Last_name FROM visit as v JOIN patient as p  ON v.patient_thc = p.thc WHERE v.visit_id = '"+visitid+"';"
    db.query(query, (err, result1) => {
        if (err) {
            res.redirect('/home');
        }
        let query2 = "SELECT * FROM description WHERE type = 'TFI'"
        db.query(query2, (err, result) => {
            if (err) {
                res.redirect('/home');
            }
            res.render('tfi.ejs', {
                questions: result,
                visit: result1[0],
                message: message,
            })
        })
    })
})

/**
 * The route used when user click cancel for tfi result
 * It will remove the data from TFI table
 */
app.post('/tfi_cancel',function(req,res){
    let message 
    let visitid = req.body.visitid_val
    let query = "SELECT v.VISIT_ID, v.PATIENT_THC, v.Visit_sequence_number, v.Visit_Date,"+
    "p.First_name,p.Last_name FROM visit as v JOIN patient as p  ON v.patient_thc = p.thc WHERE v.visit_id = '"+visitid+"';"
    db.query(query, (err, result1) => {
        if (err) {
            res.redirect('/home');
        }
        let query2 = "DELETE FROM tfi WHERE VISIT_VISIT_ID = " + visitid
        db.query(query2, (err, result) => {
            if (err) {
                res.redirect('/home');
            }
            console.log("Number of records deleted: " + result.affectedRows);
        })
        let query3 = "SELECT * FROM description WHERE type = 'TFI'"
        db.query(query3, (err, result3) => {
            if (err) {
                res.redirect('/home');
            }
            res.render('tfi.ejs', {
                questions: result3,
                visit: result1[0],
                message: message,
            })
        })
    })
})

/**
 * The route used when user clicks submit for tfi form
 * It will calculate and insert new data to thi table
 */
app.post('/tfi_result',function(req,res){
    
    let query
    let scores = {}
    let question_result = []  
    let i_score = 0
    let sc_score = 0
    let c_score  = 0
    let sl_score = 0
    let a_score = 0
    let r_score = 0
    let q_score = 0
    let e_score = 0
    let t_score = 0
    let number_of_question = 0

    visitid = req.body.visitid_val
    if (req.body.q1) {
        scores['q1'] = [req.body.q1, 'I']
        number_of_question ++
    } else{
        scores['q1'] = [-1, 'N/A']
    }
    if (req.body.q2) {
        scores['q2'] = [req.body.q2, 'I']
        number_of_question ++
    } else{
        scores['q2'] = [-1, 'N/A']
    }
    if (req.body.q3) {
        scores['q3'] = [req.body.q3, 'I']
        number_of_question ++
    } else{
        scores['q3'] = [-1, 'N/A']
    }
    if (req.body.q4) {
        scores['q4'] = [req.body.q4, 'SC']
        number_of_question ++
    } else{
        scores['q4'] = [-1, 'N/A']
    }
    if (req.body.q5) {
        scores['q5'] = [req.body.q5, 'SC']
        number_of_question ++
    } else{
        scores['q5'] = [-1, 'N/A']
    }
    if (req.body.q6) {
        scores['q6'] = [req.body.q6, 'SC']
        number_of_question ++
    } else{
        scores['q6'] = [-1, 'N/A']
    }
    if (req.body.q7) {
        scores['q7'] = [req.body.q7, 'C']
        number_of_question ++
    } else{
        scores['q7'] = [-1, 'N/A']
    }
    if (req.body.q8) {
        scores['q8'] = [req.body.q8, 'C']
        number_of_question ++
    } else{
        scores['q8'] = [-1, 'N/A']
    }
    if (req.body.q9) {
        scores['q9'] = [req.body.q9, 'C']
        number_of_question ++
    } else{
        scores['q9'] = [-1, 'N/A']
    }
    if (req.body.q10) {
        scores['q10'] = [req.body.q10, 'SL']
        number_of_question ++
    } else{
        scores['q10'] = [-1, 'N/A']
    }
    if (req.body.q11) {
        scores['q11'] = [req.body.q11, 'SL']
        number_of_question ++
    } else{
        scores['q11'] = [-1, 'N/A']
    }
    if (req.body.q12) {
        scores['q12'] = [req.body.q12, 'SL']
        number_of_question ++
    } else{
        scores['q12'] = [-1, 'N/A']
    }
    if (req.body.q13) {
        scores['q13'] = [req.body.q13, 'A']
        number_of_question ++
    } else{
        scores['q13'] = [-1, 'N/A']
    }
    if (req.body.q14) {
        scores['q14'] = [req.body.q14, 'A']
        number_of_question ++
    } else{
        scores['q14'] = [-1, 'N/A']
    }
    if (req.body.q15) {
        scores['q15'] = [req.body.q15, 'A']
        number_of_question ++
    } else{
        scores['q15'] = [-1, 'N/A']
    }
    if (req.body.q16) {
        scores['q16'] = [req.body.q16, 'R']
        number_of_question ++
    } else{
        scores['q16'] = [-1, 'N/A']
    }
    if (req.body.q17) {
        scores['q17'] = [req.body.q17, 'R']
        number_of_question ++
    } else{
        scores['q17'] = [-1, 'N/A']
    }
    if (req.body.q18) {
        scores['q18'] = [req.body.q18, 'R']
        number_of_question ++
    } else{
        scores['q18'] = [-1, 'N/A']
    }
    if (req.body.q19) {
        scores['q19'] = [req.body.q19, 'Q']
        number_of_question ++
    } else{
        scores['q19'] = [-1, 'N/A']
    }
    if (req.body.q20) {
        scores['q20'] = [req.body.q20, 'Q']
        number_of_question ++
    } else{
        scores['20'] = [-1, 'N/A']
    }
    if (req.body.q21) {
        scores['q21'] = [req.body.q21, 'Q']
        number_of_question ++
    } else{
        scores['q21'] = [-1, 'N/A']
    }
    if (req.body.q22) {
        scores['q22'] = [req.body.q22, 'Q']
        number_of_question ++
    } else{
        scores['q22'] = [-1, 'N/A']
    }
    if (req.body.q23) {
        scores['q23'] = [req.body.q23, 'E']
        number_of_question ++
    } else{
        scores['q23'] = [-1, 'N/A']
    }
    if (req.body.q24) {
        scores['q24'] = [req.body.q24, 'E']
        number_of_question ++
    } else{
        scores['q24'] = [-1, 'N/A']
    }
    if (req.body.q25) {
        scores['q25'] = [req.body.q25, 'E']
        number_of_question ++
    } else{
        scores['q25'] = [-1, 'N/A']
    }
    
    let score, type    
    for (var q in scores){
        score = parseInt(scores[q][0])
        type = scores[q][1]
        
        question_result.push(score)
        if (score >= 0){
            t_score += score
            switch(type) {
                case 'I':
                    i_score += score
                    break;
                case 'SC': 
                    sc_score += score
                    break;
                case 'C':
                    c_score += score
                    break;  
                case 'SL':
                    sl_score += score
                    break;
                case 'A':
                    a_score += score
                    break;
                case 'R':
                    r_score += score
                    break;
                case 'Q':
                    q_score += score
                    break;
                case 'E':
                    e_score += score
                    break;                     
            }
        }
    }

    console.log("number of answers:" + number_of_question)
    console.log("total score = " +t_score )

    if (number_of_question <19){
        let visitid = req.body.visitid_val
        let message = " Invalid submit. Please answer at least 19 questions to continue."
        let query = "SELECT v.VISIT_ID, v.PATIENT_THC, v.Visit_sequence_number, v.Visit_Date,"+
        "p.First_name,p.Last_name FROM visit as v JOIN patient as p  ON v.patient_thc = p.thc WHERE v.visit_id = '"+visitid+"';"
        db.query(query, (err, result1) => {
            if (err) {
                res.redirect('/home');
            }
            let query2 = "SELECT * FROM description WHERE type = 'TFI'"
            db.query(query2, (err, result) => {
                if (err) {
                    res.redirect('/home');
                }
                res.render('tfi.ejs', {
                    questions: result,
                    visit: result1[0],
                    message: message,
                })
            })
        })
    } else {
        t_score = t_score/number_of_question *10
        
        question_result.push(i_score)
        question_result.push(sc_score)
        question_result.push(c_score)
        question_result.push(sl_score)
        question_result.push(a_score)
        question_result.push(r_score)
        question_result.push(q_score)
        question_result.push(e_score)
        question_result.push(t_score)
        question_result.push(visitid)
        
        query = "SELECT * FROM tfi WHERE VISIT_VISIT_ID = " + visitid
        
        db.query(query, function (err, result) {
        if (err) {
            res.redirect('/home');
        }
        if (result.length >=1){
            query1 = "DELETE FROM tfi WHERE VISIT_VISIT_ID = " +visitid
            db.query(query1, function (err, result1) {
                if (err) {
                    throw(err);
                }
                console.log("Number of records deleted: " + result1.affectedRows);
            })
        }
        })

            query = "INSERT INTO tfi(I1,I2,I3,SC4,SC5,SC6,C7,C8,C9,SL10,SL11,SL12,A13,A14,A15,R16,R17,R18,Q19,Q20,Q21,Q22,E23,E24,E25,Sc_I,Sc_SC,Sc_C,Sc_SL,Sc_A,Sc_R,Sc_Q,Sc_E,Sc_T,VISIT_VISIT_ID) VALUES (?)"
    
            db.query(query, [question_result], function (err, result) {
            if (err) {
                res.redirect('/home');
            }
            console.log("Number of records inserted: " + result.affectedRows);
        })
        
        let result_comment
        
        query = "SELECT * FROM tfi WHERE VISIT_VISIT_ID = " + visitid
        
        db.query(query, function (err, result) {
            if (err) {
                res.redirect('/home');
            }
            let query3 = "SELECT v.VISIT_ID, v.PATIENT_THC, v.Visit_sequence_number, v.Visit_Date,"+
                "p.First_name,p.Last_name FROM visit as v JOIN patient as p  ON v.patient_thc = p.thc WHERE v.visit_id = '"+visitid+"';"
            db.query(query3, function (err, result2) {
                if (err) {
                    res.redirect('/home');
                }
                res.render('tfi_result.ejs', {
                    scores: result,
                    visit: result2[0],
                    result_detail: result_comment,
                    no_ques: number_of_question, 
                })
            })
        })
    }
})

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});