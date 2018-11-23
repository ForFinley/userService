const fs = require('fs');

//Takes in database name, field you want to search by and value of that field, returns records
function query(database, key, value) {
    return new Promise((resolve, reject) => {
        fs.readFile("./db/"+database+".json", 'utf8', function (err, data) {
            if (err) reject(err);
            else {
                data = JSON.parse(data);
                let result = {
                    Items: [],
                    Count: 0
                };
                
                for(let x = 0; x < data.length; x++){
                    if(data[x][key] === value){
                        result.Items.push(data[x]);
                        result.Count += 1;
                    }
                }
                resolve(result);
            }
        });
    });
}

//Writes to db
function write(database, obj){
    let db;
    fs.readFile("./db/"+database+".json", 'utf8', function (err, data) {
        if (err) reject(err);
        else {
            db = JSON.parse(data);

            let newRecord = true;
            //For updating
            for(let x = 0; x < db.length; x++){
                if(db[x].email === obj.email){
                    obj.id = db[x].id;
                    obj.email = db[x].email;
                    db.splice(x, 1);
                    db.push(obj);
                    newRecord = false;
                }
            }
            if(newRecord === true) db.push(obj);
        }
        fs.writeFile("./db/"+database+".json", JSON.stringify(db), function (err, data) {
            if (err) console.log(err);
        });
    });
}

module.exports = {
    query,
    write
};