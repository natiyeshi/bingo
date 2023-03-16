
function isDealerIn(req,res,done){
    if(typeof(req.session.loged) == "undefined" && typeof(req.session.admin) == "undefined"){
        res.redirect("/")
    } else if(typeof(req.session.admin) != "undefined"){
        res.redirect("/admin")
    } else if(typeof(req.session.loged) == "undefined"){
        res.redirect("/")
    } else{
        done() 
    }
}

function isDealerNotIn(req,res,done){
    if(typeof(req.session.loged) != "undefined"){
        res.redirect("/dealer")
    }else if(typeof(req.session.admin) != "undefined"){
        res.redirect("/admin")
    } else{
        done()
    }
} 
 
function isAdminIn(req,res,done){
    if(typeof(req.session.admin) == "undefined"){
        res.redirect("/login/admin")
    } else{
        done() 
    }
}
 
function isAdminNotIn(req,res,done){
    if(typeof(req.session.admin) != "undefined"){
        res.redirect("/admin")
    }else if(typeof(req.session.loged) != "undefined"){
        res.redirect("/dealer")
    } else{
        done()
    }
}

module.exports = {isDealerIn,isDealerNotIn,isAdminIn,isAdminNotIn}