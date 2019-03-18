const _ = require('lodash');
class User{
    constructor(app){

        this.app = app;
    }

    create(user = {}, cb = () => {}){

        const collection = this.app.collection('user');
        let obj = {
            name: _.toString(_.get(user, 'name', '')),
            email: _.toLower(_.get(user, 'email', '')),
            password: _.get(user,'password',''),

        }

        // we do need validate this object before saving to our mongodb
    }


}

module.exports = User;