let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// create a reference to the model
let Contact = require('../models/business');
let business = require('../models/business');

module.exports.displayContactList = (req, res, next) => {
    Contact.find((err, contactList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(contactList);

            res.render('business/list',
            {title: 'Business Contacts', BusinessList: contactList,
            displayName: req.user ? req.user.displayName : ''});
        }
    });
}

module.exports.displayAddPage = (req, res, next) => {
    res.render('business/add', {title: 'Add Contact'});
}

module.exports.processAddPage = (req, res, next) => {
    let newContact = business({
        "name": req.body.name,
        "number": req.body.number,
        "email": req.body.email,
    });

    business.create(newContact, (err, business) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the contact list
            res.redirect('/contact-list')
        }
    });
}

module.exports.displayEditPage = ((req, res, next) => {
    let id = req.params.id;

    business.findById(id, (err, contactToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('business/edit',
            {title: 'Edit Contact', business: contactToEdit,
            displayName: req.user ? req.user.displayName : ''});
        }
    });
})

module.exports.processEditPage = (req, res, next) => {
    let id = req.params.id;
    let updatedContact = business({
        "_id": id,
        "name": req.body.name,
        "number": req.body.number,
        "email": req.body.email,        
    });

    business.updateOne({_id: id}, updatedContact, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the contact list
            res.redirect('/contact-list');
        }
    });

}

module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    business.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the contact list
            res.redirect('/contact-list');
        }
    });
}