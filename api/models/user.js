const _ = require('lodash');
const bcrypt = require('bcrypt');
const {OrderedMap} = require('immutable');
const salt = 10;
class User{
    constructor(app){

        this.app = app;
        // user in cache
        this.users = new OrderedMap();
    }

    addUserToCache(id, user){
        id = _.toString(id);
        this.users = this.users.set(id,user);
    }
    beforeSave(user, cb = () => {}){

        const collection = this.app.db.collection('user');

        let err =null;
        const validations ={
            name: {
                errorMessage: "Name is required",
                doValid: () => {
                    const name = _.get(user, 'name','');
                    if(name && name.length){
                        return true;
                    }
                    return false;
                }
            },
            email: {
                errorMessage: "Email is invalid.",
                doValid:()=>{
                    const email = _.get(user, 'email', '');
                    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    if(emailRegex.test(email)){
                        return true;
                    }
                    return false;
                }

            },
            password: {
                errorMessage: "Password is required and more than 3 characters",
                doValid: ()=> {
                    const passwd = _.get(user,'password','');
                    if(passwd && passwd.length >=3){
                        return true;
                    }
                    return false;
                }
            }
        };
        let errors = [];

        _.each(validations, (validation, field)=>{
            const isValid = validation.doValid();
            if(!isValid){
                const errorMessage = validation.errorMessage;
                errors.push(errorMessage);
            }

         });
        if(errors.length){
            const err = _.join(errors,',');
            console.log("Validation finally is: ", err );
            return cb(err, user);
        }else {
            //let find in our database make sure email address is not exist.
            const email = _.get(user,'email');
            collection.findOne({email: {$eq: email}}, (err, result)=>{

                console.log("Find email in our database with result: ", err, result);
                if(err || result){
                    //this mean user exist. or some error
                    return cb("Email already exist, please try other email.");
                }

                return cb(null,user);
            });
        }
        //return cb(err, user);
    }

    create(user = {}, cb = () => {}){

        const collection = this.app.db.collection('user');
        let obj = {
            name: _.toString(_.get(user, 'name', '')),
            email: _.trim(_.toLower(_.get(user, 'email', ''))),
            password: _.get(user,'password',''),
            created: new Date(),

        };

        // we do need validate this object before saving to our mongodb
        this.beforeSave(obj, (err, user) => {
            if(err){
                return cb(err, null);
            }

            //save user to our dababase
            const userPlaintextPassword = user.password;
            user.password = bcrypt.hashSync(userPlaintextPassword,salt);

            collection.insertOne(user, (err, info)=>{
                if(err){
                    return cb(err, null);
                }
                const id  = _.toString(user._id);

                //set this user to cache and we get later fasty.

                this.addUserToCache(id,user);
                return cb(null,user);
            });

        });
    }


}

module.exports = User;