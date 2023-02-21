
function isDealerIn(req,res,done){
    if(typeof(req.session.loged) == "undefined"){
        res.redirect("/")
    } else{
        done()
    }
}

function isDealerNotIn(req,res,done){
    if(typeof(req.session.loged) != "undefined"){
        res.redirect("/dealer")
    } else{
        done()
    }
}

module.exports = {isDealerIn,isDealerNotIn}